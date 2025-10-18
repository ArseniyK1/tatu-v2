package config

import (
	"fmt"

	"github.com/caarlos0/env/v11"
	"github.com/joho/godotenv"
)

type (
	Config struct {
		App     App
		DB      DB
		Minio   Minio
		Tg      Tg
		Swagger Swagger
		Log     Log
	}

	App struct {
		Port string `env:"APP_PORT"`
	}

	DB struct {
		URL     string `env:"DB_URL"`
		PoolMax int    `env:"DB_POOL_MAX"`
	}

	Minio struct {
		Port      string `env:"MINIO_PORT"`
		UseSsl    bool   `env:"MINIO_USE_SSL"`
		AccessKey string `env:"MINIO_ACCESS_KEY"`
		SecretKey string `env:"MINIO_SECRET_KEY"`
		Endpoint  string `env:"MINIO_ENDPOINT"`
		PublicUrl string `env:"MINIO_PUBLIC_URL"`
	}

	Tg struct {
		BotToken string `env:"TATU_BOT_TOKEN"`
	}

	Swagger struct {
		Enabled bool `env:"SWAGGER_ENABLED" envDefault:"false"`
	}

	Log struct {
		Level string `env:"LOG_LEVEL,required"`
	}
)

func NewConfig() (*Config, error) {
	// Загружаем переменные из .env файла
	err := godotenv.Load()
	if err != nil {
		// Игнорируем ошибку, если файл .env не найден
		// Это позволяет использовать переменные окружения системы
	}

	newCfg := &Config{}

	err = env.Parse(newCfg)

	if err != nil {
		return nil, fmt.Errorf("config error: %w", err)
	}

	return newCfg, nil
}
