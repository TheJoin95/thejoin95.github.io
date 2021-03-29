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
        <div class="prose md:prose-xl text-justify">
          <p class="biography">
            I'm a passion & creative driven developer who has ton of others
            passion: <i>basketball, cycling, photography</i> are few of them.
          </p>
          <p class="biography">
            Since <b>2014</b> I have lent my expertise in the <b>software develpoment</b>
            and <b>solution architect</b> fields in <b>Florence, Italy</b>. <br/>
            I've been working as a software engineer & solution architect
            for <b>7+ years</b> in both product and
            consultancy companies, taking the best from both worlds.<br/>
            I'm currently working as a <b>Head of Research & Development</b> divison at
            <a href="https://www.plansoft.it" target="_blank">Plansoft</a>, where I'm innovating
            the tech stack of the company.
          </p>
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
