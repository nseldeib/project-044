'use client';

import { TileLayer } from 'react-leaflet';

/**
 * Carto Dark Matter tile layer.
 * Uses direct Carto CDN — no proxy required for modern Leaflet.
 * The /api/tiles proxy remains available as a fallback for restricted environments.
 */
// Transparent 1×1 PNG — shown when a tile fails to load, prevents Leaflet from retrying
const EMPTY_TILE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQ' +
  'AAbjALjgAAAABJRU5ErkJggg==';

export default function DarkTileLayer() {
  return (
    <TileLayer
      url="/api/tiles?z={z}&x={x}&y={y}"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>'
      maxZoom={20}
      errorTileUrl={EMPTY_TILE}
    />
  );
}
