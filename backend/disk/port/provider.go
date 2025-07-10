package port

import "cleanx/backend/disk/entity"

type DiskUsageProvider interface {
	GetDiskUsage(path string) (*entity.DiskStats, error)
}
