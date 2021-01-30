<template>
  <section class="about m-10 container mx-auto">
    <div class="p-5">
      <div class="flex flex-wrap">
        <div id="column-portrait" class="w-full md:w-1/4">
          <div class="rounded-full">
            <img src="/images/miki.jpg" class="rounded-full w-full" title="Me" />
          </div>
        </div>
        <div class="w-full px-2 md:w-2/5">
          <h1>This is an about page</h1>
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
  div {
    border: 8px solid $dark-4;
  }
}
</style>
