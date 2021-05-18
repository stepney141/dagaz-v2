class TPiece {
    constructor(type, player) {
      this.type   = type;
      this.player = player;
    }

    toString(design) {
      return design.playerNames[this.player] + " " + design.pieceNames[this.type];
    }

    getValue(ix) {
      if (_.isUndefined(this.values)) return null;
      if (_.isUndefined(this.values[ix])) return null;
      return this.values[ix];
    }

    setValue(ix, value) {
      var v = this.getValue(ix);
      if ((v === null) && (value === null)) return this;
      if ((v !== null) && (value !== null) && (v == value)) return this;
      var r = new TPiece(this.type, this.player);
      if (_.isUndefined(r.values)) {
          r.values = [];
      }
      if (!_.isUndefined(this.values)) {
          _.each(_.keys(this.values), function(i) {
              r.values[i] = this.values[i];
          }, this);
      }
      if (value !== null) {
          r.values[ix] = value;
      } else {
          delete r.values[ix];
      }
      return r;
    }

    promote(type) {
      if (type == this.type) return this;
      return new TPiece(type, this.player);
    }

    changeOwner(player) {
      if (player == this.player) return this;
      return new TPiece(this.type, player);
    }
  }