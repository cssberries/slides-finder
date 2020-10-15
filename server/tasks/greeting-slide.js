const fsx = require( 'fs-extra' );
const newSlide = require( './new-slide.js' );
const randomize = require( 'randomatic' );
const slideName = randomize( 'A', 10 );
var snapshots = require( './snapshots-server' );
let tree = `[
    {
        "slidePath": "../../../../mockups",
        "name": "mockups",
        "id": "${randomize( 'A', 10 )}",
        "state": "mockups",
        "children":[
            {
                "id": "${slideName}",
                "slidePath": "../../../../mockups/${slideName}",
                "name": "${slideName}",
                "state": "mockups/${slideName}",
                "index": "",
                "component": "${slideName}"
            }
        ]
    }
]`;

module.exports = {
	create: function (options) {
		fsx.ensureDirSync( 'mockups' );
		console.log(tree);
		fsx.writeFileSync( 'tree.json', tree, null, 4, function ( err ) {
            if ( err ) {
                response.send( "failed to save" );
            } else {
                response.send( "succeeded in saving" );
            }
        });
        newSlide.greeting(slideName);
        let opt = {
            "slide": "",
            "force": true,
            "port": options.ANGULAR_PORT
        };
		// snapshots.generate(opt);
	}
};
