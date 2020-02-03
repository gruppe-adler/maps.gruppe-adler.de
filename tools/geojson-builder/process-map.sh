#!/bin/sh
set -e

worldName=$1
mapDirectory=$2
outDir=$3
toolsDir=$4
tmpDir=$5

mapOutDir=$outDir/$worldName
mkdir -p $mapOutDir
rm -rf $mapOutDir/*


echo "▶️   Building contour lines geojson from DEM ($worldName)"
gzip -d $mapDirectory/dem.asc.gz
$toolsDir/build-contours.sh $mapDirectory/dem.asc $mapDirectory/geojson $tmpDir

echo "▶️   Unzipping geojsons ($worldName)"
for filePath in $mapDirectory/geojson/*.geojson.gz; do
    echo "Unzipping $(basename $filePath)"
    gzip -d $filePath    
done

echo "▶️   Converting geojson to correct coordinates ($worldName)"
$toolsDir/convert-geojson.sh $mapDirectory $mapOutDir $toolsDir $tmpDir
