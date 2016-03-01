/* adjusted for dictionary universal */
/* basically, just <a> tags fiter */

window.ColorizeFilter = {
    rootNode: function () {return null},

    filterNode: function (node) {
        return 'a' !== node.tagName.toLowerCase();
    }
};