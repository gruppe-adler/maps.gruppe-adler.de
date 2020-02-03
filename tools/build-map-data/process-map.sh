#!/bin/sh
set -e

worldName=$1
mapDirectory=$2
dataDir=$3
toolsDir=$4
tmpDir=$5

outDir=$dataDir/$worldName
mkdir -p $outDir
rm -rf $outDir/*


echo "▶️   Building contour lines geojson from DEM ($worldName)"
gzip -d $mapDirectory/dem.asc.gz
$toolsDir/build-contours.sh $mapDirectory/dem.asc $mapDirectory/geojson $tmpDir

echo "▶️   Unzipping geojsons ($worldName)"
for filePath in $mapDirectory/geojson/*.geojson.gz; do
    echo "Unzipping $(basename $filePath)"
    gzip -d $filePath    
done


echo "▶️   Converting geojson to correct coordinates ($worldName)"
$toolsDir/convert-geojson.sh $mapDirectory $outDir $toolsDir $tmpDir
