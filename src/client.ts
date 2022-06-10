import { TDesign } from "./core/index.js";

export class DagazClient {
  design: any;
  model: any;
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
