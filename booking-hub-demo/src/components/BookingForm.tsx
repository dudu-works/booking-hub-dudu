import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface BookingFormProps {
  onSuccess: () => void;
}

export default function BookingForm({ onSuccess }: BookingFormProps) {
  const [customer, setCustomer] = useState('');
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customer || !service || !date || !time || !address) {
      setError('모든 항목을 입력해주세요');
      return;
    }

    try {
      setLoading(true);
      const { error: insertError } = await supabase
        .from('bookings')
        .insert([
          {
            customer,
            service,
            date,
            time,
            address,
            status: 'pending',
            via: 'form'
          }
        ]);

      if (insertError) {
        setError(insertError.message);
        return;
      }

      setCustomer('');
      setService('');
      setDate('');
      setTime('');
      setAddress('');
      onSuccess();
    } catch (err) {
      setError('예약 추가 중 오류가 발생했습니다');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white border border-gray-300 rounded">
      <h2 className="text-xl font-bold mb-4">예약 추가</h2>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="고객사"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="서비스"
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded"
        />
      </div>

      <input
        type="text"
        placeholder="주소"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full border border-gray-300 px-3 py-2 rounded mb-4"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? '추가 중...' : '예약하기'}
      </button>
    </form>
  );
}
