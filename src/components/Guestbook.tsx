import React, { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { Send, Trash2, Quote, RefreshCw } from 'lucide-react';
import { Comment } from '../types';

export default function Guestbook() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [ownerId, setOwnerId] = useState('');

  // Default wishes from the original graduation celebration
  const defaultComments: Comment[] = [
    {
      id: 'default-1',
      author: 'Lan Anh',
      text: 'Chúc mừng Nam nhé! Cuối cùng cũng ra trường rồi, thành công rực rỡ nha! 🎓✨',
      createdAt: new Date().toISOString(),
      rotation: 1,
      colorIndex: 0,
    },
    {
      id: 'default-2',
      author: 'Anh Tuấn',
      text: 'Giỏi lắm em trai! Hẹn gặp ở buổi lễ nhé, rủ cả nhà đi ăn tiệc mừng bung lụa nha! 🥳🍻',
      createdAt: new Date().toISOString(),
      rotation: -1.5,
      colorIndex: 1,
    },
    {
      id: 'default-3',
      author: 'Thầy Minh',
      text: 'Chúc em vững bước trên con đường sự nghiệp sắp tới. Thầy luôn tự hào về sự kiên trì và cố gắng của em trong suốt 4 năm qua.',
      createdAt: new Date().toISOString(),
      rotation: 2,
      colorIndex: 2,
    },
  ];

  // Load from local storage or set defaults
  useEffect(() => {
    const saved = localStorage.getItem('grad_guestbook');
    // ensure we have a local owner id to mark which comments belong to this browser
    let existingOwner = localStorage.getItem('grad_guestbook_owner');
    if (!existingOwner) {
      existingOwner = `owner-${Date.now()}-${Math.random()}`;
      localStorage.setItem('grad_guestbook_owner', existingOwner);
    }
    setOwnerId(existingOwner);
    if (saved) {
      try {
        setComments(JSON.parse(saved));
      } catch (e) {
        setComments(defaultComments);
      }
    } else {
      setComments(defaultComments);
    }
  }, []);

  const saveComments = (newComments: Comment[]) => {
    setComments(newComments);
    localStorage.setItem('grad_guestbook', JSON.stringify(newComments));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) {
      setError('Vui lòng nhập đầy đủ tên và lời chúc nhé bạn thương!');
      return;
    }

    const newComment: Comment = {
      id: `comment-${Date.now()}-${Math.random()}`,
      author: author.trim(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
      rotation: (Math.random() * 4) - 2, // Random rot between -2 and 2
      colorIndex: Math.floor(Math.random() * 4), // pick a random pastel color
      ownerId: ownerId || undefined,
    };

    const updated = [newComment, ...comments];
    saveComments(updated);
    setAuthor('');
    setText('');
    setError('');
  };

  const handleDelete = (id: string) => {
    const target = comments.find((c) => c.id === id);
    if (!target) return;
    if (target.ownerId && target.ownerId !== ownerId) {
      // not allowed
      alert('Bạn chỉ có thể xóa lời chúc do chính bạn viết.');
      return;
    }
    const filtered = comments.filter((c) => c.id !== id);
    saveComments(filtered);
  };

  const handleResetDefaults = () => {
    if (confirm('Bạn có muốn khôi phục về danh sách lời chúc mặc định ban đầu không?')) {
      saveComments(defaultComments);
    }
  };

  const cardColors = [
    'bg-white border-pink-100',
    'bg-[#f4faff] border-sky-100',
    'bg-[#fcfaf2] border-amber-100',
    'bg-[#faf5ff] border-purple-100',
  ];

  const authorColors = [
    'text-[#105982]', // pink/plum
    'text-[#105982]', // deep sky
    'text-amber-800', // warm brown
    'text-[#7e4a8a]', // purple
  ];

  const tapeColors = [
    'bg-rose-400/20',
    'bg-sky-400/20',
    'bg-amber-400/20',
    'bg-indigo-400/20',
  ];

  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-handwritten text-4xl text-primary font-bold relative inline-block mx-auto">
          Sổ lưu bút
          <span className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-pink-400 to-indigo-400 rounded-full opacity-60"></span>
        </h3>
      </div>

      <div className="sketch-border-sm bg-white p-6 mb-8 relative shadow-sm">
        <div className="absolute top-2 right-3">
          <Quote className="text-primary/10 w-12 h-12 rotate-180" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <input
              id="guestbook-author-input"
              value={author}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setAuthor(e.target.value)}
              className="w-full bg-transparent border-2 border-outline-variant/60 rounded-lg px-3 py-3 focus:border-primary focus:ring-1 focus:ring-primary/10 outline-none font-handwritten text-lg text-primary placeholder:text-on-surface-variant transition-all"
              placeholder="Tên của bạn..."
              maxLength={40}
              type="text"
              aria-label="Tên của bạn"
            />
          </div>

          <div>
            <textarea
              id="guestbook-text-input"
              value={text}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
              className="w-full bg-white/50 border-2 border-dashed border-outline-variant rounded-lg p-3 font-handwritten text-lg text-on-surface resize-none min-h-[120px] placeholder:text-on-surface-variant transition-all"
              placeholder="Lời chúc tốt nghiệp gửi Nam..."
              maxLength={400}
              rows={4}
              aria-label="Lời chúc"
            />
          </div>

          {error && <p className="text-rose-600 text-sm font-semibold">{error}</p>}

          <div className="flex flex-col md:flex-row items-center gap-3 pt-2">
            <button
              type="submit"
              className="w-full md:flex-1 py-3 bg-[#105982] text-white rounded-full font-bold hover:bg-[#0e4f70] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg ring-1 ring-[#0e4f70]/10"
              aria-label="Gửi lời chúc"
            >
              Gửi lời chúc
              <Send size={16} />
            </button>

            {comments.length !== defaultComments.length && (
              <button
                type="button"
                onClick={handleResetDefaults}
                className="w-full md:w-auto px-4 py-2 bg-white border rounded-md text-xs text-on-surface-variant/70 hover:text-primary transition-colors flex items-center gap-2 justify-center"
                title="Khôi phục mặc định"
              >
                <RefreshCw size={14} /> Khôi phục mặc định
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Wishes Display Area */}
      <div className="space-y-6 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
        {comments.length === 0 ? (
          <p className="text-center italic text-on-surface-variant opacity-60 font-handwritten text-xl py-6">
            Chưa có lời chúc nào hết á, hãy là người chúc đầu tiên nha! ✨
          </p>
        ) : (
          comments.map((comment) => {
            const rot = comment.rotation ?? 0;
            const colorIdx = comment.colorIndex ?? 0;
            const cardColor = cardColors[colorIdx % cardColors.length];
            const authorColor = authorColors[colorIdx % authorColors.length];
            const tapeColor = tapeColors[colorIdx % tapeColors.length];

            return (
              <div
                key={comment.id}
                className={`sketch-border-sm p-5 pb-6 shadow-sm transition-all relative hover:rotate-0 duration-300 ${cardColor}`}
                style={{
                  transform: `rotate(${rot}deg)`,
                }}
              >
                {/* Washi tape visual attachment */}
                <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-16 h-5 rotate-2 shadow-sm border border-black/5 ${tapeColor}`}></div>

                <div className="flex justify-between items-start mb-2 pt-1">
                  <p className={`font-handwritten text-2xl font-bold ${authorColor}`}>
                    {comment.author}
                  </p>
                  
                  {/* Delete button (hidden by default, shows on hover or accessible) */}
                  {comment.ownerId && comment.ownerId === ownerId ? (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-on-surface-variant/30 hover:text-rose-600 transition-colors duration-150 p-1 rounded hover:bg-rose-50"
                      title="Xóa lời chúc"
                    >
                      <Trash2 size={14} />
                    </button>
                  ) : null}
                </div>

                <p className="font-body-md text-on-surface whitespace-pre-wrap leading-relaxed italic">
                  "{comment.text}"
                </p>

                <p className="text-[10px] text-on-surface-variant/40 mt-3 text-right">
                  {new Date(comment.createdAt).toLocaleDateString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
export { Guestbook };
