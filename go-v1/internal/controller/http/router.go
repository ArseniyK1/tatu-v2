package http

import (
	"net/http"
	"tatu/config"
	"tatu/internal/controller/http/middleware"
	v1 "tatu/internal/controller/http/v1"
	"tatu/internal/graphql"
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

	// GraphQL настройка с использованием библиотек
	// Создаем GraphQL хендлер с использованием graphql-go библиотеки
	graphqlHandler, err := graphql.NewGraphQLHandlerV2(t)
	if err != nil {
		l.Fatal("Failed to create GraphQL handler: %v", err)
	}

	// GraphQL endpoint - здесь будут обрабатываться все GraphQL запросы
	// POST /graphql - основной endpoint для GraphQL запросов
	app.Post("/graphql", graphqlHandler.GraphQLHandler())

	// GraphQL Playground - веб-интерфейс для тестирования GraphQL
	// GET /playground - откроет интерактивную среду для тестирования
	app.Get("/playground", graphqlHandler.PlaygroundHandler())

	// Старый REST endpoint (оставляем для совместимости)
	app.Get("/pg-history", func(ctx *fiber.Ctx) error {
		val, err := t.History(ctx.Context())

		if err != nil {
			return ctx.Status(500).JSON(fiber.Map{"error": err.Error()})
		}

		return ctx.JSON(val)
	})

	// REST API v1 роуты (оставляем для совместимости)
	apiV1Group := app.Group("/v1")
	{
		v1.NewTranslationRoutes(apiV1Group, t, l)
	}
}
