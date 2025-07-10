package elevate

func EnsureElevated() error {
	e := GetElevator()
	if e.IsElevated() {
		return nil
	}
	return e.Elevate()
}
