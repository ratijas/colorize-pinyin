/* adjusted for dictionary universal */
/* basically, just <a> tags fiter */

window.ColorizeFilter = {
    rootNode: function () {return null},

    filterNode: function (node) {
        var tagName = node.tagName.toLowerCase();
        return !~['a', 'script', 'style'].indexOf(tagName);
    }
};