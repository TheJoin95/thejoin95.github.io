<template>
    <div class="lettering content">
        <div class="slideshow">
        <div class="slide slide--current">
            <h2 class="word word--1">thejoin</h2>
        </div>
        </div>
    </div>
</template>

<script>
import anime from 'animejs';
// import TextScramble from '../lib/TextScramble';
import Word from '../lib/WordFx';

export default {
  name: 'Lettering',
  methods: {
    randomBetween(minValue, maxValue, precision) {
      let effectivePrecision = precision;
      if (typeof (precision) === 'undefined') {
        effectivePrecision = 2;
      }
      return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)), maxValue)
        .toFixed(effectivePrecision));
    },
    typeEffect() {
      const effects = [
        {
          options: {
            shapeColors: ['red', '#000', '#fff'],
            shapeFill: false,
            shapeStrokeWidth: 10,
          },
          hide: {
            shapesAnimationOpts: {
              duration: 250,
              delay: (t, i) => i * 20,
              easing: 'easeOutExpo',
              translateX: () => [0, anime.random(-200, 200)],
              translateY: () => [0, anime.random(-200, 200)],
              scale: () => [
                this.randomBetween(0.2, 0.6),
                this.randomBetween(0.2, 0.6),
              ],
              rotate: () => [0, anime.random(-16, 16)],
              opacity: [
                {
                  value: 1,
                  duration: 1,
                  easing: 'linear',
                  delay: (t, i) => i * 20,
                },
                {
                  value: 0,
                  duration: 150,
                  delay: 100,
                  easing: 'easeOutQuad',
                },
              ],
            },
          },
          show: {
            lettersAnimationOpts: {
              duration: 400,
              delay: (t, i) => i * 60,
              easing: 'easeOutExpo',
              opacity: {
                value: [0, 1],
                duration: 100,
                easing: 'linear',
              },
              translateY: (t, i) => (i % 2
                ? [anime.random(-350, -300), 0]
                : [anime.random(300, 350), 0]),
            },
            shapesAnimationOpts: {
              duration: 500,
              delay: (t, i) => i * 30,
              easing: 'easeOutExpo',
              translateX: () => [0, anime.random(-200, 200)],
              translateY: () => [0, anime.random(-200, 200)],
              scale: () => [
                this.randomBetween(0.2, 0.6),
                this.randomBetween(0.2, 0.6),
              ],
              rotate: () => [0, anime.random(-16, 16)],
              opacity: [
                { value: 1, duration: 1, easing: 'linear' },
                {
                  value: 0,
                  duration: 350,
                  delay: 150,
                  easing: 'easeOutQuad',
                },
              ],
            },
          },
        },
      ];
      window.word = new Word(
        document.querySelector('.word'),
        effects[0].options,
      );
      window.word.show(effects[0].show).then(() => {
        setTimeout(() => {
          window.word.hide(effects[0].hide).then(() => {
            document.querySelector('.lettering').style.opacity = '-1';
            setTimeout(() => {
              document.querySelector('.lettering').style.display = 'none';
            }, 600);
          });
        }, 500);
      });
    },
  },
  mounted() {
    this.typeEffect();
  },
};
</script>
<style>

.content {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  min-height: 100vh;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background: #2e3440;
  transition: opacity 600ms;
}

/* Slideshow */
.slideshow {
  position: absolute;
  top: 0;
  left: 0;
}

.slide {
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  display: flex;
  align-content: center;
  justify-content: center;
  pointer-events: none;
  opacity: 0;
  z-index: 1;
}

.slide--current {
  opacity: 1;
  pointer-events: auto;
  z-index: 100;
}

/* Word + SVG styles */
.word {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin: 0 0 0.25em 0;
  cursor: default;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  grid-area: title;
  font-size: 10vw;
  font-weight: 400;
}

.word span {
  display: block;
  position: relative;
  flex: none;
  white-space: pre;
}

.word--1 {
  font-weight: 700;
  text-transform: uppercase;
  font-size: 9vw;
  color: #d8dee9;
}

.shapes {
  position: fixed;
  top: 0;
  left: 0;
}

@media screen and (max-width: 40em) {
  .slide .word {
    font-size: 2em;
  }
}
</style>
