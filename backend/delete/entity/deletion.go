package entity

type DeletionResult struct {
	ID          string `json:"id"`
	Path        string `json:"path"`
	Success     bool   `json:"success"`
	Error       string `json:"error,omitempty"`
	IsDirectory bool   `json:"isDirectory"`
	Size        int64  `json:"size"`
	DeletedAt   string `json:"deletedAt"`
}

type DeletionRequest struct {
	Paths []string `json:"paths"`
	Force bool     `json:"force"`
}

type DeletionSummary struct {
	ID           string           `json:"id"`
	TotalItems   int              `json:"totalItems"`
	SuccessCount int              `json:"successCount"`
	FailureCount int              `json:"failureCount"`
	TotalSize    int64            `json:"totalSize"`
	Results      []DeletionResult `json:"results"`
	StartedAt    string           `json:"startedAt"`
	CompletedAt  string           `json:"completedAt"`
	Status       string           `json:"status"`
}
