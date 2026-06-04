import * as React from 'react';
import { useState, useEffect, type ChangeEvent } from 'react';
import { GraduationCap, MapPin, Phone, Calendar as CalendarIcon, ChevronRight, Sparkles, User, CreditCard as Edit, Check, Circle as HelpCircle, Map, Hop as Home, Users, MessageSquare, Volume2, Bookmark, Heart, Star, Gift, Smile, Music } from 'lucide-react';
import FloatingIcons from './components/FloatingIcons';
import Countdown from './components/Countdown';
import RSVPForm from './components/RSVPForm';
import Guestbook from './components/Guestbook';
import MemoryGallery from './components/MemoryGallery';

function IntroScreen({
  onOpen,
  opening,
}: {
  onOpen: () => void;
  opening: boolean;
}) {
  return (
    <main className="intro-page flex min-h-svh items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="intro-page__glow"></div>

      {/* Use shared FloatingIcons component for consistency */}
      <FloatingIcons />

      <section className="relative z-10 flex w-full max-w-lg flex-col items-center text-center">
        <p className="mb-3 font-sans text-xs font-bold uppercase tracking-[0.45em] text-[#105982]/70">
          From Nam to All friends
        </p>

        <h1 className="font-handwritten text-4xl md:text-5xl font-bold leading-tight text-[#105982] drop-shadow-sm">
          Nhấn dô đuy :3
          <br />
  
        </h1>


        <button
          type="button"
          onClick={onOpen}
          onKeyDown={(e: KeyboardEvent) => {
            const key = (e as KeyboardEvent).key || (e as any).key;
            if (key === 'Enter' || key === ' ') {
              e.preventDefault?.();
              onOpen();
            }
          }}
          disabled={opening}
          aria-label="Mở bì thư"
          aria-pressed={opening}
          aria-expanded={opening}
          title="Mở thư mời"
          className={`intro-envelope mt-8 ${opening ? 'is-opening' : ''}`}
        >
          <span className="intro-envelope__shadow" aria-hidden="true"></span>
          <span className="intro-envelope__back" aria-hidden="true"></span>
          <span className="intro-envelope__letter" aria-hidden={opening}>
            <span className="intro-envelope__letter-ribbon">From Nam to All Friends</span>
            <span className="intro-envelope__letter-title">Lời mời tốt nghiệp</span>
          </span>
          <span className="intro-envelope__body-flap" aria-hidden="true"></span>
          <span className="intro-envelope__flap" aria-hidden="true"></span>
          <span className="intro-envelope__seal" aria-hidden="true">
            <img src="/hcmut.png" alt="HCMUT Logo" />
          </span>
        </button>

        
      </section>
    </main>
  );
}

