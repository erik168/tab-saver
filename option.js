var MAX = 20;

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
 * RecordCount选择发生变化的event handler
 *
 * @param {HTMLEvent} e
 */
function recordCountOnchange( e ) {
    localStorage.setItem( KEY_RECORDCOUNT, g( "RecordCount" ).value );
}

/**
 * 绘制列表视图
 */
function renderList() {
    var i       = 0;
    var len     = 0;
    var html    = [ '<dl>' ];
    var count   = parseInt( localStorage.getItem( KEY_RECORDCOUNT ), 10 );
    var tabs;
    var titles;
    var j;
    var jLen;
    
    for ( ; i < count; i++ ) {
        tabs = localStorage.getItem( KEY_PREFIX + i );
        titles = localStorage.getItem( KEY_TPREFIX + i );
        if ( !tabs ) {
            break;
        }
        
        tabs = JSON.parse( tabs );
        titles = JSON.parse( titles );

        html.push( '<dt data-index="' + i 
            + '">[<i>恢复Tab序列</i>][<del>删除</del>] 保存的第' 
            + ( i + 1 ) + '个序列</dt>' );
        
        for ( j = 0, jLen = tabs.length; j < jLen; j++ ) {
            html.push( '<dd><a target="_blank" href="' + tabs[ j ] + '">' + titles[ j ] + '</a></dd>' );
        }
    }
    html.push( '</dl>' );

    g( "ResultList" ).innerHTML = html.join( '' );
}

/**
 * 结果列表点击事件处理函数
 */
function listClickHandler( e ) {
    e = e || window.event;
    var tar = e.srcElement || e.target;
    var index = tar.parentNode.getAttribute( 'data-index' );

    switch ( tar.tagName ) {
    case "DEL":
        deleteTabsByIndex( index );
        break;
    case "I":
        restoreTabsByIndex( index );
        break;
    }
}

/**
 * 删除tabs记录
 *
 * @param {number} index
 */
function deleteTabsByIndex( index ) {
    var recordCount = parseInt( localStorage.getItem( KEY_RECORDCOUNT ), 10 );
    var tabs;
    var titles;
    
    localStorage.removeItem( KEY_PREFIX + index );
    localStorage.removeItem( KEY_TPREFIX + index );
    index++;
    for ( ; index < recordCount; index++ ) {
        tabs = localStorage.getItem( KEY_PREFIX + index );
        titles = localStorage.getItem( KEY_TPREFIX + index );

        if ( !tabs ) {
            break;
        }
        localStorage.setItem( KEY_PREFIX + ( index - 1 ), tabs );
        localStorage.setItem( KEY_TPREFIX + ( index - 1 ), titles );
        localStorage.removeItem( KEY_PREFIX + index );
        localStorage.removeItem( KEY_TPREFIX + index );
    }

    renderList();
}

/**
 * 恢复tabs
 *
 * @param {number} index
 */
function restoreTabsByIndex( index ) {
    var tabs = localStorage.getItem( KEY_PREFIX + index );
    var len;
    var i = 0;

    if ( !tabs ) {
        return; 
    }

    tabs = JSON.parse( tabs );
    for ( len = tabs.length; i < len; i++ ) {
        chrome.tabs.create( { url: tabs[ i ] } );
    }
}

// 初始化onload后页面行为
(function () {
    var rcEl = g( "RecordCount" );
    var i = 1;
    var op;
    for ( ; i <= MAX; i++ ) {
        op = document.createElement( 'option' );
        op.value = i;
        op.innerText = i;
        rcEl.appendChild( op );
    }
    rcEl.value = localStorage.getItem( KEY_RECORDCOUNT );

    rcEl.onchange = recordCountOnchange;
    op = null;
    rcEl = null;

    renderList();
    g( "ResultList" ).onclick = listClickHandler;
})();