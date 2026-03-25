/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --ocean-50: #e6f7fb;
    --ocean-500: #00a9d7;
    --ocean-900: #00253b;
    --ocean-950: #000f1a;
    --wave-500: #00c7ad;
    --depth-800: #0a1628;
    --depth-950: #03070f;
  }

  * {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    -webkit-tap-highlight-color: transparent;
  }

  body {
    background: #03070f;
    color: white;
    font-family: var(--font-body), system-ui, sans-serif;
    overscroll-behavior: none;
  }

  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  ::-webkit-scrollbar-track {
    background: #0a1628;
  }

  ::-webkit-scrollbar-thumb {
    background: #00a9d7;
    border-radius: 2px;
  }
}

@layer components {
  .glass-card {
    @apply bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl;
  }

  .glass-card-strong {
    @apply bg-ocean-950/80 backdrop-blur-md border border-ocean-800/30 rounded-2xl;
  }

  .ocean-text {
    @apply text-ocean-400;
  }

  .rating-star-fill {
    fill: #eab308;
  }

  .skeleton {
    @apply bg-white/5 rounded-lg animate-shimmer;
    background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }

  .compass-needle {
    transform-origin: center;
    transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .spot-pin {
    @apply cursor-pointer transition-transform duration-200 hover:scale-110;
  }

  .forecast-row {
    @apply flex items-center gap-3 py-2.5 border-b border-white/5 hover:bg-white/3 transition-colors;
  }

  .chip {
    @apply inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 border border-white/10;
  }

  .chip-ocean {
    @apply chip bg-ocean-500/20 border-ocean-500/30 text-ocean-300;
  }

  .btn-primary {
    @apply inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ocean-500 hover:bg-ocean-400 text-white font-medium text-sm transition-all duration-200 active:scale-95 touch-manipulation;
  }

  .btn-ghost {
    @apply inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all duration-200 active:scale-95 touch-manipulation border border-white/10;
  }

  .wave-text {
    background: linear-gradient(135deg, #00a9d7, #00c7ad);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

@layer utilities {
  .touch-manipulation {
    touch-action: manipulation;
  }

  .text-balance {
    text-wrap: balance;
  }

  .safe-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }

  .ocean-glow {
    box-shadow: 0 0 32px rgba(0, 169, 215, 0.2);
  }

  .wave-glow {
    box-shadow: 0 0 24px rgba(0, 199, 173, 0.25);
  }
}

/* Wave animation for hero section */
.wave-container {
  position: relative;
  overflow: hidden;
}

.wave-container::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #00a9d7, #00c7ad, transparent);
  animation: waveBar 3s ease-in-out infinite;
}

@keyframes waveBar {
  0%, 100% { opacity: 0.4; transform: scaleX(0.8); }
  50% { opacity: 1; transform: scaleX(1); }
}

/* Tide chart */
.tide-area {
  fill: url(#tideGradient);
  stroke: #00a9d7;
  stroke-width: 2;
}

/* Leaflet overrides */
.leaflet-container {
  background: #0a1628 !important;
  font-family: var(--font-body) !important;
}

.leaflet-tile {
  filter: brightness(0.7) saturate(0.8) hue-rotate(180deg);
}

.leaflet-popup-content-wrapper {
  background: #0a1628 !important;
  border: 1px solid rgba(0,169,215,0.3) !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 24px rgba(0,0,0,0.5) !important;
  color: white !important;
}

.leaflet-popup-tip {
  background: #0a1628 !important;
}
