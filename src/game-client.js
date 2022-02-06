import { TDesign } from "./core/index.js";

export class DagazClient {
  /**
   * 
   * @param {{game: (design: TDesign) => void, extension: Array<(args : *) => void>}}
   */
  constructor({
    game: game_design_func,
    extention: ...external_rule_func
  }) {
    /** @type {TDesign | null} */
    this.design = new TDesign();
    this.game_design_func = game_design_func;
    this.external_rule_func = external_rule_func;
  }

  getGameDesign() {
    return this.design;
  }

  resetGameDesign () {
    if (this.design !== null) {
      this.model.design = null;
    }
  }

  buildGameDesign () {
    this.game_design_func(this.design);
  }
}
