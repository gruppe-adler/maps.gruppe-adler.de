package generate

import (
	"io/ioutil"
	"path"

	models "../models"
	utils "../utils"
)

// MapsJSON Generate a maps.json
func MapsJSON(mapsDir string) {
	metaJSONs := []models.MetaJSON{}

	// find all files/directories in mapsDir
	nodes, err := ioutil.ReadDir(mapsDir)
	utils.Check(err, "Error while reading maps directory.")

	for _, node := range nodes {
		if !node.IsDir() {
			continue
		}

		var meta models.MetaJSON
		err = utils.ReadJSON(path.Join(mapsDir, node.Name(), "meta.json"), &meta)
		if err != nil {
			continue
		}

		metaJSONs = append(metaJSONs, meta)
	}

	utils.PrintJSON(metaJSONs)
}
