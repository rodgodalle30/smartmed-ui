function checkMarqueeOverflow(el) {
  const parent = el.parentElement;
  if (!parent) return;

  const overflowAmount = el.scrollWidth - parent.clientWidth;

  if (overflowAmount > 2) {
    el.style.setProperty("--marquee-distance", `-${overflowAmount}px`);
    el.classList.add("marquee-active");
  } else {
    el.classList.remove("marquee-active");
    el.style.removeProperty("--marquee-distance");
  }
}

export const vMarquee = {
  mounted(el) {
    checkMarqueeOverflow(el);
    const ro = new ResizeObserver(() => checkMarqueeOverflow(el));
    ro.observe(el.parentElement);
    el._marqueeRO = ro;
  },
  updated(el) {
    checkMarqueeOverflow(el);
  },
  unmounted(el) {
    el._marqueeRO?.disconnect();
  },
};
