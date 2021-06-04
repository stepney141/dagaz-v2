import _ from 'underscore';
import { Dagaz } from '../../old/dagaz.js';

(function () {
  Dagaz.View.SHIFT_X      = 0;
  Dagaz.View.SHIFT_Y      = 0;

  Dagaz.View.STRIKE_ALPHA = 0.5;
  Dagaz.View.DROPS_ALPHA  = 0.5;

  Dagaz.View.HINT_STEPS   = 1;

  Dagaz.View.TARGET_COLOR = "#00AA00";

  Dagaz.View.markType = {
    TARGET:    0,
    ATTACKING: 1,
    GOAL:      2,
    CURRENT:   3,
    KO:        4
  };

  Dagaz.View.maxSteps = 3;
  Dagaz.View.STEP_CNT = 3;

  var self            = null;
  var isConfigured    = false;
  var isValid         = false;
  var mouseX          = 0;
  var mouseY          = 0;
  var mousePressed    = false;
  var hintedPiece     = null;
  var fromPos         = null;
  var deferred        = [];
  var blink           = 0;

  Dagaz.View.blink = [1, 0, -1, 0];

  Dagaz.View.configure = function(view) {};

  Dagaz.View.getView = function() {
    if (_.isUndefined(Dagaz.View.view)) {
      Dagaz.View.view = new View2D();
    }
    return Dagaz.View.view;
  };

  Dagaz.View.inRect = function(view, pos, x, y) {
    return (x > view.pos[pos].x) &&
             (y > view.pos[pos].y) &&
             (x < view.pos[pos].x + view.pos[pos].dx) &&
             (y < view.pos[pos].y + view.pos[pos].dy);
  };

  Dagaz.View.pointToPieces = function(view, x, y) {
    var list = _.chain(view.setup)
      .map(function(piece) {
        return +piece.pos;
      })
      .filter(function(pos) {
        return Dagaz.View.inRect(view, pos, x, y);
      })
      .sortBy(function(pos) {
        return -pos;
      })
      .value();
  };

  Dagaz.View.pointToPositions = function(view, x, y) {
    return _.chain(_.range(view.pos.length))
      .filter(function(pos) {
        return Dagaz.View.inRect(view, pos, x, y);
      })
      .value();
  };

  var posToIx = function(view, pos) {
    for (var i = 0; i < view.setup.length; i++) {
      if (view.setup[i].pos == pos) {
        return i;
      }
    }
    return null;
  };

  var drawMarks = function(ctx, view, list, color) {
    _.each(list, function(p) {
      var pos = this.pos[p];
      var x = pos.x; var y = pos.y;
      if (pos.dx > 0) {
        x += pos.dx / 2 | 0;
      }
      if (pos.dy > 0) {
        y += pos.dy / 2 | 0;
      }
      var r = pos.dx / 4;
      if (Math.abs(pos.dy - pos.dx) > 10) {
        r = Math.min(pos.dy, pos.dx) / 2;
      }
      if (!_.isUndefined(Dagaz.View.MARK_R)) {
        r = Dagaz.View.MARK_R;
      }
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(x + Dagaz.View.SHIFT_X, y + Dagaz.View.SHIFT_Y, r, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }, view);
  };

  var isCommitted = function(frame) {
    return !_.isUndefined(frame.cnt);
  };

  var isDone = function(frame) {
    return frame.cnt <= 0;
  };

  var isNotNull = function(x) {
    return !_.isUndefined(x) && (x !== null);
  };

  Dagaz.View.showMarks = function(view, ctx) {
    drawMarks(ctx, view, view.target, Dagaz.View.TARGET_COLOR);
    drawMarks(ctx, view, view.goal,   "#FFFF00");
  };

  Dagaz.View.showPiece = function(view, ctx, frame, pos, piece, model, x, y) {
    var isSaved = false;
    var dx = 0;
    var dy = 0;
    if (_.indexOf(view.strike, pos) >= 0) {
      ctx.save();
      ctx.globalAlpha = Dagaz.View.STRIKE_ALPHA;
      isSaved = true;
    }
    if (Dagaz.Model.showBlink && (_.indexOf(view.current, pos) >= 0)) {
      dx = Dagaz.View.blink[blink];
      dy = Dagaz.View.blink[blink + 1];
    }
    ctx.drawImage(piece.h, x + dx, y + dy, piece.dx, piece.dy);
    if (isSaved) {
      ctx.restore();
    }
  };

  Dagaz.View.showHint = function(view) {
    if (Dagaz.Model.showHints) {
      var positions = view.pointToPositions(mouseX, mouseY);
      if (!_.isUndefined(positions) && (positions.length > 0)) {
        var ix  = posToIx(view, positions[0]);
        if (ix !== null) {
          var piece = view.piece[view.setup[ix].name];
          if (hintedPiece !== piece) {
            var text = piece.name;
            if (piece.help) {
              text = piece.help;
            }
            PieceInfoImage.src = piece.h.src;
            PieceInfoText.innerHTML = text;
            PieceInfo.style.display = "inline";
            hintedPiece = piece;
          }
        }
      } else {
        PieceInfo.style.display = "none";
        hintedPiece = null;
      }
    }
  };

  var mouseUpdate = function(event) {
    var canvasRect = Canvas.getBoundingClientRect();
    mouseX = event.clientX - canvasRect.left;
    mouseY = event.clientY - canvasRect.top;
  };

  var mouseMove = function(event) {
    mouseUpdate(event);
    Dagaz.View.showHint(self);
    var pos = self.pointToPositions(mouseX, mouseY);
    if (pos && self.controller) {
      self.controller.mouseLocate(self, pos);
    }
  };

  Dagaz.View.PKM = function(view, positions) {};

  var mouseUp = function(event) { 
    var pos = self.pointToPositions(mouseX, mouseY);
    if (event.button == 2) return;
    if (pos && self.controller) {
      self.controller.mouseUp(self, pos);
    }
    mousePressed = false; 
  };

  var mouseDown = function(event) { 
    if (event.button == 2) return;
    mousePressed = true; 
    var pos = self.pointToPositions(mouseX, mouseY);
    if (pos && self.controller) {
      self.controller.mouseDown(self, pos);
    }
    event.preventDefault(); 
  };

  var mouseWheel = function(event) {
    var delta = event.wheelDelta;
    if (_.isUndefined(event.wheelDelta)) {
      delta = -event.deltaY;
    }
    if (delta > 0) {
      self.controller.mouseWheel(self, -1);
    } else {
      self.controller.mouseWheel(self, 1);
    }
    mouseUpdate(event);
    var pos = self.pointToPositions(mouseX, mouseY);
    if (pos && pos.length > 0) {
      event.preventDefault();
    }
  };

  document.oncontextmenu = function()  { 
    var pos = self.pointToPositions(mouseX, mouseY);
    Dagaz.View.PKM(self, pos);
    return false; 
  };
})();
