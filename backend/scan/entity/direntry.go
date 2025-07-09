package entity

import "time"

type DirEntry struct {
	Name       string        `json:"name"`
	Path       string        `json:"path"`
	Size       int64         `json:"size"`
	IsDir      bool          `json:"isDir"`
	Children   []*DirEntry   `json:"children,omitempty"`
	Elapsed    time.Duration `json:"elapsed"`
	TotalDirs  int           `json:"totalDirs"`
	TotalFiles int           `json:"totalFiles"`
}
