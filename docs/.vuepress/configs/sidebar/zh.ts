import type { SidebarConfig } from '@vuepress/theme-default'

export const sidebarZh: SidebarConfig = {
  '/zh/': [
    {
      text: '指南',
      children: [
        '/zh/README.md',
        '/zh/guide/quick-start.md',
        '/zh/guide/configuration.md',
        '/zh/guide/problems.md',
        '/zh/guide/development.md',
        '/zh/guide/buymeacoffee.md',
      ],
    },
  ]
}