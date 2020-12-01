const importFresh = require( 'import-fresh' );
const fs = require('fs-extra');
const randomize = require('randomatic');
const updateTree = importFresh( './update-tree' );

module.exports = {
    
    duplicate: function (node, options) {
        console.log(node);
        let originalPath = `render/mockups/${node.name}`;
        console.log(`originalPath: ${originalPath}`);
        let parentPath = originalPath.substr(0, originalPath.lastIndexOf('/'));

        let parentStateParts = node.state.split('/');
        parentStateParts.pop();
        let parentState = parentStateParts.join('/');

        compName = randomize('A', 10);
        fs.ensureDirSync(`${parentPath}/${compName}`);
        //
        let componentContent = fs.readFileSync(`${originalPath}/component.ts`, "utf8");
        componentContent = componentContent.replace(/(?<=\bexport class\s)(\w+)/g, compName);
        let componentFile = `${parentPath}/${compName}/component.ts`;
        fs.writeFileSync(componentFile, componentContent);
        //
        let templatePath = `${originalPath}/template.html`;
        let templateContent = '';

        if (fs.existsSync(templatePath)) {
            templateContent = fs.readFileSync(templatePath, "utf8");
        }

        templateContent = templateContent.replace(/(?<=\bexport class\s)(\w+)/g, compName);
        let templateFile = `${parentPath}/${compName}/template.html`;
        fs.writeFileSync(templateFile, templateContent);
        //
        let stylePath = `${originalPath}/style.less`;
        let styleContent = '';

        if (fs.existsSync(stylePath)) {
            styleContent = fs.readFileSync(stylePath, "utf8");
        }

        styleContent = styleContent.replace(/(?<=\bexport class\s)(\w+)/g, compName);
        let styleFile = `${parentPath}/${compName}/style.less`;
        fs.writeFileSync(styleFile, styleContent);
        //
        let nodes = this.traverse( JSON.parse( fs.readFileSync( 'persistency/tree.json', 'utf8' ) ), parentState, compName );
        fs.writeFileSync( 'persistency/tree.json', JSON.stringify( nodes, null, 4 ) );

        updateTree.update(options);
    },
    
    traverse: function (persistency, parentState, slideName) {
        for (let i = 0; i < persistency.length; i++) {
            if (persistency[i].state === parentState) {
                let newSlide = {};
                newSlide.slidePath = `../render/mockups/${slideName}`;
                newSlide.name = slideName;
                newSlide.id = slideName;
                newSlide.state = `${parentState}/${slideName}`;
                newSlide.index = "\u0004";
                newSlide.component = slideName;
                persistency[i].children.push(newSlide);

            } else {
                if (persistency[i].children) {
                    this.traverse(persistency[i].children, parentState, slideName);
                }
            }
        }
        return persistency;
    }
}
