<template>
  <section class="home">
    <div class="container mx-auto">
      <HelloWorld />
    </div>
    <div class="h-8 relative">
      <NyanCat />
    </div>
    <div class="container mx-auto grid grid-cols-6">
      <div class="col-span-6 md:col-span-5">
        <div class="p-5 md:p-0 md:py-5">
          <div class="m-0 md:m-8">
            <h3 class="text-3xl">TLDR;</h3>
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
                <br/><br/>
                Are you interested on reading more? Go into the
                <router-link to="/about">WhoAmI</router-link> section
              </p>
            </div>
          </div>
        </div>
        <div class="hr-spine mx-auto w-full" />
        <div class="container mx-auto p-5 md:p-0 md:py-5">
          <div class="m-0 md:m-8">
            <h1 class="text-3xl">Open source projects</h1>
            <div v-for="project in projects" :key="project.title"
              class="max-w-sm rounded overflow-hidden shadow-lg bg-gray-700 inline-block">
              <div class="px-6 py-4">
                <div class="font-bold text-xl mb-2">{{ project.title }}</div>
                <p class="text-base">
                  {{ project.description }}
                </p>
              </div>
              <div class="px-6 pt-4 pb-2">
                <span v-for="tag in project.tags" :key="tag"
                  class="inline-block bg-gray-200 rounded-full px-3 py-1
                text-sm font-semibold text-gray-700 mr-2 mb-2">#{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="hr-spine mx-auto w-full" />
        <div class="container mx-auto p-5 md:p-0 md:py-5">
          <div class="m-0 md:m-8">
            <h1 class="text-3xl">I've been featured on</h1>
            <div v-for="feature in features" :key="feature.title"
              class="max-w-sm rounded overflow-hidden shadow-lg bg-gray-700 inline-block">
              <div class="px-6 py-4">
                <div class="font-bold text-xl mb-2">{{ feature.source }}</div>
                <p class="text-base">
                  {{ feature.title }}
                </p>
              </div>
              <div class="px-6 pt-4 pb-2">
                <span v-for="tags in feature.tags" :key="tags"
                  class="inline-block bg-gray-200 rounded-full px-3 py-1
                text-sm font-semibold text-gray-700 mr-2 mb-2">#{{ tags }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="sm:hide col-span-1 pt-5 text-center">
        <h3 class="text-xl mt-10"><i class="bg-grey-200">Brief</i></h3>
        <div class="circle mx-auto" style="
        visibility: inherit; opacity: 1; transform: matrix(1, 0, 0, 1, 0, 0);">
        </div>
        <div class="spine mx-auto h-full" style="
        visibility: inherit; opacity: 1; transform: matrix(1, 0, 0, 1, 0, 0);"
        ></div>
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
  data() {
    return {
      projects: [
        {
          title: 'Covid Supermarket Waiting Times',
          description: 'Supermarket waiting times project',
          link: '',
          tags: ['canada', 'english', 'vuejs'],
        },
      ],
      features: [
        {
          title: 'Covid Supermarket Waiting Times',
          description: 'Supermarket waiting times project',
          source: 'Blog.to',
          link: '',
          tags: ['canada', 'english', 'vuejs'],
        },
      ],
    };
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
