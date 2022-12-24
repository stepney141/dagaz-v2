import type {
  DirectionID,
  DirectionName,
  GameBehaviorOptionFlags,
  GameRuleTemplate,
  LocationID,
  LocationName,
  Movement,
  MoveModeID,
  PieceName,
  PiecePrice,
  PieceTypeID,
  PlayerID,
  PlayerName,
  Plugin,
  TPiece,
  ZoneID,
  ZoneName
} from "./types";

type TDesign = {
  directionNames: DirectionName[];
  directionIds: DirectionID[];

  locationNames: LocationName[];
  locationIds: LocationID[];
  boardConnectionGraph: number[][];

  playerNames: PlayerName[];
  rotationallySymmetricDirections: DirectionID[][];

  pieces: {
    [key in PieceTypeID]: {
      name: PieceName;
      price: PiecePrice;
    };
  };
  pieceNames: {
    [EachPiece in PieceName]: PieceTypeID;
  };

  movements: Movement[];

  initialPosition: Array<{ location: LocationID; piece: TPiece }>;

  zones: {
    [EachZone in ZoneID]: {
      [EachPlayerWhoCanUseTheZone in PlayerID]: LocationID[];
    };
  };
  zoneNames: {
    [EachZone in ZoneName]: ZoneID;
  };

  turns:
    | {
        player: PlayerID;
        modes: number[];
      }[]
    | undefined;

  modes: MoveModeID[];
  repeat: number | null;
  gameOptions: GameBehaviorOptionFlags;

  plugins: Plugin[];
};

function buildGameDesign(gameRule: GameRuleTemplate) {
  return {
    directionNames: gameRule.directions,

    locationNames: gameRule.locations.map((loc) => loc.name),
    boardConnectionGraph: gameRule.locations.map((loc) => loc.offsets),

    playerNames: gameRule.players.map((player) => player.name),
    rotationallySymmetricDirections: gameRule.players.map((player) => player.symmetry),

    pieces: Object.fromEntries(
      gameRule.pieces.map((piece) => [piece.type, { name: piece.name, price: piece.price }])
    ),
    pieceNames: Object.fromEntries(gameRule.pieces.map((piece) => [piece.name, piece.type])),

    movements: gameRule.moves,

    // initialPosition:

    zones: Object.fromEntries(gameRule.zones.map((zone) => [zone.type, zone.name])),
    zoneNames: Object.fromEntries(gameRule.zones.map((zone) => [zone.name, zone.type]))
  };
}

// function getInitBoard(gameRule: GameRuleTemplate): TBoard {}
