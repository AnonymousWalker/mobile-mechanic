/**
 * Cloudflare Worker to serve static Astro site assets
 * This worker serves files from the dist directory
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // Try to get the asset from the ASSETS binding
    let asset = await env.ASSETS.fetch(request);
    
    // If asset exists, return it
    if (asset.status !== 404) {
      return asset;
    }
    
    // For Astro static sites, check if it's a directory route (ends with /)
    // Astro generates index.html files in subdirectories
    if (pathname.endsWith('/')) {
      const indexRequest = new Request(new URL(pathname + 'index.html', request.url));
      asset = await env.ASSETS.fetch(indexRequest);
      if (asset.status !== 404) {
        return asset;
      }
    }
    
    // Try without trailing slash
    if (!pathname.endsWith('/') && !pathname.includes('.')) {
      const indexRequest = new Request(new URL(pathname + '/index.html', request.url));
      asset = await env.ASSETS.fetch(indexRequest);
      if (asset.status !== 404) {
        return asset;
      }
    }
    
    // Fallback to 404.html if it exists
    const notFoundRequest = new Request(new URL('/404.html', request.url));
    const notFound = await env.ASSETS.fetch(notFoundRequest);
    if (notFound.status !== 404) {
      return new Response(notFound.body, {
        status: 404,
        headers: notFound.headers,
      });
    }
    
    // Final fallback
    return new Response('Not Found', { status: 404 });
  },
};

