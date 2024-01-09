import { Queue, createQueue } from "./que";

let queue: Queue<number>;

beforeEach(() => {
  queue = createQueue<number>();
});

test("enqueue: アイテムを追加すると、キューにアイテムが格納されること", () => {
  queue.enqueue(1);
  expect(queue.dequeue()).toBe(1);
});

test("dequeue: キューが空でない場合、最初のアイテムを削除し返却すること", () => {
  queue.enqueue(1);
  queue.enqueue(2);
  expect(queue.dequeue()).toBe(1);
  expect(queue.dequeue()).toBe(2);
});

test("dequeue: キューが空の場合、undefined を返却すること", () => {
  expect(queue.dequeue()).toBeUndefined();
});

test("isEmpty: キューが空の場合、true を返却すること", () => {
  expect(queue.isEmpty()).toBe(true);
});

test("isEmpty: キューが空でない場合、false を返却すること", () => {
  queue.enqueue(1);
  expect(queue.isEmpty()).toBe(false);
});
