'use client';

import { MapContainer, Polyline } from 'react-leaflet';
import DarkTileLayer from './DarkTileLayer';
import SubwayTrainMarker from './SubwayTrainMarker';
import type { SubwayLine } from '@/app/hooks/useTransit';
import { SUBWAY_ROUTES } from '@/app/lib/subwayRoutes';

interface SubwayMapProps {
  lines: SubwayLine[];
  selectedLineId?: string | null;
}

export default function SubwayMap({ lines, selectedLineId }: SubwayMapProps) {
  const activeLines = selectedLineId ? lines.filter((l) => l.lineId === selectedLineId) : lines;
  // When a line is selected, show all routes dimmed + selected bright; otherwise show all
  const routeLines = selectedLineId ? lines : lines;

  return (
    <MapContainer
      center={[40.73, -73.97]}
      zoom={12}
      style={{ width: '100%', height: '100%', minHeight: 0 }}
      zoomControl={true}
    >
      <DarkTileLayer />

      {/* Subway route polylines — rendered below train markers */}
      {routeLines.map((line) => {
        const route = SUBWAY_ROUTES[line.lineId];
        if (!route) return null;
        const isSelected = selectedLineId === line.lineId;
        const isDimmed = selectedLineId !== null && !isSelected;
        return (
          <Polyline
            key={`route-${line.lineId}`}
            positions={route}
            pathOptions={{
              color: line.color,
              weight: isSelected ? 4 : 2.5,
              opacity: isDimmed ? 0.18 : isSelected ? 0.85 : 0.5,
            }}
          />
        );
      })}

      {/* Train markers — rendered on top of routes */}
      {activeLines.flatMap((line) =>
        line.trains
          .filter((t) => t.lat !== 0 && t.lon !== 0)
          .map((train) => (
            <SubwayTrainMarker key={train.id} train={train} line={line} />
          ))
      )}
    </MapContainer>
  );
}
