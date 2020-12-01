var fsx = require( 'fs-extra' );
var fs = require( 'fs' );
var routs = require( './routs.js' );
var slidesListFinder = require( './slides-list-finder' );
var slidesListRender = require( './generate-slides-angular' );
var greetingSlide = require( './greeting-slide' );
const PATH = require( 'path' );
module.exports = {
    update: function update( options ) {
        // console.log( `__dirname: ${__dirname}` );
        if ( !fs.existsSync( 'render/mockups' ) ) {
            console.log( 'mockups folder doesn\'t exists!' );
            greetingSlide.create(options);
        }

        let routeListPath = PATH.normalize( `${PATH.resolve( __dirname, '../../' )}/data/tmp/routeList.json` );
        // let persistencyPath = PATH.normalize( `${PATH.resolve( __dirname, '../../' )}/persistency/tree.json` );
        let persistencyPath = 'persistency/tree.json';

        fsx.writeFileSync( routeListPath, JSON.stringify( routs.update( this.getTree( persistencyPath ) ), null, 4 ) );
        slidesListFinder.modify( this.getTree( persistencyPath ), options );
        slidesListRender.generate( this.getTree( persistencyPath ), options );
    },
    
    getTree: function getTree( path ) {
        return JSON.parse( fs.readFileSync( path, 'utf8' ) )[0];
    }
};
