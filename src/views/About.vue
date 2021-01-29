<template>
  <div class="about container mx-auto">
    <lottie-player
      src="/lotties/social.json"
      background="transparent max-w-full"
      speed="1"
      style="width: 100%; height: 512px;"
      loop
      autoplay />
    <h1>This is an about page</h1>
  </div>
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
