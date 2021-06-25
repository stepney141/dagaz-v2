import _ from '../../../../../dependencies/underscore-esm-min.js';
import { Dagaz } from '../../dagaz.js';

export class View2D {
  constructor() {
    this.pos     = [];
    this.res     = [];
    this.back    = [];
    this.piece   = [];
    this.board   = [];
    this.setup   = [];
    this.target  = [];
    this.strike  = [];
    this.goal    = [];
    this.changes = [];
    this.vectors = [];
    this.current = [];
    this.drops   = [];
    this.ko      = [];
  }

  pointToPieces(x, y) {
    return Dagaz.View.pointToPieces(this, x, y);
  }

  pointToPositions(x, y) {
    return Dagaz.View.pointToPositions(this, x, y);
  }

  isEmpty(pos) {
    return posToIx(this, pos) === null;
  }

  setDrops(name, positions) {
    this.drops = [];
    if (!_.isUndefined(this.piece[name])) {
      _.each(positions, function(p) {
        if (p <= this.pos.length) {
          this.drops.push({
            piece: this.piece[name],
            position: this.pos[p]
          });
        }
      }, this);
    }
  }

  clearDrops() {
    this.drops = [];
  }

  /**
   * set up screen coordinates of a position on the board
   * @param {*} name 
   * @param {*} x 
   * @param {*} y 
   * @param {*} dx 
   * @param {*} dy 
   * @param {*} selector  
   */
  defPosition(name, x, y, dx, dy, selector) {
    if (!_.isUndefined(selector) && (selector != Dagaz.Model.getResourceSelector())) return;
    this.pos.push({
      name: name,
      x:    x,
      y:    y,
      dx:   dx,
      dy:   dy
    });
  }

  /**
   * set up graphic resources for the board
   * @param {*} img 
   * @param {*} x 
   * @param {*} y 
   * @param {*} selector 
   * @param {*} turns 
   */
  defBoard(img, x, y, selector, turns) {
    if (!_.isUndefined(selector) && (selector != Dagaz.Model.getResourceSelector())) return;
    var board = {
      h: document.getElementById(img),
      t: turns,
      x: x ? x : 0,
      y: y ? y : 0
    };
    this.res.push(board);
    this.back.push(board);
  }

  /**
   * set up graphic resources for a piece
   * @param {*} img 
   * @param {*} name 
   * @param {*} help 
   * @param {*} glyph 
   */
  defPiece(img, name, help, glyph) {
    var piece = {
      h:    document.getElementById(img),
      name: name
    };
    if (glyph) {
      piece.glyph = document.getElementById(glyph);
    }
    if (help) {
      piece.help = help;
    }
    this.res.push(piece);
    this.piece[name] = piece;
  }

  allResLoaded() {
    if (this.allDone) return true;
    for (var i = 0; i < this.res.length; i++) {
      var image = this.res[i].h;
      if (!image.complete || (image.naturalWidth == 0)) return false;
      this.res[i].dx = image.naturalWidth;
      this.res[i].dy = image.naturalHeight;
    }
    this.allDone = true;
    return true;
  }

  clear() {
    this.setup = [];
  }

  addPiece(piece, pos, model) {
    this.setup.push({
      pos:  +pos,
      name:  piece,
      model: model, 
      x:     this.pos[pos].x,
      y:     this.pos[pos].y
    });
  }

  markPositions(type, positions) {
    if (type == Dagaz.View.markType.TARGET) {
      this.target  = positions;
    } 
    if (type == Dagaz.View.markType.ATTACKING) {
      this.strike  = positions;
    }
    if (type == Dagaz.View.markType.GOAL) {
      this.goal    = positions;
    }
    if (type == Dagaz.View.markType.CURRENT) {
      this.current = positions;
    }
    if (type == Dagaz.View.markType.KO) {
      this.ko      = positions;
    }
    this.invalidate();
  }

