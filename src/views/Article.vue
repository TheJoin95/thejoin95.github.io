<template>
  <section class="article container mx-auto m-width-960">
    <div class="article-content" v-html="article"></div>
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
          const text = await r.text();
          // Workaround, da modificare in produzione con redirect
          if (text.search(/sorry/) !== -1) {
            self.redirectTo404();
          }

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
