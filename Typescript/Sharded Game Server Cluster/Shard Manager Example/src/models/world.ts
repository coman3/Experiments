import { Vector } from "./vector";
import { Tile } from "./tile";
import { Player } from './player';

export class World {
    private worldSize: Vector;
    private worldTiles: Tile[][];
    private worldPlayers: Player[];
    get players(): Player[] { return this.worldPlayers; }

    get size(): Vector { return this.worldSize; }
    get tiles(): Tile[][] { return this.worldTiles; }
    get totalTiles(): number {
        let size = 0;
        const tileCounts = this.worldTiles.map(x => x.map(c => c.totalTiles));
        tileCounts.forEach(x => x.forEach(c => size += c));
        return size;
    }

    constructor(maxTileSplits: Vector) {
        this.worldSize = maxTileSplits;
        this.worldTiles = new Array<Tile[]>(maxTileSplits.x);
        this.worldPlayers = new Array<Player>();
        for (let x = 0; x < maxTileSplits.x; x++) {
            this.tiles[x] = new Array<Tile>(maxTileSplits.y);
        }
    }

    populate() {
        for (let x = 0; x < this.size.x; x++) {
            for (let y = 0; y < this.size.y; y++) {
                this.worldTiles[x][y] = new Tile(new Vector(x, y));
            }
        }
    }

    /**
     * Get a root tile from a floored index
     * @param position The floored index of the tile
     */

    getTile(position: Vector) {
        return this.findTileFromRelativePosition(position);
    }

    /**
     * Find the tile at a decimal based relative position within the world
     * 
     * @param position A decimal based position within the world index
     */
    private findTileFromRelativePosition(position: Vector) {
        if (
            position.x > this.worldSize.x ||
            position.y > this.worldSize.y ||
            position.x < 0 ||
            position.y < 0
        ) return null;// out of bounds

        const flooredPosition = position.Floor();
        const tile = this.tiles[flooredPosition.x][flooredPosition.y];
        return tile.findTileFromRelativeVector(position.Subtract(flooredPosition));
    }

    populateWithDummyPlayers(count: number) {
        for (let i = 0; i < count; i++) {
            const randomPosition = new Vector(Math.random() * this.worldSize.x, Math.random() * this.worldSize.y);
            this.worldPlayers.push(new Player(randomPosition));
        }
    }

    getClosestPlayer(relativePosition: Vector, maxDistance: number = 0.1): Player {
        if (this.players.length <= 0) return null;
        const sortedArray = this.players.sort((a, b) => {
            const distanceDelta = a.position.DistanceTo(relativePosition) - b.position.DistanceTo(relativePosition);
            if (distanceDelta > 0) return 1;
            if (distanceDelta < 0) return -1;
            return 0;
        });
        return sortedArray.find(item => item.position.DistanceTo(relativePosition) <= maxDistance);
    }

    fitPlayers() {
        this.worldPlayers.forEach(player => {
            const tile = this.getTile(player.position);
            player.connectedTiles = new Array<Tile>(tile);
        });
    }

}