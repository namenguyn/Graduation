import React, { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function RSVPForm() {
  const guestListKey = 'grad_rsvp_list';
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [savedRSVP, setSavedRSVP] = useState<any>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('grad_rsvp');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedRSVP(parsed);
        setName(parsed.name);
        setNotes(parsed.notes || '');
        setSubmitted(true);
      } catch (e) {
        // Ignore
      }
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Vui lòng nhập tên của bạn để Nam dễ sắp xếp đón tiếp nhé!');
      return;
    }

    const rsvpData = {
      name: name.trim(),
      attending: true,
      notes: notes.trim(),
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem('grad_rsvp', JSON.stringify(rsvpData));

    const savedList = localStorage.getItem(guestListKey);
    const guestList = savedList ? JSON.parse(savedList) : [];
    const updatedList = [rsvpData, ...guestList.filter((entry: any) => entry?.name !== rsvpData.name)];
    localStorage.setItem(guestListKey, JSON.stringify(updatedList));

    setSavedRSVP(rsvpData);
    setSubmitted(true);
  };

  const handleEdit = () => {
    setSubmitted(false);
  };

  return (
    <section className="mb-16 bg-primary-fixed/10 p-6 md:p-8 sketch-border relative overflow-hidden shadow-sm">
      {/* Crayon scribbly texture backfill */}
      <div className="crayon-fill absolute inset-0 -z-10 opacity-20 pointer-events-none"></div>

      <div className="relative z-10 max-w-lg mx-auto text-center">
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <h3 className="font-handwritten text-3xl text-primary mb-6 font-bold flex items-center justify-center gap-2">
              Bạn sẽ đến tham dự chứ?
            </h3>

            {/* Guest Name input so we have actual context! */}
            <div className="mb-6 text-left">
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                Tên bạn là gì? <span className="text-rose-500">*</span>:
              </label>
              <input
                id="rsvp-name-input"
                type="text"
                required
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="Kimi no na wa..."
                className="w-full px-4 py-3 bg-white/80 border-2 border-outline-variant/60 rounded-lg font-sans text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-inner"
              />
            </div>

            {/* Notes input */}
            

            {/* Guest details removed as requested */}

            {/* Notes textarea */}
            <div className="mb-6 text-left">
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                Ghi chú:
              </label>
              <textarea
                value={notes}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                placeholder="Nếu được thì bạn note giúp Nam thời gian bạn tới với nhéeee!"
                className="w-full px-4 py-3 bg-white/80 border-2 border-outline-variant/60 rounded-lg font-sans text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-inner h-28"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-primary text-on-primary font-bold rounded-xl shadow-lg hover:brightness-105 active:scale-[0.98] transition-all sketch-border-sm cursor-pointer"
            >
              Xác nhận tham dự
            </button>
          </form>
        ) : (
          <div className="py-4 text-center animate-fadeIn">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full text-green-500 mb-4 shadow border border-green-100">
              <CheckCircle2 size={36} className="animate-pulse" />
            </div>

            <h4 className="font-handwritten text-3xl text-primary font-bold mb-2">
              Chào {savedRSVP?.name}!
            </h4>

            <p className="font-body-md text-on-surface-variant max-w-sm mx-auto mb-6">
              Cảm ơn bạn đã xác nhận tham dự! Nam đã lưu thông tin đăng ký của bạn rồi nha. {savedRSVP?.notes ? <div className="mt-2 italic text-sm">Ghi chú: {savedRSVP?.notes}</div> : null} Hẹn sớm gặp nhau nhé! 🎉🎓
            </p>

            <div className="flex flex-col gap-2 max-w-xs mx-auto">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-[#105982] text-sm font-semibold rounded-lg border border-[#105982]/20 transition-all cursor-pointer"
              >
                Sửa lại thông tin phản hồi
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
export { RSVPForm };
