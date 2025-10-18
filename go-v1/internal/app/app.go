package app

import (
	"fmt"
	"tatu/config"
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

	log.Info("App started")
}
