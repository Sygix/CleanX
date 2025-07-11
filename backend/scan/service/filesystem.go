package service

import (
	"cleanx/backend/scan/entity"
	"log"
	"os"
	"path/filepath"
)

type LocalFileSystem struct{}

func NewLocalFileSystem() *LocalFileSystem {
	return &LocalFileSystem{}
}

func (l *LocalFileSystem) ReadDir(path string) ([]entity.DirEntry, error) {
	entries, err := os.ReadDir(path)
	if err != nil {
		// Log the error but don't fail completely - return empty slice
		log.Printf("Warning: Cannot read directory %s: %v", path, err)
		return []entity.DirEntry{}, nil
	}

	var result []entity.DirEntry
	for _, e := range entries {
		fullPath := filepath.Join(path, e.Name())
		info, err := e.Info()
		if err != nil {
			// Skip files/directories we can't access (permission issues, etc.)
			log.Printf("Warning: Cannot access %s: %v", fullPath, err)
			continue
		}

		// Additional safety check for file size (in case of permission issues)
		var size int64
		if !e.IsDir() {
			size = info.Size()
			// Sanity check for negative or extremely large sizes
			if size < 0 {
				log.Printf("Warning: Invalid file size for %s: %d", fullPath, size)
				size = 0
			}
		}

		result = append(result, entity.DirEntry{
			Name:  e.Name(),
			Path:  fullPath,
			Size:  size,
			IsDir: e.IsDir(),
		})
	}
	return result, nil
}

func (l *LocalFileSystem) GetInfo(path string) (entity.DirEntry, error) {
	info, err := os.Stat(path)
	if err != nil {
		log.Printf("Warning: Cannot get info for %s: %v", path, err)
		return entity.DirEntry{}, err
	}

	// Additional safety checks
	var size int64
	if !info.IsDir() {
		size = info.Size()
		// Sanity check for negative or extremely large sizes
		if size < 0 {
			log.Printf("Warning: Invalid file size for %s: %d, setting to 0", path, size)
			size = 0
		}
	}

	return entity.DirEntry{
		Name:  filepath.Base(path),
		Path:  path,
		Size:  size,
		IsDir: info.IsDir(),
	}, nil
}

func (l *LocalFileSystem) ListDrives() ([]string, error) {
	return listDrives()
}
