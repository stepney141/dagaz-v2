import _ from 'underscore';
import { Dagaz } from '../dagaz.js';

(function () {
  var STATE = {
    INIT: 0,
    IDLE: 1,
    WAIT: 2,
    BUZY: 3,
    EXEC: 4,
    DONE: 5,
    STOP: 6
  };

  Dagaz.Controller.AI_DELAY = 500;

  var isDrag = false;
  var passForced = 0;
  var once = false;
  var lastPosition = null;
  var determinated = null;
  var dropIndex = 0;
  var onceGameOver = true;

  Dagaz.Controller.newGame = function() {
    if (!_.isUndefined(Dagaz.Controller.clearGame)) {
      Dagaz.Controller.clearGame();
    }
    var str = window.location.toString();
    var result = str.match(/^([^?]+)/);
    if (result) {
      str = result[1];
    }
    window.location = str;
  };

  Dagaz.Controller.passTurn = function() {
    var app = Dagaz.Controller.app;
    if ((app.state == STATE.IDLE) && !_.isUndefined(app.list)) {
      var moves = _.filter(app.board.moves, function(move) {
        return move.isPass();
      });
      if (moves.length < 1) return;
      if (!confirm("Pass turn?")) return;
      app.boardApply(moves[0]);
      app.syncCaptures(moves[0]);
      app.state = STATE.IDLE;
      delete app.list;
      app.view.clearDrops();
      lastPosition = null;
      if (_.isUndefined(Dagaz.Model.getMarked)) {
        app.view.markPositions(Dagaz.View.markType.ATTACKING, []);
      }
      app.view.markPositions(Dagaz.View.markType.CURRENT, []);
      app.view.markPositions(Dagaz.View.markType.TARGET, []);
    }
  };

  var gameOver = function(text, self, player) {
    if (!Dagaz.Model.silent || (player != 0)) {
      if (!_.isUndefined(Dagaz.Controller.clearGame)) {
        Dagaz.Controller.clearGame();
      }
      alert(text);
    }
    if (Dagaz.Model.progressive) {
      if (Dagaz.Model.silent && (player != 0)) return;
      if (Dagaz.Controller.loseRefresh && (player < 0)) {
        window.location = window.location.toString();
        return;
      }
      if (Dagaz.Model.progressiveUrl !== null) {
        window.location = Dagaz.Model.progressiveUrl;
        return;
      }
      var str = Dagaz.Model.continue(self.design, self.board, window.location.toString());
      if (str !== null) {
        window.location = str;
      }
    }
  };

  Dagaz.Controller.createApp = function(canvas) {
    if (_.isUndefined(Dagaz.Controller.app)) {
      Dagaz.Controller.app = new App(canvas);
    }
    return Dagaz.Controller.app;
  };

  var sendStat = function(goal, player) {
    if (player != 1) {
      
      goal = -goal;
    }
  };

  Dagaz.Model.InitGame();
  Dagaz.Controller.app = Dagaz.Controller.createApp(Canvas);

  if (!_.isUndefined(Dagaz.Controller.getSessionManager)) {
    Dagaz.Controller.getSessionManager(Dagaz.Controller.app);
  }
  if (!_.isUndefined(Dagaz.Controller.play)) {
    Dagaz.Controller.play(Dagaz.Sounds.start);
  }

  Dagaz.Controller.app.view.init(Dagaz.Controller.app.canvas, Dagaz.Controller.app);

  Dagaz.Controller.app.run();
})();
