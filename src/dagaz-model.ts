import { TBoard, TDesign } from "./core/index";
import { PlayerID } from "./types";

type Game = {
	model: {
		design: null | TDesign;
		resetDesign: () => void;
		getDesign: () => null | TDesign;
		buildDesign?: (design: TDesign) => void;
		extension?: (board: TBoard) => void;
		getGoal?: (board: TBoard, player?: PlayerID) => null | number;
	}
	view: Record<string, unknown>
};

export const games: Game = {
	model: {
		design: null,
		resetDesign: () => {
			if (games.model.design !== null) {
				games.model.design = null;
			}
		},
		getDesign: (): TDesign => {
			if (games.model.design === null) {
				games.model.design = new TDesign();
			}
			return games.model.design;
		}
	},
	view: {}
};
