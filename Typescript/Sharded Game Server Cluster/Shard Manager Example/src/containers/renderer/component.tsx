import * as React from 'react';
import { Canvas } from '../../components/index';
import { Tile, Vector } from '../../models/index';
import { World } from 'models/world';
import { Player } from 'models/player';
interface IProps {
    world: World;
    tileRenderSize: number;
    showDetails: boolean;
    onPlayerSelected: (player: Player) => void;
    onTileSelected: (tile: Tile) => void;
}

// tslint:disable-next-line:max-classes-per-file
export class Renderer extends React.Component<IProps> {
    // Rendering Properties
    offset: Vector = new Vector(0, 0);
    isDraging: boolean = false;
    scale: number = 1;
    zoomCount: number = 0;
    lastMousePosition: Vector;
    canvas: HTMLCanvasElement;

    selectedPlayer: Player;
    selectedPlayerLocked: boolean;
    selectedTile: Tile;
    selectedTileLocked: boolean;

    /** Get the webgl context associated to the canvas */
    get glContext(): CanvasRenderingContext2D { return this.canvas.getContext("2d") };

    bindRef = (ref: HTMLCanvasElement) => {
        this.canvas = ref;
    }

    drawTile = (g: CanvasRenderingContext2D, tile: Tile, renderOffset?: Vector) => {
        const tileSize = tile.size;
        const color = {
            red: (255 - tile.size * 255) * 0.5,
            green: (255 - tile.size * 255) * 0.5,
            blue: (255 - tile.size * 255) * 0.5
        }
        g.lineWidth = 1;
        if (tile._color) {
            g.strokeStyle = tile._color;
        }
        if (this.selectedPlayer && this.selectedPlayer.connectedTiles.includes(tile)) {
            g.lineWidth = 3;
            color.red = 255;
        }
        if (this.selectedTile === tile) {
            g.lineWidth = 3;
            color.green = this.selectedTileLocked ? 255 : 180;
        }

        g.strokeStyle = "rgb(" + color.red + "," + color.green + "," + color.red + ")";

        let point = tile.position.Multiply(tileSize * this.scale).Multiply(this.props.tileRenderSize);
        if (renderOffset) {
            point = point.Add(renderOffset);
        }
        g.strokeRect(
            point.x + this.offset.x,
            point.y + this.offset.y,
            tileSize * this.props.tileRenderSize * this.scale,
            tileSize * this.props.tileRenderSize * this.scale
        );
        if (tile.isSplit)
            tile.tiles.forEach(xTiles => {
                xTiles.forEach(yTile => {
                    this.drawTile(g, yTile, point);
                })
            });
    }

    drawPlayer = (g: CanvasRenderingContext2D, player: Player) => {
        const point = player.position.Multiply(this.scale).Multiply(this.props.tileRenderSize).Add(this.offset);
        const size = 0.25;
        g.fillRect(point.x - (size / 2) * this.scale, point.y - (size / 2) * this.scale, size * this.scale, size * this.scale);
    }

    drawTileInfomation = (g: CanvasRenderingContext2D, tile: Tile, renderOffset?: Vector) => {

        if (tile.isSplit) return;

        let point = tile.position.Multiply(tile.size * this.scale).Multiply(this.props.tileRenderSize);
        if (renderOffset) {
            point = point.Add(renderOffset);
        }
        g.font = (3 * this.scale * tile.size) + "px Arial";
        const jsonModel = {
            x: tile.x,
            y: tile.y,
            depth: tile.depth,
            size: tile.size,
        };

        const textPostition = point
            .Add(this.offset)
            .Add(new Vector(this.scale, this.scale)
                .Multiply(tile.size)
                .Multiply(new Vector(2, 4)
                )
            );

        g.fillStyle = "rgb(120,0,120)";
        g.fillText(
            JSON.stringify(jsonModel, null, 2),
            textPostition.x,
            textPostition.y,
        );

        if (tile.isSplit)
            tile.tiles.forEach(xTiles => {
                xTiles.forEach(yTile => {
                    this.drawTile(g, yTile, point);
                })
            });
    }

    drawWorldInfomation = (g: CanvasRenderingContext2D, world: World) => {
        const point = new Vector(0, 0);
        const textPostition = point
            .Add(this.offset)
            .Add(new Vector(this.scale, this.scale)
                .Multiply(new Vector(0, -4)
                )
            );
        g.font = (6 * this.scale) + "px Arial";
        g.fillStyle = "rgb(120,0,120)";
        g.fillText(
            JSON.stringify({ players: world.players.length, totalTiles: world.totalTiles }, null, 2),
            textPostition.x,
            textPostition.y,
        )
    }

