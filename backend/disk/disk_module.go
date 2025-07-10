package disk

import (
	"cleanx/backend/disk/entity"
	"cleanx/backend/disk/service"
	"cleanx/backend/disk/usecase"
)

type DiskModule struct {
	usecase *usecase.GetDiskUsageUsecase
}

func NewDiskModule() *DiskModule {
	provider := service.NewUsageReader()
	usecase := usecase.NewGetDiskUsageUsecase(provider)
	return &DiskModule{usecase: usecase}
}

func (d *DiskModule) GetSystemDiskUsage() (*entity.DiskStats, error) {
	return d.usecase.GetSystemDiskUsage()
}
