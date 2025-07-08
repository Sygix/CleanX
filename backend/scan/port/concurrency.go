package port

type ConcurrencyLimiter interface {
	Acquire()
	Release()
}
