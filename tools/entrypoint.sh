#!/bin/sh

toolsDir=$PWD/tools/
mapsDir=$PWD/maps
mapDataDir=$PWD/map-data
tmpDir=$PWD/tmp

echo "Tools directory: $toolsDir"
echo "Maps directory: $mapsDir"
echo "Tmp directory: $tmpDir"

# create tmp dir
mkdir -p $tmpDir
rm -rf $tmpDir/*

# create map-data dir
mkdir -p $mapDataDir
rm -rf $mapDataDir/*

for mapPath in $mapsDir/*/ ; do
    worldName=$(basename $mapPath)

    cp -r $mapPath $tmpDir/$worldName

    echo "➡️  Starting map $worldName --------------------------------------------------------------------------"
    echo "::debug ::Starting map $worldName"

    $toolsDir/process-map.sh $worldName $tmpDir/$worldName $mapDataDir $toolsDir $tmpDir

    echo "✔️  Finished map $worldName --------------------------------------------------------------------------"
    echo "::debug ::Starting map $worldName"
done

#cleanup
echo "➡️  Cleaning up"
rm -rf $tmpDir