package entity

type ScanSummary struct {
	ID       string `json:"id"`
	ScanDate string `json:"scanDate"`
	Path     string `json:"path"`
	Status   string `json:"status"`
}
