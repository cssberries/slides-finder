const chokidar = require('chokidar');
const log = console.log;
const fsx = require('fs-extra');
const PATH = require('path');

let states = [];
if (fsx.existsSync(`${PATH.resolve( __dirname, '../../' )}/finder/data/tmp/routeList.json`)) {
    states = require( '../../finder/data/tmp/routeList.json' );
}
const snapshots = require('./snapshots-server')
const watcher = chokidar.watch('../../lrc-mockups/mockups', {
    persistent: true,
});

function getState(fileName){
    states.forEach(element => {
        if (fileName.includes(element.componentName)) {
            let opt = {
                slide: {state: element.path, component: element.componentName},
                force: false,
                PORT: 5500
            };
            console.log(opt);
            snapshots.generate(opt);
        }
    });
}

watcher
  .on('addDir', path => log(`Directory ${path} has been added`))
//   .on('unlinkDir', path => log(`Directory ${path} has been removed`))
//   .on('error', error => log(`Watcher error: ${error}`))
//   .on('ready', () => log('Initial scan complete. Ready for changes'))
//   .on('raw', (event, path, details) => {log('Raw event info:', event, path, details)})
  .on('change', async path => {
    
    getState(path)
    // snapshots.generate(opt);
  })
  ;