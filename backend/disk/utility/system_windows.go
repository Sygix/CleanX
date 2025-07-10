//go:build windows
// +build windows

package utility

import (
	"cleanx/backend/disk/entity"
	"syscall"
	"unsafe"
)

func GetDiskUsage(path string) (*entity.DiskStats, error) {
	kernel32 := syscall.MustLoadDLL("kernel32.dll")
	getDiskFreeSpaceExW := kernel32.MustFindProc("GetDiskFreeSpaceExW")

	lpDirectoryName, err := syscall.UTF16PtrFromString(path)
	if err != nil {
		return nil, err
	}

	var freeBytesAvailable, totalBytes, totalFreeBytes uint64
	r1, _, err := getDiskFreeSpaceExW.Call(
		uintptr(unsafe.Pointer(lpDirectoryName)),
		uintptr(unsafe.Pointer(&freeBytesAvailable)),
		uintptr(unsafe.Pointer(&totalBytes)),
		uintptr(unsafe.Pointer(&totalFreeBytes)),
	)

	if r1 == 0 {
		return nil, err
	}

	return &entity.DiskStats{
		Total: totalBytes,
		Free:  totalFreeBytes,
		Used:  totalBytes - totalFreeBytes,
	}, nil
}
