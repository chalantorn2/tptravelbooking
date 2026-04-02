import React from 'react';

const BookingStatusLegend = () => {
  const statuses = [
    { name: 'รอดำเนินการ', color: 'bg-gray-400' },
    { name: 'จองแล้ว', color: 'bg-blue-500' },
    { name: 'กำลังดำเนินการ', color: 'bg-yellow-500' },
    { name: 'เสร็จสิ้น', color: 'bg-emerald-500' },
    { name: 'ยกเลิก', color: 'bg-red-500' },
  ];

  return (
    <div className="flex flex-wrap justify-center items-center gap-4 py-2.5 mb-3 bg-gray-50 rounded-lg border border-gray-100 px-3">
      {statuses.map((s) => (
        <div key={s.name} className="flex items-center gap-1.5">
          <div className={`w-3 h-3 rounded-full ${s.color}`} />
          <span className="text-xs font-medium text-gray-500">{s.name}</span>
        </div>
      ))}
    </div>
  );
};

export default BookingStatusLegend;
