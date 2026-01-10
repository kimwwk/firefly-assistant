// Add PWA manifest link
const manifestLink = document.createElement('link');
manifestLink.rel = 'manifest';
manifestLink.href = '/public/manifest.json';
document.head.appendChild(manifestLink);

// Add theme color meta tag
const themeColor = document.createElement('meta');
themeColor.name = 'theme-color';
themeColor.content = '#000000';
document.head.appendChild(themeColor);

// Add apple touch icon
const appleIcon = document.createElement('link');
appleIcon.rel = 'apple-touch-icon';
appleIcon.href = '/public/icon-192.png';
document.head.appendChild(appleIcon);

// Add mobile web app capable meta tags
const mobileCapable = document.createElement('meta');
mobileCapable.name = 'mobile-web-app-capable';
mobileCapable.content = 'yes';
document.head.appendChild(mobileCapable);

const appleMobileCapable = document.createElement('meta');
appleMobileCapable.name = 'apple-mobile-web-app-capable';
appleMobileCapable.content = 'yes';
document.head.appendChild(appleMobileCapable);

const appleStatusBar = document.createElement('meta');
appleStatusBar.name = 'apple-mobile-web-app-status-bar-style';
appleStatusBar.content = 'black-translucent';
document.head.appendChild(appleStatusBar);
