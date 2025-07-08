package service

type SemaphoreLimiter struct {
	sem chan struct{}
}

func NewSemaphoreLimiter(max int) *SemaphoreLimiter {
	return &SemaphoreLimiter{sem: make(chan struct{}, max)}
}

func (s *SemaphoreLimiter) Acquire() {
	s.sem <- struct{}{}
}

func (s *SemaphoreLimiter) Release() {
	<-s.sem
}
