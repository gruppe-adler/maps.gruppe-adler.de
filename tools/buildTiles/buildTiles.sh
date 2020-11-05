#!/bin/sh
set -e

toolsDir=$(dirname $0)
mapsDir=$1
outDir=$2

tmpDir="/tmp/build-tiles-tmp-data"
mehUtils=$toolsDir/meh-utils

# create tmp dir
mkdir -p $tmpDir
rm -rf $tmpDir/*

# create out dir
mkdir -p $outDir
rm -rf $outDir/*

ARROW="\342\217\251"

for mapPath in $mapsDir/*/ ; do
    worldName=$(basename $mapPath)
    mapOutDir=$outDir/$worldName

    echo "--------------------------------------------------"
    echo "🗺️ $worldName"
    echo "--------------------------------------------------"

    echo ""
    echo "📁 Creating output directory ($worldName)"
    mkdir -p $mapOutDir

    echo ""
    echo "📁 Copying meta.json ($worldName)"
    cp $mapPath/meta.json $mapOutDir/meta.json

    echo ""
    echo "📁 Building preview images ($worldName)"
    $mehUtils preview -in $mapPath -out $mapOutDir

    echo ""
    echo "📁 Building satellite tiles ($worldName)"
    mkdir -p $mapOutDir/sat
    $mehUtils sat -in $mapPath -out $mapOutDir/sat

    echo ""
    echo "📁 Building Mapbox Terrain-RGB tiles ($worldName)"
    mkdir -p $mapOutDir/terrainrgb
    $mehUtils terrainrgb -in $mapPath -out $mapOutDir/terrainrgb

    echo ""
    echo "📁 Building mapbox vector tiles ($worldName)"
    mkdir -p $mapOutDir/mvt
    $mehUtils mvt -in $mapPath -out $mapOutDir/mvt -layer_settings $toolsDir/layer_settings.json
    echo ""
done

