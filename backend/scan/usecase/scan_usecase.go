package usecase

import (
	"cleanx/backend/scan/entity"
	"cleanx/backend/scan/port"
	"log"
	"path/filepath"
	"runtime"
	"sort"
	"sync"
	"time"
)

type ScanUseCase struct {
	fs              port.FileSystemPort
	maxGoroutines   int
	maxDepth        int
	memoryThreshold uint64 // Maximum memory usage in bytes before throttling
}

func NewScanUseCase(fs port.FileSystemPort) *ScanUseCase {
	return &ScanUseCase{
		fs:              fs,
		maxGoroutines:   100,                // Limit concurrent goroutines
		maxDepth:        50,                 // Prevent excessive recursion depth
		memoryThreshold: 1024 * 1024 * 1024, // 1GB memory threshold
	}
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

// checkMemoryUsage returns true if memory usage is above threshold
func (s *ScanUseCase) checkMemoryUsage() bool {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)
	return m.Alloc > s.memoryThreshold
}

func (s *ScanUseCase) buildDirEntry(path string, recursive bool) (*entity.DirEntry, error) {
	return s.buildDirEntryWithDepth(path, recursive, 0)
}

func (s *ScanUseCase) buildDirEntryWithDepth(path string, recursive bool, depth int) (*entity.DirEntry, error) {
	start := time.Now()
	log.Printf("Scanning directory: %s (depth: %d)", path, depth)

	// Check memory usage before proceeding
	if s.checkMemoryUsage() {
		log.Printf("Warning: Memory usage above threshold, forcing garbage collection")
		runtime.GC()
		runtime.GC() // Double GC for better cleanup

		// Check again after GC
		if s.checkMemoryUsage() {
			log.Printf("Warning: Memory still high after GC, limiting scan depth")
			return &entity.DirEntry{
				Name:       filepath.Base(path),
				Path:       path,
				IsDir:      true,
				Size:       0,
				TotalDirs:  0,
				TotalFiles: 0,
				Children:   []*entity.DirEntry{},
				Elapsed:    time.Since(start),
			}, nil
		}
	}

	// Prevent excessive recursion depth
	if depth > s.maxDepth {
		log.Printf("Warning: Maximum recursion depth reached for %s", path)
		return &entity.DirEntry{
			Name:       filepath.Base(path),
			Path:       path,
			IsDir:      true,
			Size:       0,
			TotalDirs:  0,
			TotalFiles: 0,
			Children:   []*entity.DirEntry{},
			Elapsed:    time.Since(start),
		}, nil
	}

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
		root.Elapsed = time.Since(start)
		return root, nil
	}

	if !recursive {
		// Non-recursive scan with memory safety
		for i, entry := range entries {
			// Check memory periodically during large directory scans
			if i%1000 == 0 && s.checkMemoryUsage() {
				log.Printf("Warning: Memory usage high during non-recursive scan, stopping at %d entries", i)
				break
			}

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

	// Recursive scan with controlled concurrency and memory management
	var (
		wg        sync.WaitGroup
		mu        sync.Mutex
		semaphore = make(chan struct{}, s.maxGoroutines) // Limit concurrent goroutines
	)

	// Separate directories and files for better memory management
	var directories []entity.DirEntry
	var files []entity.DirEntry

	for _, entry := range entries {
		if entry.IsDir {
			directories = append(directories, entry)
		} else {
			files = append(files, entry)
		}
	}

	// Process files first (less memory intensive)
	for _, entry := range files {
		mu.Lock()
		root.Children = append(root.Children, &entry)
		root.Size += entry.Size
		root.TotalFiles++
		mu.Unlock()
	}

	// Process directories with controlled concurrency
	for _, entry := range directories {
		// Check memory before spawning new goroutine
		if s.checkMemoryUsage() {
			log.Printf("Warning: Memory usage high, processing %s synchronously", entry.Path)
			// Process synchronously to avoid memory explosion
			subDir, err := s.buildDirEntryWithDepth(entry.Path, recursive, depth+1)
			if err != nil {
				log.Printf("Error scanning subdirectory %s: %v - continuing with scan", entry.Path, err)
				subDir = &entity.DirEntry{
					Name:       entry.Name,
					Path:       entry.Path,
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
			continue
		}

		wg.Add(1)
		go func(e entity.DirEntry) {
			defer wg.Done()

			// Acquire semaphore to limit concurrency
			semaphore <- struct{}{}
			defer func() { <-semaphore }()

			defer func() {
				if r := recover(); r != nil {
					log.Printf("Recovered from panic while scanning %s: %v", e.Path, r)
				}
			}()

			subDir, err := s.buildDirEntryWithDepth(e.Path, recursive, depth+1)
			if err != nil {
				log.Printf("Error scanning subdirectory %s: %v - continuing with scan", e.Path, err)
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
	}

	wg.Wait()

	sort.SliceStable(root.Children, func(i, j int) bool {
		return root.Children[i].Size > root.Children[j].Size
	})

	root.Elapsed = time.Since(start)
	log.Printf("Finished scanning directory: %s, Total size: %d, Total directories: %d, Total files: %d, Elapsed time: %s", path, root.Size, root.TotalDirs, root.TotalFiles, root.Elapsed)
	return root, nil
}
