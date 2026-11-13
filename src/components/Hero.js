import { EASE_SPRING } from '../core/Motion.js';

/**
 * Hero composition: wordmark, tagline, lanyard badge and memoji, plus the intro
 * that brings the navigation and hero in once fonts are ready.
 */
export class Hero {
  #introStarted = false;

  constructor({ container, wordmark, tagline, badge, memoji, navTags, hint, arrow, storyButton, languageToggle, motion }) {
    this.container = container;
    this.wordmark = wordmark;
    this.tagline = tagline;
    this.badge = badge;
    this.memoji = memoji;
    this.navTags = navTags;
    this.hint = hint;
    this.arrow = arrow;
    this.storyButton = storyButton;
    this.languageToggle = languageToggle;
    this.motion = motion;
  }

  setOpacity(opacity) {
    const value = opacity.toFixed(3);
    if (value === this.opacity) return;
    this.opacity = value;
    this.container.style.opacity = value;
    this.container.style.visibility = opacity <= 0 ? 'hidden' : '';
  }

  playIntro() {
    if (this.#introStarted) return;
    this.#introStarted = true;

    requestAnimationFrame(() => {
      const reveal = (element) => element.classList.remove('is-pending');
      if (this.motion.reduced) {
        document.querySelectorAll('.is-pending').forEach(reveal);
        return;
      }

      this.navTags.forEach((tag, index) => {
        reveal(tag);
        this.motion.play(tag, [{ opacity: 0, transform: 'translateY(-40px) rotate(-4deg)' }, { opacity: 1, transform: 'none' }], {
          duration: 700,
          delay: 120 + index * 80,
          easing: EASE_SPRING,
        });
      });

      reveal(this.wordmark);
      this.motion.play(this.wordmark, [
        { opacity: 0, transform: 'translateY(60px)', clipPath: 'inset(100% 0 0 0)' },
        { opacity: 1, transform: 'none', clipPath: 'inset(0 0 0 0)' },
      ], { duration: 1100, delay: 260 });

      reveal(this.tagline);
      this.motion.play(this.tagline, [
        { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
        { opacity: 1, clipPath: 'inset(0 0 0 0)' },
      ], { duration: 900, delay: 1050, easing: 'cubic-bezier(.5,0,.3,1)' });

      this.badge.drop({ delay: 700 });
      this.memoji.enter({ delay: 450 });

      reveal(this.languageToggle);
      this.motion.play(this.languageToggle, [{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: 1500 });

      reveal(this.hint);
      this.motion.play(this.hint, [{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: 1800 });

      reveal(this.storyButton);
      this.motion.play(this.storyButton, [{ opacity: 0, transform: 'translateY(18px) scale(.9)' }, { opacity: 1, transform: 'none' }], {
        duration: 700,
        delay: 1650,
        easing: EASE_SPRING,
      });

      // The chalk arrow is drawn stroke by stroke, like on a blackboard.
      reveal(this.arrow);
      [...this.arrow.querySelectorAll('path')].forEach((stroke, order) => {
        this.motion.play(stroke, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
          duration: order ? 260 : 700,
          delay: 2300 + order * 720,
          easing: 'ease-in-out',
        });
      });
    });
  }
}
