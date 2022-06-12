import { TDesign } from "./core/index";

export class DagazClient {
  design: null | TDesign;
  model: any;
  constructor() {
    this.design = new TDesign();
  }

  getDesign() {
    return this.design;
  }

  resetDesign() {
    if (this.design !== null) {
      this.model.design = null;
    }
  }

  buildDesign() { }
}
