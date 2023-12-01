export const findFirstUniqueQuad = (message: string): string =>
  message.length < 4
    ? ""
    : new Set(message.slice(0, 4).split("")).size === 4
    ? message.slice(0, 4)
    : findFirstUniqueQuad(message.slice(1));

export const findEndOfFirstUniqueQuad = (message: string): number =>
  message.indexOf(findFirstUniqueQuad(message)) + 4;
