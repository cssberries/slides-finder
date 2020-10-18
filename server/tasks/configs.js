var fsx = require( 'fs-extra' );
const PATH = require( 'path' );
module.exports = {
	
	proxy: function update( options ) {
		let content = `{
			"/api/*": {
				"target": "http://localhost:${options.SERVER_PORT}",
				"secure": false,
				"changeOrigin": true,
				"logLevel": "debug"
			}
		}`;
		let jsonPath = PATH.normalize( `${PATH.resolve( __dirname, '../../' )}/proxy.conf.json` );
		
        fsx.writeFileSync( jsonPath, content, null, 4 );
	},

	setEnvDev: function ( options ) {
        
        let content = `export const environment = {
            production: false,
            domainName: 'http://localhost:${options.DEV_RENDER_PORT}',
        };`;

        let envPath = options.envPath || PATH.normalize( `${PATH.resolve( __dirname, '../../' )}/src/environments/` );
		let path = `${envPath}environment.ts`;
		
        fsx.writeFileSync( path, content, null, 4 );
    },
    
    setEnvProd: function ( options ) {
        
        let content = `export const environment = {
            production: true,
            domainName: '${options.DOMAIN_NAME}',
        };`;

        let envPath = options.envPath || PATH.normalize( `${PATH.resolve( __dirname, '../../' )}/src/environments/` );
		let path = `${envPath}environment.prod.ts`;
		
        fsx.writeFileSync( path, content, null, 4 );
    },

    ensureEnvDir: function () {
        let path = PATH.normalize( `${PATH.resolve( __dirname, '../../' )}/src/environments/` );
        if (!fsx.existsSync(path)) {
            fsx.ensureDirSync(path);
        }
    }
};
