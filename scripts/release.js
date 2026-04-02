const { execSync } = require('child_process');
const { readFileSync, existsSync } = require('fs');
const path = require('path');

function run(cmd, options = {}) {
  try {
    return execSync(cmd, { stdio: 'pipe', encoding: 'utf8', ...options });
  } catch (e) {
    if (options.exit !== false) {
      console.error(`❌ 命令执行失败: ${cmd}`);
      console.error(e.message);
      process.exit(1);
    }
    throw e;
  }
}

function log(msg) {
  console.log(`📌 ${msg}`);
}

console.log('\n🔄 开始发布流程...\n');

// 1. 检查工作目录状态
log('检查工作目录状态...');
const status = run('git status --porcelain').trim();
if (status) {
  console.error('❌ 工作目录有未提交的更改，请先提交或暂存');
  process.exit(1);
}

// 2. 检查当前分支
log('检查当前分支...');
const branch = run('git rev-parse --abbrev-ref HEAD').trim();
if (branch !== 'dev') {
  console.error(`❌ 当前不在 dev 分支，当前分支: ${branch}`);
  process.exit(1);
}

// 3. 读取版本号
log('读取版本号...');
const pkgPath = path.join(process.cwd(), 'package.json');
if (!existsSync(pkgPath)) {
  console.error('❌ 未找到 package.json');
  process.exit(1);
}
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const version = pkg.version;
const tagName = `v${version}`;
log(`当前版本: ${version}, Tag: ${tagName}`);

// 4. 检查 tag 是否已存在
log('检查 tag 是否已存在...');
const existingTags = run('git tag').trim().split('\n').filter(Boolean);
if (existingTags.includes(tagName)) {
  console.error(`❌ Tag ${tagName} 已存在，请先更新版本号`);
  process.exit(1);
}

// 5. 切换到 main 分支
log('切换到 main 分支...');
run('git checkout main');

// 6. 合并 dev 到 main
log('合并 dev 到 main...');
try {
  run('git merge dev --no-edit');
} catch (e) {
  run('git merge --abort', { exit: false });
  run('git checkout dev');
  console.error('❌ 合并冲突，请手动解决后重试');
  process.exit(1);
}
log('合并成功');

// 7. 创建 tag
log(`创建 tag: ${tagName}...`);
run(`git tag ${tagName}`);

// 8. 推送 main 分支
log('推送 main 分支...');
run('git push origin main');

// 9. 推送 tag
log(`推送 tag: ${tagName}...`);
run(`git push origin ${tagName}`);

// 10. 切换回 dev 分支
log('切换回 dev 分支...');
run('git checkout dev');

console.log('\n✅ 发布完成!\n');
