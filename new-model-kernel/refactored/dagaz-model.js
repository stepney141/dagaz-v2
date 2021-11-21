import _ from "../../dependencies/underscore-esm-min.js";
import { TDesign } from "./dagaz-model-class/TDesign.js";

const games = {
  model: {
    passTurn: false,
    passPartial: false,
    sharedPieces: false,
    deferredCaptures: false,

    getDesign: () => {
      if (_.isUndefined(games.model.design)) {
        games.model.design = new TDesign();
      }
      return games.model.design;
    },
    BuildDesign: (design) => { }
  },
  view: {}
};

export { games };
