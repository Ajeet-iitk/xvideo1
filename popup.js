const toggle = document.getElementById('toggleFilter');

// Load current setting
chrome.storage.sync.get(['enabled'], (result) => {
  toggle.checked = result.enabled !== false;
});

// Save setting on change
toggle.addEventListener('change', () => {
  chrome.storage.sync.set({ enabled: toggle.checked });
});