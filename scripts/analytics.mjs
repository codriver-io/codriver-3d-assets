// Visit and download counts for the public library, from Codriver's self-hosted Plausible (stats.codriver.io):
// cookieless, no personal data (see licenses.html). The build injects this snippet into every page; it only loads
// on the production hosts, so local builds, previews and forks send nothing. Events: pageviews (the viewer's
// `asset` as a property), 'Model Open' and 'Download' with asset / detail / city / kind (src/analytics.js), and
// outbound links when enabled for the site in Plausible. An empty PLAUSIBLE_SCRIPT turns analytics off.
export const PLAUSIBLE_SCRIPT = 'https://stats.codriver.io/js/pa-wBXA_yuDcQpfhkN135MWb.js';
export const PRODUCTION_HOSTS = ['3d-assets.codriver.io', 'codriver-3d-assets.pages.dev'];

export function analyticsSnippet(script = PLAUSIBLE_SCRIPT) {
  if (!script) return '';
  const hosts = JSON.stringify(PRODUCTION_HOSTS), src = JSON.stringify(script);
  return `<script>(function(){if(${hosts}.indexOf(location.hostname)<0)return;var s=document.createElement('script');s.async=true;s.src=${src};document.head.appendChild(s);`
    + `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)};plausible.init=plausible.init||function(i){plausible.o=i||{}};`
    + `plausible.init({customProperties:function(){var a=new URLSearchParams(location.search).get('asset');return a?{asset:a}:{}}});})();</script>`;
}

// Insert the snippet just before </head> of an HTML page (no-op when analytics is off or the page has no head).
export const withAnalytics = (html, script = PLAUSIBLE_SCRIPT) => {
  const tag = analyticsSnippet(script);
  return tag && html.includes('</head>') ? html.replace('</head>', `${tag}</head>`) : html;
};
