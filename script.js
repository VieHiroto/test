(function() {
    'use strict';
    console.log('Script from GitHub is running');

    // すべてのリンクを取得
    const links = document.querySelectorAll('a');
    console.log('Found links:', links);

    // リンクをチェック
    links.forEach(link => {
        console.log('Checking link:', link.href);
        if (link.href === 'https://www.google.com/') {
            console.log('Google link found');
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
