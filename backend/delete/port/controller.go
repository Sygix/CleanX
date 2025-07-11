package port

import "cleanx/backend/delete/entity"

type DeletionController interface {
	DeleteItems(request entity.DeletionRequest) (*entity.DeletionSummary, error)
	GetDeletionHistory() ([]entity.DeletionSummary, error)
}

type EventEmitter interface {
	EmitDeletionProgress(summary *entity.DeletionSummary)
	EmitDeletionComplete(summary *entity.DeletionSummary)
}

type CacheRepository interface {
	StoreDeletionSummary(summary *entity.DeletionSummary) error
	GetAllDeletionSummaries() ([]entity.DeletionSummary, error)
}
