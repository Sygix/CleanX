package main

import (
	"cleanx/backend/elevate"
	"embed"
	"fmt"
	"os"
	"runtime"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Ensure the application is running with elevated privileges if not in development mode
	if os.Getenv("WAILS_ENV") != "dev" {
		elevator := elevate.GetElevator()

		if !elevator.IsElevated() {
			fmt.Println("L'application ne dispose pas des privilèges administrateur/root.")

			switch runtime.GOOS {
			case "windows":
				err := elevator.Elevate()
				if err != nil {
					fmt.Println("Échec de l'élévation :", err)
					os.Exit(1)
				}
				os.Exit(0) // Process parent quitte, enfant root continue
			default:
				// Sur Linux/macOS : on continue sans élever
				fmt.Println("Continuer sans élévation sur", runtime.GOOS)
			}
		}
	}

	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "CleanX",
		Width:  1440,
		Height: 1024,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
