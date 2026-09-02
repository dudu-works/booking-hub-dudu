import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Booking {
  id: string;
  customer: string;
  service: string;
  date: string;
  time: string;
  status: string;
  address?: string;
}

export default function BookingTable({ refreshKey }: { refreshKey?: number }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [refreshKey]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('조회 실패:', error.message);
        return;
      }

      setBookings(data || []);
    } catch (err) {
      console.error('오류:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (booking: Booking) => {
    const newStatus = booking.status === 'pending' ? 'confirmed' : 'pending';
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', booking.id);

    if (error) {
      console.error('상태 변경 실패:', error.message);
      return;
    }

    fetchBookings();
  };

  if (loading) {
    return <div className="text-center py-8">로딩 중...</div>;
  }

  if (bookings.length === 0) {
    return <div className="text-center py-8 text-gray-500">예약이 없습니다</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">고객사</th>
            <th className="border border-gray-300 px-4 py-2 text-left">서비스</th>
            <th className="border border-gray-300 px-4 py-2 text-left">날짜</th>
            <th className="border border-gray-300 px-4 py-2 text-left">시간</th>
            <th className="border border-gray-300 px-4 py-2 text-left">위치</th>
            <th className="border border-gray-300 px-4 py-2 text-left">상태</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-blue-50">
              <td className="border border-gray-300 px-4 py-2">{booking.customer}</td>
              <td className="border border-gray-300 px-4 py-2">{booking.service}</td>
              <td className="border border-gray-300 px-4 py-2">{booking.date}</td>
              <td className="border border-gray-300 px-4 py-2">{booking.time}</td>
              <td className="border border-gray-300 px-4 py-2">
                {booking.address ? (
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(booking.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {booking.address}
                  </a>
                ) : (
                  '-'
                )}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => toggleStatus(booking)}
                  className={`px-3 py-1 rounded font-semibold cursor-pointer ${
                    booking.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {booking.status === 'pending' ? '대기' : '확정'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
