package graphql

import (
	"tatu/internal/entity"
	"tatu/internal/usecase"

	"github.com/graphql-go/graphql"
)

type SchemaBuilder struct {
	translationService usecase.Translation
}

func NewSchemaBuilder(translationService usecase.Translation) *SchemaBuilder {
	return &SchemaBuilder{
		translationService: translationService,
	}
}

func (sb *SchemaBuilder) BuildSchema() (graphql.Schema, error) {
	translationType := graphql.NewObject(graphql.ObjectConfig{
		Name: "Translation",
		Fields: graphql.Fields{
			"source": &graphql.Field{
				Type:        graphql.String,
				Description: "Исходный язык перевода",
			},
			"destination": &graphql.Field{
				Type:        graphql.String,
				Description: "Целевой язык перевода",
			},
			"original": &graphql.Field{
				Type:        graphql.String,
				Description: "Оригинальный текст",
			},
			"translation": &graphql.Field{
				Type:        graphql.String,
				Description: "Переведенный текст",
			},
		},
	})

	translationHistoryType := graphql.NewObject(graphql.ObjectConfig{
		Name: "TranslationHistory",
		Fields: graphql.Fields{
			"history": &graphql.Field{
				Type:        graphql.NewList(translationType),
				Description: "Список всех переводов",
			},
		},
	})

	queryType := graphql.NewObject(graphql.ObjectConfig{
		Name: "Query",
		Fields: graphql.Fields{
			"translationHistory": &graphql.Field{
				Type:        translationHistoryType,
				Description: "Получить историю переводов",
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {

					ctx := p.Context

					history, err := sb.translationService.History(ctx)
					if err != nil {
						return nil, err
					}

					return history, nil
				},
			},
		},
	})

	mutationType := graphql.NewObject(graphql.ObjectConfig{
		Name: "Mutation",
		Fields: graphql.Fields{
			"translate": &graphql.Field{
				Type:        translationType,
				Description: "Создать новый перевод",
				Args: graphql.FieldConfigArgument{
					"source": &graphql.ArgumentConfig{
						Type:        graphql.NewNonNull(graphql.String),
						Description: "Исходный язык",
					},
					"destination": &graphql.ArgumentConfig{
						Type:        graphql.NewNonNull(graphql.String),
						Description: "Целевой язык",
					},
					"text": &graphql.ArgumentConfig{
						Type:        graphql.NewNonNull(graphql.String),
						Description: "Текст для перевода",
					},
				},
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {

					ctx := p.Context

					source, _ := p.Args["source"].(string)
					destination, _ := p.Args["destination"].(string)
					text, _ := p.Args["text"].(string)

					translation := entity.Translation{
						Source:      source,
						Destination: destination,
						Original:    text,
					}

					result, err := sb.translationService.Translate(ctx, translation)
					if err != nil {
						return nil, err
					}

					return result, nil
				},
			},
		},
	})

	schema, err := graphql.NewSchema(graphql.SchemaConfig{
		Query:    queryType,
		Mutation: mutationType,
	})

	if err != nil {
		return graphql.Schema{}, err
	}

	return schema, nil
}
