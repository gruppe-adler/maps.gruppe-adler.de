#!/bin/sh

worldName=$1
mapDirectory=$2
dataDir=$3

outDir=$dataDir/$worldName
mkdir -p $outDir
rm -rf $outDir/*


echo "▶️   Building contour lines from DEM ($worldName)"
docker run -it --rm -v $mapDirectory/dem.asc:/tmp/dem.asc -v $mapDirectory/geojson:/tmp/out build-contours

echo "▶️   Building locations geojson from meta.json ($worldName)"

echo "▶️   Converting geojson to correct coordinates ($worldName)"
docker run -it --rm -v $mapDirectory:/in -v $outDir:/out convert-geojson

