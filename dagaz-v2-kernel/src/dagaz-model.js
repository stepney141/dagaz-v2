import { TDesign } from "./core/TDesign.js";

const games = {
  model: {
    resetDesign: () =>{
      if (games.model.design !== undefined) {
        delete games.model.design;
      }
    },
    getDesign: () => {
      if (games.model.design === undefined) {
        games.model.design = new TDesign();
      }
      return games.model.design;
    },
    buildDesign: () => { }
  },
  view: {}
};

export { games };
