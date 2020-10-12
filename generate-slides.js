const blueberry-finder = require('./index.js');

let options = {
    'slidesDir': 'src/mockups',
    'slidesTreePath': `${__dirname}/tree.json`,
    'rootDir': ''
}

blueberry-finder.run(options);
