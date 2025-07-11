# CleanX

**CleanX is a cross-platform disk space analyzer and file management tool that helps you visualize disk usage, scan directories, and efficiently clean up storage space.**

## ✨ Features

- **📊 Disk Usage Analysis** - Real-time system disk usage monitoring with visual gauges
- **🔍 Directory Scanning** - Fast recursive and non-recursive directory scanning
- **📈 Data Visualization** - Interactive charts showing:
  - File size distribution
  - Top file extensions
  - Largest files treemap
  - Disk usage graphs
- **🗂️ File Explorer** - Browse and navigate scanned directories with filtering options
- **🗑️ File Management** - Safe deletion of files and folders with confirmation
- **📋 Scan History** - Track and manage previous scans
- **⚡ Real-time Updates** - Live progress tracking and event notifications
- **🖥️ Cross-platform** - Supports Windows, macOS, and Linux

## 📋 Prerequisites

Before running CleanX, ensure you have the following installed:

- **Go** (version 1.19 or later) - [Download Go](https://golang.org/dl/)
- **Node.js** (version 16 or later) - [Download Node.js](https://nodejs.org/)
- **Wails CLI** - Install with: `go install github.com/wailsapp/wails/v2/cmd/wails@latest`

## 🚀 Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd CleanX
   ```

2. **Install dependencies:**

   ```bash
   # Install Go dependencies
   go mod download

   # Install frontend dependencies
   cd frontend
   npm install  # or pnpm install
   cd ..
   ```

## 🛠️ Development

### Live Development Mode

To run the application in development mode with hot reload:

```bash
wails dev
```

This will:

- Start the Go backend
- Launch a Vite development server for fast frontend hot reload
- Open the application window
- Provide a web interface at `http://localhost:34115` for browser development

### Building for Production

To build a redistributable executable:

```bash
wails build
```

The built application will be available in the `build/bin/` directory.

### Project Structure

```
CleanX/
├── app.go              # Main application entry point
├── main.go             # Wails application setup
├── wails.json          # Wails configuration
├── backend/            # Go backend modules
│   ├── scan/           # Directory scanning functionality
│   ├── delete/         # File deletion operations
│   ├── disk/           # Disk usage monitoring
│   └── elevate/        # Privilege elevation utilities
├── frontend/           # React TypeScript frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── routes/     # Application pages
│   │   └── utils/      # Utility functions
│   └── wailsjs/        # Generated Wails bindings
└── build/              # Build output directory
```

## 🎯 Usage

1. **Launch CleanX** - Run the built executable or use `wails dev`
2. **Select Drive** - Choose a drive or directory to scan
3. **Start Scanning** - Click "Nouveau Scan" to analyze disk usage
4. **Explore Results** - Use the file explorer and charts to identify large files
5. **Manage Files** - Delete unnecessary files directly from the interface
6. **Track History** - Review previous scans and deletion activities

## 🔧 Configuration

CleanX can be configured through `wails.json`. Key configuration options include:

- **Window settings** - Size, position, and appearance
- **Build options** - Target platforms and compilation flags
- **Asset bundling** - Frontend build configuration

Refer to the [Wails documentation](https://wails.io/docs/reference/project-config) for detailed configuration options.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

- **Build failures**: Ensure Go and Node.js versions meet requirements
- **Permission errors**: Run with appropriate permissions for file operations
- **Missing dependencies**: Run `go mod download` and `npm install`

### Debug Mode

For detailed logging, run in development mode:

```bash
wails dev -debug
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Wails](https://wails.io/) - Go + Web frontend framework
- UI components powered by React and TypeScript
- Charts and visualizations using modern web technologies
