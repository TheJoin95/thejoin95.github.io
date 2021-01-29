<template>
  <section class="article container mx-auto m-width-780 p-3 py-0">
    <article class="article-content p-3 prose prose-xl" v-html="article"></article>
  </section>
</template>

<script>

export default {
  name: 'Article',
  data() {
    return {
      article: '<loading />',
    };
  },
  metaInfo: {
    title: 'Who am I', // Titolo dell'articolo
    meta: [{
      vmid: 'description',
      name: 'description',
      content: 'A short description about me', // short description dell'articolo
    }],
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
<style lang="scss">
.article {
  background: $dark-4;

  &-content {
    background: $light-1;
  }

  .prose-xl, .prose {
    h1, h2, h3, h4, h5, h6 {
      color: $dark-1;
    }
    p {
      color: $dark-3;
    }
  }
}

</style>
