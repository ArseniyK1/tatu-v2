package graphql

import (
	"encoding/json"
	"net/http"
	"tatu/internal/usecase"

	"github.com/gofiber/fiber/v2"
	"github.com/graphql-go/graphql"
	"github.com/graphql-go/handler"
)

type GraphQLHandlerV2 struct {
	schema      graphql.Schema
	httpHandler *handler.Handler
}

func NewGraphQLHandlerV2(translationService usecase.Translation) (*GraphQLHandlerV2, error) {
	schemaBuilder := NewSchemaBuilder(translationService)

	schema, err := schemaBuilder.BuildSchema()
	if err != nil {
		return nil, err
	}

	httpHandler := handler.New(&handler.Config{
		Schema:   &schema,
		Pretty:   true,
		GraphiQL: true,
	})

	return &GraphQLHandlerV2{
		schema:      schema,
		httpHandler: httpHandler,
	}, nil
}

// метод интегрирует graphql-go с fiber
func (h *GraphQLHandlerV2) GraphQLHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Поддерживаем как GET, так и POST запросы
		if c.Method() == "GET" {
			// Для GET запросов возвращаем информацию о схеме
			return c.JSON(fiber.Map{
				"message": "GraphQL endpoint. Use POST for queries or visit /playground for interactive interface",
				"endpoints": fiber.Map{
					"graphql":    "/graphql",
					"playground": "/playground",
				},
			})
		}

		if c.Method() != "POST" {
			return c.Status(405).JSON(fiber.Map{
				"error": "Method not allowed",
			})
		}

		body := c.Body()
		if len(body) == 0 {
			return c.Status(400).JSON(fiber.Map{
				"error": "Request body is empty",
			})
		}

		var req struct {
			Query     string                 `json:"query"`
			Variables map[string]interface{} `json:"variables"`
		}

		if err := json.Unmarshal(body, &req); err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid JSON",
			})
		}

		// Проверяем, что запрос не пустой
		if req.Query == "" {
			return c.Status(400).JSON(fiber.Map{
				"error": "Must provide an operation",
			})
		}

		// Выполняем GraphQL запрос
		result := graphql.Do(graphql.Params{
			Schema:         h.schema,
			RequestString:  req.Query,
			VariableValues: req.Variables,
			Context:        c.Context(),
		})

		if len(result.Errors) > 0 {
			return c.Status(400).JSON(fiber.Map{
				"errors": result.Errors,
			})
		}

		return c.JSON(result)
	}
}

func (h *GraphQLHandlerV2) PlaygroundHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Устанавливаем правильные заголовки для GraphiQL
		c.Set("Content-Type", "text/html; charset=utf-8")

		// Создаем простой HTML для GraphiQL
		html := `
<!DOCTYPE html>
<html>
<head>
    <title>GraphQL Playground</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/graphql-playground-react/build/static/css/index.css" />
    <link rel="shortcut icon" href="https://cdn.jsdelivr.net/npm/graphql-playground-react/build/favicon.png" />
    <script src="https://cdn.jsdelivr.net/npm/graphql-playground-react/build/static/js/middleware.js"></script>
</head>
<body>
    <div id="root">
        <style>
            body {
                margin: 0;
                font-family: Open Sans, sans-serif;
                overflow: hidden;
            }
            #root {
                width: 100vw;
                height: 100vh;
            }
        </style>
        <div style="display: flex; align-items: center; justify-content: center; height: 100vh; flex-direction: column;">
            <h1>GraphQL Playground</h1>
            <p>GraphQL endpoint: <code>/graphql</code></p>
            <p>Try this query:</p>
            <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px;">
{
  translationHistory {
    history {
      source
      destination
      original
      translation
    }
  }
}</pre>
        </div>
    </div>
    <script>
        window.addEventListener('load', function (event) {
            const root = document.getElementById('root');
            root.innerHTML = '';
            
            GraphQLPlayground.init(root, {
                endpoint: '/graphql',
                settings: {
                    'request.credentials': 'include',
                },
                tabs: [
                    {
                        endpoint: '/graphql',
                        query: 'query { translationHistory { history { source destination original translation } } }',
                    },
                ],
            });
        });
    </script>
</body>
</html>`

		return c.SendString(html)
	}
}

type fiberResponseWriter struct {
	ctx *fiber.Ctx
}

func (w *fiberResponseWriter) Header() http.Header {

	headers := make(http.Header)
	w.ctx.Request().Header.VisitAll(func(key, value []byte) {
		headers.Set(string(key), string(value))
	})
	return headers
}

func (w *fiberResponseWriter) Write(data []byte) (int, error) {

	return w.ctx.Write(data)
}

func (w *fiberResponseWriter) WriteHeader(statusCode int) {

	w.ctx.Status(statusCode)
}
