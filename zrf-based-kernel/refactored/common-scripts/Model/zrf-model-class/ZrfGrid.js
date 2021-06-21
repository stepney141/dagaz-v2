import _ from 'underscore';
import { addPositions } from './utils.js';

export class ZrfGrid {
  constructor(design) {
    this.design = design;
    this.scales = [];
    this.dirs   = [];
  }

  addScale(scale) {
    this.scales.push(scale.split('/'));
  }

  addDirection(name, offsets) {
    if (_.indexOf(this.dirs, name) < 0) {
      this.design.addDirection(name);
    }
    var ix = _.indexOf(this.design.dirs, name);
    if (ix >= 0) {
      this.dirs[ix] = offsets;
    }
  }

  addPositions() {
    addPositions(this, this.scales.length - 1, "", []);
  }
}