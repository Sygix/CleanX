package service

import (
	"cleanx/backend/disk/entity"
	"cleanx/backend/disk/utility"
)

type UsageReader struct{}

func NewUsageReader() *UsageReader {
	return &UsageReader{}
}

func (r *UsageReader) GetDiskUsage(path string) (*entity.DiskStats, error) {
	return utility.GetDiskUsage(path)
}
