#!/bin/sh
set -e

tippecanoePath=$1
inDir=$2/
outDir=$3

for mapDir in $inDir*/ ; do
    worldName=$(basename $mapDir)
    files=$(find $mapDir/* -type f -name "*.geojson" -o -name "*.geojson.gz*")

    echo "➡️  Starting conversion from geojson to mapbox vector tiles for map $worldName"
    echo "Found the following geojsons: \n$files"

    mkdir -p $outDir/$worldName

    $tippecanoePath \
        --no-feature-limit \
        --no-tile-size-limit \
        --no-line-simplification \
        --read-parallel \
        --maximum-zoom=g \
        --minimum-zoom=0 \
        --output-to-directory $outDir/$worldName/mvt \
        $files

    echo "✔️  Finished conversion from geojson to mapbox vector tiles for map $worldName"
done