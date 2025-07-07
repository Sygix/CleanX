package main

import (
	"cleanx/backend/scan/entity"
	"cleanx/backend/scan/service"
	"cleanx/backend/scan/usecase"
	"context"
	"log"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	fs := service.NewLocalFileSystem()
	scanner := usecase.NewScanUseCase(fs)

	result, err := scanner.Scan("/home/simon/Documents/Cours/CleanX")
	if err != nil {
		log.Println("Erreur:", err)
	} else {
		log.Printf("Résultat:\n%+v\n", result)
	}
}

// Scan function
func (a *App) Scan(path string) (*entity.DirEntry, error) {
	fs := service.NewLocalFileSystem()
	scanner := usecase.NewScanUseCase(fs)

	return scanner.Scan(path)
}
