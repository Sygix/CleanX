package elevate

import "os"

type linuxElevator struct{}

func (l *linuxElevator) IsElevated() bool {
	return os.Geteuid() == 0
}

func (l *linuxElevator) Elevate() error {
	return nil // noop: we do not elevate on Linux
}
