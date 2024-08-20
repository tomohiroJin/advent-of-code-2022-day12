import { analyzeMap } from ".";

const reflectionMap = `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`;

describe("Day 14: Parabolic Reflector Dish", () => {
  describe("show", () => {
    it("マップを解析して現在の情報を返す取り込む", () => {
      const { show, map } = analyzeMap(reflectionMap);
      expect(show(map)).toBe(`O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`);
    });
  });

  describe("analyzeMapAttributes", () => {
    it("マップを解析して座標とそれぞれの属性を保持したマップを返す", () => {
      const { analyzeMapAttributes } = analyzeMap(`.#O
O#.`);
      expect(analyzeMapAttributes()).toEqual([
        [
          { x: 0, y: 0, element: "space" },
          { x: 1, y: 0, element: "squareLock" },
          { x: 2, y: 0, element: "circleLock" },
        ],
        [
          { x: 0, y: 1, element: "circleLock" },
          { x: 1, y: 1, element: "squareLock" },
          { x: 2, y: 1, element: "space" },
        ],
      ]);
    });

    it("マップを解析して存在しない値が入っていた場合エラーを返す", () => {
      expect(() => analyzeMap("?")).toThrow(Error);
    });
  });

  describe("レバーを倒すと倒した方向に岩が移動する", () => {
    it("北にレバーを倒すと丸い岩は空きスペースに移動する", () => {
      const { show, operateLever, map } = analyzeMap(`...
O..
OO.
.OO`);
      const actual = operateLever("North", map);
      expect(show(actual)).toBe(`OOO
OO.
...
...`);
    });

    it("北にLiverを倒すと四角い岩までの空きスペースに移動する", () => {
      const { show, operateLever, map } = analyzeMap(`#..
O.#
OO.
..O`);
      const actual = operateLever("North", map);
      expect(show(actual)).toBe(`#O.
O.#
O.O
...`);
    });

    it("岩の位置から南の端までの行数で岩の重さを算出できる", () => {
      const { calculateTotalWeight, map } = analyzeMap(`#..
O.#
OO.
..O`);
      expect(calculateTotalWeight(map)).toBe(8);
    });

    it("北に移動したあとに岩の重さを算出できる", () => {
      const { show, calculateTotalWeight, operateLever, map } =
        analyzeMap(reflectionMap);

      const actual = operateLever("North", map);

      expect(show(actual)).toBe(`OOOO.#.O..
OO..#....#
OO..O##..O
O..#.OO...
........#.
..#....#.#
..O..#.O.O
..O.......
#....###..
#....#....`);
      expect(calculateTotalWeight(actual)).toBe(136);
    });

    it("南にレバーを倒すと丸い岩は空きスペースに移動する", () => {
      const { show, operateLever, map } = analyzeMap(`...
O..
OO.
.OO`);
      const actual = operateLever("South", map);
      expect(show(actual)).toBe(`...
...
OO.
OOO`);
    });

    it("西にレバーを倒すと丸い岩は空きスペースに移動する", () => {
      const { show, operateLever, map } = analyzeMap(`..O
..O
.O.
OO.`);
      const actual = operateLever("West", map);
      expect(show(actual)).toBe(`O..
O..
O..
OO.`);
    });

    it("東にレバーを倒すと丸い岩は空きスペースに移動する", () => {
      const { show, operateLever, map } = analyzeMap(`O..
O..
.OO
.O.`);
      const actual = operateLever("East", map);
      expect(show(actual)).toBe(`..O
..O
.OO
..O`);
    });

    it("北、西、南、東に回転した結果を取得できる", () => {
      const { show, performCycle, analyzeMapAttributes } =
        analyzeMap(reflectionMap);
      performCycle();
      expect(show(analyzeMapAttributes())).toBe(`.....#....
....#...O#
...OO##...
.OO#......
.....OOO#.
.O#...O#.#
....O#....
......OOOO
#...O###..
#..OO#....`);
    });
  });

  describe("周期の取得", () => {
    it("一定の回数を回転させたときに同じ形ができた場合に周期性ができたと判断できる", () => {
      const { performCycle, cycleStartIndex, cycleLength } = analyzeMap(`.O
..`);

      expect(cycleStartIndex()).toBeNull();

      performCycle();
      performCycle();

      expect(cycleStartIndex()).toBe(1);
      expect(cycleLength()).toBe(1);
    });

    it("周期性の回数を確認して重量を算出した結果を確認する", () => {
      const { cycleStartIndex, performCycle, calculateResultAfterCycles } =
        analyzeMap(reflectionMap);

      while (cycleStartIndex() === null) {
        performCycle();
      }

      expect(calculateResultAfterCycles(1e9)).toBe(64);
    });
  });
});
