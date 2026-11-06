// One measurement ID for every current portfolio page; no monthly expiry.
(function () {
  const config = window.portfolioAnalytics;
  if (!config || location.hostname !== config.productionHost || !/^G-[A-Z0-9]+$/.test(config.measurementId)) return;
  if (window.portfolioAnalyticsStarted) return;
  window.portfolioAnalyticsStarted = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', config.measurementId);
  const loader = document.createElement('script');
  loader.async = true;
  loader.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(config.measurementId);
  document.head.appendChild(loader);
})();
