#!/bin/sh
set -e

# This directory contains a directory for each map.
# Those map directories will look like this:
#
# stratis
# │
# ├── [...]
# ├── 2                 # This the LOD
# │   ├── [...]
# │   └── 0             # This a the column
# │       ├── [...]
# │       └── 1.png     # This is the row
# └── sat.json
satDir=$1

# Maps directory
destinationMapsDir=$2

for mapDir in $satDir*/ ; do
    worldName=$(basename $mapDir)

    mapSatDir=$destinationMapsDir/$worldName/sat

    cp -r $mapDir $mapSatDir
done