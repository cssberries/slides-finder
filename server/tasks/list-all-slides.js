const fs = require( 'fs' );
var sortJsonArray = require( 'sort-json-array' );

var slides = [{
    "slidePath": "mockups",
    "name": "mockups",
    "id": "IFSFEGVRLT",
    "state": "mockups",
    "children": []
}];

var dirTree = require( 'directory-tree' );

module.exports = {

    setComponentName: function ( node, id ) {
        let compPath = node.path.replace( /\\/g, '/' );
        let componentContent = fs.readFileSync( compPath, 'utf8' );
        let currentName = componentContent.match( /(?<=\bexport class\s)(\w+)/g );
        if ( currentName !== node.name ) {
            componentContent.replace( `${currentName}`, id );
            fs.writeFileSync( compPath, componentContent );
        }
    },

    getTree: function ( path ) {
        return dirTree( path );
    },

    getIndex: function ( name ) {
        let int = parseInt( name.match( /.+?(?=___)/ ) );
        let index = String.fromCharCode( int );
        return index;
    },

    traverseTree: function ( node, i ) {
        let slide = {};
        if ( !node ) {
            return
        }
        node.path = node.path.replace( /\\/g, '/' ).replace( 'src/', '' );
        slide.id = node.path.replace( 'mockups/', '' ).replace( '/component.ts', '' );
        slide.slidePath = `render/mockups/${slide.id}`;
        slide.name = slide.id;
        slide.state = `render/mockups/${slide.id}`;
        slide.index = this.getIndex( node.name );
        slide.component = slide.id;
        if ( node.children ) {
            for ( var i = 0; i < node.children.length; i++ ) {
                if ( node.children[i].name === '.DS_Store' ) {
                    node.children.splice( i, 1 );
                    i--;
                } else
                    if ( node.children[i].name.includes( '.html' ) ) {
                        node.children.splice( i, 1 );
                        i--;
                    } else {
                        this.traverseTree( node.children[i], i );
                    }
            }
            sortJsonArray( node.children, 'index', 'asc' );
        } else
            if ( node.path.includes( '.ts' ) ) {
                this.setComponentName( node, slide.id );

                slides[0].children.push( slide );
            }
    },
    run: function ( options ) {
        this.traverseTree( this.getTree( options.slidesTreePath ) );
        fs.writeFileSync( 'persistency/tree.json', JSON.stringify( slides, null, 4 ).replace( /\\\\/g, '/' ) );
    }
};