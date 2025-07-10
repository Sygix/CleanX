//go:build windows
// +build windows

package service

import (
	"syscall"
	"unsafe"
)

func listDrives() ([]string, error) {
	kernel32 := syscall.NewLazyDLL("kernel32.dll")
	getLogicalDriveStrings := kernel32.NewProc("GetLogicalDriveStringsW")

	const maxDrives = 254
	buffer := make([]uint16, maxDrives)

	r, _, err := getLogicalDriveStrings.Call(
		uintptr(len(buffer)),
		uintptr(unsafe.Pointer(&buffer[0])),
	)

	if r == 0 {
		return nil, err
	}

	i := 0
	var result []string
	for {
		start := i
		for i < len(buffer) && buffer[i] != 0 {
			i++
		}
		if start == i {
			break
		}
		drive := syscall.UTF16ToString(buffer[start:i])
		result = append(result, drive)
		i++
	}
	return result, nil
}
