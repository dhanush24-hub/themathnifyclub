'use client';

import { useState } from 'react';
import Image from 'next/image';

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
}

export default function GalleryClient({ images }: { images: GalleryImage[] }) {
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  if (images.length === 0) {
    return (
      <div className="text-center py-16 text-white/50">
        No images in the gallery yet. Check back soon!
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img) => (
          <button
            key={img.id}
            type="button"
            className="group relative aspect-video rounded-xl overflow-hidden glass-panel border border-white/10 hover:border-indigo-500/50 transition-all text-left"
            onClick={() => setLightbox(img)}
          >
            <Image
              src={img.image_url}
              alt={img.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="font-semibold">{img.title}</p>
              {img.description && <p className="text-sm text-white/80 truncate">{img.description}</p>}
            </div>
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            ×
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={lightbox.image_url}
                alt={lightbox.title}
                fill
                className="object-contain"
              />
            </div>
            <div className="mt-4 text-center text-white">
              <h3 className="text-xl font-semibold">{lightbox.title}</h3>
              {lightbox.description && <p className="text-white/70 mt-1">{lightbox.description}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
