<template>
  <section class="article container mx-auto m-width-780 p-3 py-0">
    <article class="article-content p-3 prose md:prose-xl" v-html="article"></article>
  </section>
</template>

<script>
const articles = require('../assets/articles.json');

export default {
  name: 'Article',
  data() {
    return {
      article: '<loading />',
      metaData: {},
    };
  },
  metaInfo() {
    return {
      title: this.metaData.title,
      meta: [{
        vmid: 'description',
        name: 'description',
        content: this.metaData.description,
      },
      {
        vmid: 'og:title',
        name: 'og:title',
        content: this.metaData.title,
      },
      {
        vmid: 'og:type',
        name: 'og:type',
        content: 'article',
      },
      {
        vmid: 'og:url',
        name: 'og:url',
        content: window.location.href,
      },
      {
        vmid: 'og:site_name',
        name: 'og:site_name',
        content: window.location.hostname,
      },
      {
        vmid: 'og:description',
        name: 'og:description',
        content: this.metaData.description,
      },
      {
        vmid: 'twitter:widgets:csp',
        name: 'twitter:widgets:csp',
        content: 'on',
      },
      {
        vmid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary',
      },
      {
        vmid: 'twitter:site',
        name: 'twitter:site',
        content: window.location.href,
      },
      {
        vmid: 'twitter:domain',
        name: 'twitter:domain',
        content: window.location.hostname,
      },
      {
        vmid: 'twitter:title',
        name: 'twitter:title',
        content: this.metaData.title,
      },
      {
        vmid: 'twitter:description',
        name: 'twitter:description',
        content: this.metaData.description,
      },

      ],
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
      articles.forEach((v) => {
        if (v.permalink === this.$route.params.article.substr(11)) {
          self.metaData = v;
        }
      });

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
