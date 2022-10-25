import _ from "underscore";
import type { TDesign } from "./design";
import type { DirectionID } from './../types';

/**
 * 
 * @param grid 
 * @param ix 
 * @param name 
 * @param point 
 */
const addLocations = function (grid: TGrid, ix: number, name: string, point: Array<number>) {
    if (ix < 0) {
        const offsets = _.range(grid.dirs.length).fill(0);

        wider_loop: for (const vector of grid.dirs) {
            let o = 0;
            for (let c = grid.scales.length - 1; c >= 0; c--) {
                if (c < grid.scales.length - 1) {
                    o = o * grid.scales[c].length;
                }
                const v = vector[c];
                const x = point[c] + v;
                if (x < 0) {
                    continue wider_loop;
                }
                if (x >= grid.scales[c].length) {
                    continue wider_loop;
                }
                o += v;
            }
            offsets[grid.dirs.indexOf(vector)] = o;
        }

        grid.design.addLocation({ name, offsets });
        return;
    }

    for (let i = 0; i < grid.scales[ix].length; i++) {
        point.unshift(i);
        addLocations(grid, ix - 1, grid.scales[ix][i] + name, point);
        point.shift();
    }
};

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
        this.scales.push(scale.split('/'));
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

    addLocations() {
        addLocations(this, this.scales.length - 1, "", []);
    }
}
