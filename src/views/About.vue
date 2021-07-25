<template>
  <section class="about container mx-auto">
    <div class="p-0 md:p-10 mt-10 md:mt-0">
      <div class="p-0 md:p-5 text-center">
        <h1 class="leading-tight text-4xl md:text-5xl font-bold">
          Ciao <span class="wave">&#x1F44B;</span><br />
          I'm Miki Lombardi
          </h1>
      </div>
      <div class="p-5">
        <div class="text-center mx-auto">
          <div id="column-portrait" class="inline-block">
            <div class="rounded-full">
              <img src="/images/miki.jpg" width="256" class="rounded-full max-w-full" title="Me" />
            </div>
          </div>
          <div class="w-full md:w-1/3 inline-block">
            <lottie-player
              src="/lotties/social.json"
              background="transparent max-w-full"
              speed="1"
              class="w-full h-64"
              loop
              autoplay />
            <Social />
          </div>
        </div>
      </div>
      <div class="p-5">
        <div class="flex mt-2 flex-wrap">
          <div class="mx-auto w-full prose md:prose-xl biography text-justify">
            <h2 class="text-3xl font-bold">What I do?</h2>
            <p>
              I helped Aperion and Plansoft to delivery high quality products, software and
              services to their customers.
              Since June 2021, I'm working at <a href="https://www.growens.io/it/" target="_blank">Growens</a>
              My core knowledge has been instrumental in resolving complex architectural
              and software development challenges.<br/><br/>
              Working within the scopes of a lot of technical roles such as software engineer,
                course trainer, tech lead,
              solutions architect and head of R&D, I have developed a precise understanding of
                various technicalities which
              has helped me in maximizing value of my company and products
              in my current leadership roles.</p>
            <br/>
            <p>
              My colleagues know me as an excellent communicator.
              I like to use an interactive approach for understanding and solving problems
              of varied scopes.<br/><br/>
              I’m also enjoying sharing the knowledge with the community by writing
              articles and build / contribute to open source project.
            </p>
            <p>
              Always striving to improve, I love learning new things and face challenging problems.
              I love to follow a mentor and I like to be mentor for others too.
            </p><br/>
            <p>In my experience I have always found a friendly and homely
              environment, even in large companies.
              I like to always give a touch of style to work, especially with
              the people who are part of it.
            </p>
              <p>I'm always looking for the next challenge and I would like to
              be part of the solution process.
            </p>
            <div class="mt-10 text-center">
              <a download href="/miki-lombardi-resume.pdf"
              class="w-1/3 bg-gray-600 hover:bg-gray-500 text-white
              font-bold py-2 px-4 border-b-4 border-gray-700 hover:border-gray-500
              rounded inline-flex items-center">
                <svg class="fill-current w-full md:w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
                <span>Download Miki's Resume</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import Social from '@/components/Social.vue';

export default {
  components: {
    Social,
  },
  metaInfo: {
    title: 'Who am I',
    meta: [{
      vmid: 'description',
      name: 'description',
      content: 'A short description about me',
    }],
  },
};
</script>
<style lang="scss" scoped>
#column-portrait {
  img {
    border: 8px solid $dark-4;
  }
}

</style>
