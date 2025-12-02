const fs = require('fs');

function processDepcheck(packageJsonPath, depcheckJsonPath, location) {
  if (!fs.existsSync(depcheckJsonPath)) {
    console.log(`No depcheck results for ${location}`);
    return false;
  }
  
  try {
    const depcheckContent = fs.readFileSync(depcheckJsonPath, 'utf-8');
    const depcheckData = JSON.parse(depcheckContent);
    const unusedDeps = depcheckData.dependencies || [];
    
    if (unusedDeps.length === 0) {
      console.log(`No unused dependencies in ${location}`);
      return false;
    }
    
    console.log(`📦 Found unused dependencies in ${location}:`, unusedDeps);
    
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    let changed = false;
    
    unusedDeps.forEach(dep => {
      if (pkg.dependencies && pkg.dependencies[dep]) {
        console.log(`Removing dependency: ${dep}`);
        delete pkg.dependencies[dep];
        changed = true;
      }
      if (pkg.devDependencies && pkg.devDependencies[dep]) {
        console.log(`Removing devDependency: ${dep}`);
        delete pkg.devDependencies[dep];
        changed = true;
      }
    });
    
    if (changed) {
      fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
      console.log(`✅ Updated ${packageJsonPath}`);
    }
    
    return changed;
  } catch (error) {
    console.error(`Error processing ${location}:`, error.message);
    return false;
  }
}

let anyChanges = false;
anyChanges = processDepcheck('package.json', 'depcheck-root.json', 'root') || anyChanges;
anyChanges = processDepcheck('apps/api/package.json', 'depcheck-api.json', 'apps/api') || anyChanges;
anyChanges = processDepcheck('apps/web/package.json', 'depcheck-web.json', 'apps/web') || anyChanges;

if (anyChanges) {
  console.log('cleaned_deps=true');
  fs.appendFileSync(process.env.GITHUB_OUTPUT, 'cleaned_deps=true\n');
}
