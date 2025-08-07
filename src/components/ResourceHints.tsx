// components/ResourceHints.tsx
import Head from 'next/head';

export default function ResourceHints() {
  return (
    <Head>
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.unsplash.com" />
      
      {/* DNS Prefetch for API */}
      <link rel="dns-prefetch" href="https://flycycy-eldercareai.hf.space" />
      
      {/* Preload critical fonts */}
      <link 
        rel="preload" 
        href="/fonts/geist-sans.woff2" 
        as="font" 
        type="font/woff2" 
        crossOrigin="anonymous" 
      />
      
      {/* Preload critical CSS */}
      <link 
        rel="preload" 
        href="/_next/static/css/app/layout.css" 
        as="style" 
      />
      
      {/* Prefetch important routes */}
      <link rel="prefetch" href="/elder" />
      <link rel="prefetch" href="/elder/chat" />
      <link rel="prefetch" href="/caregiver" />
      
      {/* Resource hints for images */}
      <link 
        rel="preload" 
        as="image" 
        href="/images/elder-placeholder.jpg" 
        media="(max-width: 768px)"
      />
      
      {/* Preload service worker */}
      <link rel="preload" href="/sw.js" as="script" />
      
      {/* Meta tags for performance */}
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      
      {/* Theme color for PWA */}
      <meta name="theme-color" content="#8b5cf6" />
      
      {/* Apple specific optimizations */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Disable tap highlight on iOS */}
      <meta name="format-detection" content="telephone=no" />
      
      {/* Inline critical CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Critical CSS for above-the-fold content */
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Prevent layout shift */
        img {
          max-width: 100%;
          height: auto;
        }
        
        /* Loading screen styles */
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #e9d5ff 0%, #fce7f3 50%, #dbeafe 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
      `}} />
    </Head>
  );
}