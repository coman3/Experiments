import { Vector } from './vector';
import { Tile } from './tile';

export class Player {
    position: Vector;
    velocity: Vector;
    connectedTiles: Tile[];

    constructor(startPosition: Vector) {
        this.position = startPosition;
        this.velocity = new Vector(0, 0);
        this.connectedTiles = new Array<Tile>();
    }
}