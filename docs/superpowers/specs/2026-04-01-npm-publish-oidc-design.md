# npm 发布 + OIDC 认证设计文档

**日期：** 2026-04-01  
**项目：** md-green-theme  
**目标：** 通过 GitHub Actions + OIDC 发布到 npm

## 背景

md-green-theme 是一个 Markdown 主题包，当前版本 1.0.0，尚未发布到 npm。需要建立自动化发布流程，使用 OIDC 认证方式提高安全性。

## 目标

- 自动化 npm 发布流程
- 使用 OIDC 替代长期 token，提高安全性
- 支持自动版本管理
- 自动生成 CHANGELOG
- 发布前自动运行测试

## 技术方案

### 核心技术栈

- **GitHub Actions** - CI/CD 平台
- **npm Provenance + OIDC** - 无密钥认证
- **standard-version** - 自动版本管理
- **commitlint** - 提交信息规范

### 工作流程

```
开发者提交
         ↓
推送代码 → CI 自动测试
         ↓
准备发布 → 运行 npm run release
         ↓
自动更新版本、CHANGELOG、创建 tag
         ↓
推送 tag → GitHub Actions 触发
         ↓
运行测试 → 发布到 npm (OIDC 认证)
```

### 实施路径

由于 npm OIDC 配置需要包已存在，采用分阶段实施：

**阶段 1：首次发布（使用 NPM_TOKEN）**
1. 在 npm 生成 Automation Token
2. 配置 GitHub Secret: NPM_TOKEN
3. 创建 GitHub Actions 工作流（使用 token）
4. 首次发布包

**阶段 2：迁移到 OIDC**
1. 在 npm 网站配置 OIDC 信任
2. 更新 GitHub Actions 工作流
3. 移除 NPM_TOKEN
4. 后续发布使用 OIDC

## 配置详情

### package.json 变更

添加脚本：
```json
{
  "scripts": {
    "release": "standard-version",
    "release:first": "standard-version --first-release"
  }
}
```

添加配置：
```json
{
  "publishConfig": {
    "access": "public",
    "provenance": true
  }
}
```

### GitHub Actions 工作流

**阶段 1 工作流：**
- 触发条件：tag 推送 或 手动触发
- 步骤：测试 → 构建 → 发布（使用 NPM_TOKEN）

**阶段 2 工作流：**
- 添加 OIDC permissions
- 发布命令使用 `--provenance`

### 提交规范

使用 Conventional Commits：
- `feat:` - 新功能
- `fix:` - 修复
- `docs:` - 文档
- `style:` - 格式
- `refactor:` - 重构
- `test:` - 测试
- `chore:` - 构建/工具

## 使用流程

### 首次发布

```bash
# 1. 配置 GitHub Secret: NPM_TOKEN

# 2. 开发完成后
git commit -m "feat: 初始功能"

# 3. 创建首次发布
npm run release:first

# 4. 推送代码和 tag
git push --follow-tags origin main
```

### 后续发布

```bash
# 1. 开发新功能
git commit -m "feat: 添加新功能"

# 2. 创建发布
npm run release

# 3. 推送
git push --follow-tags origin main
```

## 安全考虑

- 不在代码中存储敏感信息
- 使用 GitHub Secrets 存储 NPM_TOKEN（阶段 1）
- 迁移到 OIDC 后移除 token
- npm provenance 提供发布可追溯性

## 成功标准

- ✅ 可以通过推送 tag 触发发布
- ✅ 可以手动触发发布
- ✅ 发布前自动运行测试
- ✅ 自动生成版本号和 CHANGELOG
- ✅ 使用 OIDC 认证（无长期 token）
- ✅ npm provenance 正确显示