import { defineUserConfig, defaultTheme } from 'vuepress'
import {
    navbarEn,
    navbarZh,
    sidebarEn,
    sidebarZh,
  } from './configs/index.js'

export default defineUserConfig({
  title: 'ChatGPT UI',
  description: 'A ChatGPT web client',
  base: '/chatgpt-ui/',
  locales: {
    // 键名是该语言所属的子路径
    // 作为特例，默认语言可以使用 '/' 作为其路径。
    '/': {
      lang: 'en-US',
      description: 'A ChatGPT web client',
    },
    '/zh/': {
      lang: 'zh-CN',
      description: '一个 ChatGPT 的 Web 客户端',
    },
  },
  theme: defaultTheme({
    locales: {
      '/': {
        // navbar
        navbar: navbarEn,
        // sidebar
        sidebar: sidebarEn,
      },
      '/zh/': {
        // navbar
        navbar: navbarZh,
        selectLanguageName: '简体中文',
        selectLanguageText: '选择语言',
        selectLanguageAriaLabel: '选择语言',
        // sidebar
        sidebar: sidebarZh,
        // 404 page
        notFound: [
            '这里什么都没有',
            '我们怎么到这来了？',
            '这是一个 404 页面',
            '看起来我们进入了错误的链接',
        ],
        backToHome: '返回首页',
        // a11y
        openInNewWindow: '在新窗口打开',
        toggleColorMode: '切换颜色模式',
        toggleSidebar: '切换侧边栏',
      },
    },
  }),
})