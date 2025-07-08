package scan

import (
	"cleanx/backend/scan/entity"
	"cleanx/backend/scan/service"
	"cleanx/backend/scan/usecase"
)

type API struct {
	fs      *service.LocalFileSystem
	limiter *service.SemaphoreLimiter
}

func NewAPI() *API {
	fs := service.NewLocalFileSystem()
	limiter := service.NewSemaphoreLimiter(16) // Nombre de goroutines concurrentes TODO: Make this configurable in the UI
	return &API{
		fs:      fs,
		limiter: limiter,
	}
}

func (a *API) Scan(path string) (*entity.DirEntry, error) {
	scanner := usecase.NewScanUseCase(a.fs, a.limiter)
	return scanner.Scan(path)
}

func (a *API) ScanNonRecursive(path string) (*entity.DirEntry, error) {
	scanner := usecase.NewScanUseCase(a.fs, a.limiter)
	return scanner.ScanNonRecursive(path)
}
