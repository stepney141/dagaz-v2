(function() {

var STATE = {
    IDLE: 1,
    DONE: 2
};

var SERVICE  = "http://192.168.101.137:3000/api/";
var USERNAME = "admin";
var PASSWORD = "admin";
var WAIT_FRAME = 100;

var once = true;
var onceGameOver = true;
var inProgress = false;
var auth = null;
var session = null;
var move = null;
var setup = null;

function App(canvas) {
  this.design = Dagaz.Model.getDesign();
  this.canvas = canvas;
  this.view   = Dagaz.View.getView();
  this.state  = STATE.IDLE;
}

var gameOver = function(text, self, player) {
  if (!Dagaz.Model.silent) {
      alert(text);
  }
}

App.prototype.gameOver = function(text, player) {
  Dagaz.Controller.Done(this.board);
  this.view.markPositions(Dagaz.View.markType.KO, []);
  if (onceGameOver) {
      _.delay(gameOver, 1000, text, this, player);
      onceGameOver = false;
  }
  if (this.board && Dagaz.Model.showLose) {
     var captured = [];
     _.each(this.design.allPositions(), function(pos) {
        var piece = this.board.getPiece(pos);
        if (piece !== null) {
            if ((player == 0) || 
                ((player < 0) && (piece.player == -player)) ||
                ((player > 0) && (piece.player != player))) {
                captured.push(pos);
            }
        }
     }, this);
     this.view.markPositions(Dagaz.View.markType.ATTACKING, captured);
  }
}

Dagaz.Controller.createApp = function(canvas) {
  if (_.isUndefined(Dagaz.Controller.app)) {
      Dagaz.Controller.app = new App(canvas);
  }
  return Dagaz.Controller.app;
}

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
}

App.prototype.done = function() {
  if (this.doneMessage) {
      this.gameOver(this.doneMessage, this.winPlayer);
      delete this.doneMessage;
  }
}

App.prototype.boardApply = function(move) {
   if (!_.isUndefined(Dagaz.Controller.play)) {
        var sound = Dagaz.Sounds.move;
        if (!_.isUndefined(this.move.sound)) {
            sound = this.move.sound;
        }
        Dagaz.Controller.play(sound, this.board.player);
  }
  this.board = this.board.apply(move);
  move.applyAll(this.view);
}

App.prototype.getBoard = function() {
  if (_.isUndefined(this.board)) {
      this.board = Dagaz.Model.getInitBoard();
      Dagaz.Model.Done(this.design, this.board);
  }
  return this.board;
}

var authorize = function() {
  if (auth !== null) return;
  inProgress = true;
  $.ajax({
     url: SERVICE + "auth/login",
     type: "POST",
     data: {username: USERNAME, password: PASSWORD},
     dataType: "json",
     success: function(data) {
         console.log('Auth: Succeed');
         auth = data;
         inProgress = false;
     },
     error: function() {
         alert('Auth: Error!');
     },
     statusCode: {
        401: function() {
             alert('Auth: Bad User!');
        },
        500: function() {
             alert('Auth: Internal Error!');
        }
     }
  });
}

var refresh = function() {
  if (auth === null) return;
  inProgress = true;
  $.ajax({
     url: SERVICE + "auth/refresh",
     type: "GET",
     dataType: "json",
     beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + auth.refresh_token);
     },
     success: function(data) {
         console.log('Refresh: Succeed');
         auth = data;
         inProgress = false;
     },
     error: function() {
         alert('Refresh: Error!');
     },
     statusCode: {
        401: function() {
             auth = null;
             inProgress = false;
             return;
        },
        500: function() {
             alert('Refresh: Internal Error!');
        }
     }
  });
}

var getSid = function() {
  var str = window.location.search.toString();
  var result = str.match(/[?&]sid=([^&]*)/);
  if (result) {
      return result[1];
  } else {
      return "";
  }
}

var getSession = function() {
  if (auth === null) return;
  if (session !== null) return;
  inProgress = true;
  $.ajax({
     url: SERVICE + "session",
     type: "GET",
     dataType: "json",
     beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + auth.access_token);
     },
     success: function(data) {
         if (data.length > 1) {
             var sid = getSid();
             if (sid) {
                 data = _.filter(data, function(s) {
                      return s.id == sid;
                 });
             }
         }
         if (data.length != 1) {
             alert('Sess: No session!');
             return;
         } else if (data.length == 1) {
             session = data[0];
             console.log('Sess: Succeed');
         }
         inProgress = false;
     },
     error: function() {
         alert('Sess: Error!');
     },
     statusCode: {
        401: function() {
             refresh();
        },
        403: function() {
             alert('Sess: Bad User!');
        },
        500: function() {
             alert('Sess: Internal Error!');
        }
     }
  });
}

var getMove = function() {
  if (auth === null) return;
  if (session === null) return;
  if (move !== null) return;
  inProgress = true;
  $.ajax({
     url: SERVICE + "move/unconfirmed/" + session.id,
     type: "GET",
     dataType: "json",
     beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + auth.access_token);
     },
     success: function(data) {
         if (data.length > 0) {
             console.log('Move: Succeed');
             move = data[0];
         }
         inProgress = false;
     },
     error: function() {
         alert('Move: Error!');
     },
     statusCode: {
        401: function() {
             refresh();
        },
        403: function() {
             alert('Move: Bad User!');
        },
        404: function() {
             alert('Move: Bad Session!');
        },
        500: function() {
             alert('Move: Internal Error!');
        }
     }
  });
}

