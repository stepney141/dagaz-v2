import { TDesign } from "./TDesign.js";

const games = {
  model: {
    passTurn: false,
    passPartial: false,
    sharedPieces: false,
    deferredCaptures: false,

    getDesign: () => {
      if (games.model.design === undefined) {
        games.model.design = new TDesign();
      }
      return games.model.design;
    },
    BuildDesign: (design) => { }
  },
  view: {}
};

export { games };
