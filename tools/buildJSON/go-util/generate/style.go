package generate

import (
	"fmt"

	models "../models"
	utils "../utils"
)

// StyleJSON Generate a style.json
func StyleJSON(metaJSON models.MetaJSON, configJSON models.ConfigJSON, tileJSON models.TileJSON, allLayers []models.MapboxLayer) {
	style := models.MapboxStyle{
		Version: 8,
		Name:    fmt.Sprintf("%s Vector Tiles", metaJSON.DisplayName),
		Sprite:  fmt.Sprintf("%s/sprites/sprite", configJSON.URL),
		Glyphs:  "https://orangemug.github.io/font-glyphs/glyphs/{fontstack}/{range}.pbf",
		Sources: map[string]models.MapboxSource{},
		Layers:  []models.MapboxLayer{},
	}

	sourceID := fmt.Sprintf("%s-%s", configJSON.SourcePrefix, metaJSON.WorldName)

	style.Sources[sourceID] = models.MapboxSource{
		Attribution: configJSON.Attribution,
		Type:        "vector",
		URL:         fmt.Sprintf("%s/%s/mvt/tile.json", configJSON.URL, metaJSON.WorldName),
	}

	vectorLayersMap := map[string]uint8{}
	for _, vecLayer := range tileJSON.VectorLayers {
		vectorLayersMap[vecLayer.ID] = 1
	}

	for _, layer := range allLayers {
		layer.Source = sourceID

		_, found := vectorLayersMap[layer.SourceLayer]

		if found || layer.Type == "background" {
			style.Layers = append(style.Layers, layer)
		}
	}

	utils.PrintJSON(style)
}
