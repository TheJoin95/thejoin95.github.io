<template>
  <div class="hello box-content h-20 w-32 p-4 border-4 border-gray-400 bg-gray-200 mx-auto">
    <div class="h-full w-full bg-gray-400">
      <h1 class="text-scramble">I'm Miki Lombardi</h1>
      <h2 class="text-scramble">A passion driven developer</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
