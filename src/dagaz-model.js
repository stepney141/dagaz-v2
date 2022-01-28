import { TDesign } from "./core/index.js";

const games = {
  model: {
    resetDesign: () =>{
      if (games.model.design !== null) {
        games.model.design = null;
      }
    },
    getDesign: () => {
      if (games.model.design === null) {
        games.model.design = new TDesign();
      }
      return games.model.design;
    },
    buildDesign: () => { },
    design: null
  },
  view: {}
};

export { games };
