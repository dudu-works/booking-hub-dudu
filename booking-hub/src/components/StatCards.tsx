import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface StatCardsProps {
  refreshKey?: number;
}

export function StatCards({ refreshKey = 0 }: StatCardsProps) {
  const [todayCount, setTodayCount] = useState(0);
  const [confirmRate, setConfirmRate] = useState(0);
  const [weekCount, setWeekCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*');

      if (error) {
        console.error('집계 조회 실패:', error);
        return;
      }

      if (!data) {
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const bookings = data;

      // 오늘 예약 수
      const today_count = bookings.filter((b) => b.date === today).length;
      setTodayCount(today_count);

      // 확정률
      const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
      const totalCount = bookings.length;
      const rate = totalCount > 0 ? ((confirmedCount / totalCount) * 100).toFixed(1) : 0;
      setConfirmRate(parseFloat(rate as string));

      // 이번 주 총 건수 (월-금)
      const now = new Date();
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      const mondayDate = new Date(now.setDate(diff));
      const fridayDate = new Date(mondayDate);
      fridayDate.setDate(fridayDate.getDate() + 4);

      const mondayStr = mondayDate.toISOString().split('T')[0];
      const fridayStr = fridayDate.toISOString().split('T')[0];

      const weekCount = bookings.filter(
        (b) => b.date >= mondayStr && b.date <= fridayStr
      ).length;
      setWeekCount(weekCount);
    };

    fetchStats();
  }, [refreshKey]);

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-4xl font-bold text-blue-600 mb-2">{todayCount}</div>
        <div className="text-gray-600">오늘 예약</div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-4xl font-bold text-green-600 mb-2">{confirmRate}%</div>
        <div className="text-gray-600">확정률</div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-4xl font-bold text-purple-600 mb-2">{weekCount}</div>
        <div className="text-gray-600">이번 주 총</div>
      </div>
    </div>
  );
}
