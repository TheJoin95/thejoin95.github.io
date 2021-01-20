<template>
  <div class="hello sm:m-10">
    <div class="p-5">
      <div class="grid grid-cols-6 gap-4">
        <div class="col-start-2 col-span-4 h-20"></div>
        <div class="col-start-1 col-end-4">
          <h1 class="font-bold text-6xl mt-5 mb-1 text-scramble">I'm Miki Lombardi</h1>
          <h2 class="text-4xl mt-1 text-scramble">A passion driven developer</h2>
        </div>
        <div class="col-start-5 col-end-7">
          <!-- https://lottiefiles.com/44885-man-on-working -->
          <lottie-player
            src="https://assets10.lottiefiles.com/packages/lf20_zjllsmcs.json"
            background="transparent"
            speed="1"
            style="width: 400px; height: 400px;"
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
