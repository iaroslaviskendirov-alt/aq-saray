import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RoomGalleryProps {
  photos: { src: string; alt: string }[]
  className?: string
}

// Слайдер фото номера: свайп на телефоне (scroll-snap), стрелки и точки на компьютере
export function RoomGallery({ photos, className }: RoomGalleryProps) {
  const track = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  const go = (i: number) => {
    const el = track.current
    if (!el) return
    const next = (i + photos.length) % photos.length
    el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <div className={cn('group relative overflow-hidden', className)}>
      <div
        ref={track}
        className="flex h-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={(e) => {
          const el = e.currentTarget
          setIndex(Math.round(el.scrollLeft / el.clientWidth))
        }}
      >
        {photos.map((p, i) => (
          <img
            key={p.src}
            src={p.src}
            alt={p.alt}
            loading={i === 0 ? 'eager' : 'lazy'}
            draggable={false}
            className="h-full w-full shrink-0 snap-center object-cover"
          />
        ))}
      </div>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Предыдущее фото"
            onClick={() => go(index - 1)}
            className="absolute top-1/2 left-3 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur transition group-hover:opacity-100 focus-visible:opacity-100 md:grid"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Следующее фото"
            onClick={() => go(index + 1)}
            className="absolute top-1/2 right-3 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur transition group-hover:opacity-100 focus-visible:opacity-100 md:grid"
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {photos.map((p, i) => (
              <span
                key={p.src}
                className={cn('h-1.5 rounded-full bg-white transition-all', i === index ? 'w-5 opacity-100' : 'w-1.5 opacity-50')}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
