import { Vector } from "./vector";

const slitSize = 2;

export class Tile {
    position: Vector;
    tiles: Tile[][];
    isSplit: boolean;
    parent?: Tile;
    _color: string;
    independent: boolean;

    get size(): number {
        return 1 * Math.pow(1 / slitSize, this.getTileDepth(this, 0));
    }
    get childSize(): number {
        return 1 * Math.pow(1 / slitSize, this.getTileDepth(this, 0) + 1);
    }
    get depth(): number { return this.getTileDepth(this, 0); }

    get totalTiles(): number {
        let size = 0;
        if (!this.isSplit)
            return 1;
        const tileCounts = this.tiles.map(x => x.map(c => c.totalTiles));
        tileCounts.forEach(c => c.forEach(x => size += x));
        return size + 1;
    }

    get x(): number { return this.position.x };
    get y(): number { return this.position.y };

    constructor(pos: Vector, parent?: Tile) {
        this.position = pos;
        this.parent = parent;
        this.isSplit = false;
        this._color = undefined;
        this.independent = false;
    }

    getRootTile(tile?: Tile): Tile {
        if (!tile) return this.getRootTile(this);

        if (tile.parent)
            return this.getRootTile(tile);
        return tile;
    }

    getTileDepth(tile?: Tile, depth?: number): number {
        if (!tile && !depth) return this.getTileDepth(this, 0);

        if (tile.parent)
            return this.getTileDepth(tile.parent, depth + 1);
        return depth;
    }

    getRelativeOffsetToParent(rootTileWidth: Vector) {
        return rootTileWidth.Multiply(this.size).Multiply(this.position);
    }

    getGlobalOffsetToTile(rootTileWidth: Vector, tile?: Tile): Vector {
        if (!tile) return this.getGlobalOffsetToTile(rootTileWidth, this);
        if (tile.parent)
            return this.getGlobalOffsetToTile(rootTileWidth, tile.parent).Add(tile.getRelativeOffsetToParent(rootTileWidth));
        return tile.getRelativeOffsetToParent(rootTileWidth);
    }

    splitTile() {
        this.tiles = new Array<Tile[]>();
        for (let xTile = 0; xTile < slitSize; xTile++) {
            this.tiles[xTile] = new Array<Tile>();
            for (let yTile = 0; yTile < slitSize; yTile++) {
                const point = new Vector(xTile, yTile);
                const childTile = new Tile(point, this)
                this.tiles[xTile][yTile] = childTile;
            }
        }
        this.isSplit = true;
    }

    findTileFromRelativeVector(point: Vector, tile?: Tile): Tile {
        if (!tile)
            return this.findTileFromRelativeVector(point, this);
        if (!tile.isSplit)
            return tile;
        const flooredPosition = point.DivideBy(tile.childSize).Floor();
        if (flooredPosition.x > tile.tiles.length || flooredPosition.y > tile.tiles[0].length)
            return tile;

        const foundTile = tile.tiles[flooredPosition.x][flooredPosition.y];
        if (!foundTile)
            return tile;

        const relativePosition = point.Subtract(flooredPosition.Multiply(tile.childSize));
        return this.findTileFromRelativeVector(relativePosition, foundTile);
    }

    toJSON(): any {

        return {
            position: this.position,
            isSplit: this.isSplit,
            depth: this.depth,
            size: this.size,
            parentTile: this.parent
        }
    }
}