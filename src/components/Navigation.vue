<template>
  <section class="navigation relative">
    <div role="alert" class="hidden lg:hidden alert-box rounded-full mx-auto z-20 fixed p-2
    bg-indigo-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex">
      <span class="flex rounded-full bg-indigo-500 uppercase px-2 py-1
      text-xs font-bold mr-3">INFO</span>
      <span class="font-semibold mr-2 text-left flex-auto">Email address copied</span>
    </div>
    <div class="navigation-header fixed w-full">
      <div class="hidden md:block absolute say-hi tracking-wider">
        <router-link to="/">
          <img alt="Miki go to Home"
            class="mr-1 align-top inline-block w-6 m-w-full" src="/images/icon.png" />
        </router-link>
        <a href="#" @click="copyEmailToClipboard">Say Hi.</a>
      </div>
      <div @click="toggleMenu" class="absolute hamburger cursor-pointer p-2 rounded-full">
        <svg class="w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round"
            stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </div>
    </div>
    <div class="navigation-footer fixed w-full">
      <div class="hidden md:block absolute whoami tracking-wider">
        <router-link to="/about">WhoAmI</router-link>
      </div>
      <div class="hidden md:block absolute writing tracking-wider">
        <router-link to="/blog">Writing</router-link>
      </div>
    </div>

    <!-- da mettere i social in navigation + off-canvas -->

    <!-- off-canvas menu -->
    <div class="hidden shadow md:shadow-lg w-full md:w-1/3 h-full fixed off-canvas-menu z-10 p-5">
      <div @click="toggleMenu" class="close-header w-full border-opacity-50">
        <svg class="inline w-12 pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round"
          stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span class="text-4xl align-middle pointer">Close</span>
      </div>
      <div class="mb-5 md:mb-10 pb-3 md:pb-5 mobile-content absolute bottom-0 w-full text-3xl">
        <ul>
          <li class="pointer pb-1">
            <router-link @click.native="toggleMenu" to="/">/home</router-link>
          </li>
          <li class="pointer py-1">
            <router-link @click.native="toggleMenu" to="/about">WhoAmI</router-link>
          </li>
          <li class="pointer py-1">
            <router-link @click.native="toggleMenu" to="/blog">Writing</router-link>
          </li>
          <li class="pointer py-1 pointer">Social</li>
          <li class="pointer pt-1" @click="copyEmailToClipboard">Say Hi</li>
        </ul>
      </div>
    </div>
    <!-- end off-canvas menu -->
  </section>
</template>

<script>
export default {
  name: 'Navigation',
  methods: {
    toggleMenu(e) {
      e.preventDefault();
      const offCanvasElement = document.querySelector('.off-canvas-menu');
      offCanvasElement.classList.toggle('hidden');
    },
    copyEmailToClipboard(e) {
      e.preventDefault();
      const dummy = document.createElement('textarea');
      document.body.appendChild(dummy);
      dummy.value = 'miki.lombi@gmail.com';
      dummy.select();
      document.execCommand('copy');
      document.body.removeChild(dummy);

      const alertBox = document.querySelector('.alert-box');
      alertBox.classList.toggle('hidden');
      alertBox.classList.toggle('lg:hidden');

      setTimeout(() => {
        alertBox.classList.toggle('hidden');
        alertBox.classList.toggle('lg:hidden');
      }, 2200);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.navigation {
  font-weight: bold;

  .navigation-header {
    top: 0;
  }

  .navigation-footer {
    bottom: 0;
  }

  .alert-box {
    top: 6em;
    left: 50%;
    margin-left: -117px;
  }

  .hamburger {
    background: $dark-3;
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

  .off-canvas-menu {
    top: 0;
    right: 0;
    background-color: $bg-primary;
    animation: offCanvasAnimIn .6s ease-in-out;

    .close-header {
      border-bottom: 1px solid $text-color-primary;
    }

    .mobile-content {
      bottom: 0;
    }

    li.pointer {
      border-bottom: 2px outset #3b425240;
      border-bottom-left-radius: 15%;
      border-bottom-right-radius: 30%;
      width: 95%;
    }
  }
}

@keyframes offCanvasAnimIn{
  from {right: -500px;}
  to{right:0;}
}

@media screen and (max-width: 767px) {
  .navigation {
    .hamburger {
      right: 1.2rem;
    }
  }
}

</style>
