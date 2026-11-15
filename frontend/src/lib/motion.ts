export const FLUID_EASE = [0.22, 1, 0.36, 1];

export const DURATIONS = {
  micro: 0.15,
  ui: 0.3,
  section: 0.6,
  hero: 1.0,
};

export const STAGGER_DELAY = 0.06;

export const fadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: DURATIONS.section, ease: FLUID_EASE } },
  exit: { opacity: 0, y: -16, transition: { duration: DURATIONS.ui } },
};

export const maskSlideUp = {
  initial: { y: "100%", opacity: 0 },
  animate: (i: number = 0) => ({
    y: "0%",
    opacity: 1,
    transition: {
      duration: DURATIONS.section,
      ease: FLUID_EASE,
      delay: i * STAGGER_DELAY,
    },
  }),
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: STAGGER_DELAY,
    },
  },
};

export const cardHover3D = {
  rest: { rotateX: 0, rotateY: 0, scale: 1 },
  hover: { scale: 1.02, transition: { duration: DURATIONS.ui, ease: FLUID_EASE } },
};

