package usecase

import (
	"cleanx/backend/scan/entity"
	"cleanx/backend/scan/port"
	"path/filepath"
	"sort"
	"sync"
)

type ScanUseCase struct {
	fs      port.FileSystemPort
	limiter port.ConcurrencyLimiter
}

func NewScanUseCase(fs port.FileSystemPort, limiter port.ConcurrencyLimiter) *ScanUseCase {
	return &ScanUseCase{fs: fs, limiter: limiter}
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

	if !recursive {
		for _, entry := range entries {
			root.Children = append(root.Children, &entry)
			root.Size += entry.Size
		}
		sort.SliceStable(root.Children, func(i, j int) bool {
			return root.Children[i].Size > root.Children[j].Size
		})
		return root, nil
	}

	var (
		wg sync.WaitGroup
		mu sync.Mutex
	)

	for _, entry := range entries {
		if entry.IsDir && recursive {
			wg.Add(1)
			s.limiter.Acquire()
			go func(e entity.DirEntry) {
				defer wg.Done()
				subDir, err := s.buildDirEntry(e.Path, recursive)
				s.limiter.Release()
				if err == nil && subDir != nil {
					mu.Lock()
					root.Children = append(root.Children, subDir)
					root.Size += subDir.Size
					mu.Unlock()
				}
			}(entry)
		} else {
			mu.Lock()
			root.Children = append(root.Children, &entry)
			root.Size += entry.Size
			mu.Unlock()
		}
	}
	wg.Wait()

	sort.SliceStable(root.Children, func(i, j int) bool {
		return root.Children[i].Size > root.Children[j].Size
	})

	return root, nil
}
