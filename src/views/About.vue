<template>
  <section class="about container mx-auto">
    <div class="p-0 md:p-10 mt-10 md:mt-0">
      <div class="p-0 md:p-5 text-center">
        <h1 class="leading-tight text-4xl md:text-5xl font-bold">
          Ciao &#x1F44B;<br />
          I'm Miki Lombardi
          </h1>
      </div>
      <div class="p-5">
        <div class="flex flex-wrap">
          <div id="column-portrait" class="mx-auto sm:w-2/3 md:w-1/4">
            <div class="rounded-full">
              <img src="/images/miki.jpg" class="rounded-full max-w-full" title="Me" />
            </div>
          </div>
          <div class="mt-0 sm:mt-3 w-full px-2 md:w-2/5 prose md:prose-xl">
            <p class="biography">
              I'm a passion & creative driven developer who has ton of others
              passion like basketball, cycling, photography
            </p>
          </div>
          <div class="w-full md:w-1/3">
            <lottie-player
              src="/lotties/social.json"
              background="transparent max-w-full"
              speed="1"
              style="width: 100%;"
              loop
              autoplay />
            </div>
        </div>
        <div class="flex flex-wrap">
          <div class="mx-auto w-2/3"></div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
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

.biography {
  color: $text-color-primary;
}
</style>
