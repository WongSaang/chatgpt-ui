import type { SidebarConfig } from '@vuepress/theme-default'

export const sidebarEn: SidebarConfig = {
  '/': [
    {
      text: 'Guide',
      children: [
        '/README.md',
        '/guide/quick-start.md',
        '/guide/configuration.md',
        '/guide/problems.md',
        '/guide/development.md',
        '/guide/buymeacoffee.md',
      ],
    },
  ]
}