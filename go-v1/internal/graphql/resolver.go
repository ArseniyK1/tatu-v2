package graphql

import (
	"context"
	"tatu/internal/entity"
	"tatu/internal/usecase"
)

// Resolver содержит все зависимости для обработки GraphQL запросов
// Это структура, которая будет передаваться в каждый резолвер
type Resolver struct {
	// Сервис для работы с переводами (тот же, что используется в REST API)
	translationService usecase.Translation
}

// NewResolver создает новый экземпляр резолвера
// Это конструктор, который принимает все необходимые зависимости
func NewResolver(translationService usecase.Translation) *Resolver {
	return &Resolver{
		translationService: translationService,
	}
}

// TranslationHistory - резолвер для получения истории переводов
// Эта функция вызывается когда клиент делает запрос translationHistory
func (r *Resolver) TranslationHistory(ctx context.Context) (*entity.TranslationHistory, error) {
	// Вызываем метод History из нашего сервиса переводов
	// Это тот же метод, который мы использовали в REST API
	history, err := r.translationService.History(ctx)
	if err != nil {
		// Если произошла ошибка, возвращаем её
		// GraphQL автоматически отправит ошибку клиенту
		return nil, err
	}

	// Возвращаем указатель на историю переводов
	return &history, nil
}

// Translate - резолвер для создания нового перевода
// Эта функция вызывается когда клиент делает мутацию translate
func (r *Resolver) Translate(ctx context.Context, args struct {
	Source      string
	Destination string
	Text        string
}) (*entity.Translation, error) {
	// Создаем структуру перевода с входными данными
	translation := entity.Translation{
		Source:      args.Source,
		Destination: args.Destination,
		Original:    args.Text,
		// Translation будет заполнен сервисом
	}

	// Вызываем метод Translate из нашего сервиса
	// Предполагаем, что у нас есть такой метод в usecase.Translation
	result, err := r.translationService.Translate(ctx, translation)
	if err != nil {
		return nil, err
	}

	// Возвращаем указатель на результат
	return &result, nil
}
