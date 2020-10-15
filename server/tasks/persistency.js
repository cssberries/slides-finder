const fs = require('fs-extra');
const randomize = require('randomatic');
const updateTree = require('./update-tree');
const PATH = require( 'path' );

removeUndefined = function (json) {
    return JSON.parse(JSON.stringify(json))
}
module.exports = {
    newFolder: function (node) {
        let folder = {};
        folder.slidePath = 'mockups';
        folder.name = 'New folder';
        folder.id = randomize('A', 10);
        folder.state = `${node.state}/New folder`;
        folder.index = '\u0000';
        folder.children = [];
        return folder;
    },

    rename: function (node) {
        let nodes = this.traverseFind(JSON.parse(fs.readFileSync('tree.json', 'utf8')), node, 'rename');
        fs.writeFileSync('tree.json', JSON.stringify(nodes, null, 4));
    },

    addFolder: function (node, opt) {
        console.log(__dirname);
        let nodes = this.traverseFind(JSON.parse(fs.readFileSync('tree.json', 'utf8')), node, 'addFolder');
        fs.writeFileSync('tree.json', JSON.stringify(nodes, null, 4));
        updateTree.update(opt);
    },
    assignSlide: function (slideName, node, opt) {
        let nodes = this.traverseAssign(JSON.parse(fs.readFileSync('tree.json', 'utf8')), node, slideName);
        fs.writeFileSync('tree.json', JSON.stringify(nodes, null, 4));
        updateTree.update(opt);
    },
    duplicateSlide: function (node, opt) {
        let originalPath = `src/${node.slidePath.replace(/%20/g, ' ')}`;
        let parentPath = originalPath.substr(0, originalPath.lastIndexOf('/'));
        compName = randomize('A', 10);
        this.traverseAssign(JSON.parse(fs.readFileSync('tree.json', 'utf8')), node, compName);

        let componentContent = fs.readFileSync(`${originalPath}/component.ts`, "utf8");
        let componentFile = `${parentPath}/${compName}component.ts`;
        componentContent = content.replace(/(?<=\bexport class\s)(\w+)/g, compName);
        fs.writeFileSync(componentFile, componentContent);
        //
        let templateContent = fs.readFileSync(`${originalPath}/template.html`, "utf8");
        let templateFile = `${parentPath}/${compName}template.html`;
        templateContent = content.replace(/(?<=\bexport class\s)(\w+)/g, compName);
        fs.writeFileSync(templateFile, templateContent);
        //

        updateTree.update(opt);
    },

    move: function (node) {
        nodes = this.updateState(node.newModel, node.node, node.to.parent.state);
        fs.writeFileSync(PATH.resolve('tree.json'), JSON.stringify(node.newModel, null, 4));
    },

    updateState: function (persistency, node, parentState) {
        for (let i = 0; i < persistency.length; i++) {
            if (persistency[i].id === node.id) {
                persistency[i].state = `${parentState}/${node.id}`;
            } else {
                if (persistency[i].children) {
                    this.updateState(persistency[i].children, node, parentState);
                }
            }
        }
        return persistency;
    },

    deleteFolder: function (node) {
        let nodes = this.traverseFind(JSON.parse(fs.readFileSync('tree.json', 'utf8')), node, 'deleteFolder');
        fs.writeFileSync('tree.json', JSON.stringify(nodes, null, 4));
    },
    deleteSlide: function (node, opt) {
        let nodes = this.traverseDelete(JSON.parse(fs.readFileSync('tree.json', 'utf8')), node);
        fs.writeFileSync('tree.json', JSON.stringify(nodes, null, 4));
        updateTree.update(opt);
    },

    traverseAssign: function (persistency, node, slideName) {
        for (let i = 0; i < persistency.length; i++) {
            if (persistency[i].state === node.state) {
                // console.log(node.state);

                let newSlide = {};
                newSlide.slidePath = `../../../../mockups/${slideName}`;
                newSlide.name = slideName;
                newSlide.id = slideName;
                newSlide.state = `${node.state}/${slideName}`;
                newSlide.index = "\u0004";
                newSlide.component = slideName;
                persistency[i].children.push(newSlide);

            } else {
                if (persistency[i].children) {
                    this.traverseAssign(persistency[i].children, node, slideName);
                }
            }
        }
        return persistency;
    },

    traverseMove: function (persistency, node) {
        for (let i = 0; i < persistency.length; i++) {
            if (persistency[i].state === node.to.parent.state) {
                node.node.index = node.to.index;
                node.node.state = `${persistency[i].state}/${node.node.name}`;
                persistency[i].children.push(node.node);
            } else {
                if (persistency[i].children) {
                    this.traverseMove(persistency[i].children, node);
                }
            }
        }
        return persistency;
    },

    traverseDelete: function (persistency, node) {
        for (let i = 0; i < persistency.length; i++) {
            if (persistency[i].state === node.state) {
                fs.removeSync(`src/${node.slidePath}`);
                persistency.splice(i, 1);
            } else {
                if (persistency[i].children) {
                    this.traverseDelete(persistency[i].children, node);
                }
            }
        }
        return persistency;
    },
    traverseFind: function (persistency, node, action) {
        let state = node.state;
        for (let i = 0; i < persistency.length; i++) {
            if (persistency[i].state === state) {
                switch (action) {
                    case 'addFolder': persistency[i].children.push(this.newFolder(persistency[i])); break;
                    case 'assignSlide': persistency[i].children.push(this.newFolder(persistency[i])); break;
                    case 'deleteFolder': persistency.splice(i, 1); break;
                    case 'rename':
                        let stateParts = persistency[i].state.split('/');
                        stateParts.pop();
                        let parentState = stateParts.join('/');
                        if (parentState !== '') {
                            parentState = `${parentState}/`;
                        }
                        persistency[i].state = `${parentState}${node.name}`;
                        persistency[i].name = node.name;
                        this.traverseRename(persistency[i].children, node, persistency[i].state);
                        break;
                }

            } else {
                if (persistency[i].children) {
                    this.traverseFind(persistency[i].children, node, action);
                }
            }
        }
        return persistency;
    },

    traverseRename: function (nodes, node, parentState) {
        for (let i = 0; i < nodes.length; i++) {
            // console.log(nodes[i].state);
            nodes[i].state = `${parentState}/${nodes[i].name}`;
            if (nodes[i].children) {
                let parentState = nodes[i].state;
                this.traverseRename(nodes[i].children, node, parentState);
            }
        }
        return nodes;
    }
}
