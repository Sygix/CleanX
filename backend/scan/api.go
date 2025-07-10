package scan

import (
	"cleanx/backend/scan/entity"
	"cleanx/backend/scan/port"
	"cleanx/backend/scan/usecase"
	"log"
	"time"

	"github.com/google/uuid"
)

type API struct {
	cache        port.CachePort
	eventEmitter port.EventEmitterPort
	fileSystem   port.FileSystemPort
	scanner      *usecase.ScanUseCase
}

func NewAPI(cache port.CachePort, eventEmitter port.EventEmitterPort, fileSystem port.FileSystemPort, scanner *usecase.ScanUseCase) *API {
	return &API{
		cache:        cache,
		eventEmitter: eventEmitter,
		fileSystem:   fileSystem,
		scanner:      scanner,
	}
}

func (a *API) Scan(path string) (*entity.DirEntry, error) {
	result := &entity.DirEntry{
		ID:       uuid.New().String(),
		ScanDate: time.Now().Format(time.RFC3339),
		Status:   "IN-PROGRESS",
		Path:     path,
	}
	a.cache.Set(result.ID, result)
	a.eventEmitter.Emit("scan-status-updated", map[string]string{"id": result.ID, "status": result.Status})

	scanResult, err := a.scanner.Scan(path)
	if err == nil {
		scanResult.ID = result.ID
		scanResult.ScanDate = result.ScanDate
		scanResult.Status = "COMPLETED"
		a.cache.Set(scanResult.ID, scanResult)
		a.eventEmitter.Emit("scan-status-updated", map[string]string{"id": scanResult.ID, "status": scanResult.Status})
	}

	return scanResult, err
}

func (a *API) ScanNonRecursive(path string) (*entity.DirEntry, error) {
	return a.scanner.ScanNonRecursive(path)
}

func (a *API) ListScans() []entity.ScanSummary {
	scans := make([]entity.ScanSummary, 0)
	for _, key := range a.cache.Keys() {
		if entry, exists := a.cache.Get(key); exists {
			dirEntry, ok := entry.(*entity.DirEntry)
			if !ok {
				continue // Skip entries that are not of type *entity.DirEntry
			}
			scans = append(scans, entity.ScanSummary{
				ID:       dirEntry.ID,
				ScanDate: dirEntry.ScanDate,
				Path:     dirEntry.Path,
				Status:   dirEntry.Status,
			})
		}
	}
	return scans
}

func (a *API) GetScan(id string) *entity.DirEntry {
	entry, exists := a.cache.Get(id)
	if !exists {
		log.Printf("Scan with ID %s not found", id)
		return nil
	}
	dirEntry, ok := entry.(*entity.DirEntry)
	if !ok {
		log.Printf("Entry with ID %s is not a DirEntry", id)
		return nil
	}
	return dirEntry
}

func (a *API) ListDrives() []string {
	drives, _ := a.fileSystem.ListDrives()
	return drives
}
