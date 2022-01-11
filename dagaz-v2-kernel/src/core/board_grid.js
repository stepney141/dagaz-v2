import _ from "../../../dependencies/underscore-esm-min.js";
import { TDesign } from "./index.js";

/**
 * 
 * @param {TGrid} grid 
 * @param {number} ix 
 * @param {string} name 
 * @param {Array<*>} point 
 */
const addPositions = function(grid, ix, name, point) {
  if (ix < 0) {
    /** @type {Array<number>} */
    const offsets = _.range(grid.dirs.length).fill(0);

    grid.dirs.forEach(dir => {
      let o = 0;
      for (let c = grid.scales.length - 1; c >= 0; c--) {
        if (c < grid.scales.length - 1) {
          o = o * grid.scales[c].length;
        }
        let v = grid.dirs[dir][c];
        let x = point[c] + v;
        if (x < 0) {
          return;
        }
        if (x >= grid.scales[c].length) {
          return;
        }
        o += v;
      }
      offsets[dir] = o;
    });

    grid.design.addPosition(name, offsets);
    return;
  }

  for (let i = 0; i < grid.scales[ix].length; i++) {
    point.unshift(i);
    addPositions(grid, ix - 1, grid.scales[ix][i] + name, point);
    point.shift();
  }
};

export class TGrid {
  /**
   * @param {TDesign} design 
   */
  constructor(design) {
    this.design = design;

    /** @type {Array<Array<string>>} */
    this.scales = [];

    /** @type {Array<Array<number>>} */
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
   * @param {string} name - direction name
   * @param {Array<number>} offsets - directional vector
   * @example
   * const g = design.addGrid();
   * g.addDirection("n", [ 0, -1 ]);
   * g.addDirection("e", [ 1,  0 ]);
   * g.addDirection("w", [-1,  0 ]);
   * g.addDirection("s", [ 0,  1 ]);
   */
  addDirection(name, offsets) {
    if (this.dirs.indexOf(name) < 0) {
      this.design.addDirection(name);
    }
    let ix = this.design.dirs.indexOf(name);
    if (ix >= 0) {
      this.dirs[ix] = offsets;
    }
  }
  
  addPositions() {
    addPositions(this, this.scales.length - 1, "", []);
  }
}
