import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Trash2, Download } from 'lucide-react';
import { MemoryPhoto } from '../types';

export default function MemoryGallery() {
  const [photos, setPhotos] = useState<MemoryPhoto[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultPhotos: MemoryPhoto[] = [
    {
      id: 'photo-1',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANO0xIVuTduHCpphh6zKCgecudj9a0lt9HpW1EqtCVYrm29H6-lH4sUDhu5zgHevTRZVLPrYQLOETqzgVqpt2LIAVCzca7AGctL3o7_sXbyisKPGf0Qn09GwkH-rVaJiFy0XQtkhjqVwqwCucecsqsmVtNPpHkkfYZvbEnO_JvWM7hKFBbL8jKi2MzCUK0RWGTAYQGU39U9hYJZRdosLE3Iux1EHZnOmx955VT14-c59C5_9HlaTqrmNRelnzQfRIyGgyDKI_goiqN',
      caption: 'Một chiều bình yên bên giảng đường',
      author: 'Lan Anh'
    },
    {
      id: 'photo-2',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAs5vUsCyqO3hWWKIDB0QV-bAFcP-03WyaqAKRCBkwcke9Sbb2LcZwSUU0oH-amz2TkBJH-XXml-T4v3EMWdxoArTRa-w3H-Qi171ONp36MoxcTuFGmyH3uaqPl2y9XDQH3vQ-kF9GQGAA5XlWMQVwtikLnSl85-KdX-rWvKGgO47MISGAblVpDm_1jhtKRl5xhKPtnOids6-VVGa3WDPHvigbyd44YjPnwuR1mqf9qoueBPuahE_JnaEnkmEdrZhUASMIaHqGTuxtt',
      caption: 'Cùng chí hướng, cùng ước mơ',
      author: 'Anh Tuấn'
    },
    {
      id: 'photo-3',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7FVyv02NbMkopbQggUsZ-TmN31tAGlmj7I0A5pS8hoxNhb1zG1yj9t467_EyQsgwd4oQIZ9AwjspAHMD3e1RKVf1IPv6QfZxlOlDaZbWYqRaRakq0-raifOFfXfaj3tObgrE_6eedMbBYHvEth2-IR6yYKsGtFFmd2JqJGu0xe8RGrODV3HOPrnyl4p0dR_tSEPjgIEdwsfrShLuODtSs_X1H3pC8i6cs2zSB7gi_qoBxObzvCat4zau_U42HkVd_hYQ0vlk_6eXj',
      caption: 'Nụ cười ngày tốt nghiệp cận kề',
      author: 'Khánh Linh'
    },
    {
      id: 'photo-4',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5WSbwCNj29rbCa0P6KiDVPp2pb135mZ7OCO64-9Wqy9qWHA-yHiQebhZsDDv2hCRp_AShLWDpLq1EITJy-Lc61mKevirJ3UM6aJPTIaDmPLlO3NnafReKXaq6SZHGuVTt5iG3YAdqlH5giiACY2Cv66H3epfSKllibRuWJwfB7QXf-MUE-IEZEMJNaKTJ9pm7jIfGlvTz-PQdJMLQ5VEg1F5SSuechW4TE3dZGR1rorcmBPZArNc6-DC8YfaS4_HEJhFLtXwmO5_0',
      caption: 'Chiếc áo cử nhân kiêu hãnh',
      author: 'Thầy Minh'
    },
    {
      id: 'photo-5',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3Qum3sSW5ars0wT2iVT7a8GME_cMqdkXT_OclMVGCXpk1WkPjK8DdTly7OBT8w8cwXa7L5VGjrQXn9Fg-_k8aHV8uBC8xtKro_mys82ccpWpP4npcWzQkKim7yZs-lf1pWPkh8DP8-I-i1mTUTM_VPJjFEi6KWaB7jbBbVzNLB0LjKsNY1fZ3BcHGQ6IoFyHm8x1Esf5I-P9Yty_kBYSwcIws0TjkUwMh1BjYA1nBPQZBmNjPnTQmRXgUcAD28wAdSHOnqCXDGpTf',
      caption: 'Tình cảm bè bạn mãi bền vững',
      author: 'Hải Nam'
    },
    {
      id: 'photo-6',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcgQTpwbsn6MMdY-61yu-EyK-RovHzEDPiNFOSnvjHUjDuGpXJv2iMPoHU0yzSiNfxhDbUwe1lJktkIt703nSI0eaUCSBQ5A1KLTyhD5KYf3bnJAqgBYfN0VG_LsUO-55A8EwDigJ6mviE_vX-SBAGZe7fB0SwBdyZwHagrsZubTLxrRPCdfrHREWqrB4RqnoXcer2qAXTMQMfXhHi1myfB9dCKkGEzEaCWsqW6UGPQR_azWYXkElFsCEHzzTufkoNk-SbfF9aMGkl',
      caption: 'Bóng dáng người tri thức trưởng thành',
      author: 'Ngọc Diệp'
    }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('grad_photos');
    if (saved) {
      try {
        setPhotos(JSON.parse(saved));
      } catch (e) {
        setPhotos(defaultPhotos);
      }
    } else {
      setPhotos(defaultPhotos);
    }
  }, []);

  const savePhotos = (updated: MemoryPhoto[]) => {
    setPhotos(updated);
    localStorage.setItem('grad_photos', JSON.stringify(updated));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chỉ tải tệp hình ảnh có định dạng phù hợp (jpg, png)!');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('Tệp hình ảnh quá lớn! Vui lòng tải ảnh nhỏ hơn 8MB nha.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64Url = event.target.result as string;
        const newPhoto: MemoryPhoto = {
          id: `photo-${Date.now()}-${Math.random()}`,
          url: base64Url,
          caption: 'Kỷ niệm tuyệt vời cùng thầy cô bạn bè Quốc gia',
          author: 'Bạn thương yêu',
          isCustom: true
        };
        const updated = [newPhoto, ...photos];
        savePhotos(updated);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Bạn có muốn xóa kỷ niệm này không?')) {
      const filtered = photos.filter(p => p.id !== id);
      savePhotos(filtered);
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  // Specific tilts for scrapbook feel
  const rotations = [-2.5, 3.2, -1.2, 1.8, -3, 2.5];

  return (
    <div className="w-full">
      {/* Upload Zone */}
      <section className="mb-16">
        <h3 className="font-handwritten text-3xl text-center text-primary mb-6 font-bold flex items-center justify-center gap-2">
          Kỷ niệm cùng Nam
        </h3>
        
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`sketch-border border-dashed p-8 md:p-12 text-center transition-all duration-300 group cursor-pointer w-full pointer-events-auto border-4 ${
            isDragging 
              ? 'bg-secondary-fixed/30 border-secondary' 
              : 'bg-white/40 border-outline-variant/60 hover:bg-secondary-fixed/15'
          }`}
        >
          <input
            id="memory-file-input"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          <div className="w-16 h-16 rounded-full bg-secondary-fixed/30 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
            <UploadCloud className="text-secondary stroke-[1.5]" size={36} />
          </div>
          
          <p className="font-handwritten text-2xl text-primary font-bold">Tải ảnh lên</p>
          <p className="font-body-md text-on-surface-variant/80 text-center mt-2 max-w-sm mx-auto leading-normal">
            Nhấn hoặc thả ảnh vào đây để chia sẻ những khoảnh khắc đẹp của chúng ta nhé!
          </p>
        </div>
      </section>

      {/* Friends Memories Photo Grid */}
      <section className="mb-16">
        <h3 className="font-handwritten text-3xl text-center text-primary mb-8 font-bold flex items-center justify-center gap-2">
          Kỷ niệm từ bạn bè
        </h3>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, index) => {
            const rot = rotations[index % rotations.length];
            return (
              <div
                key={photo.id}
                onClick={() => openLightbox(index)}
                className="sketch-border-sm p-3 bg-white hover:rotate-0 hover:scale-[1.03] transition-all duration-300 shadow-sm cursor-zoom-in relative select-none pointer-events-auto"
                style={{ transform: `rotate(${rot}deg)` }}
              >
                {/* Washi tape on top for polaroid scrapbook effect */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-16 h-4 opacity-30 bg-[#bfdbfe]/60 border border-black/5 rotate-3"></div>

                <div className="w-full aspect-square overflow-hidden bg-slate-50 relative group">
                  <img
                    alt={photo.caption || 'Friend memory'}
                    src={photo.url}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Hover overlay (no like/heart) */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <span className="p-2 bg-white/90 rounded-full text-slate-700 shadow hover:scale-110 transition-transform">
                      <ImageIcon size={16} />
                    </span>
                  </div>

                  {/* Delete overlay for custom uploaded images */}
                  {photo.isCustom && (
                    <button
                      onClick={(e) => handleDeletePhoto(photo.id, e)}
                      className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-full shadow hover:bg-rose-700 pointer-events-auto transition-all transform scale-90 active:scale-75 z-10"
                      title="Xóa ảnh kỷ niệm này"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>

                {/* caption/author intentionally removed per user request */}
              </div>
            );
          })}
        </div>
      </section>

      {/* Lightbox full-screen popup modal */}
      {lightboxIndex !== null && (
        <div onClick={closeLightbox} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col justify-center items-center p-4 select-none pointer-events-auto">
          {/* Close button top right */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-[#083047] hover:text-[#071d27] bg-white p-2 rounded-full transition-all cursor-pointer pointer-events-auto shadow-lg"
            id="close-lightbox"
          >
            <X size={26} />
          </button>

          {/* Previous / Next triggers */}
          <div className="relative max-w-4xl max-h-[80vh] w-full flex items-center justify-center">
            {lightboxIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(lightboxIndex - 1);
                }}
                className="absolute left-2 md:-left-16 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 p-3 rounded-full transition-all text-xl font-bold font-mono cursor-pointer z-10 pointer-events-auto"
              >
                &lt;
              </button>
            )}

            <div onClick={(e) => e.stopPropagation()} className="bg-white/95 p-4 rounded-lg sketch-border max-w-[95%] text-center shadow-2xl relative">
              <img
                src={photos[lightboxIndex].url}
                alt={photos[lightboxIndex].caption}
                className="max-h-[60vh] max-w-full object-contain rounded mx-auto"
              />
              {/* caption/author removed from lightbox per user request */}
            </div>

            {lightboxIndex < photos.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(lightboxIndex + 1);
                }}
                className="absolute right-2 md:-right-16 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 p-3 rounded-full transition-all text-xl font-bold font-mono cursor-pointer z-10 pointer-events-auto"
              >
                &gt;
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export { MemoryGallery };
