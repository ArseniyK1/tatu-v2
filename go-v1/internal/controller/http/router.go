package http

import (
	"net/http"
	"tatu/config"
	"tatu/internal/controller/http/middleware"
	v1 "tatu/internal/controller/http/v1"
	"tatu/internal/usecase"
	"tatu/pkg/logger"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/swagger"
)

// Swagger spec:
// @title       Go Clean Template API
// @description Using a translation service as an example
// @version     1.0
// @host        localhost:8080
// @BasePath    /v1
func NewRouter(app *fiber.App, cfg *config.Config, t usecase.Translation, l logger.Interface) {
	// Options
	app.Use(middleware.Logger(l))
	app.Use(middleware.Recovery(l))

	// Prometheus metrics
	// if cfg.Metrics.Enabled {
	// 	prometheus := fiberprometheus.New("my-service-name")
	// 	prometheus.RegisterAt(app, "/metrics")
	// 	app.Use(prometheus.Middleware)
	// }

	// Swagger
	if cfg.Swagger.Enabled {
		app.Get("/swagger/*", swagger.HandlerDefault)
	}

	// K8s probe
	app.Get("/healthz", func(ctx *fiber.Ctx) error { return ctx.SendStatus(http.StatusOK) })

	// Routers
	apiV1Group := app.Group("/v1")
	{
		v1.NewTranslationRoutes(apiV1Group, t, l)
	}
}
