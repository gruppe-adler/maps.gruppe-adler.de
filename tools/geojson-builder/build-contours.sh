#!/bin/sh
set -e

inDir=$1
outDir=$2
tmpDir=$3/contours

mkdir -p $tmpDir
rm -rf $tmpDir/*


if [ ! -e $inDir/meta.json ]; then
    echo "⚠️   ERROR: Failed to find a valid meta.json in /in"
    exit 1 # terminate and indicate error
fi

elevOffset=$(ndjson-cat $inDir/meta.json | ndjson-map 'd.elevationOffset')

demPath=$inDir/dem.asc

toolsDir="/tools"
gdal_contour -off $elevOffset -a elevation -i 100.0 $demPath $tmpDir/contours_100.json
gdal_contour -off $elevOffset -a elevation -i 50.0 $demPath $tmpDir/contours_50.json
gdal_contour -off $elevOffset -a elevation -i 10.0 $demPath $tmpDir/contours_10.json
gdal_contour -off $elevOffset -a elevation -i 5.0 $demPath $tmpDir/contours_05.json
gdal_contour -off $elevOffset -a elevation -i 1.0 $demPath $tmpDir/contours_01.json
gdal_contour -off $elevOffset -p -fl 0 $demPath $tmpDir/water.json

# convert FeatureGroup to array of features
ndjson-cat $tmpDir/contours_100.json | ndjson-map 'd.features' > $outDir/contours_100.geojson
ndjson-cat $tmpDir/contours_50.json | ndjson-map 'd.features' > $outDir/contours_50.geojson
ndjson-cat $tmpDir/contours_10.json | ndjson-map 'd.features' > $outDir/contours_10.geojson
ndjson-cat $tmpDir/contours_05.json | ndjson-map 'd.features' > $outDir/contours_05.geojson
ndjson-cat $tmpDir/contours_01.json | ndjson-map 'd.features' > $outDir/contours_01.geojson
ndjson-cat $tmpDir/water.json | ndjson-map 'd.features' > $outDir/water.geojson