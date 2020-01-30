#!/bin/sh
set -e

demPath=$1
outDir=$2
tmpDir=$3/contours

mkdir -p $tmpDir
rm -rf $tmpDir/*

toolsDir="/tools"
gdal_contour -a elev $demPath $tmpDir/contours_50.json -i 50.0
gdal_contour -a elev $demPath $tmpDir/contours_10.json -i 10.0
gdal_contour -a elev $demPath $tmpDir/contours_05.json -i 5.0

# convert FeatureGroup to array of features
ndjson-cat $tmpDir/contours_50.json | ndjson-map 'd.features' > $outDir/contours_50.geojson
ndjson-cat $tmpDir/contours_10.json | ndjson-map 'd.features' > $outDir/contours_10.geojson
ndjson-cat $tmpDir/contours_05.json | ndjson-map 'd.features' > $outDir/contours_05.geojson