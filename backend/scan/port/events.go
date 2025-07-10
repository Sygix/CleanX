package port

type EventEmitterPort interface {
	Emit(eventName string, data interface{})
}
