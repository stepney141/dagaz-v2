export class TMove {
    constructor(mode) {
      this.actions = [];
      this.mode    = mode;
    }

    copy() {
      var r = new TMove(this.mode);
      _.each(this.actions, function(a) {
          r.actions.push(a);
      });
      return r;
    }

    clone(part) {
      var r = new TMove(this.mode);
      _.each(this.actions, function(a) {
          if ((a[0] !== null) && (a[1] !== null) && (a[3] == part)) return;
          r.actions.push(a);
      });
      return r;
    }

    toString(design) {
      var r = ""; var p = null;
      for (var i = 0; i < this.actions.length; i++) {
           var a = this.actions[i];
           if ((a[0] !== null) && (a[1] !== null)) {
               if ((p === null) || (p != a[0])) {
                    if (r != "") r = r + " ";
                    r = r + design.posToString(a[0]);
               }
               r = r + "-" + design.posToString(a[1]);
               p = a[1];
           }
      }
      return r;
    }

    isPass() {
      return this.actions.length == 0;
    }

    isDropMove() {
      if (this.actions.length != 1) return false;
      return (this.actions[0][0] === null) && (this.actions[0][1] !== null) && (this.actions[0][2] !== null);
    }

    isSimpleMove() {
      if (this.actions.length != 1) return false;
      return (this.actions[0][0] !== null) && (this.actions[0][1] !== null);
    }

    movePiece(from, to, piece, part) {
      if (_.isUndefined(part)) part = 1;
      this.actions.push([from, to, piece, part]);
    }

    capturePiece(from, part) {
      if (_.isUndefined(part)) part = 1;
      this.actions.push([from, null, null, part]);
    }

    dropPiece(to, piece, part) {
      if (_.isUndefined(part)) part = 1;
      this.actions.push([null, to, piece, part]);
    }

    applyTo(obj) {
      _.each(this.actions, function(a) {
          if (a[0] !== null) {
              obj.setPiece(a[0], null);
          }
          if ((a[1] !== null) && (a[2] !== null)) {
              obj.setPiece(a[1], a[2]);
          }
          if ((a[0] !== null) && (a[1] !== null) && !_.isUndefined(obj.setLastFrom)) {
              obj.setLastFrom(a[0]);
          }
      });
    }
  }