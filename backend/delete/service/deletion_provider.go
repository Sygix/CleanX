package service

import (
	"cleanx/backend/delete/port"
	"os"
	"path/filepath"
)

type LocalDeletionProvider struct{}

func NewLocalDeletionProvider() port.DeletionProvider {
	return &LocalDeletionProvider{}
}

func (l *LocalDeletionProvider) DeleteFile(path string) error {
	return os.Remove(path)
}

func (l *LocalDeletionProvider) DeleteDirectory(path string, force bool) error {
	if force {
		return os.RemoveAll(path)
	}
	return os.Remove(path)
}

func (l *LocalDeletionProvider) GetFileInfo(path string) (size int64, isDir bool, err error) {
	info, err := os.Stat(path)
	if err != nil {
		return 0, false, err
	}

	if info.IsDir() {
		totalSize, err := l.calculateDirectorySize(path)
		return totalSize, true, err
	}

	return info.Size(), false, nil
}

func (l *LocalDeletionProvider) calculateDirectorySize(dirPath string) (int64, error) {
	var totalSize int64

	err := filepath.Walk(dirPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.IsDir() {
			totalSize += info.Size()
		}
		return nil
	})

	return totalSize, err
}
