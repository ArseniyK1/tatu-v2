package webapi

import (
	"fmt"
	"tatu/internal/entity"

	trans "github.com/bas24/googletranslatefree"
)

// TranslationWebAPI -.
type TranslationWebAPI struct{}

// New -.
func New() *TranslationWebAPI {
	return &TranslationWebAPI{}
}

// Translate -.
func (t *TranslationWebAPI) Translate(translation entity.Translation) (entity.Translation, error) {
	result, err := trans.Translate(translation.Original, translation.Source, translation.Destination)
	if err != nil {
		return entity.Translation{}, fmt.Errorf("TranslationWebAPI - Translate - googletranslatefree.Translate: %w", err)
	}

	translation.Translation = result

	return translation, nil
}
