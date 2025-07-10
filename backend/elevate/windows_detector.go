//go:build windows
// +build windows

package elevate

func GetElevator() Elevator {
	return &windowsElevator{}
}
