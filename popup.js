/**
 * 获取element
 *
 * @param {string} id 
 * @return {HTMLElement}
 */
function g( id ) {
    return document.getElementById( id );
}


/**
 * 显示消息
 *
 * @param {string} text 
 */
function msg( text ) {
    g( 'Msg' ).innerText = text;
}

/**
 * 保存当前tab
 */
function saveTab() {
    chrome.windows.getCurrent( function ( currentWin ) {
        chrome.tabs.query( 
            { windowId: currentWin.id },
            function ( tabs ) {
                var saved   = [];
                var titles  = [];
                var i       = 0;
                var len     = tabs.length;
                var count   = parseInt( localStorage.getItem( KEY_RECORDCOUNT ), 10 );
                var url;
                var title;

                for ( ; i < len; i++ ) {
                    saved.push( tabs[ i ].url );
                    titles.push( tabs[ i ].title );
                }
                
                while ( --count > 0 ) {
                    url = localStorage.getItem( KEY_PREFIX + ( count - 1 ) );
                    title = localStorage.getItem( KEY_TPREFIX + ( count - 1 ) );

                    if ( !url ) {
                        continue;
                    }

                    localStorage.setItem( KEY_PREFIX + count, url );
                    localStorage.setItem( KEY_TPREFIX + count, title );
                }
                localStorage.setItem( KEY_PREFIX + 0, JSON.stringify( saved ) );
                localStorage.setItem( KEY_TPREFIX + 0, JSON.stringify( titles ) );
                msg( "成功保存当前" + len + "个tab");
            }
        );
    } );
}

/**
 * 恢复tab
 */
function restoreTab() {
    var tabs = JSON.parse( localStorage.getItem( KEY_PREFIX + 0 ) );
    var i, len;

    for ( i = 0, len = tabs.length; i < len; i++ ) {
        chrome.tabs.create( { url: tabs[ i ] } );
    }
}

/**
 * 跳转至“设置”页
 */
function gotoOption() {
    chrome.tabs.create( {
        url     : chrome.extension.getURL( "option.html" ),
        active  : true
    } );

    return false;
}

// 初始化onload后页面行为
(function () {
    g( "SaveTab" ).onclick = saveTab;
    g( "RestoreTab" ).onclick = restoreTab;
    g( "Option" ).onclick = gotoOption;
})();