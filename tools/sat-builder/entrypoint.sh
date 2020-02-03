#!/bin/sh
set -e

mapsDir=$1
outDir=$2
# tmpDir=$2

# create tmp dir
tmpDir=/tmp
mkdir -p $tmpDir
rm -rf $tmpDir/*

# create out dir
mkdir -p $outDir

# $1: sat dir
# $2: out name
combine_sat_image () {
    local combineTmpDir=$(dirname $2)/combine_tmp
    mkdir -p $combineTmpDir

    # combine tiles to rows
    for row in 0 1 2 3; do
        convert \
            $1/0/$row.png \
            $1/1/$row.png +append \
            $1/2/$row.png +append \
            $1/3/$row.png +append \
            $combineTmpDir/row$row.png
    done

    # combine rows
    convert \
        $combineTmpDir/row0.png \
        $combineTmpDir/row1.png -append \
        $combineTmpDir/row2.png -append \
        $combineTmpDir/row3.png -append \
        -bordercolor none -border 50 \
        -trim \
        $2
    
    rm -rf $combineTmpDir
}

# $1: sat image
calc_max_lod() {

    # get width of image
    size=$(identify -format "%w" $1)

    # ceil(size/256)
    local tilesPerRow=$((($size + 255) / 256))

    local lod=0
    local curTiles=1
    while [ $curTiles -lt $tilesPerRow ]; do
        curTiles=$(($curTiles * 2))
        lod=$(($lod + 1))
    done
    echo $lod
}

# $1 src
# $2 dst
safe_mv() {
    mkdir -p $(dirname $2)
    mv $1 $2
}

# $1: lod
# $2: sat image
# $3: output directory
build_tile_set() {
    local lod=$1
    local satImg=$2
    local tileSetOutDir=$3/$lod

    # make out dir
    mkdir -p $tileSetOutDir
    rm -rf $tileSetOutDir/*

    local tilesPerRow=1

    if [ $lod -eq 0 ]; then
        convert $satImg -resize 256x256 $tileSetOutDir/tile_00000.png
    else
        # calc tiles per row
        for i in $(seq 1 $lod)
        do
            tilesPerRow=$(($tilesPerRow * 2))
        done

        # crop tiles
        convert \
            $satImg \
            -crop ${tilesPerRow}x$tilesPerRow@ \
            +repage \
            -resize 256x256 \
            +repage \
            $tileSetOutDir/tile_%05d.png
    fi

    local row=0
    local col=0

    for file in `ls $tileSetOutDir/*.png | sort -V`; do
        
        safe_mv $file $tileSetOutDir/$col/$row.png

        col=$(($col+1))

        if [ $col -eq $tilesPerRow ]; then
            col=0
            row=$(($row+1))
        fi
    done
}

for mapPath in $mapsDir/*/ ; do
    worldName=$(basename $mapPath)

    mapTempDir=$tmpDir/$worldName
    mkdir -p $mapTempDir

    mapOutDir=$outDir/$worldName
    mkdir -p $mapOutDir

    mapSatDir=$mapPath/sat

    cp -r $mapPath $tmpDir/$worldName
    satDir=$mapPath/sat

    echo "--------------------------------------------------"
    echo "🗺️   $worldName"
    echo "--------------------------------------------------"

    mergedImg=$mapTempDir/merged.png

    echo "▶️   Combining satellite image ($worldName)"
    combine_sat_image $mapSatDir $mergedImg

    maxLod=$(calc_max_lod $mergedImg)
    echo "🧮   Calculated max lod: $maxLod ($worldName)"

    for lod in $(seq 0 $maxLod); do
        echo "▶️   Building tiles for LOD $lod ($worldName)"
        build_tile_set $lod $mergedImg $mapOutDir
    done

    echo "▶️   Creating sat.json ($worldName)"
    echo "{ \"maxLod\": $maxLod }" >> $mapOutDir/sat.json
done
