const updateTree = require( './server/tasks/update-tree' );
const server = require( './server' );
const configs = require('./server/tasks/configs.js');
const npm = require( "npm" );
module.exports = {
    setOptions: function ( options ) {
        options['slidesTreePath'] = `${__dirname}/tree.json`;
        options['routesListPath'] = `${__dirname}/routeList.json`;
        options['slidesListModulePathRender'] = 'node_modules/slides-render-angular/src/app/slides/slides-list.module.ts';
        options['slidesListModulePathFinder'] = 'node_modules/slides-finder/src/app/slides/slides-list.module.ts';
        options['slidesListingComponentPath'] = `.`;
        options['slidesRenderComponentPath'] = `.`;
        options['slidesDir'] = 'mockups';
        options['DOMAIN_NAME'] = options.DOMAIN_NAME;
        process.env['ANGULAR_PORT'] = options.ANGULAR_PORT;
        process.env['SNAPSHOTS_PORT'] = options.SNAPSHOTS_PORT;
        process.env['SERVER_PORT'] = options.SERVER_PORT;
        process.env['BASE_HREF_FINDER'] = options.BASE_HREF_FINDER;
        process.env['GH_REPOSITORY_FINDER'] = options.GH_REPOSITORY_FINDER;        
    },

    run: function ( options ) {
        this.setOptions( options );
        npm.load( () => {
            npm.run( 'startBlueberryFinder' );
        } );
        server.startServer( options );
        updateTree.update( options );
    },

    deploy: function ( options ) {
        configs.setEnvProd(options);
        this.setOptions( options );
        npm.load( () => {
            npm.run( 'deployFinder' );
        } );
    }
};
