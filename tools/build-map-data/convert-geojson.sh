#!/bin/sh

inDir=$1
outDir=$2
toolsDir=$3
tmpDir=$4/process-geojson

mkdir -p $tmpDir
rm -rf $tmpDir/*

worldSize=$(ndjson-cat $inDir/meta.json | ndjson-map 'd.worldSize')

if [ -e $inDir/meta.json ]
then
    echo "meta.json found"
else
    echo "ERROR: Failed to find a valid meta.json in /in"
    exit 1 # terminate and indicate error
fi

for filePath in $inDir/geojson/*.json; do
    fileName=$(basename $filePath)
    layer=${fileName%.*}

    # find tippecanoe settings for current layer
    settingsCmd="ndjson-cat $toolsDir/layer_settings.json | ndjson-split 'd' | ndjson-filter 'd.layer === \"$layer\"'"
    settingsJson=$(eval $settingsCmd)

    if [ -z "$var" ]
    then
        tippecanoeSettings=""
    else
        tippecanoeSettings="d.tippecanoe = $settingsJSON,"
    fi

    cmd="ndjson-cat $filePath | ndjson-split 'd' | ndjson-map -r toLonLat=$toolsDir/armaToLonLat '$tippecanoeSettings d.properties = {}, d.geometry = toLonLat($worldSize, d.geometry) , d'"
    eval $cmd | ndjson-reduce > $outDir/$layer.geojson
    echo "✔️  Finished layer $layer"
done
