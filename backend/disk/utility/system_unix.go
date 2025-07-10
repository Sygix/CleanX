//go:build linux || darwin || unix
// +build linux darwin unix

package utility

import (
	"cleanx/backend/disk/entity"

	"golang.org/x/sys/unix"
)

func GetDiskUsage(path string) (*entity.DiskStats, error) {
	var stat unix.Statfs_t
	err := unix.Statfs(path, &stat)
	if err != nil {
		return nil, err
	}
	total := stat.Blocks * uint64(stat.Bsize)
	free := stat.Bfree * uint64(stat.Bsize)
	return &entity.DiskStats{
		Total: total,
		Free:  free,
		Used:  total - free,
	}, nil
}
