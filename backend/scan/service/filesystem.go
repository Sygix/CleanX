package service

import (
	"cleanx/backend/scan/entity"
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
	return listDrives()
}
