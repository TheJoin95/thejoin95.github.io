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
                for <b>{{ (new Date().getFullYear()) - 2014 }}+ years</b> in both product and
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
            <h1 class="text-3xl mb-5">Conferences & Talks</h1>
            <div class="md:flex md:flex-wrap">
              <div v-for="talk in talks" :key="talk.title"
                class="flex-auto max-w-sm rounded overflow-hidden w-full md:w-1/4
                shadow-lg bg-gray-700 inline-block homepage-block my-1">
                <a :href="talk.link" target="_blank">
                  <div class="px-6 py-4">
                    <div class="font-bold text-xl text-center mb-2">
                      <img style="max-height: 135px"
                        :src="talk.icon" :alt="talk.source" :title="talk.source"
                      class="inline-block" />
                    </div>
                    <p class="text-base">
                      {{ talk.title }}
                    </p>
                  </div>
                  <div class="px-6 pt-4 pb-2">
                    <span v-for="tags in talk.tags" :key="tags"
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
            <h1 class="text-3xl mb-5">I've been featured on</h1>
            <div class="md:flex-wrap md:flex">
              <div v-for="feature in features" :key="feature.title"
                class="flex-auto max-w-sm rounded overflow-hidden w-full md:w-1/4
                shadow-lg bg-gray-700 inline-block homepage-block my-1">
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
          style="top: 62.5em; left: -28px;">
          <h3 class="text-xl relative" style="background: $bg-primary;">
            <i class="bg-grey-200">Conf&amp;Talks</i>
          </h3>
          <div class="circle mx-auto mt-2 relative" style="
            visibility: inherit; opacity: 1; transform: matrix(1, 0, 0, 1, 0, 0);">
          </div>
        </div>
        <div class="sidebar-breakpoint absolute text-center"
          style="top: 137em; left: -17px;">
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
        {
          title: 'ImageGoNord review from Genbeta devs team',
          source: 'Genbeta',
          icon: 'https://zenkit.com/wp-content/uploads/2020/06/genbeta_logo.png',
          link: 'https://www.genbeta.com/deskmod/buscas-wallpaper-perfecto-echa-vistazo-a-galeria-imagegonord-convierte-tu-propia-imagen-a-paleta-nord',
          tags: ['opensource', 'python'],
        },
      ],
      talks: [
        {
          title: 'Pythonday - WeAreDevs | A crowdsourced map for checking supermarket wait times worldwide',
          source: 'Python Day - WeAreDevs',
          icon: 'https://assets-global.website-files.com/5e9996a6531fea7d1003b18e/5e9c1a4de014f9389fa3352f_wearedevelopers-logo.png',
          link: 'https://www.wearedevelopers.com/event/python-day-1221',
          tags: ['opensource', 'covid19', 'python'],
        },
        {
          title: 'JavaScript Congress - WeAreDevs | Automate everything via NodeJS and Puppeteer',
          source: 'JavaScript Congress \'21 - WeAreDevs',
          icon: 'https://assets-global.website-files.com/5e9996a6531fea7d1003b18e/5e9c1a4de014f9389fa3352f_wearedevelopers-logo.png',
          link: 'https://www.wearedevelopers.com/javascript-congress',
          tags: ['docker', 'nodejs', 'google'],
        },
        {
          title: 'Optimize the UX and the frontend performance with Grafana, Prometheus and Lighthouse',
          source: 'Containerday Italy - Grusp',
          icon: 'https://2020.containerday.it/img/themes/containerday/logo.svg',
          link: 'https://2021.containerday.it/talks_speakers/#miki',
          tags: ['docker', 'nodejs', 'google'],
        },
        {
          title: 'A crowdsourced map for checking supermarket wait times worldwide | A 2020 project to help people during the covid19 lockdown',
          source: 'EuroPython',
          icon: 'https://ep2021.europython.eu/static/img/ep2021-social-online-card.jpg',
          link: 'https://ep2021.europython.eu/talks/BG87bCt-a-crowdsourced-map-for-checking-supermarket-wait-times-worldwide/',
          tags: ['europython', 'python', 'covid19'],
        },
        {
          title: 'Micro-frontend: The micro-service development architecture on the front-end side',
          source: 'FEVR',
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAADqCAYAAACMcRPfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjcwQjBGRUNDQUNBNjExRTVBQkU3RDU0REEyMDRBQ0MwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjcwQjBGRUNEQUNBNjExRTVBQkU3RDU0REEyMDRBQ0MwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzBCMEZFQ0FBQ0E2MTFFNUFCRTdENTREQTIwNEFDQzAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NzBCMEZFQ0JBQ0E2MTFFNUFCRTdENTREQTIwNEFDQzAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7VI1saAAAsOklEQVR42uyd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',
          link: 'https://www.fevr.it/eventi/2020/06/micro-frontend-the-micro-service-development-architecture-on-the-front-end-side/',
          tags: ['microfrontend', 'architecture'],
        },
        {
          title: 'Various talks in Schrodinger Hat about technology & Open Source Day 2021 event',
          source: 'Schrodinger Hat',
          icon: 'data:image/png;base64,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',
          link: 'https://www.schrodinger-hat.it',
          tags: ['r&d', 'technology'],
        },
        {
          title: 'Various talks in Plansoft about cutting edge technology such as Microfrontend, Microservices, AWS, AR/VR, Machine Learning and more',
          source: 'Plansoft',
          icon: 'data:image/png;base64,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',
          link: 'https://www.plansoft.it/blog/',
          tags: ['r&d', 'technology'],
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
