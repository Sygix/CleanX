package service

import (
	"cleanx/backend/delete/entity"
	"cleanx/backend/delete/port"
	"context"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type DeletionEventEmitter struct {
	ctx context.Context
}

func NewDeletionEventEmitter(ctx context.Context) port.EventEmitter {
	return &DeletionEventEmitter{
		ctx: ctx,
	}
}

func (e *DeletionEventEmitter) EmitDeletionProgress(summary *entity.DeletionSummary) {
	runtime.EventsEmit(e.ctx, "deletion-progress", summary)
}

func (e *DeletionEventEmitter) EmitDeletionComplete(summary *entity.DeletionSummary) {
	runtime.EventsEmit(e.ctx, "deletion-complete", summary)
}
