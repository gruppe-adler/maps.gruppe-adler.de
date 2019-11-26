#!/bin/sh

tippecanoePath=$1
inDir=$2
outDir=$3

rm -rf ./$dir/tiles

for mapDir in $inDir/*/ ; do
    worldName=$(basename $mapDir)
    files=$(find $mapDir -type f -name "*.json")

    echo "➡️  Starting conversion from geojson to mapbox vector tiles for map $worldName"

    $tippecanoePath \
        --no-feature-limit \
        --no-tile-size-limit \
        --no-line-simplification \
        --read-parallel \
        --maximum-zoom=1 \
        --minimum-zoom=0 \
        --output-to-directory $outDir/$worldName \
        $files

    echo "✔️  Finished conversion from geojson to mapbox vector tiles for map $worldName"
done