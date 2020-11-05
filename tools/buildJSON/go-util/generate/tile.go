package generate

import (
	"fmt"

	models "../models"
	utils "../utils"
)

// TileJSON Generate a tile.json
func TileJSON(metaJSON models.MetaJSON, configJSON models.ConfigJSON, tileJSON models.TileJSON, layer string) {
	displayName := map[string]string{
		"sat":        "Satellite Tiles",
		"mvt":        "Mapbox Vector Tiles",
		"terrainrgb": "Mapbox Terrain-RGB Tiles",
	}[layer]

	extension := map[string]string{
		"sat":        "png",
		"mvt":        "pbf",
		"terrainrgb": "png",
	}[layer]

	tileJSON.TileJSON = "2.2.0"
	tileJSON.Name = fmt.Sprintf("%s %s", metaJSON.DisplayName, displayName)
	tileJSON.Description = fmt.Sprintf("%s of the Arma 3 Map '%s' from %s", displayName, metaJSON.DisplayName, metaJSON.Author)
	tileJSON.Attribution = configJSON.Attribution
	tileJSON.Scheme = "xyz"
	tileJSON.Tiles = []string{fmt.Sprintf("%s/%s/%s/{z}/{x}/{y}.%s", configJSON.URL, metaJSON.WorldName, layer, extension)}

	utils.PrintJSON(tileJSON)
}
