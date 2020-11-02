#!/bin/sh
set -e

toolsDir=$(dirname $0)
mapsDir=$1
outDir=$2

tmpDir="/tmp/build-shit"
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
    echo "\360\237\227\272\357\270\217  $worldName"
    echo "--------------------------------------------------"

    echo "$ARROW Creating output directory ($worldName)\n"
    mkdir -p $mapOutDir

    echo "$ARROW Copying meta.json ($worldName)\n"
    cp $mapPath/meta.json $mapOutDir/meta.json

    echo "$ARROW Building preview images ($worldName)\n"
    $mehUtils preview -in $mapPath -out $mapOutDir


    echo "$ARROW Building satellite tiles ($worldName)\n"
    mkdir -p $mapOutDir/sat
    $mehUtils sat -in $mapPath -out $mapOutDir/sat
    echo ""

    echo "$ARROW Building Mapbox Terrain-RGB tiles ($worldName)\n"
    mkdir -p $mapOutDir/terrainrgb
    $mehUtils terrainrgb -in $mapPath -out $mapOutDir/terrainrgb
    echo ""

    echo "▶️ Building mapbox vector tiles ($worldName)\n"
    mkdir -p $mapOutDir/mvt
    $mehUtils mvt -in $mapPath -out $mapOutDir/mvt -layer_settings $toolsDir/layer_settings.json
    echo ""
done

