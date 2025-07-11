package usecase

import (
	"cleanx/backend/scan/entity"
	"cleanx/backend/scan/port"
	"log"
	"path/filepath"
	"sort"
	"sync"
	"time"
)

type ScanUseCase struct {
	fs port.FileSystemPort
}

func NewScanUseCase(fs port.FileSystemPort) *ScanUseCase {
	return &ScanUseCase{fs: fs}
}

func (s *ScanUseCase) Scan(path string) (*entity.DirEntry, error) {
	defer func() {
		// Recover from any panics that might occur during scanning
		if r := recover(); r != nil {
			log.Printf("Recovered from panic while scanning %s: %v", path, r)
		}
	}()

	rootInfo, err := s.fs.GetInfo(path)
	if err != nil {
		log.Printf("Warning: Cannot access path %s: %v", path, err)
		// Return a minimal entry instead of failing completely
		return &entity.DirEntry{
			Name:     filepath.Base(path),
			Path:     path,
			Size:     0,
			IsDir:    true,
			Children: []*entity.DirEntry{},
		}, nil
	}
	if !rootInfo.IsDir {
		return nil, nil
	}

	return s.buildDirEntry(path, true)
}

func (s *ScanUseCase) ScanNonRecursive(path string) (*entity.DirEntry, error) {
	defer func() {
		// Recover from any panics that might occur during scanning
		if r := recover(); r != nil {
			log.Printf("Recovered from panic while scanning non-recursive %s: %v", path, r)
		}
	}()

	return s.buildDirEntry(path, false)
}

func (s *ScanUseCase) buildDirEntry(path string, recursive bool) (*entity.DirEntry, error) {
	start := time.Now()
	log.Printf("Scanning directory: %s", path)
	root := &entity.DirEntry{
		Name:       filepath.Base(path),
		Path:       path,
		IsDir:      true,
		TotalDirs:  0,
		TotalFiles: 0,
	}

	entries, err := s.fs.ReadDir(path)
	if err != nil {
		log.Printf("Error reading directory %s: %v", path, err)
		// Instead of returning error, return partial results with empty children
		root.Elapsed = time.Since(start)
		return root, nil
	}

	if !recursive {
		for _, entry := range entries {
			log.Printf("Scanned file: %s, Size: %d", entry.Path, entry.Size)
			root.Children = append(root.Children, &entry)
			root.Size += entry.Size
			if entry.IsDir {
				root.TotalDirs++
			} else {
				root.TotalFiles++
			}
		}
		sort.SliceStable(root.Children, func(i, j int) bool {
			return root.Children[i].Size > root.Children[j].Size
		})
		root.Elapsed = time.Since(start)
		log.Printf("Finished scanning directory: %s, Total size: %d, Total directories: %d, Total files: %d, Elapsed time: %s", path, root.Size, root.TotalDirs, root.TotalFiles, root.Elapsed)
		return root, nil
	}

	var (
		wg sync.WaitGroup
		mu sync.Mutex
	)

	for _, entry := range entries {
		if entry.IsDir && recursive {
			wg.Add(1)
			go func(e entity.DirEntry) {
				defer wg.Done()
				defer func() {
					// Recover from any panics that might occur during scanning
					if r := recover(); r != nil {
						log.Printf("Recovered from panic while scanning %s: %v", e.Path, r)
					}
				}()

				subDir, err := s.buildDirEntry(e.Path, recursive)
				if err != nil {
					// Log error but continue with other directories
					log.Printf("Error scanning subdirectory %s: %v - continuing with scan", e.Path, err)
					// Create a placeholder entry for the problematic directory
					subDir = &entity.DirEntry{
						Name:       e.Name,
						Path:       e.Path,
						Size:       0,
						IsDir:      true,
						TotalDirs:  0,
						TotalFiles: 0,
						Children:   nil,
					}
				}

				if subDir != nil {
					mu.Lock()
					root.Children = append(root.Children, subDir)
					root.Size += subDir.Size
					root.TotalDirs += subDir.TotalDirs + 1
					root.TotalFiles += subDir.TotalFiles
					mu.Unlock()
				}
			}(entry)
		} else {
			log.Printf("Scanned file: %s, Size: %d", entry.Path, entry.Size)
			mu.Lock()
			root.Children = append(root.Children, &entry)
			root.Size += entry.Size
			if entry.IsDir {
				root.TotalDirs++
			} else {
				root.TotalFiles++
			}
			mu.Unlock()
		}
	}
	wg.Wait()

	sort.SliceStable(root.Children, func(i, j int) bool {
		return root.Children[i].Size > root.Children[j].Size
	})

	root.Elapsed = time.Since(start)
	log.Printf("Finished scanning directory: %s, Total size: %d, Total directories: %d, Total files: %d, Elapsed time: %s", path, root.Size, root.TotalDirs, root.TotalFiles, root.Elapsed)
	return root, nil
}
