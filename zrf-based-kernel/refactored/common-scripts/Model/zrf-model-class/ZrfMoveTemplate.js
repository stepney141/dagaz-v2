import _ from 'underscore';
import { Dagaz } from '../../dagaz.js';

export class ZrfMoveTemplate {
  constructor() {
    this.commands = [];
  }

  addCommand(name, param) {
    if (!_.isUndefined(Dagaz.Model.commands[name])) {
      if (_.isUndefined(Dagaz.Model.cache)) {
        Dagaz.Model.cache = [];
      }
      if (_.isUndefined(Dagaz.Model.cache[name])) {
        Dagaz.Model.cache[name] = [];
      }
      var offset = param;
      if (_.isUndefined(Dagaz.Model.cache[name][offset])) {
        Dagaz.Model.cache[name][offset] = function(x) {
          return (Dagaz.Model.commands[name])(x, offset);
        };
      }
      this.commands.push(Dagaz.Model.cache[name][offset]);
    }
  }
}