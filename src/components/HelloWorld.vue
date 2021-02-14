<template>
  <section class="hello m-0 md:m-10">
    <div class="p-5 md:mt-10">
      <div class="flex flex-wrap">
        <div class="w-full md:w-1/2">
          <h1 class="leading-none font-bold text-6xl mt-5 mb-2 text-scramble">
            I'm Miki Lombardi
          </h1>
          <h2 class="leading-none text-4xl mt-3 text-scramble">A passion driven developer</h2>

          <router-link to="/about">
            <div class="mt-10 h-8 shadow appearance-none border border-gray-700 rounded
            w-full md:w-3/4 py-2 px-3 text-gray-900 leading-none focus:outline-none
            focus:shadow-outline bg-gray-800">
              <span class="inline-block align-middle text-green-600">$ Miki ~</span>
              <span class="inline-block align-middle ml-2 text-red-700 typewriter">whoami</span>
              <span class="w-6 bg-gray-500 float-right font-bold py-0 px-1
              border-b-4 align-middle border-gray-700 hover:border-gray-500 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                  stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3
                  3H6a3 3 0 01-3-3V7a3
                  3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </span>
            </div>
          </router-link>
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
  </section>
</template>

<script>
export default {
  name: 'HelloWorld',
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.typewriter {
  overflow: hidden;
  border-right: .15em solid orange;
  white-space: nowrap;
  margin: 0 inherit;
  letter-spacing: inherit;
  animation:
    typing .8s steps(40, end) 3.5s,
    blink-caret .75s step-end infinite;
}

/* The typing effect */
@keyframes typing {
  from { width: 0 }
  to { width: 60px }
}

/* The typewriter cursor effect */
@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: orange; }
}
</style>
