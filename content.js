function createTimerElement() {
    const timerDiv = document.createElement('div');
    timerDiv.id = 'timerDiv';
    timerDiv.style.position = 'fixed';
    timerDiv.style.top = '10px';
    timerDiv.style.right = '10px';
    timerDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    timerDiv.style.color = 'white';
    timerDiv.style.padding = '10px';
    timerDiv.style.borderRadius = '5px';
    timerDiv.style.zIndex = '1000';
    document.body.appendChild(timerDiv);
    return timerDiv;
  }
  
  function updateTimer(timerDiv, timeLeft) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDiv.textContent = `Next action in ${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  
  window.addEventListener('load', function() {
    if (window.location.hostname === 'www.google.com' && window.location.pathname === '/') {
      alert('ここはGoogleのホームです');
      const searchBox = document.querySelector('input[name="q"], textarea[name="q"]');
      if (searchBox) {
        searchBox.addEventListener('focus', function() {
          searchBox.value = 'test';
          const event = new Event('input', { bubbles: true });
          searchBox.dispatchEvent(event);
        });
        searchBox.focus();  // 自動的に検索ボックスにフォーカスを当てます
      }
  
      const timerDiv = createTimerElement();
      let timeLeft = 30 * 60; // 30分
  
      updateTimer(timerDiv, timeLeft);
      setInterval(() => {
        timeLeft--;
        updateTimer(timerDiv, timeLeft);
        if (timeLeft <= 0) {
          timeLeft = 30 * 60; // Reset timer to 30 minutes
          // Perform the action
          if (searchBox) {
            searchBox.value = 'test';
            const event = new Event('input', { bubbles: true });
            searchBox.dispatchEvent(event);
          }
        }
      }, 1000); // Update every second
    }
  });
  