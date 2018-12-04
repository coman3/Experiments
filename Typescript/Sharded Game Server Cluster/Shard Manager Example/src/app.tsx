import * as React from 'react';
import { Renderer } from './containers';
import { Vector, safeReplacer, Tile } from './models';
import { World } from './models/world';
import { Checkbox, Button, Input } from 'semantic-ui-react'
import { Player } from 'models/player';

interface IState {
    showDetails: boolean;
    selectedPlayer: Player;
    selectedTile: Tile;

    spawnMorePlayersAmount: number;
}
export default class App extends React.Component<{}, IState> {
    world: World = new World(new Vector(8, 4));
    state: IState = {
        showDetails: false,
        selectedPlayer: null,
        selectedTile: null,

        spawnMorePlayersAmount: 10000,
    }

    componentWillMount() {
        this.world.populate();
    }

    onShowDetailsClicked = () => {
        this.setState({ showDetails: !this.state.showDetails });
    }
    onFitPlayersClicked = () => {
        this.world.fitPlayers();
        this.forceUpdate();
    }
    onPlayerSelected = (player: Player) => {
        this.setState({ selectedPlayer: player });
    }
    onTileSelected = (tile: Tile) => {
        this.setState({ selectedTile: tile });
    }
    onSplitTileClicked = () => {
        if (this.state.selectedTile) {
            this.state.selectedTile.splitTile();
        }
    }

    onSpawnMorePlayersClicked = () => {
        this.world.populateWithDummyPlayers(this.state.spawnMorePlayersAmount);
        this.forceUpdate();
    }
    onSpawnMorePlayersCountChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ spawnMorePlayersAmount: Number.parseFloat(event.target.value) });
    }

    onAutoAdjustTilesClicked = () => {
        this.world.tiles[0][0].splitTile();

        this.onFitPlayersClicked();
    }

    render() {
        let selectedTilePlayerCount = 0;
        if (this.state.selectedTile) {
            selectedTilePlayerCount = this.world.players.filter(x => this.world.getTile(x.position) === this.state.selectedTile).length;
        }
        return (
            <div className="appContainer">
                <Renderer world={this.world} showDetails={this.state.showDetails} tileRenderSize={100} onPlayerSelected={this.onPlayerSelected} onTileSelected={this.onTileSelected} />
                {this.state.selectedPlayer && (
                    <div className="details player">
                        <h5>Player</h5>
                        <div className="container">
                            <div className="grid">
                                <div className="body">
                                    <pre>
                                        {JSON.stringify(this.state.selectedPlayer, safeReplacer, 2)}
                                    </pre>
                                </div>
                                <div className="actions">
                                    <Button>Move To Position</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {this.state.selectedTile && (
                    <div className="details tile">
                        <h5>Tile</h5>

                        <div className="container">
                            <div className="grid">
                                <div className="body">
                                    <small>Players: {selectedTilePlayerCount}</small>
                                    <pre>
                                        {JSON.stringify(this.state.selectedTile, safeReplacer, 2)}
                                    </pre>
                                </div>
                                <div className="actions">
                                    <Button onClick={this.onSplitTileClicked}>Split</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="appControls">
                    <div className="option">
                        <Checkbox label="Show details" onChange={this.onShowDetailsClicked} />
                        <br />
                        <small>Show detailed information</small>
                    </div>
                    <div className="option">
                        <Input
                            type="number"
                            action={{ content: 'Spawn Players', onClick: this.onSpawnMorePlayersClicked }}
                            placeholder='Spawn Players'
                            defaultValue={this.state.spawnMorePlayersAmount}
                            onChange={this.onSpawnMorePlayersCountChanged}
                        />
                        <br />
                        <small>Spawn {this.state.spawnMorePlayersAmount} more players arround the entire world</small>
                    </div>
                    <div className="option">
                        <Button fluid={true} onClick={this.onFitPlayersClicked}>Fit Players</Button>
                        <br />
                        <small>Fit all players within the world and assign them to a tile</small>
                    </div>
                    <div className="option last">
                        <Button fluid={true} onClick={this.onAutoAdjustTilesClicked}>Auto Adjust Tiles</Button>
                        <br />
                        <small>Adjust all tiles to contain their maximum amout of players</small>
                    </div>
                </div>
            </div>
        );
    }
}