var express = require( 'express' );
const newSlide = require( './tasks/new-slide.js' );
const duplicateSlide = require( './tasks/duplicate-slide.js' );
const bodyParser = require( 'body-parser' );
var openInEditor = require( 'open-in-editor' );
var updateTree = require( './tasks/update-tree.js' );
const persistency = require( './tasks/persistency' );
var snapshots = require( './tasks/snapshots-server' );
const PATH = require( 'path' );
const git = require( 'simple-git' )();

module.exports = {
    updateTree: updateTree,
    startServer: function ( options ) {

        const app = express();
        app.use( bodyParser.urlencoded( { extended: true } ) );
        app.use( bodyParser.json() );

        var editor = openInEditor.configure( {
            editor: 'code' // Important: VS Code should be installed using System Installer.
        }, function ( err ) {
            console.error( 'Something went wrong: ' + err );
        } );

        app.use( function ( req, res, next ) {
            req.headers['content-type'] = "application/json";
            next();
        } );

        async function gitStatus() {
            return await git.status();
        }

        app.post( '/api/slides/git-status', ( request, response ) => {
            console.log( gitStatus() );
        } );


        app.post( '/api/slides/rename', ( request, response ) => {
            persistency.rename( request.body.body.path );
            updateTree.update( options );
        } );

        app.post( '/api/slides/addFolder', ( request, response ) => {
            persistency.addFolder( request.body.body.path, options );
        } );

        app.post( '/api/slides/deleteFolder', ( request, response ) => {
            persistency.deleteFolder( request.body.body.path );
        } );

        app.post( '/api/slides/editTS', ( request, response ) => {
            editor.open( `mockups/${request.body.body.node.id}/component.ts` )
                .then( function () {
                    console.log( `open: ${request.body.body.node.id}/component.ts` );
                }, function ( err ) {
                    console.error( 'Something went wrong: ' + err );
                } );
        } );

        app.post( '/api/slides/editHTML', ( request, response ) => {
            editor.open( `mockups/${request.body.body.node.id}/template.html` )
                .then( function () {
                    console.log( `open: ${request.body.body.node.id}/template.html` );
                }, function ( err ) {
                    console.error( 'Something went wrong: ' + err );
                } );
        } );

        app.post( '/api/slides/move', ( request, response ) => {
            console.log( 'server: move' );
            persistency.move( request.body );
            updateTree.update( options );
        } );

        app.post( '/api/slides/blank', ( request, response ) => {
            slideName = newSlide.blank();
            persistency.assignSlide( slideName, request.body.body, options );
        } );

        app.post( '/api/slides/delete', ( request, response ) => {
            console.log( request.body.body.node );
            persistency.deleteSlide( request.body.body.node, options );
        } );

        app.post( '/api/slides/duplicate', ( request, response ) => {
            duplicateSlide.duplicate( request.body.body.node, options );
        } );
        app.post( '/api/slides/updateSnapshots', ( request, response ) => {
            let opt = {
                slide: request.body.body.node,
                force: request.body.body.force,
                PORT: options.DEV_RENDER_PORT,
                slidesPath: PATH.normalize( `${PATH.resolve( __dirname, '../../' )}/slides-finder/src/slides-cache` )
            };
            snapshots.generate( opt, options.routs );
        } );

        app.listen( options.SERVER_PORT, () => {
            console.log( `Server listening on ${options.SERVER_PORT}` );
        } );
    }
};

