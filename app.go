package main

import (
	"cleanx/backend/delete"
	delete_entity "cleanx/backend/delete/entity"
	delete_service "cleanx/backend/delete/service"
	"cleanx/backend/disk"
	disk_entity "cleanx/backend/disk/entity"
	"cleanx/backend/scan"
	"cleanx/backend/scan/entity"
	"cleanx/backend/scan/service"
	"cleanx/backend/scan/usecase"
	"context"
	"fmt"
)

// App struct
type App struct {
	ctx       context.Context
	ScanAPI   *scan.API
	Disk      *disk.DiskModule
	DeleteAPI *delete.API
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	// Initialize the Scan API with required dependencies
	cache := service.NewInMemoryCache()
	eventEmitter := service.NewEventEmitter(ctx)
	fileSystem := service.NewLocalFileSystem()
	scanner := usecase.NewScanUseCase(fileSystem)

	a.ScanAPI = scan.NewAPI(cache, eventEmitter, fileSystem, scanner)
	a.Disk = disk.NewDiskModule()

	// Initialize the Delete API with required dependencies
	deletionProvider := delete_service.NewLocalDeletionProvider()
	deletionCache := delete_service.NewInMemoryCacheRepository()
	deletionEventEmitter := delete_service.NewDeletionEventEmitter(ctx)

	a.DeleteAPI = delete.NewAPI(deletionProvider, deletionCache, deletionEventEmitter)
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

func (a *App) GetSystemDiskUsage() (*disk_entity.DiskStats, error) {
	if a.Disk == nil {
		return nil, fmt.Errorf("Disk module not initialized")
	}
	return a.Disk.GetSystemDiskUsage()
}

// Deletion API methods

func (a *App) DeleteItems(request delete_entity.DeletionRequest) (*delete_entity.DeletionSummary, error) {
	if a.DeleteAPI == nil {
		return nil, fmt.Errorf("DeleteAPI not initialized")
	}
	return a.DeleteAPI.DeleteItems(request)
}

func (a *App) GetDeletionHistory() ([]delete_entity.DeletionSummary, error) {
	if a.DeleteAPI == nil {
		return nil, fmt.Errorf("DeleteAPI not initialized")
	}
	return a.DeleteAPI.GetDeletionHistory()
}
