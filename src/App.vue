<template>
  <div id="app">
    <Lettering />
    <div id="nav">
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
    this.scrambleTextEffect('.text', 'thejoin');
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
