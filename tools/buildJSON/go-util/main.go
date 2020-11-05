package main

import (
	"flag"
	"fmt"
	"os"
	"strings"

	generate "./generate"
	models "./models"
	utils "./utils"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Printf("\nERROR: No subcommand was provided.\n\n")
		os.Exit(1)
	}

	cmd := strings.ToLower(os.Args[1])
	flagSet := flag.NewFlagSet(cmd, flag.ExitOnError)

	if cmd == "maps" {
		var mapsDir string
		flagSet.StringVar(&mapsDir, "maps", "", "Path to maps directories")
		flagSet.Parse(os.Args[2:])

		if mapsDir == "" {
			flagSet.PrintDefaults()
			os.Exit(1)
		}

		generate.MapsJSON(mapsDir)

		return
	}

	var configPath string
	var metaPath string
	var tilePath string
	var lastArg string

	if cmd == "style" {
		flagSet.StringVar(&lastArg, "layers", "", "Path to layers.json")
	} else if cmd == "tile" {
		flagSet.StringVar(&lastArg, "layerId", "mvt", "Layer-ID either 'mvt' or 'sat' or 'terrainrgb'")
	} else {
		utils.Check(fmt.Errorf("ERROR: Subcommand '%s' was not found", cmd), "")
	}

	flagSet.StringVar(&configPath, "config", "", "Path to config.json")
	flagSet.StringVar(&metaPath, "meta", "", "Path to meta.json")
	flagSet.StringVar(&tilePath, "tile", "", "Path to tile.json")
	flagSet.Parse(os.Args[2:])

	if configPath == "" || metaPath == "" || tilePath == "" {
		flagSet.PrintDefaults()
		os.Exit(1)
	}

	// read config.json
	var configJSON models.ConfigJSON
	err := utils.ReadJSON(configPath, &configJSON)
	utils.Check(err, "Error while reading config.json:")

	// read meta.json
	var metaJSON models.MetaJSON
	err = utils.ReadJSON(metaPath, &metaJSON)
	utils.Check(err, "Error while reading meta.json:")

	// read tile.json
	var tileJSON models.TileJSON
	err = utils.ReadJSON(tilePath, &tileJSON)
	utils.Check(err, "Error while reading tile.json:")

	if cmd == "tile" {
		// make sure lastArg (layer flag) is one of "mvt", "sat", "terrainrgb"
		if lastArg != "mvt" && lastArg != "sat" && lastArg != "terrainrgb" {
			flagSet.PrintDefaults()
			os.Exit(1)
		}

		generate.TileJSON(metaJSON, configJSON, tileJSON, lastArg)
	} else {
		if lastArg == "" {
			flagSet.PrintDefaults()
			os.Exit(1)
		}

		var layers []models.MapboxLayer
		err = utils.ReadJSON(lastArg, &layers)
		utils.Check(err, "Error while reading layers.json:")

		generate.StyleJSON(metaJSON, configJSON, tileJSON, layers)
	}
}
