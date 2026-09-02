import { useState } from 'react';
import BookingForm from './components/BookingForm';
import BookingTable from './components/BookingTable';
import StatCards from './components/StatCards';

type TabName = '대시보드' | '예약목록' | '예약추가' | '상태관리' | '위치확인';

const TABS: TabName[] = ['대시보드', '예약목록', '예약추가', '상태관리', '위치확인'];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('대시보드');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setActiveTab('예약목록');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">예약 관리 허브</h1>

        {activeTab === '대시보드' && <StatCards refreshKey={refreshKey} />}

        {activeTab === '예약목록' && <BookingTable refreshKey={refreshKey} />}

        {activeTab === '예약추가' && <BookingForm onSuccess={handleSuccess} />}

        {activeTab === '상태관리' && (
          <div>
            <p className="mb-4 text-gray-600">예약 상태를 pending(대기)에서 confirmed(확정)으로 변경할 수 있습니다.</p>
            <BookingTable refreshKey={refreshKey} />
          </div>
        )}

        {activeTab === '위치확인' && (
          <div>
            <p className="mb-4 text-gray-600">주소를 클릭하면 Google Maps에서 위치를 확인할 수 있습니다.</p>
            <BookingTable refreshKey={refreshKey} />
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg">
        <div className="flex gap-0">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-center font-semibold transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
