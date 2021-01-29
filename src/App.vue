<template>
  <div id="app">
    <Lettering />
    <div id="nav" class="container mx-auto text-center">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">WhoAmI</router-link> |
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
  metaInfo: {
    title: 'A passion driven developer',
    titleTemplate: '%s - Miki Lombardi',
    meta: [{
      vmid: 'description', name: 'description', content: 'Homepage',
    }],
    htmlAttrs: {
      lang: 'en',
      amp: true,
    },
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
  created() {
    let orgTitle = null;
    const exitMessage = 'Hey! Don\'t close me plz';
    document.addEventListener('visibilitychange', () => {
      orgTitle = (document.title !== exitMessage) ? document.title : orgTitle;
      document.title = (document.hidden ? exitMessage : orgTitle);
    });
  },
  mounted() {
    const self = this;
    let scrambleInterval;
    Lettering.methods.typeEffect();
    clearInterval(scrambleInterval);
    scrambleInterval = setInterval(() => {
      self.scrambleTextEffect('.text-scramble', '');
    }, 7500);
  },
};
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
