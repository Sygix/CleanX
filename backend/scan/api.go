package scan

import (
	"cleanx/backend/scan/entity"
	"cleanx/backend/scan/service"
	"cleanx/backend/scan/usecase"
	"sync"
	"time"

	"github.com/google/uuid"
)

type API struct {
	fs    *service.LocalFileSystem
	cache map[string]*entity.DirEntry
	mu    sync.RWMutex
}

func NewAPI() *API {
	fs := service.NewLocalFileSystem()
	return &API{
		fs:    fs,
		cache: make(map[string]*entity.DirEntry),
	}
}

func (a *API) Scan(path string) (*entity.DirEntry, error) {
	scanner := usecase.NewScanUseCase(a.fs)
	result, err := scanner.Scan(path)
	if err == nil {
		result.ID = uuid.New().String()
		result.ScanDate = time.Now().Format(time.RFC3339)
		a.mu.Lock()
		a.cache[path] = result
		a.mu.Unlock()
	}
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
