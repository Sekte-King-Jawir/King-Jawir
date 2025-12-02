const fs = require('fs');
const { execSync } = require('child_process');

try {
  // Run knip with JSON reporter
  const knipOutput = execSync('bun run knip --production --reporter json', { 
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  const knipData = JSON.parse(knipOutput);
  let hasChanges = false;
  
  // Process each workspace
  for (const [workspace, data] of Object.entries(knipData.files || {})) {
    const unusedDeps = data.unlisted || [];
    const unusedDevDeps = data.unresolved || [];
    
    if (unusedDeps.length === 0 && unusedDevDeps.length === 0) continue;
    
    // Determine package.json path
    let pkgPath = 'package.json';
    if (workspace.includes('apps/api')) pkgPath = 'apps/api/package.json';
    else if (workspace.includes('apps/web')) pkgPath = 'apps/web/package.json';
    else if (workspace.includes('packages/')) {
      const match = workspace.match(/packages\/([^\/]+)/);
      if (match) pkgPath = `packages/${match[1]}/package.json`;
    }
    
    if (!fs.existsSync(pkgPath)) continue;
    
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    let pkgChanged = false;
    
    [...unusedDeps, ...unusedDevDeps].forEach(dep => {
      if (pkg.dependencies && pkg.dependencies[dep]) {
        console.log(`Removing dependency from ${pkgPath}: ${dep}`);
        delete pkg.dependencies[dep];
        pkgChanged = true;
      }
      if (pkg.devDependencies && pkg.devDependencies[dep]) {
        console.log(`Removing devDependency from ${pkgPath}: ${dep}`);
        delete pkg.devDependencies[dep];
        pkgChanged = true;
      }
    });
    
    if (pkgChanged) {
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
      hasChanges = true;
    }
  }
  
  if (hasChanges) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, 'cleaned_deps=true\n');
    console.log('✅ Cleaned unused dependencies');
  } else {
    console.log('ℹ️ No unused dependencies found');
  }
} catch (error) {
  console.log('ℹ️ Knip check completed, no action needed');
}
