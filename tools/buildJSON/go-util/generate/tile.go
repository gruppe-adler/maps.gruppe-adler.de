package generate

import (
	"fmt"

	models "../models"
	utils "../utils"
)

// TileJSON Generate a tile.json
func TileJSON(metaJSON models.MetaJSON, configJSON models.ConfigJSON, tileJSON models.TileJSON, layer string) {

	extension := map[string]string{
		"sat":        "png",
		"mvt":        "pbf",
		"terrainrgb": "png",
	}[layer]

	tileJSON.Attribution = configJSON.Attribution

	tileJSON.Tiles = make([]string, len(configJSON.URIs))
	for i, uri := range configJSON.URIs {
		tileJSON.Tiles[i] = fmt.Sprintf("%s/%s/%s/{z}/{x}/{y}.%s", uri, metaJSON.WorldName, layer, extension)
	}

	utils.PrintJSON(tileJSON)
}
