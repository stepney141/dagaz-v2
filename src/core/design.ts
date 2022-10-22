import _ from "underscore";
import type {
    Movement, MoveModeID,
    DirectionName, DirectionID,
    PositionName, PositionID,
    PlayerName, PlayerID,
    PieceName, PieceTypeID, PieceValue,
    ZoneName
} from "./../types";
import { games } from "./../dagaz-model";
import { TBoard } from "./board";
import { TGrid } from "./board_grid";
import { TPiece } from "./piece";

type GameBehaviorOptions =
    | 'pass-turn'
    | 'pass-partial'
    | 'shared-pieces'
    | 'deferred-captures'
    | 'maximal-captures'
    | 'smart-moves';
type GameBehaviorOptionFlags = Record<GameBehaviorOptions, boolean>;

/**
 * @param player - a name of a player who owns the pieces
 * @param pieceType - a piece type
 * @param positions - names of cells where the piece occupies when the game starts
 */
type InitialPiecePlacementSetting = {
    player: PlayerName,
    pieceName: PieceName,
    positions: PositionName[]
};

/**
 * @param name - a zone name
 * @param player - an ID of a player who can use the zone
 * @param positions - a list of position-names which are in the zone
 */
type ZoneSetting = {
    name: ZoneName,
    player: PlayerID,
    positions: PositionName[]
};

/**
 * @param name - a position name
 * @param offsets - cell offsets indicated by direction ids
 */
type PositionSetting = {
    name: PositionName,
    offsets: number[]
};

/**
 * @param name - a player name
 * @param symmetry - a list of direction ids that are rotationally symmetric in each player
 */
type PlayerSetting = {
    name: string,
    symmetry: DirectionID[]
};

/**
 * @param name - a piece name
 * @param type - a piece type id
 * @param price - a piece value
 */
type PieceSetting = {
    name: PieceName,
    type: PieceTypeID,
    price?: PieceValue
};

/**
 * Manager of information and rules of the game.
 * This will be never re-instantiated after it once gets instantiated.
 */
export class TDesign {
    board: TBoard | undefined;
    boardConnectionGraph: PositionID[][];
    dirs: DirectionName[];
    gameOptions: GameBehaviorOptionFlags;
    initial: Array<{ p: (null | PositionID), t: TPiece }>;
    modes: MoveModeID[];
    movements: Movement[];
    groupedMovements: Record<number, Movement[]> | null;
    pieceNames: PieceName[];
    playerNames: PlayerName[];
    positionNames: PositionName[];
    price: number[];
    repeat: number | null;
    rotationallySymmetricDirections: Array<undefined | DirectionID[]>;
    turns: Array<{ player: number, mode: any }> | undefined;
    zoneNames: ZoneName[];
    zones: number[][][];

    constructor() {
        /**
         * A list of direction names.
         * Each index of this array is a numeric id of each direction.
         */
        this.dirs = [];

        /**
         * A list of rotationally symmetric directions of players.
         * Each index of this array is a numeric id of each player.
         */
        this.rotationallySymmetricDirections = [];

        /**
         * A list of player names.
         * Each index of this array is a numeric id of each player.
         */
        this.playerNames = [];

        /**
         * Board representation: a list of board cell offsets represented by direction ids.
         * Dagaz adopts an extended representation of the Mailbox pattern, an array-based offset board representation system.
         * @link https://www.chessprogramming.org/Mailbox
         */
        this.boardConnectionGraph = [];

        /**
         * Board representation: a list of board cell names.
         * Each index of this array is a numeric id of each cell.
         */
        this.positionNames = [];

        /**
         * A list of priorities on the mode of moves.
         */
        this.modes = [];

        /**
         * A list of zones, the special areas composed of specified cells.
         * A zone is an array of cell ids. Also, an index of the cell array is a numeric id of a player who can use the zone.
         * Each index of this "zones" array is a numeric id of each zone.
         */
        this.zones = [];

        this.zoneNames = [];

        /**
         * A list of pieces' names.
         * Each index of this array is a numeric id of each piece type.
         */
        this.pieceNames = [];

        /** 
         * A list of pieces' prices.
         */
        this.price = [];

        /**
         * A list of movements or behavior of pieces
         */
        this.movements = [];

        this.groupedMovements = null;

        /**
         * A list of initial piece positions and piece objects.
         */
        this.initial = [];

        this.turns;

        /**
         * An initial game state.
         */
        this.board;

        this.gameOptions = {
            'pass-turn': false,
            'pass-partial': false,
            'shared-pieces': false,
            'deferred-captures': false,
            'maximal-captures': false,
            'smart-moves': false
        };

        this.repeat = null;
    }

