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

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (faq && !reduceMotion) {
  const title = faq.querySelector(".faq__title");
  const items = faq.querySelectorAll(".faq__item");

  gsap.set(title, { autoAlpha: 0, y: 24 });
  gsap.set(items, { autoAlpha: 0, y: 28 });

  gsap
    .timeline({
      scrollTrigger: {
        trigger: faq,
        start: "top 75%",
        once: true,
      },
    })
    .to(title, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" })
    .to(
      items,
      { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out" },
      "-=0.3",
    );
}

if (!reduceMotion) {
  const reveal = (trigger, parts) => {
    const items = parts.filter(Boolean);
    if (!trigger || !items.length) return;

    gsap.set(items, { autoAlpha: 0, y: 36 });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: "top 85%",
        end: "top 40%",
        scrub: 0.6,
      },
    });

    items.forEach((item, index) => {
      timeline.to(
        item,
        { autoAlpha: 1, y: 0, ease: "none", duration: 0.55 },
        index * 0.2,
      );
    });
  };

  const results = document.querySelector(".results");
  reveal(results, [
    results?.querySelector(".results__title"),
    results?.querySelector(".results__subtitle"),
    results?.querySelector(".results__stage"),
  ]);

  const smile = document.querySelector(".smile");
  reveal(smile, [
    smile?.querySelector(".smile__title"),
    smile?.querySelector(".smile__footer"),
    smile?.querySelector(".smile__photo"),
  ]);

  const stories = document.querySelector(".stories");
  reveal(stories, [
    stories?.querySelector(".stories__title"),
    stories?.querySelector(".stories__text"),
    stories?.querySelector(".stories__viewport"),
  ]);

  const footerPanel = document.querySelector(".footer__panel");
  reveal(footerPanel, [
    footerPanel?.querySelector(".footer__brand"),
    ...Array.from(footerPanel?.querySelectorAll(".footer__group") ?? []),
    footerPanel?.querySelector(".footer__legal"),
  ]);
}

const flickerLogo = (word) => {
  word.querySelectorAll(".logo-letter").forEach((letter) => {
    letter.style.animation = "none";
    letter.getBoundingClientRect();
    letter.style.animation = `logo-flicker-in-glow ${0.45 + Math.random() * 1}s linear both`;
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

const hero = document.querySelector(".hero");

if (hero) {
  const title = hero.querySelector(".hero__title");
  const text = hero.querySelector(".hero__text");
  const actions = hero.querySelector(".hero__actions");
  const bg = hero.querySelector(".hero__bg");

  if (!reduceMotion) {
    gsap.set([title, text, actions], { autoAlpha: 0, y: 28 });
    gsap.set(bg, { scale: 1.18, transformOrigin: "center center" });

    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

    intro
      .to(title, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.2)
      .to(text, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.38)
      .to(actions, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.54);

    intro.eventCallback("onComplete", () => {
      const scroll = {
        trigger: hero,
        start: "top top",
        end: "bottom top",
      };

      gsap.fromTo(
        bg,
        { scale: 1.18 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { ...scroll, scrub: 1.5 },
        },
      );

      gsap.to(title, {
        y: -80,
        ease: "none",
        scrollTrigger: { ...scroll, scrub: 0.6 },
      });
      gsap.to(text, {
        y: -80,
        ease: "none",
        scrollTrigger: { ...scroll, scrub: 1.2 },
      });
      gsap.to(actions, {
        y: -80,
        ease: "none",
        scrollTrigger: { ...scroll, scrub: 1.8 },
      });
    });
  }
}

const compare = document.querySelector(".compare");

if (compare && !reduceMotion) {
  const title = compare.querySelector(".compare__title");
  const lines = compare.querySelectorAll(".compare__col--brand p");
  const upper = compare.querySelector(".compare__arch--upper");
  const lower = compare.querySelector(".compare__arch--lower");

  gsap.set(title, { autoAlpha: 0, y: 24 });
  gsap.set(lines, { autoAlpha: 0, y: 32 });

  gsap
    .timeline({
      scrollTrigger: {
        trigger: compare,
        start: "top 70%",
        once: true,
      },
    })
    .to(title, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" })
    .to(
      lines,
      { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power3.out" },
      "-=0.3",
    );

  if (upper) {
    gsap.set(upper, { rotation: -3.09 });
    gsap.to(upper, {
      y: -48,
      ease: "none",
      scrollTrigger: {
        trigger: compare,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.6,
      },
    });
  }

  if (lower) {
    gsap.to(lower, {
      y: 36,
      ease: "none",
      scrollTrigger: {
        trigger: compare,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.6,
      },
    });
  }
}

const bannerStack = document.querySelector(".banner-stack");

if (bannerStack && !reduceMotion) {
  const [first, second] = bannerStack.querySelectorAll(".banner");

  if (first && second) {
    bannerStack.classList.add("is-stacked");

    const firstBg = first.querySelector(".banner__bg");
    const firstCopy = first.querySelector(".banner__content");
    const secondBg = second.querySelector(".banner__bg");
    const secondShade = second.querySelector(".banner__shade");
    const secondCopy = second.querySelector(".banner__content");

    gsap.set(firstBg, { scale: 1 });
    gsap.set([secondBg, secondShade], { y: () => second.offsetHeight });
    gsap.set(secondCopy, { y: 160, autoAlpha: 0 });

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
      .to(firstBg, { scale: 1.06, ease: "none", duration: 1 }, 0)
      .to([secondBg, secondShade], { y: 0, ease: "none", duration: 1 }, 0)
      .to(firstCopy, { y: -140, autoAlpha: 0, ease: "none", duration: 0.55 }, 0)
      .to(
        secondCopy,
        { y: 0, autoAlpha: 1, ease: "none", duration: 0.55 },
        0.45,
      );
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
