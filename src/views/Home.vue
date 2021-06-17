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
                I'm currently working as a <b>Full Stack Engineer</b> at
                <a href="https://www.growens.io/it/" target="_blank">Growens</a>, where I'm developing
                and optimizing the email marketing platform in an Agile team (SCRUM).
                <br/><br/>
                Are you interested on reading more? Go into the
                <router-link to="/whoami">WhoAmI</router-link> section
              </p>
            </div>
          </div>
        </div>
        <div class="hr-spine mx-auto w-full" />
        <div class="container mx-auto p-5 md:p-0 md:py-5">
          <div class="m-0 md:m-8">
            <h1 class="text-3xl mb-5">Open source projects</h1>
            <div class="md:flex">
              <div v-for="project in projects" :key="project.title"
                class="max-w-sm rounded overflow-hidden w-full md:w-1/3
                shadow-lg bg-gray-700 inline-block homepage-block">
                <a target="_blank" :href="project.link">
                  <div class="px-6 py-4">
                    <div class="font-bold text-xl mb-2">
                      <img :src="project.icon" class="inline-block" width="24" />
                      {{ project.title }}
                    </div>
                    <p class="text-base">
                      {{ project.description }}
                    </p>
                  </div>
                  <div class="px-6 pt-4 pb-2">
                    <span v-for="tag in project.tags" :key="tag"
                      class="inline-block bg-gray-200 rounded-full px-3 py-1
                    text-sm font-semibold text-gray-700 mr-2 mb-2">#{{ tag }}</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="hr-spine mx-auto w-full" />
        <div class="container mx-auto p-5 md:p-0 md:py-5">
          <div class="m-0 md:m-8">
            <h1 class="text-3xl mb-5">I've been featured on</h1>
            <div class="md:flex">
              <div v-for="feature in features" :key="feature.title"
                class="max-w-sm rounded overflow-hidden w-full md:w-1/3
                shadow-lg bg-gray-700 inline-block homepage-block">
                <a :href="feature.link" target="_blank">
                  <div class="px-6 py-4">
                    <div class="font-bold text-xl mb-2">
                      <img :src="feature.icon" :alt="feature.source" :title="feature.source"
                      class="inline-block w-full" />
                    </div>
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
        <div class="hr-spine mx-auto w-full" />
        <div class="container mx-auto p-5 md:p-0 md:py-5">
          <div class="m-0 md:m-8">
            <h3 class="text-3xl mb-5 text-center">You can find me on</h3>
            <Social />
          </div>
        </div>
      </div>
      <div class="hidden md:block col-span-1 pt-5 text-center relative mx-auto">
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
        <div class="sidebar-breakpoint absolute text-center"
          style="bottom: 5em; left: -5px;">
          <h3 class="text-xl relative" style="background: $bg-primary;">
            <i class="bg-grey-200">Social</i>
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
import Social from '@/components/Social.vue';

