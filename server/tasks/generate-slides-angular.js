const fs = require( 'fs' );
const PATH = require( 'path' );

var list = [];
var imports = [];
module.exports = {
    generate: function ( tree, options ) {
        imports = [];
        list = [];
        listMap = [];
        function traverse( node ) {
            if ( node.children ) {
                let childrenNum = node.children.length;
                let compImport = '';
                for ( let i = 0; i < childrenNum; i++ ) {
                    let childNode = node.children[i];
                    if ( node.children[i].component ) {
                        let compName = node.children[i].component;

                        compImport = module.exports.setImportDeclaration( compName, `${childNode.slidePath}/component.ts`, options );
                        if ( !list.includes( compName ) ) {
                            list.push( compName );
                            imports.push( compImport );
                        }
                        let compPath = node.children[i].state.replace( /\\/g, '/' ).replace( '.component', '' );
                        mapItem = `{path: '${compPath}', component: ${compName}}`;
                        listMap.push( mapItem );
                    }
                    else {
                        let compPath = node.children[i].state.replace( /\\/g, '/' );
                        mapItem = `{path: '${compPath}', component: SlidesListingComponent}`;
                        listMap.push( mapItem );
                    }
                    traverse( childNode );
                }
            }
        };
        listMap.push( `{path: '${tree.state}', component: SlidesListingComponent}` );

        imports.push( module.exports.setImportDeclaration( 'SlidesComponent', 'shared/slides/slides.component', options ) );
        traverse( tree );
        let moduleContent =
            `
///////////////////////////////////////////////////////////////////////
//
//                               ATTENTION!!!
//
//   Generated by slides-generator for Angular.
//   Don't edit this file - all changes will be overwritten.
//
///////////////////////////////////////////////////////////////////////

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlidesListingComponent } from '${options.slidesListingComponentRenderPath}';

${imports.join( '\n' )}

export const SlidesList = [
SlidesListingComponent,
${list.join( ',\n' )}
];
export const SlidesListMap = [
${listMap.join( ',\n' )}
];
`;
        fs.writeFileSync( options.slidesListModulePathRender, moduleContent, null, 4, function ( err ) {
            if ( err ) {
                response.send( "failed to save" );
            } else {
                response.send( "succeeded in saving" );
            }
        } )
    },
    setImportDeclaration: function ( name, path, options ) {
        if ( name !== 'SlidesComponent' ) {
            let newPath = PATH.join( '', PATH.normalize( path ) );
            let relativePathToMockups = '';
            return `import { ${name} } from '${relativePathToMockups}${newPath.replace( /\\/g, '/' ).replace( '.ts', '' )}';`

        }
    }
};
