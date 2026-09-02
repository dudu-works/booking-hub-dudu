import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface BookingFormProps {
  onSuccess?: () => void;
}

export function BookingForm({ onSuccess }: BookingFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    customer: '',
    service: '',
    date: '',
    time: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 필수 칸 검증
    if (!formData.customer || !formData.service || !formData.date || !formData.time || !formData.address) {
      setError('모든 칸을 입력해주세요');
      return;
    }

    setLoading(true);
    const { error: insertError } = await supabase
      .from('bookings')
      .insert([
        {
          customer: formData.customer,
          service: formData.service,
          date: formData.date,
          time: formData.time,
          address: formData.address,
          via: 'form',
        },
      ]);

    if (insertError) {
      setError(`예약 추가 실패: ${insertError.message}`);
    } else {
      setFormData({
        customer: '',
        service: '',
        date: '',
        time: '',
        address: '',
      });
      onSuccess?.();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">새 예약 추가</h2>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          name="customer"
          placeholder="고객사"
          value={formData.customer}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          name="service"
          placeholder="서비스"
          value={formData.service}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <input
        type="text"
        name="address"
        placeholder="주소"
        value={formData.address}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? '추가 중...' : '예약하기'}
      </button>
    </form>
  );
}
