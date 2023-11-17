import {
  calculateTotalSizeOfSmallDirectories,
  calculateTotalSizesByDirectory,
  changeDirectory,
  createDirectoryFromString,
  createFileFromString,
  parseCommandOutputToFileList,
} from ".";

const sampleCommands = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

describe("changeDirectory", () => {
  test("$ cd / でルートディレクトリに移動することができる", () => {
    expect(changeDirectory("/", "$ cd /")).toBe("/");
    expect(changeDirectory("/dir1", "$ cd /")).toBe("/");
    expect(changeDirectory("/dir1/dir2", "$ cd /")).toBe("/");
  });

  test("$ cd ディレクトリ名で現在のディレクトリを移動することができる", () => {
    expect(changeDirectory("/", "$ cd dir1")).toBe("/dir1");
    expect(changeDirectory("/dir1", "$ cd dir2")).toBe("/dir1/dir2");
  });

  test("$ cd .. でひとつ前のディレクトリに移動することができる", () => {
    expect(changeDirectory("/dir1/dir2", "$ cd ..")).toBe("/dir1");
    expect(changeDirectory("/dir1", "$ cd ..")).toBe("/");
  });
});

test("ファイルをサイズとファイル名に分けて保持できる", () => {
  expect(createFileFromString("/", "14848514 b.txt")).toEqual({
    size: 14848514,
    name: "/b.txt",
    type: "File",
  });
  expect(createFileFromString("/a", "8504156 c.dat")).toEqual({
    size: 8504156,
    name: "/a/c.dat",
    type: "File",
  });
});

test("dir から始まる場合はディレクトリとして保持できる", () => {
  expect(createDirectoryFromString("/", "dir a")).toEqual({
    name: "/a",
    type: "Directory",
    size: 0,
  });
  9;
  expect(createDirectoryFromString("/a", "dir e")).toEqual({
    name: "/a/e",
    type: "Directory",
    size: 0,
  });
});

test("コマンドを読み込んでファイルの一覧に変換する", () => {
  const actual = parseCommandOutputToFileList(sampleCommands);
  expect(actual).toEqual([
    {
      name: "/",
      type: "Directory",
      size: 0,
    },
    {
      name: "/a",
      type: "Directory",
      size: 0,
    },
    {
      size: 14848514,
      name: "/b.txt",
      type: "File",
    },
    {
      size: 8504156,
      name: "/c.dat",
      type: "File",
    },
    {
      name: "/d",
      type: "Directory",
      size: 0,
    },
    {
      name: "/a/e",
      type: "Directory",
      size: 0,
    },
    {
      size: 29116,
      name: "/a/f",
      type: "File",
    },
    {
      size: 2557,
      name: "/a/g",
      type: "File",
    },
    {
      size: 62596,
      name: "/a/h.lst",
      type: "File",
    },
    {
      size: 584,
      name: "/a/e/i",
      type: "File",
    },
    {
      size: 4060174,
      name: "/d/j",
      type: "File",
    },
    {
      size: 8033020,
      name: "/d/d.log",
      type: "File",
    },
    {
      size: 5626152,
      name: "/d/d.ext",
      type: "File",
    },
    {
      size: 7214296,
      name: "/d/k",
      type: "File",
    },
  ]);
});

test("それぞれのディレクトリ内のファイル合計値を算出することができる", () => {
  const actual = calculateTotalSizesByDirectory([
    {
      name: "/",
      type: "Directory",
      size: 0,
    },
    {
      name: "/a",
      type: "Directory",
      size: 0,
    },
    {
      size: 14848514,
      name: "/b.txt",
      type: "File",
    },
    {
      size: 8504156,
      name: "/c.dat",
      type: "File",
    },
    {
      name: "/d",
      type: "Directory",
      size: 0,
    },
    {
      name: "/a/e",
      type: "Directory",
      size: 0,
    },
    {
      size: 29116,
      name: "/a/f",
      type: "File",
    },
    {
      size: 2557,
      name: "/a/g",
      type: "File",
    },
    {
      size: 62596,
      name: "/a/h.lst",
      type: "File",
    },
    {
      size: 584,
      name: "/a/e/i",
      type: "File",
    },
    {
      size: 4060174,
      name: "/d/j",
      type: "File",
    },
    {
      size: 8033020,
      name: "/d/d.log",
      type: "File",
    },
    {
      size: 5626152,
      name: "/d/d.ext",
      type: "File",
    },
    {
      size: 7214296,
      name: "/d/k",
      type: "File",
    },
  ]);
  expect(actual).toEqual([
    { directory: "/", totalSize: 48381165 },
    { directory: "/a", totalSize: 94853 },
    { directory: "/d", totalSize: 24933642 },
    { directory: "/a/e", totalSize: 584 },
  ]);
});
test("合計サイズが最大100000以下のすべてのディレクトリの合計値を返す", () => {
  const actual = calculateTotalSizeOfSmallDirectories(sampleCommands);
  expect(actual).toBe(95437);
});
