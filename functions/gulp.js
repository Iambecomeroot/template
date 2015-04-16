var path  = require('path');
var chalk = require('chalk');
var fs    = require('fs');

function load(obj){
	var dependancies = require('./package.json').devDependencies;

	for(var dependancy in dependancies){
		var name = dependancy.replace(/gulp-/, '').replace(/-/g, '');
		if(dependancy in obj){
			name = obj[dependancy];
		}
		console.log(dependancy + ' -> ' + name);
		global[name] = require(dependancy);
	}
}

var manifest = require('./rev-manifest.json');
function updateManifest(file){
	if(!('revOrigPath' in file)){
		return;
	}
	if(!fs.existsSync('rev-manifest.json')){
		fs.writeFileSync('rev-manifest.json', '[]');
	}

	var revmanifest = JSON.parse(fs.readFileSync('rev-manifest.json', 'utf8').replace(/,(?=\n})/g, ''));
	if(typeof revmanifest !== 'object') revmanifest = {};
	revmanifest[path.basename(file.revOrigPath)] = path.basename(file.path);
	manifest = revmanifest;
	fs.writeFileSync('rev-manifest.json', JSON.stringify(revmanifest, null, '	'));
}

function before_each(array, string){
	for(var i = 0, length = array.length; i < length; i++){
		array[i] = string + array[i];
	}
	return array;
}