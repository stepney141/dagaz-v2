import { TBoard } from './core/board';
import { TDesign } from "./core/index";

type Game = {
  model: {
    resetDesign: () => void;
    getDesign: () => null | TDesign;
    buildDesign: null | ((design: TDesign) => void);
    design: null | TDesign;
    extension: null | ((board: TBoard) => any)
  };
  view: Record<string, unknown>
};

export const games: Game = {
  model: {
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
    },
    buildDesign: null,
    design: null,
    extension: null
  },
  view: {}
};