    /**
     * Return a new piece instance.
     * @param type - an id of the piece type
     * @param player - an id of a player who owns the piece
     * @returns new piece
     */
    createPiece(type: PieceTypeID, player: PlayerID): TPiece {
        return new TPiece(type, player);
    }

    /**
     * Define some flags for game rules and store them into the global namespace
     * @param name - flag name
     * @param value - flag value
     */
    checkGameOption(name: GameBehaviorOptions, value: boolean) {
        if (name === "pass-turn") {
            this.gameOptions['pass-turn'] = (value === true);
        }
        if (name === "pass-partial") {
            this.gameOptions['pass-partial'] = (value === true);
        }
        if (name === "shared-pieces") {
            this.gameOptions['shared-pieces'] = (value === true);
        }
        if (name === "deferred-captures") {
            this.gameOptions['deferred-captures'] = (value === true);
        }
    }

    /**
     * Return a position name that corresponds to the given position id
     * @param pos - a position id
     * @returns a position name
     */
    posToString(pos: PositionID): PositionName {
        if (this.positionNames[pos] === undefined) {
            return "?";
        }
        return this.positionNames[pos];
    }

    /**
     * Return an position corresponding to the given position name
     * @param name - a position name
     * @returns a position id
     */
    stringToPos(name: PositionName): null | PositionID {
        const pos = this.positionNames.indexOf(name);
        if (pos < 0) {
            return null;
        }
        return pos;
    }

    /**
     * Define a new direction
     * @param name - a list of direction names
     */
    addDirection(nameList: DirectionName[]) {
        this.dirs = nameList;
    }

    /**
     * Define a player with his/her rotationally symmetric move-directions;  
     * e.g. When a chess player moves a pawn one square toward north, the other player recognizes the pawn moves "one square toward south."  
     * This is an example of the move-direction symmetry.
     */
    addPlayer({ name, symmetry }: PlayerSetting) {
        const ix = this.playerNames.length;
        if (this.playerNames.length == 0) {
            this.playerNames.push("opposite");
        }
        this.rotationallySymmetricDirections[ix] = symmetry;
        this.playerNames.push(name);
    }

    /**
     * Define a turn.
     * @param player - a player id
     * @param modes 
     */
    addTurn(player: PlayerID, modes: Array<any>) {
        if (this.turns === undefined) {
            this.turns = [];
        }
        this.turns.push({
            player: player,
            mode: modes
        });
    }

    repeatMark() {
        if (this.turns === undefined) {
            this.turns = [];
        }
        this.repeat = this.turns.length;
    }

    /**
     * Define a cell on the game board.
     */
    addPosition({ name, offsets }: PositionSetting) {
        if ((this.boardConnectionGraph.length == 0) && (name != "start")) { //when the positions list is empty, defines the origin of the coordinates 
            this.positionNames.push("start");
            this.boardConnectionGraph.push(_.range(offsets.length).fill(0));
        }
        this.positionNames.push(name);
        this.boardConnectionGraph.push(offsets);
    }

    /**
     * Define a special zone on the game board.
     */
    addZone({ name, player, positions }: ZoneSetting) {
        let zone_id = this.zoneNames.indexOf(name);
        if (zone_id < 0) { //when the zone name is not found in the zone names list
            zone_id = this.zoneNames.length;
            this.zoneNames.push(name);
        }
        if (this.zones[zone_id] === undefined) {
            this.zones[zone_id] = [];
        }
        this.zones[zone_id][player] = positions.map(name => this.stringToPos(name));
    }

    /**
     * Define a priority on the mode of moves.
     * @param mode 
     */
    addPriority(mode: MoveModeID) {
        this.modes.push(mode);
    }

    /**
     * Define a piece.
     * @param name - a piece name
     * @param type - a piece type id
     * @param price - a piece value
     */
    addPiece({ name, type, price = 1 }: PieceSetting) {
        this.pieceNames[type] = name;
        this.price[type] = price;
    }

    /**
     * Return a piece type id that corresponds to the given piece name
     * @param name - a piece name
     * @returns a piece type id
     */
    getPieceType(name: PieceName): null | PieceTypeID {
        const r = this.pieceNames.indexOf(name);
        if (r < 0) {
            return null;
        }
        return r;
    }

    /**
     * Define how a piece moves or works (e.g. how it moves to another cell, how it captures other pieces, etc.)
     */
    addMove(movement: Movement) {
        this.movements.push(movement);
    }

    /**
     * Return a game board at the time when the game started.
     * If it doesn't exist, create the initial board from the game design.
     * @returns an initial game state
     */
    getInitBoard(): TBoard {
        if (this.board === undefined) {
            games.model.buildDesign(this); // load game rules
            this.configureMovement();
            this.board = new TBoard(this); // create the initial game state
            this.initial.forEach(s => { // place pieces on the specified cells
                this.board.setPiece(s.p, s.t);
            });
        }
        return this.board;
    }