  capturePiece(move, pos, phase) {
    if (!phase) { phase = 1; }
    _.chain(this.changes)
      .filter(function(frame) {
        return !_.isUndefined(frame.from) && !_.isUndefined(frame.to);
      })
      .filter(function(frame) {
        return frame.to == pos;
      })
      .each(function(frame) {
        deferred.push(pos);
      });
    var ix = posToIx(this, pos);
    if (ix === null) return;
    this.changes.push({
      phase: phase,
      steps: 1,
      from:  pos,
      op:    ix
    });
  }

  dropPiece(move, pos, piece, phase) {
    if (!phase) { phase = 0; }
    var ix = posToIx(this, pos);
    this.changes.push({
      phase: phase,
      steps: 1,
      ix:    ix,
      to:    pos,
      model: piece,
      np:    piece.toString()
    });
  }

  addVector(from, to, steps, mode, level) {
    if (!mode) mode = 0;
    if (!steps) { steps = Dagaz.View.STEP_CNT; }
    if (_.isUndefined(this.vectors[mode])) {
      this.vectors[mode] = [];
    }
    if (_.isUndefined(this.vectors[mode][from])) {
      this.vectors[mode][from] = [];
    }
    this.vectors[mode][from][to] = {
      steps: steps,
      level: level
    };
  }

  addPhase(ix, from, to, piece, phase, steps) {
    this.changes.push({
      phase: phase,
      steps: steps,
      from:  from,
      to:    to,
      ix:    ix,
      model: piece,
      np:    (piece === null) ? null : piece.toString(),
      dx:    ((this.pos[to].x - this.pos[from].x) / steps) | 0,
      dy:    ((this.pos[to].y - this.pos[from].y) / steps) | 0
    });
  }

  vectorFound(ix, from, to, piece, mode, phase) {
    if (!phase) { phase = 1; }
    if (phase > Dagaz.View.maxSteps) return false;
    if (this.vectors[mode] && this.vectors[mode][from]) {
      if (this.vectors[mode][from][to] && (this.vectors[mode][from][to].level == phase)) {
        this.addPhase(ix, from, to, piece, phase, this.vectors[mode][from][to].steps);
        return true;
      }
      var list = _.keys(this.vectors[mode][from]);
      for (var i = 0; i < list.length; i++) {
        var pos = list[i];
        if (this.vectors[mode][from][pos].level == phase) {
          this.addPhase(ix, from, pos, piece, phase, this.vectors[mode][from][pos].steps);
          if (this.vectorFound(ix, pos, to, piece, mode, phase + 1)) {
            return true;
          }
          this.changes.pop();
        }
      }
    }
    return false;
  }

  movePiece(move, from, to, piece, phase, steps) {
    if (!phase) { phase = 1; }
    if (!steps) { steps = Dagaz.View.STEP_CNT; }
    var ix = posToIx(this, from);
    if (!this.vectorFound(ix, from, to, piece, move.mode)) {
      if (!_.isUndefined(move.hints)) {
        _.each(move.hints, function(p) {
          this.addPhase(ix, from, p, piece, phase, Dagaz.View.HINT_STEPS);
          from = p;
          phase++;
        }, this);
      }
      this.addPhase(ix, from, to, piece, phase, steps);
    }
  }

  commit(move) {
    _.chain(this.changes)
      .filter(function(frame) {
        return !_.isUndefined(frame.from) && !_.isUndefined(frame.to);
      })
      .filter(function(frame) {
        return _.indexOf(_.chain(this.changes)
          .filter(function(frame) {
            return !_.isUndefined(frame.from) && _.isUndefined(frame.to);
          })
          .map(function(frame) {
            return frame.from;
          })
          .value(), frame.to) >= 0;
      }, this)
      .each(function(frame) {
        delete frame.ix;
      });
    _.chain(this.changes)
      .map(function(frame) {
        return frame.phase;
      })
      .uniq()
      .each(function(phase) {
        var steps = _.chain(this.changes)
          .filter(function(frame) {
            return frame.phase == phase;
          })
          .map(function(frame) {
            return frame.steps;
          })
          .push(1)
          .max()
          .value();
        _.chain(this.changes)
          .filter(function(frame) {
            return frame.phase == phase;
          })
          .each(function(frame) {
            frame.cnt = steps;
          });
      }, this);
    this.invalidate();
  }

