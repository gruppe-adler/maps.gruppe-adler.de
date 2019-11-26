#!/bin/sh

toolsDir=$1
mapsDir=$2
mapDataDir=$3
tmpDir=$4

# create tmp dir
mkdir -p $tmpDir
rm -rf $tmpDir/*

# create map-data dir
mkdir -p $mapDataDir
rm -rf $mapDataDir/*

for mapPath in $mapsDir/*/ ; do
    worldName=$(basename $mapPath)

    cp -r $mapPath $tmpDir/$worldName

    $toolsDir/process-map.sh $worldName $tmpDir/$worldName $mapDataDir $toolsDir $tmpDir
done

#cleanup
echo "➡️  Cleaning up"
rm -rf $tmpDir