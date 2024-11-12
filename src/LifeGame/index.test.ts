import {
  ALIVE,
  applyGenerations,
  countAliveNeighbors,
  createGrid,
  DEAD,
  getNextCellState,
  getNextGeneration,
  isCellAlive,
} from ".";

describe("ライフゲーム", () => {
  describe("セルの状態確認", () => {
    it("セルの状態が生(alive)の場合 True が返る", () => {
      expect(isCellAlive(ALIVE)).toBeTruthy();
    });

    it("セルの状態が死(dead)の場合 false が返る", () => {
      expect(isCellAlive(DEAD)).toBeFalsy();
    });
  });

  describe("幅と高さを指定して格子を作成できる", () => {
    it("4 x 4 の格子を作成し全てに死んだセルを配置できる", () => {
      const actual = createGrid(4, 4);
      expect(actual).toEqual([
        [DEAD, DEAD, DEAD, DEAD],
        [DEAD, DEAD, DEAD, DEAD],
        [DEAD, DEAD, DEAD, DEAD],
        [DEAD, DEAD, DEAD, DEAD],
      ]);
    });

    it("6 x 4 の格子を作成し全てに死んだセルを配置できる", () => {
      const actual = createGrid(6, 4);
      expect(actual).toEqual([
        [DEAD, DEAD, DEAD, DEAD, DEAD, DEAD],
        [DEAD, DEAD, DEAD, DEAD, DEAD, DEAD],
        [DEAD, DEAD, DEAD, DEAD, DEAD, DEAD],
        [DEAD, DEAD, DEAD, DEAD, DEAD, DEAD],
      ]);
    });
  });

  describe("誕生", () => {
    it("3つ生きているセルが隣接する場合にセルは次の世代に生になる", () => {
      const cells = [
        [ALIVE, ALIVE, ALIVE],
        [DEAD, DEAD, DEAD],
      ];
      const actual = getNextGeneration(cells);
      expect(actual[1][1]).toBe(ALIVE);
    });
  });

  describe("生存", () => {
    it("生きているセルに隣接する生きたセルが2つならば、次の世代でも生存する。", () => {
      const cells = [
        [DEAD, ALIVE, DEAD],
        [ALIVE, DEAD, ALIVE],
      ];
      const actual = getNextGeneration(cells);
      expect(actual[0][1]).toBe(ALIVE);
    });

    it("生きているセルに隣接する生きたセルが3つならば、次の世代でも生存する。", () => {
      const cells = [
        [DEAD, ALIVE, DEAD],
        [ALIVE, ALIVE, ALIVE],
      ];
      const actual = getNextGeneration(cells);
      expect(actual[1][1]).toBe(ALIVE);
    });
  });

  describe("過疎", () => {
    it("生きているセルに隣接する生きたセルが0つならば、過疎により死滅する。", () => {
      const cells = [
        [DEAD, DEAD, DEAD],
        [DEAD, ALIVE, DEAD],
      ];
      const actual = getNextGeneration(cells);
      expect(actual[1][1]).toBe(DEAD);
    });

    it("生きているセルに隣接する生きたセルが1つならば、過疎により死滅する。", () => {
      const cells = [
        [DEAD, DEAD, DEAD],
        [DEAD, ALIVE, ALIVE],
      ];
      const actual = getNextGeneration(cells);
      expect(actual[1][1]).toBe(DEAD);
    });
  });

  describe("過密", () => {
    it("生きているセルに隣接する生きたセルが4つ以上ならば、過密により死滅する。", () => {
      const cells = [
        [ALIVE, ALIVE, ALIVE],
        [ALIVE, ALIVE, ALIVE],
      ];
      const actual = getNextGeneration(cells);
      expect(actual[1][1]).toBe(DEAD);
    });
  });

  describe("次の世代に移行", () => {
    const grid = createGrid(3, 3).map((rowCells) => [
      rowCells[0],
      ALIVE,
      rowCells[2],
    ]);

    describe("隣接する生きているセルの数を数える", () => {
      it("3x3の中央セルの周囲に生きたセルが2つある場合", () => {
        const grid = [
          [DEAD, ALIVE, DEAD],
          [DEAD, DEAD, ALIVE],
          [DEAD, DEAD, DEAD],
        ];
        const actual = countAliveNeighbors(grid, 1, 1);
        expect(actual).toBe(2);
      });

      it("3x3の中央セルの周囲に生きたセルが8つある場合", () => {
        const grid = [
          [ALIVE, ALIVE, ALIVE],
          [ALIVE, DEAD, ALIVE],
          [ALIVE, ALIVE, ALIVE],
        ];
        const actual = countAliveNeighbors(grid, 1, 1);
        expect(actual).toBe(8);
      });

      it("3x3の中央セルの周囲に生きたセルが0個ある場合", () => {
        const grid = [
          [DEAD, DEAD, DEAD],
          [DEAD, DEAD, DEAD],
          [DEAD, DEAD, DEAD],
        ];
        const actual = countAliveNeighbors(grid, 1, 1);
        expect(actual).toBe(0);
      });

      it("端のセルの隣接セルの数が制限されている場合", () => {
        const grid = [
          [ALIVE, DEAD, DEAD],
          [DEAD, DEAD, DEAD],
          [DEAD, DEAD, ALIVE],
        ];
        const actual = countAliveNeighbors(grid, 0, 0);
        expect(actual).toBe(0);
      });
    });

    describe("次の世代のセルの生死を取得", () => {
      it("生きたセルが隣接する生きたセル2つで生存する", () => {
        const currentState = ALIVE;
        const actual = getNextCellState(currentState, 2);
        expect(actual).toBe(ALIVE); // 期待: 生きたまま
      });

      it("生きたセルが隣接する生きたセル3つで生存する", () => {
        const currentState = ALIVE;
        const actual = getNextCellState(currentState, 3);
        expect(actual).toBe(ALIVE); // 期待: 生きたまま
      });

      it("生きたセルが隣接する生きたセルが1つ以下で死滅する", () => {
        const currentState = ALIVE;
        const actual = getNextCellState(currentState, 1);
        expect(actual).toBe(DEAD); // 期待: 過疎による死滅
      });

      it("生きたセルが隣接する生きたセルが4つ以上で死滅する", () => {
        const currentState = ALIVE;
        const actual = getNextCellState(currentState, 4);
        expect(actual).toBe(DEAD); // 期待: 過密による死滅
      });

      it("死んでいるセルが隣接する生きたセルが3つで再生する", () => {
        const currentState = DEAD;
        const actual = getNextCellState(currentState, 3);
        expect(actual).toBe(ALIVE); // 期待: 死から生へ
      });

      it("死んでいるセルが隣接する生きたセルが3つ以外では死んだまま", () => {
        const currentState = DEAD;
        const actual = getNextCellState(currentState, 2);
        expect(actual).toBe(DEAD); // 期待: 死んだまま
      });
    });

    it("次の世代に移行して、横の真ん中3つが生になり縦の中心以外死に代わる", () => {
      const actual = getNextGeneration(grid);
      expect(actual).toEqual([
        [DEAD, DEAD, DEAD],
        [ALIVE, ALIVE, ALIVE],
        [DEAD, DEAD, DEAD],
      ]);
    });

    it("繰り返し実行すると縦と横の真ん中が入れ替わること", () => {
      const actual = applyGenerations(grid, 3);
      expect(actual).toEqual([
        [DEAD, DEAD, DEAD],
        [ALIVE, ALIVE, ALIVE],
        [DEAD, DEAD, DEAD],
      ]);
    });

    it("全てのセルが死の場合次の世代も全て死のままであること", () => {
      const actual = getNextGeneration(createGrid(3, 3));
      expect(actual).toEqual([
        [DEAD, DEAD, DEAD],
        [DEAD, DEAD, DEAD],
        [DEAD, DEAD, DEAD],
      ]);
    });
  });
});
