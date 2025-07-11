package port

type DeletionProvider interface {
	DeleteFile(path string) error
	DeleteDirectory(path string, force bool) error
	GetFileInfo(path string) (size int64, isDir bool, err error)
}
