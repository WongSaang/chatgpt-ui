<script setup>
import { marked } from "marked"
import hljs from "highlight.js"

marked.setOptions({
  highlight: function (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language }).value
  },
  langPrefix: 'hljs language-', // highlight.js css class prefix
})

const props = defineProps(['content'])
const contentHtml = computed(() => {
  return props.content ? marked(props.content) : ''
})

</script>

<template>
  <div
      v-html="contentHtml"
      class="text-body-1 text-justify"
  ></div>

</template>