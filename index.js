const importFresh = require( 'import-fresh' );
const updateTree = importFresh( './server/tasks/update-tree' );
const server = importFresh( './server' );
const configs = importFresh( './server/tasks/configs.js' );
const npm = require( 'npm' );
const fsx = require( 'fs-extra' )
const PATH = require( 'path' );
const routeListPathPath = PATH.normalize( `${PATH.resolve( __dirname, './' )}/data/tmp/routeList.json` );
const proxyConfigsPath = PATH.normalize( `${PATH.resolve( __dirname, '../../' )}/proxy.conf.json` );
const listAll = importFresh( './server/tasks/list-all-slides' );

module.exports = {
    setOptions: function ( options ) {
        options['slidesTreePath'] = `${__dirname}/tree.json`;
        options['routesListPath'] = `${__dirname}/routeList.json`;
        options['slidesListModulePathFinder'] = 'finder/slides-list.module.ts';
        options['slidesListingComponentPath'] = './node_modules/slides-finder/src/app/slides/slides-listing/slides-listing.component';
        options['slidesDir'] = 'mockups';
        options['DOMAIN_NAME'] = options.DOMAIN_NAME;
        process.env['ANGULAR_PORT'] = options.ANGULAR_PORT;
        process.env['SNAPSHOTS_PORT'] = options.SNAPSHOTS_PORT;
        process.env['SERVER_PORT'] = options.SERVER_PORT;
        process.env['BASE_HREF_FINDER'] = options.BASE_HREF_FINDER;
        process.env['GH_REPOSITORY_FINDER'] = options.GH_REPOSITORY_FINDER;
    },
    ensureRoutesList: function () {
        if ( !fsx.existsSync( routeListPathPath ) ) {
            fsx.ensureFileSync( routeListPathPath );
            fsx.writeFileSync( routeListPathPath, '[]', null, 4 );
        }
    },

    ensureProxyConfigs: function ( options ) {
        if ( !fsx.existsSync( proxyConfigsPath ) ) {
            configs.proxy( options );
        }
    },

    run: function ( options ) {
        // options.slidesTreePath = './mockups';
        // listAll.run( options );
        this.setOptions( options );
        module.exports.ensureRoutesList();
        module.exports.ensureProxyConfigs( options );
        configs.ensureEnvDir();
        configs.setEnvDev( options );
        configs.setEnvProd( options );
        npm.load( () => {
            npm.run( 'startFinder' );
        } );
        updateTree.update( options );
        options.routs = JSON.parse( fsx.readFileSync( routeListPathPath, "utf8" ) );
        server.startServer( options );
    },

    deploy: function ( options ) {
        configs.setEnvProd( options );
        this.setOptions( options );
        npm.load( () => {
            npm.run( 'deployFinder' );
        } );
    }
};
