<template>
  <section class="article container mx-auto m-width-780 px-5">
    <article class="article-content p-3 prose prose-xl" v-html="article"></article>
  </section>
</template>

<script>
import marked from 'marked';

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
      fetch(`/articles/${this.$route.params.article}.md`)
        .then(async (r) => {
          console.log(r.status);
          let text = await r.text();
          // Workaround, da modificare in produzione con redirect
          if (text.search(/sorry/) !== -1) {
            self.redirectTo404();
          }

          text = text.substr(text.substr(3).search('---') + 7);
          self.article = marked(text);
        }, () => {
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
