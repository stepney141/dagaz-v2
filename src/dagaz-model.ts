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
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'TDesign' is not assignable to type 'null'.
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
