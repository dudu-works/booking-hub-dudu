import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface StatCardsProps {
  refreshKey?: number;
}

export default function StatCards({ refreshKey }: StatCardsProps) {
  const [todayCount, setTodayCount] = useState(0);
  const [confirmedRate, setConfirmedRate] = useState(0);
  const [weekCount, setWeekCount] = useState(0);

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*');

      if (error || !data) {
        console.error('통계 조회 실패:', error?.message);
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const todayBookings = data.filter(b => b.date === today).length;
      setTodayCount(todayBookings);

      const confirmedCount = data.filter(b => b.status === 'confirmed').length;
      const rate = data.length > 0 ? ((confirmedCount / data.length) * 100).toFixed(1) : '0';
      setConfirmedRate(parseFloat(rate));

      const now = new Date();
      const monday = new Date(now);
      monday.setDate(now.getDate() - now.getDay() + 1);
      const friday = new Date(monday);
      friday.setDate(monday.getDate() + 4);

      const mondayStr = monday.toISOString().split('T')[0];
      const fridayStr = friday.toISOString().split('T')[0];

      const weekBookings = data.filter(
        b => b.date >= mondayStr && b.date <= fridayStr
      ).length;
      setWeekCount(weekBookings);
    } catch (err) {
      console.error('통계 오류:', err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-6 rounded shadow">
        <div className="text-4xl font-bold text-blue-600">{todayCount}</div>
        <div className="text-gray-600 text-sm mt-2">오늘 예약</div>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <div className="text-4xl font-bold text-green-600">{confirmedRate}%</div>
        <div className="text-gray-600 text-sm mt-2">확정률</div>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <div className="text-4xl font-bold text-purple-600">{weekCount}</div>
        <div className="text-gray-600 text-sm mt-2">이번 주 총</div>
      </div>
    </div>
  );
}
