(function() {
    'use strict';
    console.log('Script from GitHub is running');

    // すべてのリンクを取得
    const links = document.querySelectorAll('a');

    // リンクをチェック
    links.forEach(link => {
        if (link.href === 'https://www.google.com/') {
            // メッセージを表示
            const message = document.createElement('div');
            message.textContent = 'ここはGoogleのホームです';
            message.style.position = 'fixed';
            message.style.top = '10px';
            message.style.left = '10px';
            message.style.backgroundColor = 'yellow';
            message.style.padding = '10px';
            message.style.border = '1px solid black';
            document.body.appendChild(message);
        }
    });
})();
