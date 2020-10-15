var fsx = require( 'fs-extra' );
var fs = require( 'fs' );
var routs = require( './routs.js' );
var slidesListFinder = require( './slides-list-finder' );
var slidesListRender = require( './generate-slides-angular' );
var greetingSlide = require( './greeting-slide' );
const PATH = require( 'path' );
module.exports = {
    update: function update( options ) {
        if ( !fs.existsSync( 'mockups' ) ) {
            console.log( 'mockups folder doesn\'t exists!' );
            greetingSlide.create(options);
        }
        let routeListPathPath = PATH.normalize( `${PATH.resolve( __dirname, '../../' )}/data/tmp/routeList.json` );
        fsx.writeFileSync( routeListPathPath, JSON.stringify( routs.update( this.getTree( 'tree.json' ) ), null, 4 ) );
        slidesListFinder.modify( this.getTree( 'tree.json' ), options );
        slidesListRender.generate( this.getTree( 'tree.json' ), options );
    },
    
    getTree: function getTree( path ) {
        return JSON.parse( fs.readFileSync( path, 'utf8' ) )[0];
    }
};
