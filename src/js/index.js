import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from "splitting";
import { intersectionObserver } from "./useIntersectionObserver";
gsap.registerPlugin(ScrollTrigger);

let lenis;

lenis = new Lenis({
  lerp: 0.2,
  smoothWheel: true,
});

lenis.on("scroll", () => ScrollTrigger.update());

const scrollFn = (time) => {
  lenis.raf(time);
  requestAnimationFrame(scrollFn);
};

requestAnimationFrame(scrollFn);

var viewport = window.innerWidth;
var mobile = 1023;



const stories = document.querySelector(".stories");

if (stories) {
  const viewport = stories.querySelector(".stories__viewport");
  const track = stories.querySelector(".stories__track");
  const slides = [...track.children];
  let index = 1;

  const layout = () => {
    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const offset =
      (viewport.clientWidth - slideWidth) / 2 - index * (slideWidth + gap);
    track.style.transform = `translate3d(${offset}px, 0, 0)`;
  };

  const go = (direction) => {
    index = (index + direction + slides.length) % slides.length;
    layout();
  };

  stories
    .querySelector(".stories__arrow--prev")
    .addEventListener("click", () => go(-1));
  stories
    .querySelector(".stories__arrow--next")
    .addEventListener("click", () => go(1));

  window.addEventListener("resize", layout);
  layout();
}

const faq = document.querySelector(".faq");

if (faq) {
  const plus = new URL("../assets/images/plus.svg", import.meta.url).href;
  const minus = new URL("../assets/images/minus.svg", import.meta.url).href;

  faq.querySelectorAll(".faq__toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const item = toggle.closest(".faq__item");
      const wasOpen = item.classList.contains("is-open");

      faq.querySelectorAll(".faq__item").forEach((other) => {
        other.classList.remove("is-open");
        const button = other.querySelector(".faq__toggle");
        const icon = button.querySelector("img");
        button.setAttribute("aria-expanded", "false");
        if (icon) icon.src = plus;
      });

      if (!wasOpen) {
        item.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
        const icon = toggle.querySelector("img");
        if (icon) icon.src = minus;
      }
    });
  });
}

const year = document.querySelectorAll("#year");

year.forEach((y) => {
  y.innerHTML = new Date().getFullYear();
});


