// build.js

const sass = require('sass');
const fs = require('fs');
const path = require('path');

const targets = [
  { input: 'src/scss/md-green.scss', output: 'dist/md-green.css' },
  { input: 'src/scss/md-green-light.scss', output: 'dist/md-green-light.css' },
  { input: 'src/scss/md-green-dark.scss', output: 'dist/md-green-dark.css' },
  { input: 'src/scss/md-green-base.scss', output: 'dist/md-green-base.css' },
];

console.log('Building markdown theme...\n');

targets.forEach(({ input, output }) => {
  try {
    const result = sass.compile(input, {
      style: 'compressed',
      loadPaths: ['src/scss'],
    });
    
    fs.writeFileSync(output, result.css);
    
    const sizeKB = (result.css.length / 1024).toFixed(2);
    console.log(`✓ ${output} (${sizeKB} KB)`);
  } catch (error) {
    console.error(`✗ ${input}: ${error.message}`);
    process.exit(1);
  }
});

console.log('\nBuild complete!');