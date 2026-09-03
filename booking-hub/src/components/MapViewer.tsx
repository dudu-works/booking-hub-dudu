import { useEffect, useRef } from 'react';

interface MapViewerProps {
  lat?: number;
  lng?: number;
  address?: string;
}

export function MapViewer({ lat, lng, address }: MapViewerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    // Leaflet 스크립트 로드
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
      document.head.appendChild(link);
    }

    const w = window as any;
    if (!w.L) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (!mapRef.current) return;

      const defaultLat = lat || 37.5665;
      const defaultLng = lng || 126.978;
      const L = w.L;

      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapRef.current).setView(
          [defaultLat, defaultLng],
          13
        );

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(mapInstanceRef.current);
      } else {
        mapInstanceRef.current.setView([defaultLat, defaultLng], 13);
      }

      // 기존 마커 제거
      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current);
      }

      // 새 마커 추가
      if (lat && lng) {
        markerRef.current = L.marker([lat, lng])
          .addTo(mapInstanceRef.current)
          .bindPopup(address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    }
  }, [lat, lng, address]);

  return (
    <div
      ref={mapRef}
      className="w-full h-96 rounded-lg border border-gray-300 shadow-md"
    />
  );
}