var confirmMove = function() {
  if (auth === null) return;
  if (session === null) return;
  if (move === null) return;
  if (setup === null) return;
  inProgress = true;
  $.ajax({
     url: SERVICE + "move/confirm",
     type: "POST",
     data: {id: move.id, session_id: session.id, setup_str: setup},
     dataType: "json",
     beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + auth.access_token);
     },
     success: function(data) {
         console.log('Confirm: Succeed');
         move = null;
         inProgress = false;
         setup = null;
     },
     error: function() {
         alert('Confirm: Error!');
     },
     statusCode: {
        401: function() {
             refresh();
        },
        403: function() {
             alert('Confirm: Bad User!');
        },
        404: function() {
             alert('Confirm: Bad Move!');
        },
        500: function() {
             alert('Confirm: Internal Error!');
        }
     }
  });
}

var winSession = function(user) {
  if (auth === null) return;
  if (session === null) return;
  inProgress = true;
  $.ajax({
     url: SERVICE + "session/close",
     type: "POST",
     data: {id: session.id, winner: user},
     dataType: "json",
     beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + auth.access_token);
     },
     success: function(data) {
         console.log('Close: Succeed');
         move = null;
         inProgress = false;
     },
     error: function() {
         alert('Close: Error!');
     },
     statusCode: {
        401: function() {
             refresh();
        },
        403: function() {
             alert('Close: Bad User!');
        },
        404: function() {
             alert('Close: Bad Session!');
        },
        500: function() {
             alert('Close: Internal Error!');
        }
     }
  });
}

var loseSession = function(user) {
  if (auth === null) return;
  if (session === null) return;
  inProgress = true;
  $.ajax({
     url: SERVICE + "session/close",
     type: "POST",
     data: {id: session.id, loser: user},
     dataType: "json",
     beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + auth.access_token);
     },
     success: function(data) {
         console.log('Close: Succeed');
         move = null;
         inProgress = false;
     },
     error: function() {
         alert('Close: Error!');
     },
     statusCode: {
        401: function() {
             refresh();
        },
        403: function() {
             alert('Close: Bad User!');
        },
        404: function() {
             alert('Close: Bad Session!');
        },
        500: function() {
             alert('Close: Internal Error!');
        }
     }
  });
}

App.prototype.exec = function() {
  this.view.configure();
  this.view.draw(this.canvas);
  if (this.state == STATE.IDLE) {
      if (inProgress) return;
      if (setup !== null) {
          confirmMove();
          return;
      }
      authorize();
      if (auth === null) return;
      getSession();
      if (session === null) return;
      if (once) {
          if (session.last_setup) {
              var board = this.getBoard();
              Dagaz.Model.setup(this.board, session.last_setup);
              this.view.reInit(this.board);
          }
          once = false;
      }
      getMove();
      if (move === null) return;
      var board = this.getBoard();
      if ((move.time_limit <= 0) && (+move.additional_time + move.time_limit < 0)) {
           console.log("Time limit for user [" + move.user_id + "]");
           loseSession(move.user_id);
           this.gameOver("Lose", board.player);
           return;
      }
      board.generate();
      var moves = _.filter(board.moves, function(m) {
           return m.toString() == move.move_str;
      });
      if (moves.length != 1) {
           console.log("Incorrect move [" + move.move_str + "] from user [" + move.user_id + "]");          
           loseSession(move.user_id);
           this.gameOver("Lose", board.player);
           this.state = STATE.DONE;
           return;
      }
      this.boardApply(moves[0]);
      setup = Dagaz.Model.getSetup(this.design, this.board);
      var g = this.board.checkGoals(this.design, board.player);
      this.board.generate();
      if ((this.board.moves.length == 0) || (g > 0)) {
           console.log("User [" + move.user_id + "] won!");
           winSession(move.user_id);
           this.gameOver("Win", board.player);
           this.state = STATE.DONE;
           return;
      }
      if ((g !== null) && (g < 0)) {
           console.log("User [" + move.user_id + "] lose!");
           loseSession(move.user_id);
           this.gameOver("Lose", board.player);
           this.state = STATE.DONE;
           return;
      }
  }
}

App.prototype.mouseWheel = function(view, delta) {}
App.prototype.mouseLocate = function(view, pos) {}
App.prototype.mouseDown = function(view, pos) {}
App.prototype.mouseUp = function(view, pos) {}

Dagaz.Model.InitGame();
Dagaz.Controller.app = Dagaz.Controller.createApp(Canvas);

App.prototype.run = function() {
  var timestamp = Date.now();
  this.exec();
  var delta = Date.now() - timestamp;
  _.delay(function() {
     Dagaz.Controller.app.run();
  }, (delta > WAIT_FRAME) ? 0 : WAIT_FRAME - delta);
}

Dagaz.Controller.app.view.init(Dagaz.Controller.app.canvas, Dagaz.Controller.app);
Dagaz.Controller.app.run();

})();
