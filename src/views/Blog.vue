<template>
  <div class="blog">
    <div class="container mx-auto blog-list m-width-780">
      <h1 class="text-center">Blog listing</h1>
      <div v-for="article in articles" :key="article.sefurl">
        <div class="article">
          <h3><router-link :to="`/blog/${article.sefurl}`">{{ article.title }}</router-link></h3>
          <small>{{ article.date }}</small>
          <p>{{ article.description }}</p>
        </div>
      </div>
    </div>
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
<style scoped>

</style>
