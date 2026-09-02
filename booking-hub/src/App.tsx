import { useState } from 'react';
import { BookingTable } from './components/BookingTable';
import { BookingForm } from './components/BookingForm';
import { StatCards } from './components/StatCards';

type TabType = '대시보드' | '예약목록' | '예약추가' | '상태관리' | '위치확인';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('대시보드');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFormSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setActiveTab('예약목록');
  };

  const handleTableRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const tabs: { id: TabType; name: string }[] = [
    { id: '대시보드', name: '대시보드' },
    { id: '예약목록', name: '예약목록' },
    { id: '예약추가', name: '예약추가' },
    { id: '상태관리', name: '상태관리' },
    { id: '위치확인', name: '위치확인' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8 pb-32">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">예약 관리 허브</h1>

          {activeTab === '대시보드' && (
            <div>
              <StatCards refreshKey={refreshKey} />
            </div>
          )}

          {activeTab === '예약목록' && (
            <div>
              <BookingTable refreshKey={refreshKey} onRefresh={handleTableRefresh} />
            </div>
          )}

          {activeTab === '예약추가' && (
            <div>
              <BookingForm onSuccess={handleFormSuccess} />
            </div>
          )}

          {activeTab === '상태관리' && (
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800">예약 상태 관리</h2>
                <p className="text-gray-600 mt-2">상태 배지를 클릭하면 pending/confirmed로 토글됩니다</p>
              </div>
              <BookingTable refreshKey={refreshKey} onRefresh={handleTableRefresh} />
            </div>
          )}

          {activeTab === '위치확인' && (
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800">위치 확인</h2>
                <p className="text-gray-600 mt-2">주소를 클릭하면 Google Maps에서 열립니다</p>
              </div>
              <BookingTable refreshKey={refreshKey} onRefresh={handleTableRefresh} />
            </div>
          )}
        </div>
      </div>

      {/* 하단 탭 바 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
        <div className="max-w-6xl mx-auto flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 text-center font-semibold transition ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
