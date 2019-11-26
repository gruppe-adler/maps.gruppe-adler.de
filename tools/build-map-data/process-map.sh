#!/bin/sh

worldName=$1
mapDirectory=$2
dataDir=$3
toolsDir=$4
tmpDir=$5

outDir=$dataDir/$worldName
mkdir -p $outDir
rm -rf $outDir/*


echo "▶️   Building contour lines geojson from DEM ($worldName)"
$toolsDir/build-contours.sh $mapDirectory/dem.asc $mapDirectory/geojson $tmpDir

echo "▶️   Building locations geojson from meta.json ($worldName)"
echo "This is not implemented yet"
# TODO

echo "▶️   Converting geojson to correct coordinates ($worldName)"
$toolsDir/convert-geojson.sh $mapDirectory $outDir $toolsDir $tmpDir
