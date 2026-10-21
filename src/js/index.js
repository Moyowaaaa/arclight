import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from "splitting";
import { intersectionObserver } from "./useIntersectionObserver";
import { initLogoEyes } from "./logoEyes.js";

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

initLogoEyes();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const flickerLogo = (word) => {
  word.querySelectorAll(".logo-letter").forEach((letter) => {
    letter.style.animation = "none";
    letter.getBoundingClientRect();
    letter.style.animation = `logo-flicker-in-glow ${0.45 + Math.random() * 2.6}s linear both`;
  });
};

document.querySelectorAll(".logo-word").forEach((word) => {
  const letters = word.querySelectorAll(".logo-letter");

  if (reduceMotion) {
    letters.forEach((letter) => {
      letter.style.opacity = "1";
    });
    return;
  }

  letters.forEach((letter) => {
    letter.style.opacity = "0";
  });

  intersectionObserver(word, { threshold: 0.6 }).then(() => flickerLogo(word));
});

const bannerStack = document.querySelector(".banner-stack");

if (bannerStack && !reduceMotion) {
  const [first, second] = bannerStack.querySelectorAll(".banner");

  if (first && second) {
    bannerStack.classList.add("is-stacked");

    const firstBg = first.querySelector(".banner__bg");
    const firstCopy = first.querySelector(".banner__content");
    const secondBg = second.querySelector(".banner__bg");
    const secondCopy = second.querySelector(".banner__content");

    gsap.set(second, { yPercent: 100 });
    gsap.set(secondBg, { scale: 1.12 });
    gsap.set(secondCopy, { y: 48, autoAlpha: 0 });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: bannerStack,
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      .to(firstBg, { scale: 1.08, ease: "none" }, 0)
      .to(firstCopy, { y: -40, autoAlpha: 0, ease: "none" }, 0)
      .to(second, { yPercent: 0, ease: "none" }, 0)
      .to(secondBg, { scale: 1, ease: "none" }, 0)
      .to(secondCopy, { y: 0, autoAlpha: 1, ease: "none" }, 0.2);
  }
}

const navbar = document.querySelector(".navbar");
const footerPanel = document.querySelector(".footer__panel");

if (navbar) {
  const updateNavbar = (scroll = window.scrollY) => {
    navbar.classList.toggle("is-scrolled", scroll > 100);
  };

  updateNavbar();
  lenis.on("scroll", ({ scroll }) => updateNavbar(scroll));
}

if (navbar && footerPanel) {
  const navClearance = () => {
    const root =
      parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    return Math.round(root + navbar.offsetHeight);
  };

  gsap.to(navbar, {
    y: () => -navClearance(),
    autoAlpha: 0,
    ease: "none",
    scrollTrigger: {
      trigger: footerPanel,
      start: "top bottom",
      end: "bottom bottom",
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });
}
