import type { Book, ReadingStatus } from '../data/bookshelf.ts';

const SHELF_ORDER: ReadingStatus[] = ['reading', 'next', 'finished'];

function pick(log: Book[], status: ReadingStatus): Book | undefined {
  const matches = log.filter((book) => book.status === status);
  // The queue starts at the oldest "next"; for the others, the most recent entry wins.
  return status === 'next' ? matches[0] : matches.at(-1);
}

export function shelfFrom(log: Book[]): Book[] {
  return SHELF_ORDER.map((status) => pick(log, status)).filter(
    (book): book is Book => book !== undefined,
  );
}
