package main

import (
	"cleanx/backend/scan"
	"cleanx/backend/scan/entity"
	"cleanx/backend/scan/service"
	"cleanx/backend/scan/usecase"
	"context"
	"fmt"
)

// App struct
type App struct {
	ctx     context.Context
	ScanAPI *scan.API
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	// Initialize the API with required dependencies
	cache := service.NewInMemoryCache()
	eventEmitter := service.NewEventEmitter(ctx)
	fileSystem := service.NewLocalFileSystem()
	scanner := usecase.NewScanUseCase(fileSystem)

	a.ScanAPI = scan.NewAPI(cache, eventEmitter, fileSystem, scanner)
}

func (a *App) Scan(path string) (*entity.DirEntry, error) {
	if a.ScanAPI == nil {
		return nil, fmt.Errorf("ScanAPI not initialized")
	}
	return a.ScanAPI.Scan(path)
}

func (a *App) ScanNonRecursive(path string) (*entity.DirEntry, error) {
	if a.ScanAPI == nil {
		return nil, fmt.Errorf("ScanAPI not initialized")
	}
	return a.ScanAPI.ScanNonRecursive(path)
}

func (a *App) ListScans() ([]entity.ScanSummary, error) {
	if a.ScanAPI == nil {
		return nil, fmt.Errorf("ScanAPI not initialized")
	}
	return a.ScanAPI.ListScans(), nil
}

func (a *App) GetScan(id string) (*entity.DirEntry, error) {
	if a.ScanAPI == nil {
		return nil, fmt.Errorf("ScanAPI not initialized")
	}
	return a.ScanAPI.GetScan(id), nil
}

func (a *App) ListDrives() ([]string, error) {
	if a.ScanAPI == nil {
		return nil, fmt.Errorf("ScanAPI not initialized")
	}
	return a.ScanAPI.ListDrives(), nil
}
