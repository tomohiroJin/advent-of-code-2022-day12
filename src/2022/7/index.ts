const PATH_SEPARATOR = "/" as const;
const FileType = {
  File: "File",
  Directory: "Directory",
} as const;

type FileType = (typeof FileType)[keyof typeof FileType];
type Path = string;
type File = { size: number; name: string; type: FileType };
type Directory = {
  directory: string;
  totalSize: number;
};

const joinPathSegments = (currentPath: Path, inputName: string): string =>
  currentPath === PATH_SEPARATOR
    ? `${currentPath}${inputName}`
    : `${currentPath}${PATH_SEPARATOR}${inputName}`;

export const createDirectoryFromString = (
  currentPath: Path,
  inputString: string
): File => {
  const newDirectory = inputString.replace(/^dir /, "");
  return {
    name: joinPathSegments(currentPath, newDirectory),
    type: FileType.Directory,
    size: 0,
  };
};

export const createFileFromString = (
  currentPath: Path,
  inputString: string
): File => {
  const [size, name] = inputString.split(" ");
  return {
    size: Number(size),
    name: joinPathSegments(currentPath, name),
    type: FileType.File,
  };
};

export const changeDirectory = (currentPath: Path, command: string): Path => {
  const newDirectory = command.replace(/^\$ cd /, "");
  if (newDirectory === PATH_SEPARATOR) {
    return PATH_SEPARATOR;
  } else if (newDirectory === "..") {
    return (
      PATH_SEPARATOR +
      currentPath
        .split(PATH_SEPARATOR)
        .filter(Boolean)
        .slice(0, -1)
        .join(PATH_SEPARATOR)
    );
  } else {
    return joinPathSegments(currentPath, newDirectory);
  }
};

export const calculateTotalSizesByDirectory = (files: File[]): Directory[] => {
  const directors = files.filter((file) => file.type === FileType.Directory);
  return directors.map((directory) => {
    const reg = new RegExp(`^${directory.name}`);
    return {
      directory: directory.name,
      totalSize: files
        .filter((file) => file.type === FileType.File && reg.test(file.name))
        .reduce((prev, current) => prev + current.size, 0),
    };
  });
};

export const parseCommandOutputToFileList = (commandOutput: string) => {
  const commands = commandOutput.split("\n");
  let currentPath = "/";
  return commands.reduce<File[]>(
    (files, command) => {
      if (/^\$ cd .*$/.test(command)) {
        currentPath = changeDirectory(currentPath, command);
      } else if (/^\$ ls$/.test(command)) {
      } else if (/^dir .*$/.test(command)) {
        files.push(createDirectoryFromString(currentPath, command));
      } else {
        files.push(createFileFromString(currentPath, command));
      }
      return files;
    },
    [
      {
        name: "/",
        type: "Directory",
        size: 0,
      },
    ]
  );
};

export const calculateTotalSizeOfSmallDirectories = (commands: string) =>
  calculateTotalSizesByDirectory(parseCommandOutputToFileList(commands))
    .filter((directory) => directory.totalSize <= 100000)
    .reduce((totalSize, directory) => totalSize + directory.totalSize, 0);
