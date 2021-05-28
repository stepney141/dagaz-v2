import _ from "../../dependencies/underscore-esm-min.js";
import { games } from "./dagaz-model-object.js";
import { TDesign } from "./dagaz-model-class/TDesign.js";

games.model.getDesign = function() {
  if (_.isUndefined(games.model.design)) {
    games.model.design = new TDesign();
  }
  return games.model.design;
};

games.model.BuildDesign = function (design) { };

export { games };
