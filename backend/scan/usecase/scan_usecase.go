package usecase

import (
	"cleanx/backend/scan/entity"
	"cleanx/backend/scan/port"
	"path/filepath"
	"sort"
)

type ScanUseCase struct {
	fs port.FileSystemPort
}

func NewScanUseCase(fs port.FileSystemPort) *ScanUseCase {
	return &ScanUseCase{fs: fs}
}

func (s *ScanUseCase) Scan(path string) (*entity.DirEntry, error) {
	rootInfo, err := s.fs.GetInfo(path)
	if err != nil {
		return nil, err
	}
	if !rootInfo.IsDir {
		return nil, nil
	}

	return s.scanRecursive(path)
}

func (s *ScanUseCase) scanRecursive(path string) (*entity.DirEntry, error) {
	root := &entity.DirEntry{
		Name:  filepath.Base(path),
		Path:  path,
		IsDir: true,
	}

	entries, err := s.fs.ReadDir(path)
	if err != nil {
		return nil, err
	}

	for _, e := range entries {
		if e.IsDir {
			sub, err := s.scanRecursive(e.Path)
			if err == nil {
				root.Children = append(root.Children, sub)
				root.Size += sub.Size
			}
		} else {
			root.Children = append(root.Children, &e)
			root.Size += e.Size
		}
	}

	sort.SliceStable(root.Children, func(i, j int) bool {
		return root.Children[i].Size > root.Children[j].Size
	})

	return root, nil
}
