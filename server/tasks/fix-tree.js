const fs = require('fs');

let persistency = fs.readFileSync('data/tree.json', 'utf8');
persistency = JSON.parse(persistency)[0];

function traverseTree(node, parentState) {
    let state = `${parentState}/${node.name}`;
    node.state = state.replace('/mockups', 'mockups');
    if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
            traverseTree(node.children[i], node.state);
        }
    } else {
        let fileName = node.name;
        // let compPath = `src/${node.slidePath.replace(/\\/g, '/')}/component.ts`;
        // let componentContent = fs.readFileSync(compPath, 'utf8');
        // let currentName = componentContent.match(/(?<=\bexport class\s)(\w+)/g)[0];
        // let stateArray = node.state.split('/');
        // stateArray[1] = fileName;

        // componentContent = componentContent.replace(currentName, fileName);
        node.id = fileName;
        node.component = fileName;
        // fs.writeFileSync(compPath, componentContent);
    }


}
function fixPersistency() {
    traverseTree(persistency, '');
    return [persistency];
};

fs.writeFileSync('data/tree.json', JSON.stringify(fixPersistency(), null, 4));