  drawKo(ctx) {
    if (!_.isUndefined(this.piece["Ko"]) && (this.ko.length > 0)) {
      var piece = this.piece["Ko"];
      _.each(this.ko, function(pos) {
        var p = this.pos[pos];
        var x = ( p.x + (p.dx - piece.dx) / 2) | 0;
        var y = ( p.y + (p.dy - piece.dy) / 2) | 0;
        if (!_.isUndefined(Dagaz.View.KO_ALPHA)) {
          ctx.save();
          ctx.globalAlpha = Dagaz.View.KO_ALPHA;
        }
        ctx.drawImage(piece.h, x, y, piece.dx, piece.dy);
        if (!_.isUndefined(Dagaz.View.KO_ALPHA)) {
          ctx.restore();
        }
      }, this);
    }
  }

  invalidate() {
    isValid = false;
  }

  animate() {
    var len = this.changes.length;
    this.changes = _.filter(this.changes, function(frame) {
      return _.isUndefined(frame.done);
    });
    var phase = _.chain(this.changes)
      .map(function(frame) {
        return frame.phase;
      })
      .min()
      .value();
    _.chain(this.changes)
      .filter(function(frame) {
        return frame.phase == phase;
      })
      .filter(function(frame) {
        return !_.isUndefined(frame.from) && _.isUndefined(frame.op);
      })
      .each(function(frame) {
        frame.op = posToIx(this, frame.from);
      }, this);
    this.changes = _.filter(this.changes, function(frame) {
      if (frame.phase > phase) return true;
      if (_.isUndefined(frame.from)) return true;
      return !_.isUndefined(frame.op);
    });
    _.chain(this.changes)
      .filter(function(frame) {
        return frame.phase == phase;
      })
      .filter(isCommitted)
      .each(function(frame) {
        if (!_.isUndefined(frame.op)) {
          var piece = this.setup[frame.op];
          if (piece) {
            if (!_.isUndefined(frame.dx)) {
              piece.x += frame.dx;
            }
            if (!_.isUndefined(frame.dy)) {
              piece.y += frame.dy;
            }
            piece.z = Math.abs(+frame.dx) + Math.abs(+frame.dy);
          }
        }
        frame.cnt--;
      }, this);
    var captured = _.chain(this.changes)
      .filter(function(frame) {
        return frame.phase == phase;
      })
      .filter(isCommitted)
      .filter(isDone)
      .map(function(frame) {
        if (_.isUndefined(frame.to)) {
          return frame.from;
        } else {
          return frame.to;
        }
      })
      .map(function(pos) {
        return posToIx(this, pos);
      }, this)
      .filter(isNotNull)
      .difference(
        _.chain(this.changes)
          .filter(isCommitted)
          .filter(isDone)
          .map(function(frame) {
            return frame.ix;
          })
          .filter(isNotNull)
          .value()
      )
      .value();
    _.chain(this.changes)
      .filter(function(frame) {
        return frame.phase == phase;
      })
      .filter(isCommitted)
      .filter(isDone)
      .each(function(frame) {
        if (!_.isUndefined(frame.op) && !_.isUndefined(frame.to)) {
          var piece = this.setup[frame.op];
          if (piece) {
            if (frame.np) {
              piece.name = frame.np;
            }
            if (frame.model) {
              piece.model = frame.model;
            }
            piece.pos = +frame.to;
            piece.x = this.pos[frame.to].x;
            piece.y = this.pos[frame.to].y;
            delete piece.z;
          }
        }
        if (_.isUndefined(frame.op) && !_.isUndefined(frame.to)) {
          this.setup.push({
            pos:   frame.to,
            name:  frame.np,
            model: frame.model,
            x:     this.pos[frame.to].x,
            y:     this.pos[frame.to].y
          });
        }
        frame.done = true;
      }, this);
    this.setup = _.chain(_.range(this.setup.length))
      .filter(function(ix) {
        return _.indexOf(captured, ix) < 0;
      })
      .map(function(ix) {
        return this.setup[ix];
      }, this)
      .value();
    if ((len > 0) && (this.changes.length == 0)) {
      isValid = true;
      if (this.controller) {
        this.controller.done();
      }
      if (deferred.length > 0) {
        deferred = _.map(deferred, function(pos) {
          return posToIx(this, pos);
        }, this);
        this.setup = _.chain(_.range(this.setup.length))
          .filter(function(ix) {
            return _.indexOf(deferred, ix) < 0;
          })
          .map(function(ix) {
            return this.setup[ix];
          }, this)
          .value();
        deferred = [];
      }
    }
  }