    draw = () => {
        if (!this.props.world.tiles) return;
        const g = this.glContext;
        g.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.props.world.tiles.forEach(tileXRow => {
            tileXRow.forEach(tile => {
                this.drawTile(g, tile);
            });
        });

        let changedFillStyle = false;
        g.fillStyle = "rgb(0, 120, 120)";
        g.strokeStyle = "";
        const filterForSelectedTile = this.props.world.players.length > 50000;

        const globalOffsetForSelectedTile = this.selectedTile ? this.selectedTile.getGlobalOffsetToTile(new Vector(1, 1)) : new Vector(0, 0);
        console.log(globalOffsetForSelectedTile, this.selectedTile ? this.selectedTile.size : -1);
        this.props.world.players.forEach(player => {
            if (changedFillStyle === true) {
                g.fillStyle = "rgb(0, 120, 120)";
                changedFillStyle = false;
            }
            if (player === this.selectedPlayer) {
                g.fillStyle = "rgb(0, 255, 255)";
                changedFillStyle = true;
            }

            if (!filterForSelectedTile) {
                this.drawPlayer(g, player);
                return;
            }
            if (!this.selectedTile) return;
            const playerPosition = player.position;
            if (
                (
                    playerPosition.x <= (globalOffsetForSelectedTile.x + 1.5 * this.selectedTile.size) &&
                    playerPosition.x >= (globalOffsetForSelectedTile.x - 0.5 * this.selectedTile.size)
                )
                &&
                (
                    playerPosition.y <= (globalOffsetForSelectedTile.y + 1.5 * this.selectedTile.size) &&
                    playerPosition.y >= (globalOffsetForSelectedTile.y - 0.5 * this.selectedTile.size)
                )
            ) this.drawPlayer(g, player);

        });

        if (this.props.showDetails) {
            this.drawWorldInfomation(g, this.props.world);
            this.props.world.tiles.forEach(tileXRow => {
                tileXRow.forEach(tile => {
                    this.drawTileInfomation(g, tile);
                });
            });
        }
    }

    onMouseMoveEvent = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const currentMousePos = new Vector(event.pageX, event.pageY);
        if (this.isDraging) {
            const mouseDelta = this.lastMousePosition.Subtract(new Vector(event.pageX, event.pageY));
            this.offset = this.offset.Add(mouseDelta.Invert());
        }
        this.lastMousePosition = currentMousePos;

        const relativePosition = this.lastMousePosition.Subtract(this.offset).DivideBy(this.scale).DivideBy(this.props.tileRenderSize);
        if (this.props.world.players.length <= 10000) {
            // to slow to filter over 10000 items every time the mouse moves            
            if (!this.selectedPlayerLocked) {
                const closestPlayer = this.props.world.getClosestPlayer(relativePosition, 0.01);
                this.selectedPlayer = closestPlayer;
                this.props.onPlayerSelected(closestPlayer);
            }
        }

        if (!this.selectedTileLocked) {
            const tileFound: Tile = this.props.world.getTile(relativePosition)
            this.selectedTile = tileFound;
            this.props.onTileSelected(this.selectedTile);
        }

        this.draw();
    }
    onMouseDownEvent = (event: React.WheelEvent<HTMLCanvasElement>) => {
        if (event.button === 2) {
            // is right click
            event.preventDefault();
            this.isDraging = true;
        }
        this.draw();
    };
    onMouseUpEvent = (event: React.WheelEvent<HTMLCanvasElement>) => {
        if (event.button === 2) {
            // is right click
            event.preventDefault();
            this.isDraging = false;
        }
        this.draw();
    };

    onWheelEvent = (event: React.WheelEvent<HTMLCanvasElement>) => {
        if (event.deltaY < 0) {
            this.zoomCount += 1;
        } else {
            this.zoomCount -= 1;
        }
        const oldScale = this.scale;
        this.scale = 2 * Math.pow(2, this.zoomCount / 10);

        const mousePositionWithinTilesOld = new Vector(event.pageX, event.pageY).Subtract(this.offset).DivideBy(oldScale).DivideBy(this.props.tileRenderSize);
        const mousePositionWithinTiles = new Vector(event.pageX, event.pageY).Subtract(this.offset).DivideBy(this.scale).DivideBy(this.props.tileRenderSize);
        const deltaMouseWithinTilesChange = mousePositionWithinTilesOld.Subtract(mousePositionWithinTiles);
        this.offset = this.offset.Subtract(deltaMouseWithinTilesChange.Multiply(this.props.tileRenderSize * this.scale));
        this.draw();
    };

    preventDefault = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
    }

    onClickEvent = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (this.props.world.players.length > 10000) {
            const relativePosition = this.lastMousePosition.Subtract(this.offset).DivideBy(this.scale).DivideBy(this.props.tileRenderSize);
            const closestPlayer = this.props.world.getClosestPlayer(relativePosition, 0.01);
            this.selectedPlayer = closestPlayer;
            this.props.onPlayerSelected(closestPlayer);
        }
        this.selectedPlayerLocked = (this.selectedPlayer) ? !this.selectedPlayerLocked : false;
        this.selectedTileLocked = (this.selectedTile && (!this.selectedPlayer && !this.selectedPlayerLocked)) ? !this.selectedTileLocked : false;
        this.draw();
        this.forceUpdate();
    }
    render() {
        if (this.canvas) this.draw();
        return <Canvas refOfCanvas={this.bindRef}
            onMouseMove={this.onMouseMoveEvent} onMouseDown={this.onMouseDownEvent}
            onContextMenu={this.preventDefault} onMouseUp={this.onMouseUpEvent}
            onClick={this.onClickEvent} onWheel={this.onWheelEvent}
        />
    }
}