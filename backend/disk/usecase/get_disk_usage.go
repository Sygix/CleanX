package usecase

import (
	"cleanx/backend/disk/entity"
	"cleanx/backend/disk/port"
)

type GetDiskUsageUsecase struct {
	provider port.DiskUsageProvider
}

func NewGetDiskUsageUsecase(p port.DiskUsageProvider) *GetDiskUsageUsecase {
	return &GetDiskUsageUsecase{provider: p}
}

func (u *GetDiskUsageUsecase) GetSystemDiskUsage() (*entity.DiskStats, error) {
	defaultPath := "/"
	return u.provider.GetDiskUsage(defaultPath)
}
