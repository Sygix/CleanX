package service

import (
	"context"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type EventEmitter struct {
	ctx context.Context
}

func NewEventEmitter(ctx context.Context) *EventEmitter {
	return &EventEmitter{ctx: ctx}
}

func (e *EventEmitter) Emit(eventName string, data interface{}) {
	// Use Wails runtime to emit events
	runtime.EventsEmit(e.ctx, eventName, data)
}
