type RsvpEntry = {
  name?: string;
  attending?: boolean;
  guests?: number;
  timestamp?: string;
};

function loadGuestList(): RsvpEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const listRaw = window.localStorage.getItem('grad_rsvp_list');
  if (listRaw) {
    try {
      const parsed = JSON.parse(listRaw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      return [];
    }
  }

  const singleRaw = window.localStorage.getItem('grad_rsvp');
  if (singleRaw) {
    try {
      const parsed = JSON.parse(singleRaw);
      return [parsed];
    } catch {
      return [];
    }
  }

  return [];
}

function formatTime(timestamp?: string) {
  if (!timestamp) return 'Chưa có thời gian';
  return new Date(timestamp).toLocaleString('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function AdminPage() {
  const guestList = loadGuestList();
  const confirmedGuests = guestList.filter((guest) => guest.attending !== false);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-900">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#105982]">Danh sách khách mời</h1>
              <p className="text-sm text-slate-500 mt-1">Trang admin chỉ hiển thị danh sách xác nhận tham gia.</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
              >
                Tải lại
              </button>
              <a
                href="/"
                className="px-4 py-2 rounded-lg bg-[#105982] text-white text-sm font-semibold"
              >
                Về trang khách
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="text-xs text-slate-500">Tổng RSVP</div>
              <div className="text-2xl font-bold text-[#105982]">{guestList.length}</div>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="text-xs text-slate-500">Sẽ tham dự</div>
              <div className="text-2xl font-bold text-emerald-600">{confirmedGuests.length}</div>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="text-xs text-slate-500">Không đi</div>
              <div className="text-2xl font-bold text-rose-600">{guestList.length - confirmedGuests.length}</div>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="text-xs text-slate-500">Danh sách</div>
              <div className="text-2xl font-bold text-slate-900">{guestList.length > 0 ? 'Có' : 'Trống'}</div>
            </div>
          </div>

          {guestList.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
              Chưa có khách nào xác nhận tham gia.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th className="py-3 pr-4">Tên</th>
                    <th className="py-3 pr-4">Trạng thái</th>
                    <th className="py-3 pr-4">Số khách</th>
                    <th className="py-3 pr-4">Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {guestList.map((guest, index) => (
                    <tr key={`${guest.name || 'guest'}-${index}`} className="border-b border-slate-100">
                      <td className="py-4 pr-4 font-semibold text-slate-900">{guest.name || 'Khách mời'}</td>
                      <td className="py-4 pr-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${guest.attending === false ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                          {guest.attending === false ? 'Không tham dự' : 'Sẽ tham dự'}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-slate-700">{guest.attending === false ? 0 : guest.guests || 1}</td>
                      <td className="py-4 pr-4 text-slate-500">{formatTime(guest.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
