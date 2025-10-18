package httpserver

import (
	"net"
	"time"
)

type Option func(*Server)

func Port(port string) Option {
	return func(s *Server) {
		s.address = net.JoinHostPort("", port)
	}
}

// Prefork -.
func Prefork(prefork bool) Option {
	return func(s *Server) {
		s.prefork = prefork
	}
}

func ReadTimeout(timeout time.Duration) Option {
	return func(c *Server) {
		c.readTimeout = timeout
	}
}

func ShutdownTimeout(timeout time.Duration) Option {
	return func(c *Server) {
		c.shutdownTimeout = timeout
	}
}

func WriteTimeout(timeout time.Duration) Option {
	return func(c *Server) {
		c.writeTimeout = timeout
	}
}
