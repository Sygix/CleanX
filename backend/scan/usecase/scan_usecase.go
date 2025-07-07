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

	return s.buildDirEntry(path, true)
}

func (s *ScanUseCase) ScanNonRecursive(path string) (*entity.DirEntry, error) {
	return s.buildDirEntry(path, false)
}

func (s *ScanUseCase) buildDirEntry(path string, recursive bool) (*entity.DirEntry, error) {
	root := &entity.DirEntry{
		Name:  filepath.Base(path),
		Path:  path,
		IsDir: true,
	}

	entries, err := s.fs.ReadDir(path)
	if err != nil {
		return nil, err
	}

	for _, entry := range entries {
		if entry.IsDir && recursive {
			subDir, err := s.buildDirEntry(entry.Path, recursive)
			if err != nil {
				continue
			}
			root.Children = append(root.Children, subDir)
			root.Size += subDir.Size
		} else {
			root.Children = append(root.Children, &entry)
			root.Size += entry.Size
		}
	}

	sort.SliceStable(root.Children, func(i, j int) bool {
		return root.Children[i].Size > root.Children[j].Size
	})

	return root, nil
}
