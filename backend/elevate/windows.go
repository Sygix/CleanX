//go:build windows
// +build windows

package elevate

import (
	"os"
	"path/filepath"

	"golang.org/x/sys/windows"
)

type windowsElevator struct{}

func (w *windowsElevator) IsElevated() bool {
	sid, _ := windows.CreateWellKnownSid(windows.WinBuiltinAdministratorsSid)
	token := windows.Token(0)
	member, err := token.IsMember(sid)
	return err == nil && member
}

func (w *windowsElevator) Elevate() error {
	exe, _ := os.Executable()
	verbPtr, _ := windows.UTF16PtrFromString("runas")
	exePtr, _ := windows.UTF16PtrFromString(exe)
	paramPtr, _ := windows.UTF16PtrFromString("")
	dirPtr, _ := windows.UTF16PtrFromString(filepath.Dir(exe))

	// windows.ShellExecute returns only `error`
	err := windows.ShellExecute(0,
		verbPtr,
		exePtr,
		paramPtr,
		dirPtr,
		windows.SW_NORMAL,
	)

	return err
}
