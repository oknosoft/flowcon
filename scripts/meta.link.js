/**
 * Копирует dev-версию файлов в node_modules (для отладки библиотек)
 */

const path = require('path');
const fs = require('fs');
const md5File = require('md5-file');
const localNodeModules = path.resolve(__dirname, '../node_modules');
const remoteNodeModules = 'D:\\WORK\\0KNOSOFT\\UniServer\\www\\builder2\\git-osde\\packages';
const {dependencies} = require(path.resolve(__dirname, '../package.json'));
const libs = Object.keys(dependencies).filter(v => /^metadata-/.test(v));

function fromDir(startPath, filter, callback) {

  if(!fs.existsSync(startPath)) {
    console.log('no dir ', startPath);
    return;
  }

  const files = fs.readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    if(/node_modules/.test(filename)){
      continue;
    }
    const stat = fs.lstatSync(filename);
    if(stat.isDirectory()) {
      fromDir(filename, filter, callback); //recurse
    }
    else if(filter.test(filename)) callback(filename);
  };
};

let copied;
for (const lib of libs) {
  const lpath = path.resolve(localNodeModules, lib);
  const rpath = path.resolve(remoteNodeModules, lib);
  let i = 0;
  fromDir(rpath, /\.(css|js|mjs|md|map)$/, (rname) => {
    const name = rname.replace(rpath, '');
    const lame = path.join(lpath, name);
    if(!fs.existsSync(lame) || (md5File.sync(rname) != md5File.sync(lame))){
      i++;
      fs.createReadStream(rname).pipe(fs.createWriteStream(lame));
    }
  });
  if(i){
    copied = true;
    console.log(`from ${rpath} written ${i} files`);
  }
}
if(!copied){
  console.log(`all files match`);
}
