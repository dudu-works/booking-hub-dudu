import { useState, useEffect, useRef } from 'react';

interface AddressSearchProps {
  onAddressSelect: (address: string, lat: number, lng: number) => void;
  value: string;
}

export function AddressSearch({ onAddressSelect, value }: AddressSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const selectedAddressRef = useRef<{ address: string; lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Leaflet 로드
    if (!window.L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      setTimeout(initMap, 100);
    }

    function initMap() {
      if (!mapRef.current) return;

      if (!mapInstanceRef.current) {
        mapInstanceRef.current = window.L.map(mapRef.current).setView([37.5665, 126.978], 12);

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(mapInstanceRef.current);

        mapInstanceRef.current.on('click', async (e: any) => {
          const { lat, lng } = e.latlng;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            const address = data.address?.road || data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

            selectedAddressRef.current = { address, lat, lng };

            // 마커 표시
            if (markerRef.current) {
              mapInstanceRef.current.removeLayer(markerRef.current);
            }
            markerRef.current = window.L.marker([lat, lng])
              .addTo(mapInstanceRef.current)
              .bindPopup(`<div style="text-align: center;"><strong>${address}</strong></div>`)
              .openPopup();
          } catch (error) {
            console.error('주소 역변환 실패:', error);
            alert('주소를 가져올 수 없습니다');
          }
        });
      } else {
        // 지도 크기 업데이트
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 100);
      }
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (selectedAddressRef.current) {
      const { address, lat, lng } = selectedAddressRef.current;
      onAddressSelect(address, lat, lng);
      setIsOpen(false);
      selectedAddressRef.current = null;
    } else {
      alert('위치를 선택해주세요');
    }
  };

  return (
    <>
      {/* 주소 입력 필드 (읽기 전용) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-left bg-white hover:bg-gray-50 transition"
      >
        {value || '지도에서 위치 선택...'}
      </button>

      {/* 모달 오버레이 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* 모달 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full h-full max-w-6xl max-h-screen md:max-h-96 flex flex-col">
            {/* 헤더 */}
            <div className="border-b border-gray-200 p-4 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">지도에서 위치 선택</h3>
              <p className="text-sm text-gray-600 mt-1">지도를 클릭하여 위치를 선택하세요</p>
              {selectedAddressRef.current && (
                <p className="text-sm text-blue-600 mt-2 font-semibold">
                  선택됨: {selectedAddressRef.current.address}
                </p>
              )}
            </div>

            {/* 지도 */}
            <div ref={mapRef} className="flex-1 w-full" />

            {/* 푸터 */}
            <div className="border-t border-gray-200 p-4 bg-gray-50 flex gap-2">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!selectedAddressRef.current}
                className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
              >
                선택 완료
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-gray-300 text-gray-800 font-semibold py-2 rounded hover:bg-gray-400 transition"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
