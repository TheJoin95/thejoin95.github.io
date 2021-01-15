<template>
  <div id="app">
    <Lettering />
    <div id="nav" class="container mx-auto text-center">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/blog">Blog</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
import TextScramble from './lib/TextScramble';
import Lettering from './components/Lettering.vue';

export default {
  name: 'App',
  components: {
    Lettering,
  },
  watch: {
    $route(to, from) {
      const toName = to.name;
      const fromName = from.name;
      document.querySelector('.lettering .word').innerText = (toName !== 'Home' && toName !== fromName) ? toName : 'thejoin';

      document.querySelector('.lettering').style.opacity = '1';
      document.querySelector('.lettering').style.display = 'block';
      Lettering.methods.typeEffect();
    },
  },
  methods: {
    scrambleTextEffect(selector, text) {
      /* const phrases = [
        'Neo,',
        'sooner or later',
        'you\'re going to realize',
        'just as I did',
        'that there\'s a difference',
        'between knowing the path',
        'and walking the path',
      ];

      const el = document.querySelector('.text');
      const fx = new TextScramble(el);

      let counter = 0;
      const next = () => {
        fx.setText(phrases[counter]).then(() => {
          setTimeout(next, 800);
        });
        counter = (counter + 1) % phrases.length;
      };

      next(); */

      const elements = document.querySelectorAll(selector);
      let textToWrite = text;

      for (let i = 0; i < elements.length; i += 1) {
        const el = elements[i];
        if (el.getAttribute('data-text') !== null) {
          textToWrite = el.getAttribute('data-text');
        } else if (el.innerText !== '') {
          textToWrite = el.innerText;
        }

        const fx = new TextScramble(el);
        fx.setText(textToWrite);
      }
    },
  },
  mounted() {
    Lettering.methods.typeEffect();
    this.scrambleTextEffect('.text', 'thejoin');
  },
};
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
