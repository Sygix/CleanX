package usecase

import (
	"cleanx/backend/delete/entity"
	"cleanx/backend/delete/port"
	"time"

	"github.com/google/uuid"
)

type DeletionUseCase struct {
	provider     port.DeletionProvider
	cache        port.CacheRepository
	eventEmitter port.EventEmitter
}

func NewDeletionUseCase(provider port.DeletionProvider, cache port.CacheRepository, eventEmitter port.EventEmitter) *DeletionUseCase {
	return &DeletionUseCase{
		provider:     provider,
		cache:        cache,
		eventEmitter: eventEmitter,
	}
}

func (d *DeletionUseCase) DeleteItems(request entity.DeletionRequest) (*entity.DeletionSummary, error) {
	summary := &entity.DeletionSummary{
		ID:        uuid.New().String(),
		StartedAt: time.Now().Format(time.RFC3339),
		Status:    "running",
		Results:   make([]entity.DeletionResult, 0),
	}

	// Store initial summary
	d.cache.StoreDeletionSummary(summary)
	d.eventEmitter.EmitDeletionProgress(summary)

	for _, path := range request.Paths {
		result := d.deleteItem(path, request.Force)
		summary.Results = append(summary.Results, result)
		summary.TotalItems++

		if result.Success {
			summary.SuccessCount++
			summary.TotalSize += result.Size
		} else {
			summary.FailureCount++
		}

		// Update cache and emit progress
		d.cache.StoreDeletionSummary(summary)
		d.eventEmitter.EmitDeletionProgress(summary)
	}

	// Finalize summary
	summary.CompletedAt = time.Now().Format(time.RFC3339)
	if summary.FailureCount == 0 {
		summary.Status = "completed"
	} else if summary.SuccessCount == 0 {
		summary.Status = "failed"
	} else {
		summary.Status = "completed"
	}

	d.cache.StoreDeletionSummary(summary)
	d.eventEmitter.EmitDeletionComplete(summary)

	return summary, nil
}

func (d *DeletionUseCase) deleteItem(path string, force bool) entity.DeletionResult {
	result := entity.DeletionResult{
		ID:        uuid.New().String(),
		Path:      path,
		DeletedAt: time.Now().Format(time.RFC3339),
	}

	// Get file info before deletion
	size, isDir, err := d.provider.GetFileInfo(path)
	if err != nil {
		result.Success = false
		result.Error = err.Error()
		return result
	}

	result.Size = size
	result.IsDirectory = isDir

	// Perform deletion
	if isDir {
		err = d.provider.DeleteDirectory(path, force)
	} else {
		err = d.provider.DeleteFile(path)
	}

	if err != nil {
		result.Success = false
		result.Error = err.Error()
	} else {
		result.Success = true
	}

	return result
}

func (d *DeletionUseCase) GetDeletionHistory() ([]entity.DeletionSummary, error) {
	return d.cache.GetAllDeletionSummaries()
}