    /**
     * Define a initial setup of pieces.
     */
    configureInitBoard({ player, pieceName, positions }: InitialPiecePlacementSetting) {
        const piece_type_id = this.pieceNames.indexOf(pieceName);
        const player_id = this.playerNames.indexOf(player);
        if ((piece_type_id < 0) || (player_id < 0)) {
            return;
        }
        const piece = new TPiece(piece_type_id, player_id); // create a piece

        positions
            .map(name => this.stringToPos(name))
            .forEach(pos => {
                this.initial.push({ //store information of a piece position 
                    p: pos,
                    t: piece
                });
            });
    }

    /**
     * Return a list of all direction ids (starts from 0)
     * @returns a list of all direction ids
     */
    allDirections(): DirectionID[] {
        return _.range(this.dirs.length);
    }


    /**
     * Return a list of all player ids (starts from 1)
     * @returns a list of all player ids
     */
    allPlayers(): PlayerID[] {
        return _.range(1, this.playerNames.length);
    }

    /**
     * Return a list of all cell ids (starts from 1)
     * @returns a list of all cell ids
     */
    allPositions(): PositionID[] {
        return _.range(1, this.boardConnectionGraph.length);
    }

    /**
     * Return a direction id that corresponds to the given direction name
     * @param name - a direction name
     * @returns a direction id
     */
    getDirection(name: DirectionName): null | DirectionID {
        const dir = this.dirs.indexOf(name);
        if (dir < 0) {
            return null;
        }
        return dir;
    }

    /**
     * Return a new piece position after a player makes a move from a current position toward a given direction
     * @param player - player id
     * @param pos - current position of the piece
     * @param dir - id of the direction toward which the player is going to make a move
     * @returns a new position (null if the new position is not found)
     */
    navigate(player: PlayerID, pos: PositionID, dir: DirectionID): null | PositionID {
        let target_dir = dir;
        if (this.rotationallySymmetricDirections[player] !== undefined) {
            target_dir = this.rotationallySymmetricDirections[player][dir];
        }

        if (this.boardConnectionGraph[pos][target_dir] != 0) {
            return + pos + this.boardConnectionGraph[pos][target_dir];
        } else {
            return null;
        }
    }

    /**
     * 
     * @param dir 
     * @param player
     * @returns
     */
    opposite(dir: DirectionID, player = 0): number {
        return this.rotationallySymmetricDirections[player][dir];
    }

    /**
     * Return a zone that corresponds to the given zone name.
     * @param name - a zone name
     * @returns a zone id
     */
    getZone(name: string): null | number {
        const zone = this.zoneNames.indexOf(name);
        if (zone < 0) {
            return null;
        }
        return zone;
    }

    /**
     * Return whether the player is in the given zone.
     * @param player - player id
     * @param pos - cell id
     * @param zone - zone id
     * @returns
     */
    inZone(player: PlayerID, pos: PositionID, zone: number): boolean {
        if (this.zones[zone] !== undefined) {
            if (this.zones[zone][player] !== undefined) {
                return this.zones[zone][player].indexOf(pos) >= 0;
            }
        }
        return false;
    }

    /**
     * Return a player who is going to make a move in the next turn.
     * @param player - current player id
     * @returns next player id
     */
    nextPlayer(player: PlayerID): PlayerID {
        if (player + 1 >= this.playerNames.length) {
            return 1;
        } else {
            return player + 1;
        }
    }

    /**
     * Return the next turn id.
     * @param board 
     * @returns
     */
    nextTurn(board: TBoard): number {
        let turn = board.turn + 1;
        if (this.turns === undefined) {
            if (turn >= this.rotationallySymmetricDirections.length - 1) {
                turn = 0;
                if (this.repeat !== null) {
                    turn += this.repeat;
                }
            }
        } else {
            if (turn >= this.turns.length) {
                turn = 0;
                if (this.repeat !== null) {
                    turn += this.repeat;
                }
            }
        }
        return turn;
    }

    /**
     * Return a current player id.
     * @param turn 
     * @returns current player id
     */
    currPlayer(turn: number): PlayerID {
        if (this.turns === undefined) {
            return turn + 1;
        } else {
            return this.turns[turn].player;
        }
    }

    /**
     * Classify piece movement according to a move mode
     */
    configureMovement() {
        this.groupedMovements = _.groupBy(this.movements, movement => {
            if (this.modes.length == 0) {
                return 0;
            }
            return this.modes.indexOf(movement.mode);
        });
    }

    /**
     * Create a new grid
     * @returns a new TGrid instance
     */
    addGrid(): TGrid {
        return new TGrid(this);
    }
}
