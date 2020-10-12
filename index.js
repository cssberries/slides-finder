const updateTree = require( 'slides-server/tasks/update-tree' );
const server = require( 'slides-server' );
const npm = require( "npm" );
module.exports = {
    setOptions: function ( options ) {
        options['slidesTreePath'] = `${__dirname}/tree.json`;
        options['routesListPath'] = `${__dirname}/routeList.json`;
        options['slidesListModulePathRender'] = 'node_modules/blueberry-render/src/app/slides/slides-list.module.ts';
        options['slidesListModulePathFinder'] = 'node_modules/blueberry-finder/src/app/slides/slides-list.module.ts';
        options['slidesListingComponentPath'] = `.`;
        options['slidesRenderComponentPath'] = `.`;
        options['slidesDir'] = 'mockups';
        process.env['ANGULAR_PORT'] = options.ANGULAR_PORT;
        process.env['SNAPSHOTS_PORT'] = options.SNAPSHOTS_PORT;
        process.env['SERVER_PORT'] = options.SERVER_PORT;
        process.env['BASE_HREF_FINDER'] = options.BASE_HREF_FINDER;
        process.env['DEPLOY_REPO'] = options.DEPLOY_REPO;
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
        this.setOptions( options );
        npm.load( () => {
            npm.run( 'deployFinder' );
        } );
    }
};
