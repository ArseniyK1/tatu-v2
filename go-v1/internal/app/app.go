package app

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"tatu/config"
	"tatu/internal/controller/http"
	"tatu/internal/repo/persistent"
	"tatu/internal/repo/webapi"
	"tatu/internal/usecase/translation"
	"tatu/pkg/httpserver"
	"tatu/pkg/logger"
	"tatu/pkg/postgres"
)

func Run(cfg *config.Config) {
	log := logger.New(cfg.Log.Level)

	pg, err := postgres.New(cfg.DB.URL, postgres.MaxPoolSize(cfg.DB.PoolMax))
	if err != nil {
		log.Fatal(fmt.Errorf("app - Run - postgres.New: %w", err))
	} else {
		log.Info("DB connected")
	}
	defer pg.Close()

	// Use-case
	translationUseCase := translation.New(
		persistent.New(pg),
		webapi.New(),
	)

	httpServer := httpserver.New(httpserver.Port(cfg.Http.Port), httpserver.Prefork(cfg.Http.UsePreforkMode))
	http.NewRouter(httpServer.App, cfg, translationUseCase, log)

	httpServer.Start()

	// Waiting signal
	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt, syscall.SIGTERM)

	select {
	case s := <-interrupt:
		log.Info("app - Run - signal: %s", s.String())
	case err = <-httpServer.Notify():
		log.Error(fmt.Errorf("app - Run - httpServer.Notify: %w", err))

	}

	// Shutdown
	err = httpServer.Shutdown()
	if err != nil {
		log.Error(fmt.Errorf("app - Run - httpServer.Shutdown: %w", err))
	}
}
