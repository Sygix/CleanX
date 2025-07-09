package scan

import (
	"cleanx/backend/scan/entity"
	"cleanx/backend/scan/service"
	"cleanx/backend/scan/usecase"
	"context"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type API struct {
	fs    *service.LocalFileSystem
	cache map[string]*entity.DirEntry
	mu    sync.RWMutex
	ctx   context.Context
}

func NewAPI(ctx context.Context) *API {
	fs := service.NewLocalFileSystem()
	return &API{
		fs:    fs,
		cache: make(map[string]*entity.DirEntry),
		ctx:   ctx,
	}
}

func (a *API) SetContext(ctx context.Context) {
	a.ctx = ctx
}

func (a *API) Scan(path string) (*entity.DirEntry, error) {
	scanner := usecase.NewScanUseCase(a.fs)
	result := &entity.DirEntry{
		ID:       uuid.New().String(),
		ScanDate: time.Now().Format(time.RFC3339),
		Status:   "IN-PROGRESS",
	}
	a.mu.Lock()
	a.cache[path] = result
	a.mu.Unlock()

	a.UpdateScanStatus(result.ID, result.Status)

	scanResult, err := scanner.Scan(path)
	scanResult.ID = result.ID
	if err == nil {
		result = scanResult
		result.ScanDate = time.Now().Format(time.RFC3339)
		result.Status = "COMPLETED"
	}

	a.mu.Lock()
	a.cache[path] = result
	a.mu.Unlock()

	a.UpdateScanStatus(result.ID, result.Status)

	return result, err
}

func (a *API) ScanNonRecursive(path string) (*entity.DirEntry, error) {
	scanner := usecase.NewScanUseCase(a.fs)
	return scanner.ScanNonRecursive(path)
}

func (a *API) ListScans() []entity.ScanSummary {
	a.mu.RLock()
	defer a.mu.RUnlock()

	scans := make([]entity.ScanSummary, 0, len(a.cache))
	for path, entry := range a.cache {
		scans = append(scans, entity.ScanSummary{
			ID:       entry.ID,
			ScanDate: entry.ScanDate,
			Path:     path,
			Status:   entry.Status,
		})
	}
	return scans
}

func (a *API) GetScan(id string) *entity.DirEntry {
	a.mu.RLock()
	defer a.mu.RUnlock()
	for _, entry := range a.cache {
		if entry.ID == id {
			return entry
		}
	}
	return nil
}

func (a *API) UpdateScanStatus(id string, status string) {
	runtime.EventsEmit(a.ctx, "scan-status-updated", map[string]string{"id": id, "status": status})
}
