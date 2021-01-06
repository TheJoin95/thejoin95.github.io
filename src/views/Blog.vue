<template>
  <div class="blog">
    <h1>Blog listing</h1>
  </div>
</template>

<script>
const articles = require('../assets/articles.json');

export default {
  data() {
    return {
      articles,
    };
  },
  mounted() {
    console.log(this.articles);
  },
};
</script>
