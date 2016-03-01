/**
 * window.ColorizeFilter: {
 *   rootNode()
 *   filterNode()
 * }
 */

/**
 * initialize
 */
window.onDomReady(function () {

    var colorizeFilter = window.ColorizeFilter,
        rootNode, nodeFilter;
    if (colorizeFilter) {
        rootNode = colorizeFilter.rootNode();
        nodeFilter = colorizeFilter.nodeFilter;
    }
    if (!rootNode) {
        rootNode = document.querySelector('body');
    }
    colorizeDOM(rootNode, nodeFilter);
});