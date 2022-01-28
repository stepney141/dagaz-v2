import _ from '../../../../../../dependencies/underscore-esm-min.js';
import { addPositions } from './utils.js';

export class ZrfGrid {
  constructor(design) {
    this.design = design;
    this.scales = [];
    this.dirs   = [];
  }

  /**
   * Define a rank / a file on the board.
   * @param {string} scale - a scale of a rank/file
   * @example
   * const g = design.addGrid();
   * g.addScale("A/B/C/D/E/F/G/H");
   * g.addScale("8/7/6/5/4/3/2/1");
   */
  addScale(scale) {
    this.scales.push(scale.split('/'));
  }

  /**
   * Define a direction on the board.
   * @param {string} name - a direction name
   * @param {Array<number>} offsets - a directional vector
   * @example
   * const g = design.addGrid();
   * g.addDirection("n",[ 0, -1]);
   * g.addDirection("e",[ 1,  0]);
   * g.addDirection("w",[-1,  0]);
   * g.addDirection("s",[ 0,  1]);
   */
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