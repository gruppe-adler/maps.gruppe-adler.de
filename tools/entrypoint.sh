#!/bin/sh

toolsDir=$PWD/tools/
mapsDir=$PWD/maps/
mapDataDir=$PWD/map-data/
tmpDir=$PWD/tmp/

echo "Tools directory: $toolsDir"
echo "Maps directory: $mapsDir"
echo "Tmp directory: $tmpDir"

# create tmp dir
mkdir -p $tmpDir
rm -rf $tmpDir/*

# create map-data dir
mkdir -p $mapDataDir
rm -rf $mapDataDir/*

# build docker images
echo "➡️  Building convert-geojson docker image"
docker build -t convert-geojson $toolsDir/convert-geojson

echo "➡️  Building build-contours docker image"
docker build -t build-contours $toolsDir/build-contours

for mapPath in $mapsDir*/ ; do
    worldName=$(basename $mapPath)

    cp -r $mapPath $tmpDir$worldName

    echo "mappath shizzle $mappath"
    ls $mapPath
    echo "mappath shizzle $tmpDir$worldName"
    ls $tmpDir$worldName

    echo "➡️  Starting map $worldName --------------------------------------------------------------------------"
    echo "::debug ::Starting map $worldName"

    $toolsDir/process-map.sh $worldName $tmpDir$worldName $mapDataDir

    echo "✔️  Finished map $worldName --------------------------------------------------------------------------"
    echo "::debug ::Starting map $worldName"
done

#cleanup
echo "➡️  Cleaning up"
rm -rf $tmpDir
docker rmi convert-geojson