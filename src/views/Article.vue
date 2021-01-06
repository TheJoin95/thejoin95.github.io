<template>
  <section class="article">
    <div class="content" v-html="article"></div>
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
    loadArticle() {
      const self = this;
      fetch(`/articles/${this.$route.params.article}.md`)
        .then(async (r) => {
          const text = await r.text();
          self.article = marked(text);
        }, (reject) => {
          console.log(reject);
          self.article = '404';
          // redirect to 404
        });
    },
  },
  created() {
    this.loadArticle();
  },
};
</script>
