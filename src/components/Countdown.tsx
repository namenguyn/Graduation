import React, { useState, useEffect, type ChangeEvent } from 'react';
import { Calendar, Gift, Settings } from 'lucide-react';

interface CountdownProps {
  initialDateString?: string;
  isEditable?: boolean;
}

export default function Countdown({ initialDateString = '2026-06-15T08:30:00', isEditable = false }: CountdownProps) {
  const [targetDate, setTargetDate] = useState<string>(initialDateString);
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });
  const [isPast, setIsPast] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    function calculateTime() {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        setIsPast(true);
        return;
      }

      setIsPast(false);
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: d.toString().padStart(2, '0'),
        hours: h.toString().padStart(2, '0'),
        minutes: m.toString().padStart(2, '0'),
        seconds: s.toString().padStart(2, '0')
      });
    }

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const yearLabel = new Date(targetDate).getFullYear();
  const dateFormatted = new Date(targetDate).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="w-full max-w-xl mx-auto mb-12">
      <div className="sketch-border bg-white/70 p-6 md:p-8 text-center relative overflow-hidden shadow-md">
        {/* Dynamic crayon hatching texture fill */}
        <div className="absolute inset-0 -z-10 opacity-10 bg-[radial-gradient(#105982,transparent_1px)] [background-size:16px_16px]"></div>
        
        {/* Settings button to customize the date of the event */}
        {isEditable && (
          <button 
            onClick={() => setShowConfig(!showConfig)}
            className="absolute top-3 right-3 text-[#105982]/45 hover:text-[#105982] transition-colors p-1 rounded-full hover:bg-sky-50 z-10"
            id="toggle-countdown-settings"
            title="Thay đổi ngày sự kiện"
          >
            <Settings size={18} />
          </button>
        )}

        <p className="font-handwritten text-2xl text-[#105982] uppercase font-bold tracking-widest mb-4">
          SỰ KIỆN SẼ DIỄN RA TRONG
        </p>

        <div className="flex justify-center gap-4 md:gap-7 my-2">
          <div className="flex flex-col items-center min-w-[70px]">
            <span className="font-handwritten text-5xl md:text-6xl text-[#105982] font-bold tracking-tight transform -rotate-1 inline-block">
              {timeLeft.days}
            </span>
            <span className="font-sans text-xs font-semibold text-[#105982]/75 opacity-75 mt-1 uppercase tracking-wider">Ngày</span>
          </div>

          <div className="font-handwritten text-4xl text-[#105982]/35 select-none flex items-center md:pb-6">:</div>

          <div className="flex flex-col items-center min-w-[70px]">
            <span className="font-handwritten text-5xl md:text-6xl text-[#105982] font-bold tracking-tight transform rotate-2 inline-block">
              {timeLeft.hours}
            </span>
            <span className="font-sans text-xs font-semibold text-[#105982]/75 opacity-75 mt-1 uppercase tracking-wider">Giờ</span>
          </div>

          <div className="font-handwritten text-4xl text-[#105982]/35 select-none flex items-center md:pb-6">:</div>

          <div className="flex flex-col items-center min-w-[70px]">
            <span className="font-handwritten text-5xl md:text-6xl text-[#105982] font-bold tracking-tight transform -rotate-2 inline-block">
              {timeLeft.minutes}
            </span>
            <span className="font-sans text-xs font-semibold text-[#105982]/75 opacity-75 mt-1 uppercase tracking-wider">Phút</span>
          </div>

          <div className="font-handwritten text-4xl text-[#105982]/35 select-none flex items-center md:pb-6">:</div>

          <div className="flex flex-col items-center min-w-[70px]">
            <span className={`font-handwritten text-5xl md:text-6xl text-[#105982] font-bold tracking-tight transform rotate-1 inline-block ${!isPast ? 'animate-pulse' : ''}`}>
              {timeLeft.seconds}
            </span>
            <span className="font-sans text-xs font-semibold text-[#105982]/75 opacity-75 mt-1 uppercase tracking-wider">Giây</span>
          </div>
        </div>

        {isPast && (
          <div className="mt-4 px-3 py-1 bg-sky-50 rounded-md border border-sky-200 text-[#105982] text-xs inline-block font-sans">
            🎉 Lễ tốt nghiệp đã diễn ra thành công tốt đẹp!
          </div>
        )}

        {isEditable && showConfig && (
          <div className="mt-6 pt-6 border-t border-dashed border-outline-variant text-left animate-fadeIn">
            <label className="block text-xs font-bold text-on-surface-variant mb-2">
              Thời gian tổ chức Lễ Tốt Nghiệp:
            </label>
            <div className="flex gap-2">
              <input
                id="target-date-input"
                type="datetime-local"
                value={targetDate.slice(0, 16)}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTargetDate(e.target.value)}
                className="flex-1 px-3 py-1.5 border border-outline-variant rounded font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
              <button
                onClick={() => setTargetDate('2026-06-15T08:30:00')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-xs font-semibold text-on-surface-variant transition-colors"
              >
                Mặc định
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export { Countdown };
