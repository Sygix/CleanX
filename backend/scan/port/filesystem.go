package port

import "cleanx/backend/scan/entity"

type FileSystemPort interface {
	ReadDir(path string) ([]entity.DirEntry, error)
	GetInfo(path string) (entity.DirEntry, error)
	ListDrives() ([]string, error)
}
