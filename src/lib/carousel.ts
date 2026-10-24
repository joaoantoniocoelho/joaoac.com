export function carouselStep(itemWidth: number, gap: number): number {
  return Math.max(0, itemWidth + gap);
}

export function carouselEdges(scrollLeft: number, scrollWidth: number, clientWidth: number) {
  const maxScroll = Math.max(0, scrollWidth - clientWidth);
  return {
    atStart: scrollLeft <= 1,
    atEnd: scrollLeft >= maxScroll - 1,
  };
}