  showDrops(ctx) {
    if (this.drops.length > 0) {
      ctx.save();
      ctx.globalAlpha = Dagaz.View.DROPS_ALPHA;
      _.each(this.drops, function(f) {
        var dx = (f.position.dx - f.piece.dx) / 2 | 0;
        var dy = (f.position.dy - f.piece.dy) / 2 | 0;
        ctx.drawImage(f.piece.h, f.position.x + dx, f.position.y + dy, f.piece.dx, f.piece.dy);
      });
      ctx.restore();
    }
  }

  reInit(board) {
    board.setup(this, false);
    this.invalidate();
  }

  configure() {
    if (!isConfigured) {
      Dagaz.View.configure(this);
      if (this.controller) {
        var board = this.controller.getBoard();
        board.setup(this, true);
        this.controller.done();
      }
      isConfigured = true;
    }
  }

  draw(canvas) {
    this.configure();
    if (this.allResLoaded() && !isValid) {
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      _.each(this.back, function(b) {
        if (!_.isUndefined(b.t)) {
          var board = Dagaz.Controller.app.board;
          if (_.indexOf(b.t, board.turn) < 0) return;
        }
        ctx.drawImage(b.h, b.x, b.y);
      });
      if (!_.isUndefined(Dagaz.View.showBoard)) {
        var board = this.controller.getBoard();
        Dagaz.View.showBoard(board, ctx);
      }
      _.chain(_.range(this.setup.length))
        .sortBy(function(ix) {
          var piece = this.setup[ix];
          var order = piece.pos;
          if (piece.z > 0) {
            order += this.pos.length;
          }
          return order;
        }, this)
        .map(function(ix) {
          return this.setup[ix];
        }, this)
        .each(function(p) {
          var x = p.x; var y = p.y;
          var pos = this.pos[p.pos];
          var piece = this.piece[p.name];
          if (piece) {
            x += (pos.dx - piece.dx) / 2 | 0;
            y += (pos.dy - piece.dy) / 2 | 0;
            Dagaz.View.showPiece(this, ctx, pos, p.pos, piece, p.model, x, y, p);
          }
        }, this);
      blink += 2;
      if (blink >= Dagaz.View.blink.length) {
        blink = 0;
      }
      this.drawKo(ctx);
      Dagaz.View.showMarks(this, ctx);
      this.showDrops(ctx);
      this.animate();
    }
  }

  debug(text) {
    PieceInfoText.innerHTML = text;
    PieceInfo.style.display = "inline";
  }

  init(canvas, controller) {
    self = this;
    canvas.onmousemove = mouseMove;
    canvas.onmouseup   = mouseUp;
    canvas.onmousedown = mouseDown;
    if ('onwheel' in document) {
      document.addEventListener('wheel', mouseWheel, { passive: false });
    } else if ('onmousewheel' in document) {
      document.addEventListener('mousewheel', mouseWheel, { passive: false });
    } else {
      document.MozMousePixelScroll = mouseWheel;
    }
    this.controller = controller;
  }
}