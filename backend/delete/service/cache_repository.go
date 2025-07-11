package service

import (
	"cleanx/backend/delete/entity"
	"cleanx/backend/delete/port"
	"sync"
)

type InMemoryCacheRepository struct {
	summaries map[string]*entity.DeletionSummary
	mutex     sync.RWMutex
}

func NewInMemoryCacheRepository() port.CacheRepository {
	return &InMemoryCacheRepository{
		summaries: make(map[string]*entity.DeletionSummary),
	}
}

func (c *InMemoryCacheRepository) StoreDeletionSummary(summary *entity.DeletionSummary) error {
	c.mutex.Lock()
	defer c.mutex.Unlock()

	c.summaries[summary.ID] = summary
	return nil
}

func (c *InMemoryCacheRepository) GetAllDeletionSummaries() ([]entity.DeletionSummary, error) {
	c.mutex.RLock()
	defer c.mutex.RUnlock()

	summaries := make([]entity.DeletionSummary, 0, len(c.summaries))
	for _, summary := range c.summaries {
		summaries = append(summaries, *summary)
	}

	return summaries, nil
}
