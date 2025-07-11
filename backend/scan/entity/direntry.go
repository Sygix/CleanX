package entity

import "time"

type DirEntry struct {
	ID         string        `json:"id"`
	ScanDate   string        `json:"scanDate"`
	Name       string        `json:"name"`
	Path       string        `json:"path"`
	Size       int64         `json:"size"`
	IsDir      bool          `json:"isDir"`
	Children   []*DirEntry   `json:"children,omitempty"`
	Elapsed    time.Duration `json:"elapsed"`
	TotalDirs  int           `json:"totalDirs"`
	TotalFiles int           `json:"totalFiles"`
	Status     string        `json:"status"`
}
