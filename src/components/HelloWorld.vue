<template>
  <div class="hello sm:m-10">
    <div class="p-5">
      <div class="flex flex-wrap">
        <div class="w-full md:w-1/2">
          <h1 class="leading-none font-bold text-6xl mt-5 mb-1 text-scramble">
            I'm Miki Lombardi
          </h1>
          <h2 class="leading-none text-4xl mt-1 text-scramble">A passion driven developer</h2>
        </div>
        <div class="w-full ml-auto md:w-1/2">
          <!-- https://lottiefiles.com/44885-man-on-working -->
          <lottie-player
            class="ml-auto sm:mx-auto md:ml-auto max-w-full"
            src="/lotties/pc-man.json"
            background="transparent"
            speed="1"
            style="width: 100%; height: 400px;"
            loop autoplay />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
