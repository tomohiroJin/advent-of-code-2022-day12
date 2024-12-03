export const getASCIICode = (str: string) => str.charCodeAt(0);

const updateHashValue = (acc: number, str: string) =>
  ((acc + getASCIICode(str)) * 17) % 256;

export const calculateHash = (text: string) =>
  text.split("").reduce(updateHashValue, 0);

export const hashSteps = (stepsText: string) =>
  stepsText.split(",").map(calculateHash);

export const sumHashResults = (hashNumbers: number[]) =>
  hashNumbers.reduce((total, hashNumber) => total + hashNumber, 0);

export const computeTotalHashFromSteps = (stepsText: string) =>
  sumHashResults(hashSteps(stepsText));
