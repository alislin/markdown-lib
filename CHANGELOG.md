# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.1.0](https://github.com/alislin/markdown-lib/compare/v1.0.2...v1.1.0) (2026-04-04)


### 🐛 Bug Fixes

* 修复 lint warning - 移除未使用的 catch 参数 ([4fb7f2b](https://github.com/alislin/markdown-lib/commit/4fb7f2b627c21cde4349a2478088d106e6a5aaaa))
* 修复链接和kbd样式测试选择器问题 ([b310448](https://github.com/alislin/markdown-lib/commit/b31044816bc37e9acc8919df689a41d1c7c60c5a))


### ✨ Features

* 扩展 ThemeTestConfig 接口支持完整元素样式 ([f80231c](https://github.com/alislin/markdown-lib/commit/f80231c821b54955b8433587f68f56eef386beac))
* 添加 body 样式测试（浅色/深色模式） ([51967ba](https://github.com/alislin/markdown-lib/commit/51967baf983c1c501b4a749a4351ca7966205968))
* 添加 kbd 和 hr 样式测试（浅色/深色模式） ([5f169e7](https://github.com/alislin/markdown-lib/commit/5f169e79022ae0bf32b7d9f4157b5ebf4e28be25))
* 添加 runElementStyleTests 函数骨架 ([71692ca](https://github.com/alislin/markdown-lib/commit/71692ca733b65e030df49bab97fb4dadb8494bbc))
* 添加标题样式测试（浅色/深色模式） ([02c2a1a](https://github.com/alislin/markdown-lib/commit/02c2a1a27e091a076db3c07f6964907472b0bf36))
* 添加表格样式测试（浅色/深色模式） ([cd3cbae](https://github.com/alislin/markdown-lib/commit/cd3cbaedca4d206705352acd56b69b67dc9c936d))
* 添加代码样式测试（浅色/深色模式） ([0573254](https://github.com/alislin/markdown-lib/commit/057325404fc53ca27c973a34e64a9cebb2358191))
* 添加链接样式测试（浅色/深色模式） ([3125cb3](https://github.com/alislin/markdown-lib/commit/3125cb31cd0083fd085c92e360b33508bf4c3745))
* 添加图片样式测试（浅色/深色模式） ([5fa3d01](https://github.com/alislin/markdown-lib/commit/5fa3d018830b8dc35c40068ce4bcec6ab1bb40d0))
* 添加引用块样式测试（浅色/深色模式） ([88ec7d1](https://github.com/alislin/markdown-lib/commit/88ec7d1a3efa8328468ca5829f944f66aa391e1d))
* 为浅色主题添加选中文本样式 ([e6d8c54](https://github.com/alislin/markdown-lib/commit/e6d8c5478e65ee74644a0eeb4c553fd245b2d33d))
* 优化 kbd 键盘按键样式为立体渐变效果，并更新相关测试与预览页面 ([58f7518](https://github.com/alislin/markdown-lib/commit/58f7518a7ebd36785b0eab760aa9f2f2099d4f69))

## 1.0.1 (2026-04-01)


### 🐛 Bug Fixes

* 构建前自动创建 dist 目录 ([d2a3708](https://github.com/alislin/markdown-lib/commit/d2a3708f73a8881c5ebe7f7872d5cc283c45ec4f))
* 简化 CI 流程，移除 Playwright 测试（CSS 主题项目仅需构建验证） ([d04a662](https://github.com/alislin/markdown-lib/commit/d04a662720af51bf9e0cd13e2584bc011680715b))
* 使用官方 Playwright GitHub Action ([a120e35](https://github.com/alislin/markdown-lib/commit/a120e35245088949c3bf5ff24c057b7945d3526d))
* 添加 test 脚本并安装 Playwright 浏览器 ([c2aeb90](https://github.com/alislin/markdown-lib/commit/c2aeb9078a3dcf3253be431564a3f1ad627971c7))
* update export templates to match VSCode export format with highlight.js and mermaid support ([cbc5c7c](https://github.com/alislin/markdown-lib/commit/cbc5c7c03baf1172d244c6dcbe007efed67a9239))


### ✨ Features

* 启用 npm provenance 和 OIDC 认证 ([294258d](https://github.com/alislin/markdown-lib/commit/294258d52559003d6d4f3f084b791857d87a4dcf))
* 添加 Playwright 测试依赖并优化主题优先级逻辑 ([79ad73a](https://github.com/alislin/markdown-lib/commit/79ad73ae89c33318a51477fb83f0953dfcf9ffb1))
* add base reset styles ([8eeacd0](https://github.com/alislin/markdown-lib/commit/8eeacd0f691949445a842da2abfd249dedb722d7))
* add blockquote styles ([47dbbbe](https://github.com/alislin/markdown-lib/commit/47dbbbeb3d4237a5b08b723c15bd1cc61cf2f7a3))
* add build script and fix dark theme [@use](https://github.com/use) order ([bed170c](https://github.com/alislin/markdown-lib/commit/bed170c9ac6a840498e4b1b51750094a55ed8f7d))
* add code and code block styles ([9c04831](https://github.com/alislin/markdown-lib/commit/9c0483127f43b65da36045aa1e60f2fde398dd27))
* add CSS variables for theme system ([ef79a6a](https://github.com/alislin/markdown-lib/commit/ef79a6a101a070e65fabc98c30cc97fce14951f4))
* add dark and light theme overrides ([330ef67](https://github.com/alislin/markdown-lib/commit/330ef6776dae161b244ce8ba40b28b95bd4175f0))
* add dark mode auxiliary styles (selection, scrollbar, kbd, mark) ([2cd8421](https://github.com/alislin/markdown-lib/commit/2cd84217e1a49e855d38df6810df8534ad951cb8))
* add form and button styles ([b8dbaf4](https://github.com/alislin/markdown-lib/commit/b8dbaf4115f36c1d40594b734eceb1dbe4f0ed21))
* add image styles ([7a168c3](https://github.com/alislin/markdown-lib/commit/7a168c3384ee33fd7cc9b3ad69c55f0a923bb950))
* add main entry file with all modules ([4a801eb](https://github.com/alislin/markdown-lib/commit/4a801eb5d3377438cb1bfb23c8836ee74f9c33e6))
* add single-theme entry files ([7fe6ef2](https://github.com/alislin/markdown-lib/commit/7fe6ef2ca056f59296a4a97dc7571f80f4b9cbd9))
* add table styles ([896339d](https://github.com/alislin/markdown-lib/commit/896339db036b1e4d174dbe2cd276e69322467ff0))
* add typography styles (headings, lists, links) ([4be57be](https://github.com/alislin/markdown-lib/commit/4be57bebebccd6340a37cc3ed93afabc0043e6ec))
* add unified navigation bar with theme switching across test pages ([b91ac02](https://github.com/alislin/markdown-lib/commit/b91ac020ad655e46a9fc4567426596eeb74b55ff))
* add utility classes (row, col, flex) ([3556290](https://github.com/alislin/markdown-lib/commit/35562902534183781f9a4796f77c83e5986dfac2))
* complete SCSS refactor with modular structure ([8ddac4a](https://github.com/alislin/markdown-lib/commit/8ddac4ae470598a88ca8d9d57babef4c8eb613c5))
* optimize dark mode form styles ([6ccbfe1](https://github.com/alislin/markdown-lib/commit/6ccbfe15ec87cee46f980f8ccd7c373aecc07649))
* optimize dark mode table header styles ([60d7509](https://github.com/alislin/markdown-lib/commit/60d7509e2a8c8a22e1e3a8bffbd7d6333ecae3cf))
