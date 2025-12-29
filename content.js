let isEnabled = true;
let hiddenCount = 0;

// Load settings
chrome.storage.sync.get(['enabled'], (result) => {
  isEnabled = result.enabled !== false;
  if (isEnabled) {
    filterVideos();
    observeTimeline();
  }
});

// Listen for settings changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    isEnabled = changes.enabled.newValue;
    if (isEnabled) {
      filterVideos();
      observeTimeline();
    } else {
      showAllVideos();
    }
  }
});

function filterVideos() {
  const articles = document.querySelectorAll('article[data-testid="tweet"]');
  
  articles.forEach(article => {
    if (article.hasAttribute('data-video-filtered')) return;
    
    // Check for video indicators
    const hasVideo = article.querySelector('[data-testid="videoPlayer"]') ||
                     article.querySelector('video') ||
                     article.querySelector('[aria-label*="video" i]') ||
                     article.querySelector('[data-testid="card.layoutLarge.media"]');
    
    if (hasVideo) {
      article.style.display = 'none';
      article.setAttribute('data-video-filtered', 'true');
      hiddenCount++;
    }
  });
}

function showAllVideos() {
  const filtered = document.querySelectorAll('[data-video-filtered]');
  filtered.forEach(article => {
    article.style.display = '';
    article.removeAttribute('data-video-filtered');
  });
  hiddenCount = 0;
}

function observeTimeline() {
  const observer = new MutationObserver(() => {
    if (isEnabled) filterVideos();
  });
  
  const timeline = document.querySelector('main[role="main"]');
  if (timeline) {
    observer.observe(timeline, {
      childList: true,
      subtree: true
    });
  }
}