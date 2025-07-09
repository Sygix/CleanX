package main

import (
	"cleanx/backend/scan"
	"context"
)

// App struct
type App struct {
	ctx     context.Context
	ScanAPI *scan.API
}

// NewApp creates a new App application struct
func NewApp() *App {
	ctx := context.Background()
	return &App{
		ctx:     ctx,
		ScanAPI: scan.NewAPI(ctx),
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	a.ScanAPI.SetContext(ctx)
}
