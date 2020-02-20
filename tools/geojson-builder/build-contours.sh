#!/bin/sh
set -e

demPath=$1
outDir=$2
tmpDir=$3/contours

mkdir -p $tmpDir
rm -rf $tmpDir/*

toolsDir="/tools"
gdal_contour -a elevation $demPath $tmpDir/contours_100.json -i 100.0
gdal_contour -a elevation $demPath $tmpDir/contours_50.json -i 50.0
gdal_contour -a elevation $demPath $tmpDir/contours_10.json -i 10.0
gdal_contour -a elevation $demPath $tmpDir/contours_05.json -i 5.0
gdal_contour -a elevation $demPath $tmpDir/contours_01.json -i 1.0
gdal_contour -a elevation $demPath $tmpDir/water.json -fl 0

# convert FeatureGroup to array of features
ndjson-cat $tmpDir/contours_100.json | ndjson-map 'd.features' > $outDir/contours_100.geojson
ndjson-cat $tmpDir/contours_50.json | ndjson-map 'd.features' > $outDir/contours_50.geojson
ndjson-cat $tmpDir/contours_10.json | ndjson-map 'd.features' > $outDir/contours_10.geojson
ndjson-cat $tmpDir/contours_05.json | ndjson-map 'd.features' > $outDir/contours_05.geojson
ndjson-cat $tmpDir/contours_01.json | ndjson-map 'd.features' > $outDir/contours_01.geojson
ndjson-cat $tmpDir/water.json | ndjson-map 'd.features' > $outDir/water.geojson