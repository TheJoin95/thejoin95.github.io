<template>
  <section class="article container mx-auto m-width-780 p-3 py-0">
    <article class="article-content p-3 prose prose-xl" v-html="article"></article>
  </section>
</template>

<script>
// import marked from 'marked';

export default {
  name: 'Article',
  data() {
    return {
      article: 'loading...',
    };
  },
  watch: {
    // call again the method if the route changes
    $route: 'loadArticle',
  },
  methods: {
    redirectTo404() {
      window.location.href = '/not-found';
    },
    loadArticle() {
      const self = this;

      // eslint-disable-next-line prefer-template
      import('../../public/articles/' + this.$route.params.article + '.md').then((v, e) => {
        console.log(e);
        self.article = v.default.substr(v.default.search('h1') - 2);
      // eslint-disable-next-line no-alert
      }).catch(() => {
        self.redirectTo404();
      });
    },
  },
  created() {
    this.loadArticle();
  },
};
</script>
<style lang="scss" scoped>
.article {
  background: $dark-4;

  &-content {
    background: $light-1;
  }
}
</style>
