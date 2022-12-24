```TypeScript

```

## 現状

- ユーザーはTDesignの内部DSLを使ってゲームのルールを書く
  - z2jによる自動生成を前提としていた都合上、ルールの可読性は必ずしも高くない
- TDesignは内部DSLを実行して記述を解釈し、ゲームに関する情報を自分の中に少しずつ構築していく
- 構築後、TDesign.getInitBoard()でTBoardの初期状態を生成する

```TypeScript
const buildDesign: BuildDesign = (design: TDesign) => {
	design.addDirection( /*... */ );
	design.addPlayer( /*... */ );
	//...
};

const design = new TDesign();
let board = design.getInitBoard(buildDesign, plugins);

board.generateMoves();
board = board.makeMove(board.legalMoves[i])
```

## 理想

- ユーザーはTDesignの内部DSLを使ってゲームのルールを書く
  - ルールは可読性の高い形で書かれている
- ゲームのルールがTGameBuilder(仮称)に渡される
- TGameBuilder(仮称)は、人間にとっては読みにくいがエンジンにとっては高速な中間表現へと動的に変換する

アプローチとしては、「ZRFという可読性の高い外部DSL ==Z2J==> JavaScriptによる中間表現」から「JavaScriptによる可読性の高い内部DSL ==Dagaz内部の変換機構==> JavaScriptによる中間表現」へ移行する感じ
ZRFの排除に伴って、ZRFの抽象性をDagazに内面化させる

```TypeScript
const buildDesign: BuildDesign = (design: TDesign) => {
	design.addDirection( /*... */ );
	design.addPlayer( /*... */ );
	//...
};

const design = new TDesign();
let board = design.getInitBoard(buildDesign, plugins);

board.generateMoves();
board = board.makeMove(board.legalMoves[i])
```