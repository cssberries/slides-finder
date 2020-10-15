module.exports = {
    update: function (tree) {
        var states = [];
        function setStatePath(p) {
            path = p;
            path = path.replace('.ts', '');
            return path;
        }
        function traverse(node) {
            let state = {};
            state.path = setStatePath(node.state);
            if (node.children) {
                state.componentName = 'FolderComponent';
            } else state.componentName = node.component;
            states.push(state);
            if (node.children) {
                let childrenNum = node.children.length;
                for (let i = 0; i < childrenNum; i++) {
                    traverse(node.children[i]);
                }
            }
        };
        traverse(tree);
        return states;
    }
};
