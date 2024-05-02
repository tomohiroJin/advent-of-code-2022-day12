import { bowlingGame } from ".";

describe("1 投で 0 ～ 10 のピンを倒すことができる", () => {
  test("0 投した結果をスコアとして表示できる", () => {
    const [_, score] = bowlingGame();
    expect(score()).toBe(0);
  });

  test("1 投した結果をスコアとして表示できる", () => {
    const [roll, score] = bowlingGame();
    roll(1);
    expect(score()).toBe(1);
  });

  test("-1 本のピンを倒した場合はエラーを発生させてスコアをゲームオーバーとする", () => {
    const [roll, score] = bowlingGame();
    roll(-1);
    expect(score()).toBe("Game Over");
  });

  test("11 本のピンを倒した場合はエラーを発生させてスコアをゲームオーバーとする", () => {
    const [roll, score] = bowlingGame();
    roll(11);
    expect(score()).toBe("Game Over");
  });
});

describe("2 投で 1 フレームとしてスコアを計算できる", () => {
  test("2 投で 1 フレームとしてピンの合計値に加算される", () => {
    const [roll, score] = bowlingGame();
    roll(1);
    roll(2);
    expect(score()).toBe(3);
  });

  test("2 投目に 10 本倒してスペアとなった場合 3 投目に倒したスコアは倍になる", () => {
    const [roll, score] = bowlingGame();
    roll(0);
    roll(10);
    roll(5);
    roll(1);
    expect(score()).toBe(21);
  });

  test("1 投目に 10 本倒すとストライクとして 2 投目と 3 投目のスコアがプラスされる", () => {
    const [roll, score] = bowlingGame();
    roll(10);
    roll(5);
    roll(2);
    expect(score()).toBe(24);
  });

  test("3 投連続でストライクの場合はターキーとして 60 点になる", () => {
    const [roll, score] = bowlingGame();
    roll(10);
    roll(10);
    roll(10);
    expect(score()).toBe(60);
  });

  test("2 投で 10 本の以上ピンを倒した場合はスコアをゲームオーバーとする", () => {
    const [roll, score] = bowlingGame();
    roll(1);
    roll(2);
    roll(5);
    roll(6);
    expect(score()).toBe("Game Over");
  });
});

describe("10 フレーム目の特殊ルールが処理できる", () => {
  test("10 フレーム終了すると総得点とゲーム終了をしらせる", () => {
    const [roll, score] = bowlingGame();
    Array(20)
      .fill(0)
      .forEach((val) => roll(val));
    expect(score()).toBe("Final Frame Complete! Total Score: 0");
  });

  test("10 フレーム目にスペア後の追加投球が正しく計算される", () => {
    const [roll, score] = bowlingGame();
    Array(18)
      .fill(0)
      .forEach((val) => roll(val));
    roll(5);
    roll(5);
    roll(1);
    expect(score()).toBe("Final Frame Complete! Total Score: 11");
  });

  test("10 フレーム目にストライク後の追加投球 2 回が正しく計算される", () => {
    const [roll, score] = bowlingGame();
    Array(18)
      .fill(0)
      .forEach((val) => roll(val));
    roll(10);
    roll(5);
    roll(5);
    expect(score()).toBe("Final Frame Complete! Total Score: 20");
  });

  test("10 フレーム目を超えるとゲームは終了しているのでゲームオーバーとする", () => {
    const [roll, score] = bowlingGame();
    Array(20)
      .fill(0)
      .forEach((val) => roll(val));
    roll(10);
    expect(score()).toBe("Game Over");
  });
});

test("全てストライクでフィニッシュした場合スコア 300 点になる", () => {
  const [roll, score] = bowlingGame();
  Array(12)
    .fill(10)
    .forEach((val) => roll(val));
  expect(score()).toBe("Final Frame Complete! Total Score: 300");
});

test("全てスペアでフィニッシュした場合スコア 150 点になる", () => {
  const [roll, score] = bowlingGame();
  Array(21)
    .fill(5)
    .forEach((val) => roll(val));
  expect(score()).toBe("Final Frame Complete! Total Score: 150");
});

test("全て 1 ピンでフィニッシュした場合スコア 20 点になる", () => {
  const [roll, score] = bowlingGame();
  Array(20)
    .fill(1)
    .forEach((val) => roll(val));
  expect(score()).toBe("Final Frame Complete! Total Score: 20");
});

test("全てガーターでフィニッシュした場合スコア 0 点になる", () => {
  const [roll, score] = bowlingGame();
  Array(20)
    .fill(0)
    .forEach((val) => roll(val));
  expect(score()).toBe("Final Frame Complete! Total Score: 0");
});

describe("色々なケースを追加", () => {
  test("ストライク後にスペアが来た場合のスコア計算", () => {
    const [roll, score] = bowlingGame();
    roll(10);
    roll(5);
    roll(5);
    roll(3);
    expect(score()).toBe(36);
  });

  test("連続3ストライク後にスペアが来た場合のスコア計算", () => {
    const [roll, score] = bowlingGame();
    roll(10);
    roll(10);
    roll(10);
    roll(5);
    roll(5);
    roll(3);
    expect(score()).toBe(91);
  });

  test("スペア時のスコア計算", () => {
    const [roll, score] = bowlingGame();
    roll(9);
    roll(1);
    roll(3);
    expect(score()).toBe(16);
  });

  test("最終フレームで連続ストライク後にガーターが正確に計算される", () => {
    const [roll, score] = bowlingGame();
    Array(18).fill(0).forEach(roll);
    roll(10);
    roll(10);
    roll(0);
    expect(score()).toBe("Final Frame Complete! Total Score: 20");
  });

  test("スペア後のストライクとその次の投球が正確に計算される", () => {
    const [roll, score] = bowlingGame();
    roll(5);
    roll(5);
    roll(10);
    roll(3);
    roll(4);
    expect(score()).toBe(44);
  });

  test("ストライク後に9ピン倒して次に1ピンでスペアを完成させた場合の計算", () => {
    const [roll, score] = bowlingGame();
    roll(10);
    roll(9);
    roll(1);
    roll(4);
    expect(score()).toBe(38);
  });
});