export default function App() {
  const [showMain, setShowMain] = useState(false);
  const [isOpeningEnvelope, setIsOpeningEnvelope] = useState(false);

  // Live customization state so the user can easily personalize this beautiful card!
  const [isEditing, setIsEditing] = useState(false);
  const [gradName, setGradName] = useState('Nguyễn Hoàng Nam');
  const [classYear, setClassYear] = useState('Class of 2024');
  const [introQuote, setIntroQuote] = useState(
    'Bốn năm đại học trôi qua nhanh như một cái chớp mắt. Nam cảm ơn gia đình và bạn bè đã luôn bên cạnh ủng hộ Nam trong suốt hành trình này. Rất mong được gặp mọi người để cùng chia sẻ niềm vui trong ngày trọng đại này!'
  );
  
  // Custom uploaded primary portrait photo (fallback to Nguyen Hoang Nam default)
  const defaultPortrait = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAAls-BAS_wGhvRDsKhbtV55DujaQ0wfXxfNUPl-YXMKVWwotmABaoi05fYHVb8gpQuqtk-MWhdrQvuz9ZNDrvxakMn5uXpPEvtsvf2vPYZRIlui1yYAe6NXVPL1trsfzHIzr8GCDD9ZRvCghm9KutKCMNDxmPi2vQKBC1ORPmaEnusl6Wx-H5d_a3L0lY3Ni0QwKpRoZWTdW3dnPZZYyhTdsvUzIEAvr-803392G9Q14dtkZQQGL_zHgcsO2wBfy7ki3J89qAymUJ';
  const [gradPhoto, setGradPhoto] = useState(defaultPortrait);

  

  // Load customizations
  useEffect(() => {
    const savedName = localStorage.getItem('grad_custom_name');
    const savedClass = localStorage.getItem('grad_custom_class');
    const savedQuote = localStorage.getItem('grad_custom_quote');
    const savedPhoto = localStorage.getItem('grad_custom_photo');

    if (savedName) setGradName(savedName);
    if (savedClass) setClassYear(savedClass);
    if (savedQuote) setIntroQuote(savedQuote);
    if (savedPhoto) setGradPhoto(savedPhoto);
  }, []);

  useEffect(() => {
    if (!isOpeningEnvelope) return;

    const openTimer = window.setTimeout(() => {
      setShowMain(true);
    }, 900);

    return () => window.clearTimeout(openTimer);
  }, [isOpeningEnvelope]);

  const handleOpenEnvelope = () => {
    if (isOpeningEnvelope) return;
    setIsOpeningEnvelope(true);
  };

  const handleSaveEdit = () => {
    localStorage.setItem('grad_custom_name', gradName);
    localStorage.setItem('grad_custom_class', classYear);
    localStorage.setItem('grad_custom_quote', introQuote);
    setIsEditing(false);
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64 = event.target.result as string;
          setGradPhoto(base64);
          localStorage.setItem('grad_custom_photo', base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  

  // Smooth scroll helper
  const scrollToAnchor = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!showMain) {
    return <IntroScreen onOpen={handleOpenEnvelope} opening={isOpeningEnvelope} />;
  }

  return (
    <div className="bg-[#fdfcf8] text-on-background min-h-screen font-sans selection:bg-[#f48fb1]/30 selection:text-[#722544] relative pb-24 md:pb-12 animate-fadeIn">
      {/* Decorative background texture simulating fine paper pulp */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.07]" 
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }}
      ></div>

      {/* Floating Icons Effect */}
      <FloatingIcons />

      {/* FIXED BAR HEADER */}
      <header className="bg-white/70 backdrop-blur-md border-b-2 border-slate-200/60 w-full sticky top-0 px-4 md:px-12 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-center h-16 relative">
          <h1 className="font-handwritten text-2xl md:text-3xl text-primary font-bold cursor-pointer hover:scale-105 transition-transform text-center">
            Grad Celebration
          </h1>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main id="hero" className="relative pt-8 px-4 md:px-12 max-w-4xl mx-auto z-30">
        
        {/* DOODLE VECTOR DECORATIONS (Physical Scrapbook Feel) */}
        <div className="absolute top-10 left-1 floating-doodle opacity-30 select-none pointer-events-none">
          <Sparkles className="text-primary w-12 h-12" />
        </div>
        <div className="absolute top-44 right-2 floating-doodle opacity-30 select-none pointer-events-none" style={{ animationDelay: '-2s' }}>
          <GraduationCap className="text-secondary w-14 h-14" />
        </div>

        {/* HERO TITLE HEADER */}
        <section className="text-center mb-12 relative animate-fadeIn">
          <h2 className="font-handwritten text-4xl md:text-5xl text-primary mb-4 leading-tight font-bold">
            MỜI BẠN ĐẾN DỰ <br /> 
            <span className="relative inline-block mt-1">
              Lễ tốt nghiệp
              <span className="absolute left-0 right-0 -bottom-1 h-3 bg-cyan-300 -z-10 transform -rotate-1 skew-x-3 opacity-60"></span>
            </span>
          </h2>

          {/* GRADUATE PORTRAIT COMPONENT WITH LOCAL CUSTOMIZATION */}
          <div className="relative inline-block mt-8">
            {/* Cute scrapbook washi tapes */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-300/40 w-28 h-8 z-10 transform rotate-[-4deg] border border-cyan-400/20 shadow-sm"></div>
            
            <div className="sketch-border p-6 bg-white rotate-2 hover:rotate-0 transition-all duration-500 shadow-xl max-w-[380px] mx-auto pointer-events-auto">
              <div className="relative group overflow-hidden bg-slate-50 border border-slate-100">
                <img 
                  alt={gradName} 
                  src={gradPhoto} 
                  className="w-full h-96 object-cover grayscale-0 transition-all duration-700 select-none group-hover:scale-102" 
                />
                
                {isEditing && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center p-4">
                    <label className="px-3 py-1.5 bg-white text-xs font-bold rounded cursor-pointer hover:bg-slate-100 transition-colors shadow">
                      Đổi ảnh chân dung
                      <input type="file" onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                    </label>
                    <p className="text-[10px] text-white/70 text-center mt-2">Dùng tệp ảnh dọc chân dung tỷ lệ 4:5</p>
                  </div>
                )}
              </div>

              <div className="mt-5 text-center px-1">
                {isEditing ? (
                  <div className="space-y-2 py-1">
                    <input 
                      type="text" 
                      value={gradName} 
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setGradName(e.target.value)}
                      className="w-full border border-primary/20 px-2 py-1 text-sm bg-slate-50 rounded"
                      placeholder="Nhập tên"
                    />
                    <input 
                      type="text" 
                      value={classYear} 
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setClassYear(e.target.value)}
                      className="w-full border border-primary/20 px-2 py-1 text-xs bg-slate-50 rounded"
                      placeholder="Class of..."
                    />
                  </div>
                ) : (
                  <>
                    <p className="font-handwritten text-[#105982] text-4xl font-bold tracking-tight">
                      {gradName}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ACTIVE COUNTDOWN TIMER MODULE */}
        <Countdown initialDateString="2026-06-15T08:30:00" />

        {/* GRAD SPECIAL MESSAGE INTRODUCTION */}
        <section className="mb-14 max-w-xl mx-auto relative px-4 text-center">
          <div className="absolute -top-6 -left-2 font-serif text-6xl text-primary/15 select-none font-bold">“</div>
          
          {isEditing ? (
            <div className="vintage-card p-3 border-none">
              <label className="block text-xs font-bold text-on-surface-variant mb-1 text-left">
                Lời ngỏ gửi bạn bè (Tiếng Việt):
              </label>
              <textarea
                value={introQuote}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setIntroQuote(e.target.value)}
                className="w-full h-24 p-2 text-sm border-2 border-dashed border-[#8b7355] rounded font-sans focus:outline-none"
                maxLength={300}
              />
              <button
                onClick={handleSaveEdit}
                className="mt-2 px-3 py-1 bg-primary text-white text-xs font-bold rounded flex items-center gap-1 ml-auto"
              >
                <Check size={12} /> Lưu thông tin
              </button>
            </div>
          ) : (
            <p className="font-sans text-base md:text-[18px] text-on-surface leading-loose font-medium italic select-none">
              "{introQuote}"
            </p>
          )}

          {/* Decorative closing quote mark */}
          <div className="absolute -bottom-4 -right-2 font-serif text-6xl text-primary/15 select-none font-bold">”</div>
        </section>

        {/* LOGISTICS CARD DETAILS: TIME & LOCATION */}
        <div id="schedule" className="grid md:grid-cols-3 gap-8 mb-14">

          {/* TIME CONTAINER */}
          <div className="vintage-card p-6 hover:-rotate-1 transition-all duration-300 relative">


            <div className="flex items-center gap-3 mb-4 border-b border-dashed border-[#8b7355]/20 pb-3">
              <CalendarIcon className="text-primary stroke-[1.8]" size={28} />
              <h3 className="font-handwritten text-2xl font-bold text-primary">Thời gian tổ chức</h3>
            </div>
            
            <div className="space-y-3 font-sans text-left">
              <div>
                <p className="text-xs font-bold uppercase text-on-surface-variant opacity-60 tracking-wider">Ngày chính thức</p>
                <p className="text-base font-bold text-on-surface">Chủ Nhật, ngày 15 tháng 6, 2026</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <p className="text-xs font-bold uppercase text-on-surface-variant opacity-60 tracking-wider">Lễ trao bằng</p>
                  <p className="text-sm font-semibold text-on-surface">08:30 sáng</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-on-surface-variant opacity-60 tracking-wider">Tiệc mặn chung vui</p>
                  <p className="text-sm font-semibold text-on-surface">11:30 trưa</p>
                </div>
              </div>
            </div>
          </div>

          {/* LOCATION CONTAINER */}
          <div className="vintage-card p-6 hover:rotate-1 transition-all duration-300 relative">


            <div className="flex items-center gap-3 mb-4 border-b border-dashed border-[#8b7355]/20 pb-3">
              <MapPin className="text-secondary stroke-[1.8]" size={28} />
              <h3 className="font-handwritten text-2xl font-bold text-secondary">Địa điểm</h3>
            </div>
            
              <div className="space-y-2 text-left font-sans">
              <p className="text-xs font-bold uppercase text-on-surface-variant opacity-60 tracking-wider">Trường Đại học</p>
              <p className="text-base font-bold text-on-surface">Hanoi University (HANU)</p>
              <p className="text-xs text-on-surface-variant font-medium">Km 9, đường Nguyễn Trãi, quận Nam Từ Liêm, Hà Nội</p>

              <div className="pt-3">
                <a 
                  href="https://maps.google.com/?q=Hanoi+University+Nguyen+Trai+Hanoi"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-[#41befd]/15 hover:bg-[#41befd]/25 text-[#105982] font-semibold rounded-lg text-xs tracking-wide transition-all flex items-center justify-center gap-1.5 border border-[#41befd]/30 pointer-events-auto shadow-sm cursor-pointer"
                >
                  <Map size={13} />
                  Xem trên Google Maps
                </a>
              </div>

            </div>
          </div>

          {/* CONTACT CARD (separate) */}
          <div className="vintage-card p-6 hover:rotate-1 transition-all duration-300 relative">
            <div className="flex items-center gap-3 mb-4 border-b border-dashed border-[#8b7355]/20 pb-3">
              <Phone className="text-primary stroke-[1.2]" size={28} />
              <h3 className="font-handwritten text-2xl font-bold text-primary">Liên hệ</h3>
            </div>

            <div className="space-y-3 font-sans text-left">
              <div>
                <p className="text-xs font-bold uppercase text-on-surface-variant opacity-60 tracking-wider">Số điện thoại</p>
                <p className="text-base font-bold text-primary">0987 654 321 (Nam)</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-on-surface-variant opacity-60 tracking-wider">Ghi chú</p>
                <p className="text-sm text-on-surface-variant">Vui lòng gọi trước để Nam có thể sắp xếp khi đến.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RSVP FORM COMPONENT */}
        <div id="rsvp">
          <RSVPForm />
        </div>

        {/* GUESTBOOK MODULE & DIGITAL PEN */}
        <div id="guestbook">
          <Guestbook />
        </div>

        {/* SCRAPBOOK SNAPSHOTS MEMORY COMPONENT */}
        <div id="memories">
          <MemoryGallery />
        </div>

      </main>

      {/* FOOTER SECTION */}
      <footer className="bg-slate-100/50 w-full py-16 px-4 md:px-12 mt-28 border-t-2 border-dashed border-slate-200">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <div className="font-handwritten text-[#105982] text-3xl font-bold">Grad Celebration</div>
            <p className="text-xs sm:text-sm text-on-surface-variant font-medium mt-1 font-sans">
              Trang thông tin lưu niệm ngày Tốt Nghiệp của {gradName}
            </p>
          </div>
          <p className="font-sans text-xs text-on-surface-variant/70 italic">
            Made with love &amp; academic ink © 2026
          </p>
        </div>
      </footer>

      {/* Floating bottom nav removed per user request */}
    </div>
  );
}
export { App };
