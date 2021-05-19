import { _ } from "underscore";
import { TDesign } from "./dagaz-model-class/TDesign.js";

const games = {
  model: {
    passTurn: false,
    passPartial: false,
    sharedPieces: false,
    deferredCaptures: false
  },
  view:  []
};

games.model.getDesign = function() {
  if (_.isUndefined(games.model.design)) {
    games.model.design = new TDesign();
  }
  return games.model.design;
};

games.model.BuildDesign = function (design) { };
