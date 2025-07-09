package scan

import (
	"cleanx/backend/scan/entity"
	"cleanx/backend/scan/service"
	"cleanx/backend/scan/usecase"
	"sync"
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

func (a *API) ListScans() []string {
	a.mu.RLock()
	defer a.mu.RUnlock()
	paths := make([]string, 0, len(a.cache))
	for path := range a.cache {
		paths = append(paths, path)
	}
	return paths
}

func (a *API) GetScan(path string) (*entity.DirEntry, bool) {
	a.mu.RLock()
	defer a.mu.RUnlock()
	result, exists := a.cache[path]
	return result, exists
}
