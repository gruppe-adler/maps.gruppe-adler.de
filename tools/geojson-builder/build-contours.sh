#!/bin/sh
set -e

demPath=$1
outDir=$2
tmpDir=$3/contours

mkdir -p $tmpDir
rm -rf $tmpDir/*

toolsDir="/tools"
gdal_contour -a elevation -i 100.0 $demPath $tmpDir/contours_100.json
gdal_contour -a elevation -i 50.0 $demPath $tmpDir/contours_50.json
gdal_contour -a elevation -i 10.0 $demPath $tmpDir/contours_10.json
gdal_contour -a elevation -i 5.0 $demPath $tmpDir/contours_05.json
gdal_contour -a elevation -i 1.0 $demPath $tmpDir/contours_01.json
gdal_contour -p -fl 0 $demPath $tmpDir/water.json

# convert FeatureGroup to array of features
ndjson-cat $tmpDir/contours_100.json | ndjson-map 'd.features' > $outDir/contours_100.geojson
ndjson-cat $tmpDir/contours_50.json | ndjson-map 'd.features' > $outDir/contours_50.geojson
ndjson-cat $tmpDir/contours_10.json | ndjson-map 'd.features' > $outDir/contours_10.geojson
ndjson-cat $tmpDir/contours_05.json | ndjson-map 'd.features' > $outDir/contours_05.geojson
ndjson-cat $tmpDir/contours_01.json | ndjson-map 'd.features' > $outDir/contours_01.geojson
ndjson-cat $tmpDir/water.json | ndjson-map 'd.features' > $outDir/water.geojson