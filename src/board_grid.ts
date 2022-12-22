/**
 * @module board_grid
 */

import _ from "underscore";

import type { TDesign } from "./design";
import type { DirectionID } from "./types";

/**
 * internal DSL manager to easily represent board representation
 */
export class TGrid {
  design: TDesign;
  dirs: Array<Array<number>>;
  scales: Array<Array<string>>;

  /**
   * @param design
   */
  constructor(design: TDesign) {
    this.design = design;
    this.scales = [];
    this.dirs = [];
  }

  /**
   * Define a rank / a file on the board.
   * @param scale - a scale of a rank/file
   * @example
   * const g = design.addGrid();
   * g.addScale("A/B/C/D/E/F/G/H");
   * g.addScale("8/7/6/5/4/3/2/1");
   */
  addScale(scale: string) {
    this.scales.push(scale.split("/"));
  }

  /**
   * Define a direction on the board.
   * @param name - direction name
   * @param offsets - directional vector
   * @example
   * const g = design.addGrid();
   * g.addDirection("n", [ 0, -1 ]);
   * g.addDirection("e", [ 1,  0 ]);
   * g.addDirection("w", [-1,  0 ]);
   * g.addDirection("s", [ 0,  1 ]);
   */
  addDirection(name: string, offsets: Array<number>) {
    this.design.addDirection([name]);
    const ix: DirectionID = this.design.getDirection(name);
    if (ix >= 0) {
      this.dirs[ix] = offsets;
    }
  }

  /**
   *
   * @param grid
   * @param ix
   * @param name
   * @param point
   */
  addLocations(grid: TGrid = this, ix: number = this.scales.length - 1, name = "", point: Array<number> = []) {
    if (ix < 0) {
      const locationDelta = _.range(grid.dirs.length).fill(0);

      Object.keys(grid.dirs).forEach((dir) => {
        let o = 0;
        for (let c = grid.scales.length - 1; c >= 0; c--) {
          if (c < grid.scales.length - 1) {
            o = o * grid.scales[c].length;
          }
          const v = grid.dirs[dir as unknown as DirectionID][c];
          const x = point[c] + v;
          if (x < 0) {
            return;
          }
          if (x >= grid.scales[c].length) {
            return;
          }
          o += v;
        }
        locationDelta[dir as unknown as DirectionID] = o;
      });

      grid.design.addLocation({ name, locationDelta });
      return;
    }

    for (let i = 0; i < grid.scales[ix].length; i++) {
      point.unshift(i);
      this.addLocations(grid, ix - 1, grid.scales[ix][i] + name, point);
      point.shift();
    }
  }
}
