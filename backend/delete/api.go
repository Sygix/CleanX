package delete

import (
	"cleanx/backend/delete/entity"
	"cleanx/backend/delete/port"
	"cleanx/backend/delete/usecase"
)

type API struct {
	useCase *usecase.DeletionUseCase
}

func NewAPI(provider port.DeletionProvider, cache port.CacheRepository, eventEmitter port.EventEmitter) *API {
	deletionUseCase := usecase.NewDeletionUseCase(provider, cache, eventEmitter)
	return &API{
		useCase: deletionUseCase,
	}
}

func (a *API) DeleteItems(request entity.DeletionRequest) (*entity.DeletionSummary, error) {
	return a.useCase.DeleteItems(request)
}

func (a *API) GetDeletionHistory() ([]entity.DeletionSummary, error) {
	return a.useCase.GetDeletionHistory()
}
