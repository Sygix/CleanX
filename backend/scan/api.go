package scan

import (
	"cleanx/backend/scan/entity"
	"cleanx/backend/scan/service"
	"cleanx/backend/scan/usecase"
)

type API struct {
	fs *service.LocalFileSystem
}

func NewAPI() *API {
	fs := service.NewLocalFileSystem()
	return &API{
		fs: fs,
	}
}

func (a *API) Scan(path string) (*entity.DirEntry, error) {
	scanner := usecase.NewScanUseCase(a.fs)
	return scanner.Scan(path)
}

func (a *API) ScanNonRecursive(path string) (*entity.DirEntry, error) {
	scanner := usecase.NewScanUseCase(a.fs)
	return scanner.ScanNonRecursive(path)
}
