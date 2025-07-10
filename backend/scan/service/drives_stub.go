//go:build !windows
// +build !windows

package service

func listDrives() ([]string, error) {
	// Default drive on Unix
	return []string{"/"}, nil
}
