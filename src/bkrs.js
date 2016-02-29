/* заточено под bkrs.info */
window.ColorizeFilter = {
    rootNode: function () {
        return window.document.getElementById('ajax_search');
    },

    // return false, if node should not be parsed
    filterNode: function (node) {

        var tagName = node.tagName.toLowerCase();
        var id = node.id;
        var style = node.getAttributeNode( 'style' );

        // skip <a>, <input>, <span style="color:brown">, *[id="userName"]
        if ( tagName == 'a' ||
             tagName == 'input' ||
             ( tagName == 'span' &&
                !!style &&
                style.nodeValue == 'color:brown' ) ||
             id == 'userName' )
        {
            return false;
        }
        return true;
    }
};