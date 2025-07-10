package service

import (
	"cleanx/backend/scan/entity"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
)

type LocalFileSystem struct{}

func NewLocalFileSystem() *LocalFileSystem {
	return &LocalFileSystem{}
}

func (l *LocalFileSystem) ReadDir(path string) ([]entity.DirEntry, error) {
	entries, err := os.ReadDir(path)
	if err != nil {
		return nil, err
	}

	var result []entity.DirEntry
	for _, e := range entries {
		fullPath := filepath.Join(path, e.Name())
		info, err := e.Info()
		if err != nil {
			continue
		}
		result = append(result, entity.DirEntry{
			Name:  e.Name(),
			Path:  fullPath,
			Size:  info.Size(),
			IsDir: e.IsDir(),
		})
	}
	return result, nil
}

func (l *LocalFileSystem) GetInfo(path string) (entity.DirEntry, error) {
	info, err := os.Stat(path)
	if err != nil {
		return entity.DirEntry{}, err
	}
	return entity.DirEntry{
		Name:  filepath.Base(path),
		Path:  path,
		Size:  info.Size(),
		IsDir: info.IsDir(),
	}, nil
}

func (l *LocalFileSystem) ListDrives() ([]string, error) {
	if runtime.GOOS != "windows" {
		// On Unix-like systems, just return root
		return []string{"/"}, nil
	}
	// On Windows, use wmic to list logical drives
	out, err := exec.Command("wmic", "logicaldisk", "get", "name").Output()
	if err != nil {
		return nil, err
	}
	lines := strings.Split(string(out), "\n")
	var drives []string
	for _, line := range lines {
		drive := strings.TrimSpace(line)
		if strings.HasSuffix(drive, ":") || strings.HasSuffix(drive, ":\\") {
			if !strings.HasSuffix(drive, "\\") {
				drive += "\\"
			}
			drives = append(drives, drive)
		}
	}
	return drives, nil
}
