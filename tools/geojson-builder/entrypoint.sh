#!/bin/sh
set -e

toolsDir=$1
mapsDir=$2
outDir=$3
tmpDir=$4

# create tmp dir
mkdir -p $tmpDir
rm -rf $tmpDir/*

# create out dir
mkdir -p $outDir
rm -rf $outDir/*

for mapPath in $mapsDir/*/ ; do
    worldName=$(basename $mapPath)

    cp -r $mapPath $tmpDir/$worldName

    $toolsDir/process-map.sh $worldName $tmpDir/$worldName $outDir $toolsDir $tmpDir
done

#cleanup
echo "▶️  Cleaning up"
rm -rf $tmpDir