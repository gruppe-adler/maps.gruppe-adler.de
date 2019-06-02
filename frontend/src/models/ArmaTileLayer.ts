import { TileLayer, TileLayerOptions } from 'leaflet';

export default class ArmaTileLayer extends TileLayer {
    private mapSize: number;
    private urlTemplate: string;

    constructor(urlTemplate: string, size: number, options: TileLayerOptions) {
        super(urlTemplate,  options);

        this.mapSize = size;
        this.urlTemplate = urlTemplate;
    }

    /**
     * This method returns the url to fetch the tile.
     *
     * @param coords Coordinates to get Tile for
     */
    public getTileUrl({ x, y, z}: {x: number, y: number, z: number}) {
        /**
         * We are using CRS.Simple. This causes the origin to be in the bottom left corner, which actually is in our
         * favor, because Arma`s coordinate system starts in the bottom left corner as well.
         *
         * But now we have the following problem:
         * The tiles which cover our map area (CRS origin -> going up and right) all have a negative y (bottommost tile
         * has y=-1; the one above that has y=-2; etc.)
         * Our Tiles start in the top left corner of the map with 0-0 and so we have to correct the y coordinate of the
         * tile so that the top-left tile (still within the map area) has x=0 and y=0 and the bottom left tile has
         * y=<NUMBER OF TILES>-1 (because tiles start with 0)
         *
         * Here is a chart of the bottom left corner:
         *
         * THIS IS THE INITIAL SITUATION:    WE WANT TO ACHIEVE THIS (for 9x9 tiles):
         * |   ....   |   ....   |  ...      |   ....   |   ....   |  ...
         * |__________|__________|______     |__________|__________|______
         * |          |          |           |          |          |
         * |  0 / -2  |  1 / -2  |  ...      |  0 / 7   |  1 / 7   |  ...
         * |__________|__________|______     |__________|__________|______
         * |          |          |           |          |          |
         * |  0 / -1  |  1 / -1  |  ...      |  0 / 8   |  1 / 8   |  ...
         * |__________|__________|______     |__________|__________|______
         *
         */

        // tile size in meters
        // z = level of detail ( LOD8 -> TileSize=100m  | LOD7 -> TileSize=200m | LOD6 -> TileSize=400m ... )
        const tileSizeInM = 100 * Math.pow(2, 8 - z);

        // Number of tiles in a column
        const numTiles = Math.ceil(this.mapSize / tileSizeInM);

        const correctedY = numTiles + y;

        return this.urlTemplate
                        .replace('{x}', x.toString())
                        .replace('{y}', correctedY.toString())
                        .replace('{z}', z.toString());
    }
}
