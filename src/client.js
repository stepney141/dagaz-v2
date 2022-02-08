import { TDesign } from "./core/index.js";

export class DagazClient {
  constructor() {
    /** @type {TDesign | null} */
    this.design = new TDesign();
  }

  getDesign() {
    return this.design;
  }

  resetDesign () {
    if (this.design !== null) {
      this.model.design = null;
    }
  }

  buildDesign () { }
}