export default {
  name: 'Home',
  components: {
    HelloWorld,
    NyanCat,
    Social,
  },
  data() {
    return {
      projects: [
        {
          title: 'Covid19 Waiting Times',
          description: 'A project to help people stand in line at the market as little as possible',
          link: 'https://github.com/TheJoin95/covid19-market-waiting-times',
          icon: 'https://raw.githubusercontent.com/TheJoin95/covid19-market-waiting-times/master/client/assets/icon-192x192.png',
          tags: ['python', 'redis', 'vuejs'],
        },
        {
          title: 'Schrödinger Hat',
          description: 'An opensource community, a podcast, a series of live streaming and more!',
          link: 'https://www.schrodinger-hat.it/',
          icon: 'https://www.schrodinger-hat.it/img/logo-64.73f2ac0d.png',
          tags: ['community', 'python', 'yt'],
        },
        {
          title: 'ImageGoNord',
          description: 'A tool to bring any image to the nord palette',
          link: 'https://ign.schrodinger-hat.it/',
          icon: 'https://ign.schrodinger-hat.it/img/logo-64.73f2ac0d.png',
          tags: ['nordtheme', 'python', 'pip'],
        },
      ],
      features: [
        {
          title: 'Map shows average wait times at dozens of Toronto grocery stores',
          source: 'Blog.to',
          icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHdpZHRoPSI5MDBweCIgaGVpZ2h0PSIyNjVweCIgdmlld0JveD0iMCAwIDkwMCAyNjUiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDkwMCAyNjU7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KPCFbQ0RBVEFbCgkuc3Qwe2ZpbGw6I0Y2MTYwMDt9Cl1dPgo8L3N0eWxlPgo8Zz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik05OC4xLDYyLjVjLTE3LjgsMC0yOS42LDYuOS0zOCwxN1YzNC45VjJIMnYzMi45aDE0LjR2MTY4LjloNDIuM3YtMTQuN2M4LjQsMTAuOCwyMC43LDE4LjQsMzkuNCwxOC40CgkJYzM2LjcsMCw2NC0zMS44LDY0LTcyLjZDMTYyLjEsOTQuNSwxMzQuOCw2Mi41LDk4LjEsNjIuNXogTTg3LjUsMTY2LjVjLTE3LjIsMC0yOS4zLTEzLjMtMjkuMy0zMS41YzAtMTguMiwxMi4xLTMxLjUsMjkuMy0zMS41CgkJYzE3LjcsMCwyOS40LDEzLjYsMjkuNCwzMS41QzExNywxNTIuOSwxMDUuMiwxNjYuNSw4Ny41LDE2Ni41eiIvPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTMxNC45LDYyLjVjLTQzLDAtNzQuNiwzMC44LTc0LjYsNzIuNGMwLDQxLjYsMzEuNSw3Mi41LDc0LjYsNzIuNWM0MywwLDc0LjctMzAuOCw3NC43LTcyLjUKCQlDMzg5LjYsOTMuNCwzNTcuOSw2Mi41LDMxNC45LDYyLjV6IE0zMTQuOSwxNjYuNWMtMTcuMSwwLTI5LjctMTMtMjkuNy0zMS41YzAtMTguNSwxMi42LTMxLjUsMjkuNy0zMS41YzE3LjIsMCwyOS44LDEzLDI5LjgsMzEuNQoJCUMzNDQuOCwxNTMuNSwzMzIuMiwxNjYuNSwzMTQuOSwxNjYuNXoiLz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01MDQuOCw4MC42Yy04LjMtMTAuNi0yMC4zLTE4LjEtMzguNC0xOC4xYy0zNi45LDAtNjMuOCwzMC43LTYzLjgsNjkuNWMwLDM5LDI2LjksNjkuNCw2My44LDY5LjQKCQljMTcuOCwwLDI5LjYtNi45LDM3LjgtMTcuNHY4LjVjMCwyMS45LTE2LjcsMzEuNy0zNC42LDMxLjdjLTE2LjQsMC0zMC43LTQuNS00NC4xLTE0bC0xNS42LDM0LjljMTYuNSwxMS42LDM5LjcsMTcuNSw2Mi44LDE3LjUKCQljNDUsMCw3NC42LTI2LjgsNzQuNi03MlY2Ni4zaC00Mi41VjgwLjZ6IE00NzYuNywxNjEuNWMtMTcuMiwwLTI4LjktMTIuOC0yOC45LTI5LjRjMC0xNi44LDExLjYtMjkuNCwyOC45LTI5LjQKCQljMTYuNSwwLDI4LDEyLjYsMjgsMjkuNEM1MDQuOCwxNDguOSw0OTMuMywxNjEuNSw0NzYuNywxNjEuNXoiLz4KCTxwb2x5Z29uIGNsYXNzPSJzdDAiIHBvaW50cz0iNjk1LjksMiA1MzMsMiA1MzMsNDUuNCA1OTEuMSw0NS40IDU5MS4xLDIwMy44IDYzNy45LDIwMy44IDYzNy45LDQ1LjQgNjk1LjksNDUuNCAJIi8+Cgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNzk0LjYsNEM3MzQsNCw2OTEuMiw0Nyw2OTEuMiwxMDUuN1M3MzQsMjA3LjQsNzk0LjYsMjA3LjRjNjAuNSwwLDEwMy40LTQzLDEwMy40LTEwMS43Uzg1NS4xLDQsNzk0LjYsNHoKCQkgTTc5NC42LDE2Mi42Yy0zMiwwLTU0LjctMjMuMy01NC43LTU2LjljMC0zMy42LDIyLjctNTYuOSw1NC43LTU2LjljMzEuOSwwLDU0LjcsMjMuMyw1NC43LDU2LjkKCQlDODQ5LjIsMTM5LjMsODI2LjUsMTYyLjYsNzk0LjYsMTYyLjZ6Ii8+Cgk8cG9seWdvbiBjbGFzcz0ic3QwIiBwb2ludHM9IjE2NS4xLDIgMTY1LjEsMzQuOSAxNzkuMywzNC45IDE3OS4zLDIwMy44IDIyMy4yLDIwMy44IDIyMy4yLDM0LjkgMjIzLjIsMiAJIi8+CjwvZz4KPC9zdmc+',
          link: 'https://www.blogto.com/eat_drink/2020/04/map-wait-times-grocery-stores-toronto/',
          tags: ['canada', 'english', 'vuejs'],
        },
        {
          title: 'Automate the Publishing Process of Your Podcast With GitHub Actions',
          source: 'BetterProgramming',
          icon: 'https://cdn-images-1.medium.com/max/480/1*7A4lpkuHgEyGrIYzfAj4dA@2x.png',
          link: 'https://betterprogramming.pub/youtube-to-anchor-fm-a-github-action-to-automate-the-publishing-process-of-your-podcast-1dbb0fc90560',
          tags: ['github', 'devops', 'docker'],
        },
        {
          title: 'The Sorting Hat Experiment | WebAR in pure JS',
          source: 'AR/VR Journey',
          icon: 'https://cdn-images-1.medium.com/max/1000/1*AS3osonxOfDD78uS0hn8ww@2x.png',
          link: 'https://arvrjourney.com/the-sorting-hat-experiment-webar-in-pure-js-c53b91863c66',
          tags: ['VR', 'AR', 'threejs'],
        },
        {
          title: 'Netflix Cover Generator — A NuxtJS Project',
          source: 'CodeBurst',
          icon: 'https://cdn-images-1.medium.com/max/392/1*LC0hwOq4FY2CG5F9W7R34Q@2x.png',
          link: 'https://codeburst.io/netflix-cover-generator-a-nuxtjs-project-f20ea24e960f',
          tags: ['nuxtjs', 'canvas', '2d'],
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
    },
    {
      vmid: 'og:title',
      name: 'og:title',
      content: 'Miki Lombardi - A passion driven developer',
    },
    {
      vmid: 'og:type',
      name: 'og:type',
      content: 'article',
    },
    {
      vmid: 'og:url',
      name: 'og:url',
      content: window.location.href,
    },
    {
      vmid: 'og:site_name',
      name: 'og:site_name',
      content: window.location.hostname,
    },
    {
      vmid: 'og:description',
      name: 'og:description',
      content: 'Miki Lombardi, fullstack open source developer, italy based, technology passionate! Excited to learn and build wonderful digital things and funny stuff',
    },
    {
      vmid: 'og:image',
      name: 'og:image',
      content: `https://${window.location.hostname}/miki.jpg`,
    },
    {
      vmid: 'twitter:widgets:csp',
      name: 'twitter:widgets:csp',
      content: 'on',
    },
    {
      vmid: 'twitter:card',
      name: 'twitter:card',
      content: `https://${window.location.hostname}/miki.jpg`,
    },
    {
      vmid: 'twitter:image',
      name: 'twitter:image',
      content: `https://${window.location.hostname}/miki.jpg`,
    },
    {
      vmid: 'twitter:site',
      name: 'twitter:site',
      content: '@thejoin95',
    },
    {
      vmid: 'twitter:creator',
      name: 'twitter:creator',
      content: '@thejoin95',
    },
    {
      vmid: 'twitter:domain',
      name: 'twitter:domain',
      content: window.location.hostname,
    },
    {
      vmid: 'twitter:title',
      name: 'twitter:title',
      content: 'Miki Lombardi - A passion driven developer',
    },
    {
      vmid: 'twitter:description',
      name: 'twitter:description',
      content: 'Miki Lombardi, fullstack open source developer, italy based, technology passionate! Excited to learn and build wonderful digital things and funny stuff',
    },
    ],
  },
};
</script>
<style scoped lang="scss">
.prose a {
  color: $blueish-1;
}

.homepage-block {
  margin-right: 5px;
}

.sidebar-breakpoint {
  left: -16px;
  h3 {
    background: $bg-primary
      linear-gradient(90deg, $bg-primary 10%, rgba(59, 66, 82, 0) 50%, $bg-primary 90%);
  }
}
</style>
