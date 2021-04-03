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
            <h1 class="text-3xl mb-5">Open source projects</h1>
            <div v-for="project in projects" :key="project.title"
              class="max-w-sm rounded overflow-hidden
              shadow-lg bg-gray-700 inline-block homepage-block">
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
            <h1 class="text-3xl mb-5">I've been featured on</h1>
            <div v-for="feature in features" :key="feature.title"
              class="max-w-sm rounded overflow-hidden
                shadow-lg bg-gray-700 inline-block homepage-block">
              <a :href="feature.link" target="_blank">
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
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="sm:hide col-span-1 pt-5 text-center relative mx-auto">
        <h3 class="text-xl mt-10"><i class="bg-grey-200">Brief</i></h3>
        <div class="circle mx-auto" style="
        visibility: inherit; opacity: 1; transform: matrix(1, 0, 0, 1, 0, 0);">
        </div>
        <div class="spine mx-auto h-full" style="
        visibility: inherit; opacity: 1; transform: matrix(1, 0, 0, 1, 0, 0);"
        ></div>
        <div class="sidebar-breakpoint absolute text-center"
          style="top: 32em;">
          <h3 class="text-xl relative" style="background: $bg-primary;">
            <i class="bg-grey-200">Projects</i>
          </h3>
          <div class="circle mx-auto mt-2 relative" style="
            visibility: inherit; opacity: 1; transform: matrix(1, 0, 0, 1, 0, 0);">
          </div>
        </div>
        <div class="sidebar-breakpoint absolute text-center"
          style="top: 54em; left: -17px;">
          <h3 class="text-xl relative" style="background: $bg-primary;">
            <i class="bg-grey-200">Features</i>
          </h3>
          <div class="circle mx-auto mt-2 relative" style="
            visibility: inherit; opacity: 1; transform: matrix(1, 0, 0, 1, 0, 0);">
          </div>
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
  data() {
    return {
      projects: [
        {
          title: 'Covid Supermarket Waiting Times',
          description: 'Supermarket waiting times project',
          link: 'https://github.com/TheJoin95/covid19-market-waiting-times',
          tags: ['covid19', 'python', 'redis', 'vuejs'],
        },
      ],
      features: [
        {
          title: 'Covid Supermarket Waiting Times',
          description: 'Supermarket waiting times project',
          source: 'Blog.to',
          link: 'https://www.blogto.com/eat_drink/2020/04/map-wait-times-grocery-stores-toronto/',
          tags: ['canada', 'english', 'vuejs'],
        },
        {
          title: 'YouTube to Anchor.fm',
          description: 'Automate the Publishing Process of Your Podcast With GitHub Actions',
          source: 'BetterProgramming',
          link: 'https://betterprogramming.pub/youtube-to-anchor-fm-a-github-action-to-automate-the-publishing-process-of-your-podcast-1dbb0fc90560',
          tags: ['github', 'devops', 'docker'],
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
<style scoped lang="scss">
.prose a {
  color: $blueish-1;
}

.homepage-block {
  margin: 0 5px;

  &:nth-of-type(1) {
    margin: 0 0;
  }
}

.sidebar-breakpoint {
  left: -16px;
  h3 {
    background: $bg-primary
      linear-gradient(90deg, $bg-primary 10%, rgba(59, 66, 82, 0) 50%, $bg-primary 90%);
  }
}
</style>
