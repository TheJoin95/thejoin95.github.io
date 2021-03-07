<template>
  <section class="home">
    <div class="container mx-auto">
      <HelloWorld />
    </div>
    <div class="h-8 relative">
      <NyanCat />
    </div>
    <div class="container mx-auto p-5 md:p-0 md:py-5">
      <div class="m-0 md:m-8">
        <h1 class="text-3xl">TLDR;</h1>
        <div class="prose prose-xl">
          <div class="h-64"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import NyanCat from '@/components/NyanCat.vue';

export default {
  name: 'Home',
  components: {
    HelloWorld,
    NyanCat,
  },
  metaInfo: {
    title: 'A passion driven developer',
    meta: [{
      vmid: 'description',
      name: 'description',
      content: 'Miki Lombardi, fullstack open source developer, italy based, technology passionate! Excited to learn and build wonderful digital things and funny stuff',
    }],
  },
};
</script>
