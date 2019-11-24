#!/bin/sh

toolsDir="/tools"
gdal_contour -a elev /tmp/dem.asc /tmp/contours_50.json -i 50.0
gdal_contour -a elev /tmp/dem.asc /tmp/contours_10.json -i 10.0
gdal_contour -a elev /tmp/dem.asc /tmp/contours_05.json -i 5.0

# convert FeatureGroup to array of features
ndjson-cat /tmp/contours_50.json | ndjson-map 'd.features' > /tmp/out/contours_50.json
ndjson-cat /tmp/contours_10.json | ndjson-map 'd.features' > /tmp/out/contours_10.json
ndjson-cat /tmp/contours_05.json | ndjson-map 'd.features' > /tmp/out/contours_05.json