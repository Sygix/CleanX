package entity

type DirEntry struct {
	Name     string      `json:"name"`
	Path     string      `json:"path"`
	Size     int64       `json:"size"`
	IsDir    bool        `json:"isDir"`
	Children []*DirEntry `json:"children,omitempty"`
}
