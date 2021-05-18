class TMoveContext {
    constructor(design, board, pos, piece) {
      this.design  = design;
      this.board   = board;
      this.from    = pos;
      this.pos     = pos;
      this.mode    = null;
      this.parent  = null;
      this.part    = 1;
      this.piece   = piece;
      this.move    = new TMove(this.mode);
      this.succeed = false;
      this.changes = [];
      this.marks   = [];
    }

    copy() {
      var r = new TMoveContext(this.design, this.board, this.pos, this.piece);
      r.parent = this;
      r.part   = this.part + 1;
      r.move   = this.move.copy();
      r.mode   = this.mode;
      return r;
    }

    setPiece(pos, piece) {
      this.changes.push({
         p: pos,
         x: piece
      });
    }

    getPiece(pos) {
      for (var i = 0; i < this.changes.length; i++) {
          if (this.changes[i].p == pos) return this.changes[i].x;
      }
      if (this.parent !== null) {
          return this.parent.getPiece(pos);
      }
      return this.board.getPiece(pos);
    }

    mark() {
      this.marks.push(this.pos);
    }

    back() {
      if (this.marks.length > 0) {
          this.pos = this.marks[this.marks.length - 1];
      }
    }

    pop() {
      if (this.marks.length > 0) {
          this.pos = this.marks.pop();
      }
    }

    take() {
      this.hand = {
         start: this.pos,
         piece: this.board.getPiece(this.pos)
      };
    }

    put() {
      if (!_.isUndefined(this.hand)) {
          this.piece = this.hand.piece;
          this.move.movePiece(this.hand.start, this.pos, this.hand.piece, this.part);
          delete this.hand;
          this.succeed = true;
      }
    }

    getParam(params, ix) {
      if (_.isUndefined(params)) return null;
      if (_.isArray(params)) return params[ix];
      return params;
    }

    go(params, ix) {
      var dir = this.getParam(params, ix);
      if (dir === null) return false;
      var player = this.board.player;
      if (!_.isUndefined(this.hand)) {
          player = this.hand.piece.player;
      }
      var p = this.design.navigate(player, this.pos, dir);
      if (p === null) return false;
      this.pos = p;
      return true;
    }

    opposite(params, ix) {
      var dir = this.getParam(params, ix);
      if (dir === null) return null;
      return this.design.opposite(dir);
    }

    isLastFrom(params, ix) {
      var pos = this.getParam(params, ix);
      if (pos === null) {
          pos = this.pos;
      }
      if ((this.parent !== null) && (this.parent.parent !== null)) {
          if (pos == this.parent.parent.from) return true;
      }
      return this.board.isLastFrom(pos);
    }

    isEmpty() {
      if (games.model.deferredCaptures) {
          for (var i = 0; i < this.move.actions.length; i++) {
               var a = this.move.actions[i];
               if ((a[0] !== null) && (a[1] === null) && (a[0] == this.pos)) return false;
          }
      }
      return this.getPiece(this.pos) === null;
    }

    isEnemy() {
      var piece = this.getPiece(this.pos);
      if (piece === null) return false;
      return piece.player != this.board.player;
    }

    isFriend() {
      var piece = this.getPiece(this.pos);
      if (piece === null) return false;
      return piece.player == this.board.player;
    }

    isPiece(params, ix) {
      var t = this.getParam(params, ix);
      if (t === null) {
          return !this.isEmpty();
      }
      var piece = this.getPiece(this.pos);
      if (piece === null) return false;
      return piece.type == t;
    }

    inZone(params, ix) {
      var zone = this.getParam(params, ix);
      if (zone === null) return null;
      var player = this.board.player;
      if (!_.isUndefined(this.hand)) {
          player = this.hand.piece.player;
      }
      return this.design.inZone(player, this.pos, zone);
    }

    promote(params, ix) {
      if (_.isUndefined(this.hand)) return false;
      var type = this.getParam(params, ix);
      if (type === null) return false;
      this.hand.piece = this.hand.piece.promote(type);
      return true;
    }

    capture() {
      this.setPiece(this.pos, null);
      this.move.capturePiece(this.pos, this.part);
    }

    end(params, ix) {
      var hand = this.hand;
      this.put();
      this.mode = this.getParam(params, ix);
      if (this.succeed) {
          if (this.mode !== null) {
              var ctx = this.copy();
              this.board.forks.push(ctx);
          } else {
              this.board.moves.push(this.move);
          }
      }
      this.move = this.move.clone(this.part);
      this.hand = hand;
    }
  }