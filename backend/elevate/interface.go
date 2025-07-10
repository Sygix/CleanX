package elevate

type Elevator interface {
	IsElevated() bool
	Elevate() error
}
