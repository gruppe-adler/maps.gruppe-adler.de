#!/bin/sh
set -e

toolsDir=$(dirname $0)
mapsDir=$1

config=$toolsDir/config.json
layers=$toolsDir/layers.json
builder=$toolsDir/go-util


# Make sure config.json exists
if [ ! -f $config ]; then
    >&2 echo "❌ Couldn't find config.json"
    exit 1
fi

# Make sure layers.json exists
if [ ! -f $layers ]; then
    >&2 echo "❌ Couldn't find layers.json"
    exit 1
fi

$builder maps -maps $mapsDir 1> $mapsDir/maps.json
echo "✔️ Generated maps.json"

for layerPath in $mapsDir/*/*/ ; do
    layer=$(basename $layerPath)
    worldName=$(basename "$(dirname "$layerPath")")

    meta=$layerPath../meta.json
    tile="${layerPath}tile.json"

    # Make sure meta.json exists
    if [ ! -f $meta ]; then
        echo "⏩ Couldn't find meta.json. Skipping $worldName/$layer"
        continue
    fi

    # Make sure tile.json exists
    if [ ! -f $tile ]; then
        echo "⏩ Couldn't find tile.json. Skipping $worldName/$layer"
        continue
    fi

    if [ "$layer" = "mvt" ]; then
        $builder style -config $config -meta $meta -tile $tile -layers $layers 1> "${layerPath}style.json"
        echo "✔️ Generated style.json for $worldName/$layer"
    fi

    $builder tile -config $config -meta $meta -tile $tile -layerId $layer 1> ${tile}_tmp
    cat ${tile}_tmp > $tile
    rm ${tile}_tmp
    echo "✔️ Generated tile.json for $worldName/$layer"

done

