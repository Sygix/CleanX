package port

import "cleanx/backend/disk/entity"

type DiskController interface {
	GetSystemDiskUsage() (*entity.DiskStats, error)
}
