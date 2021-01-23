/* eslint-disable max-len */
<template>
  <div class="blog">
    <div class="container mx-auto blog-list m-width-780">
      <h1 class="text-center">Blog listing</h1>
      <section v-for="article in articles" :key="article.permalink">
        <div class="p-2 mx-auto my-5 article max-w-sm max-w-md w-full lg:max-w-full lg:flex">
          <router-link style="display: inherit"
                :to="`/blog/${article.date + '-' + article.permalink}`">
            <div class="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none
            lg:rounded-l text-center overflow-hidden"
            title='Image from Unsplash'
            :style="`background-image: url('https://source.unsplash.com/${article.icon}/400x400')`" />
          </router-link>
          <div class="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t
          lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col
          justify-between leading-normal">
            <div class="mb-8">
              <div class="text-gray-900 font-bold text-xl mb-2">
                <router-link
                :to="`/blog/${article.date + '-' + article.permalink}`">
                {{ article.title }}
                </router-link>
              </div>
              <p class="text-gray-700 text-base">{{ article.description }}</p>
            </div>
            <div class="flex items-center">
              <img class="w-10 h-10 rounded-full mr-4" src="/images/miki.jpg" alt="Miki's image">
              <div class="text-sm">
                <p class="text-gray-900 leading-none">Miki</p>
                <p class="text-gray-600">{{ article.date }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
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
