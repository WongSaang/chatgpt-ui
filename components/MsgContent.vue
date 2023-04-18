<script setup>
import hljs from "highlight.js"
import MarkdownIt from 'markdown-it'
import copy from 'copy-to-clipboard'
import mathjax3 from 'markdown-it-mathjax3'


const md = new MarkdownIt({
  linkify: true,
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return `<pre class="hljs-code-container my-3"><div class="hljs-code-header d-flex align-center justify-space-between bg-grey-darken-3 pa-1"><span class="pl-2 text-caption">${language}</span><button class="hljs-copy-button" data-copied="false">Copy</button></div><code class="hljs language-${language}">${hljs.highlight(code, { language: language, ignoreIllegals: true }).value}</code></pre>`
  },
})
md.use(mathjax3)

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const contentHtml = ref('')

const contentElm = ref(null)

watchEffect(async () => {
  contentHtml.value = props.message.message ? md.render(props.message.message) : ''
  await nextTick()
  bindCopyCodeToButtons()
})

const bindCopyCodeToButtons = () => {
  if (!contentElm.value) {
    return
  }
  contentElm.value.querySelectorAll('.hljs-code-container').forEach((codeContainer) => {
    const copyButton = codeContainer.querySelector('.hljs-copy-button');
    const codeBody = codeContainer.querySelector('code');
    copyButton.onclick = function () {
      copy(codeBody.textContent ?? '');

      copyButton.innerHTML = "Copied!";
      copyButton.dataset.copied = 'true';

      setTimeout(() => {
        copyButton.innerHTML = "Copy";
        copyButton.dataset.copied = 'false';
      }, 2000);
    };
  })
}

onMounted(() => {
  bindCopyCodeToButtons()
})

</script>

<template>
  <v-card
      :color="message.is_bot ? '' : 'primary'"
      rounded="lg"
      elevation="2"
  >
    <div
        ref="contentElm"
        v-html="contentHtml"
        class="chat-msg-content pa-3"
    ></div>
  </v-card>
</template>

<style>
.chat-msg-content {
  font-size: 0.875rem !important;
  font-weight: 400;
  line-height: 1.25rem;
}
.chat-msg-content p,
.chat-msg-content table,
.chat-msg-content ul,
.chat-msg-content ol,
.chat-msg-content h1,
.chat-msg-content h2,
.chat-msg-content h3,
.chat-msg-content h4,
.chat-msg-content h5,
.chat-msg-content h6 {
  margin-bottom: 1rem;
}
.chat-msg-content table {
  width: 100%;
  border-collapse: collapse;
  border-radius: .5rem;
}
.chat-msg-content table th,
.chat-msg-content table td {
  padding: .5rem 1rem;
  border: 1px solid gray;
}
.chat-msg-content ol, .chat-msg-content ul {
  padding-left: 2em;
}
.hljs-code-container {
  border-radius: 3px;
  overflow: hidden;
}
.hljs-copy-button{
  width:2rem;height:2rem;text-indent:-9999px;color:#fff;
  border-radius:.25rem;border:1px solid #ffffff22;
  background-image:url('data:image/svg+xml;utf-8,<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 5C5.73478 5 5.48043 5.10536 5.29289 5.29289C5.10536 5.48043 5 5.73478 5 6V20C5 20.2652 5.10536 20.5196 5.29289 20.7071C5.48043 20.8946 5.73478 21 6 21H18C18.2652 21 18.5196 20.8946 18.7071 20.7071C18.8946 20.5196 19 20.2652 19 20V6C19 5.73478 18.8946 5.48043 18.7071 5.29289C18.5196 5.10536 18.2652 5 18 5H16C15.4477 5 15 4.55228 15 4C15 3.44772 15.4477 3 16 3H18C18.7956 3 19.5587 3.31607 20.1213 3.87868C20.6839 4.44129 21 5.20435 21 6V20C21 20.7957 20.6839 21.5587 20.1213 22.1213C19.5587 22.6839 18.7957 23 18 23H6C5.20435 23 4.44129 22.6839 3.87868 22.1213C3.31607 21.5587 3 20.7957 3 20V6C3 5.20435 3.31607 4.44129 3.87868 3.87868C4.44129 3.31607 5.20435 3 6 3H8C8.55228 3 9 3.44772 9 4C9 4.55228 8.55228 5 8 5H6Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7 3C7 1.89543 7.89543 1 9 1H15C16.1046 1 17 1.89543 17 3V5C17 6.10457 16.1046 7 15 7H9C7.89543 7 7 6.10457 7 5V3ZM15 3H9V5H15V3Z" fill="white"/></svg>');
  background-repeat:no-repeat;background-position:center;
  transition:background-color 200ms ease,transform 200ms ease-out
}
.hljs-copy-button:hover{border-color:#ffffff44}
.hljs-copy-button:active{border-color:#ffffff66}
.hljs-copy-button[data-copied="true"]{text-indent:0;width:auto;background-image:none}
@media(prefers-reduced-motion){.hljs-copy-button{transition:none}}

/*MathJax*/
.MathJax svg {
  max-width: 100%;
  overflow: auto;
}
</style>