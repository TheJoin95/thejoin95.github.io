<template>
  <vue-markdown>
    {{ require(`../articles/${this.$route.params.article}.md`) }}
  </vue-markdown>
</template>

<script>
import VueMarkdown from 'vue-markdown';

export default {
  name: 'Article',
  data() {
    return {
      article: String,
    };
  },
  components: {
    VueMarkdown,
  },
  computed: {
    loadArticle() {
      return true;
    },
  },
};
</script>
