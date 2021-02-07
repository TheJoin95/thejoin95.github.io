<template>
  <section class="navigation">
    <div id="nav" class="static h-full w-full">
      <div class="hidden md:block absolute say-hi tracking-wider">
        <router-link to="/">
          <img class="mr-1 align-top inline-block w-6 m-w-full" src="/images/icon.png" />
        </router-link>
        <a href="#" @click="copyEmailToClipboard">Say Hi.</a>
      </div>
      <div class="absolute hamburger cursor-pointer">
        <svg class="w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round"
            stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </div>
      <div class="hidden md:block absolute whoami tracking-wider">
        <router-link to="/about">WhoAmI</router-link>
      </div>
      <div class="hidden md:block absolute writing tracking-wider">
        <router-link to="/blog">Writing</router-link>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Navigation',
  methods: {
    copyEmailToClipboard(e) {
      e.preventDefault();
      const dummy = document.createElement('textarea');
      document.body.appendChild(dummy);
      dummy.value = 'miki.lombi@gmail.com';
      dummy.select();
      document.execCommand('copy');
      document.body.removeChild(dummy);
      // @todo - Tooltip di conferma
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.navigation {
  font-weight: bold;

  .hamburger {
    top: 1.5rem;
    right: 2.5rem;
  }

  .say-hi {
    top: 1.5rem;
    left: 2.5rem;
  }

  .whoami {
    right: 2.5rem;
    bottom: 1.5rem;
  }

  .writing {
    left: 2.5rem;
    bottom: 1.5rem;
  }
}

</style>
