export type Queue<T> = {
  enqueue: (item: T) => void;
  dequeue: () => T | undefined;
  isEmpty: () => boolean;
};

export const createQueue = <T>(): Queue<T> => {
  const data: T[] = [];
  let head = 0;
  let tail = 0;

  const enqueue = (item: T): void => {
    data[tail] = item;
    tail++;
  };

  const dequeue = (): T | undefined => {
    if (head < tail) {
      const item = data[head];
      head++;
      if (head === tail) {
        head = 0;
        tail = 0;
      }
      return item;
    }
    return undefined;
  };

  const isEmpty = (): boolean => {
    return head === tail;
  };

  return {
    enqueue,
    dequeue,
    isEmpty,
  };
};
