<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <h1 class="text"></h1>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import TextScramble from '../lib/TextScramble';

export default {
  name: 'Home',
  components: {
    HelloWorld,
  },
  mounted() {
    const phrases = [
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

    next();
  },
};
</script>
<style scoped>

* {
  font-family: 'Ubuntu Mono', monospace;
}
</style>
