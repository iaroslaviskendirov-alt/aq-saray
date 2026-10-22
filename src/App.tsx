import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  BedDouble,
  Briefcase,
  CalendarDays,
  Car,
  Check,
  ChevronDown,
  Clock,
  MapPin,
  Maximize,
  Minus,
  Phone,
  Plus,
  Send,
  Shirt,
  Users,
  Waves,
  Wifi,
  X,
} from 'lucide-react'
import { RoomGallery } from '@/components/ui/room-gallery'
import { TelegramPreview, type BotRequest } from '@/components/ui/telegram-preview'
import { AMENITIES, DINING, EXTRAS, FAQ, GALLERY, HOTEL, ROOMS, img, type Room } from '@/data'
import {
  addDays,
  dayLabel,
  extrasPrice,
  guestsText,
  money,
  nightsBetween,
  nightsText,
  stayPrice,
  toISO,
} from '@/lib/booking'
import { cn } from '@/lib/utils'

const AMENITY_ICONS = { clock: Clock, car: Car, wifi: Wifi, waves: Waves, briefcase: Briefcase, shirt: Shirt }

const NAV = [
  { href: '#rooms', label: 'Номера' },
  { href: '#dining', label: 'Ресторан' },
  { href: '#spa', label: 'Спа' },
  { href: '#bot', label: 'Telegram-бот' },
  { href: '#contacts', label: 'Контакты' },
]

const INITIAL_REQUESTS: BotRequest[] = [
  {
    id: 1042,
    time: '09:14',
    lines: ['🛎 Новая бронь #1042', 'Комфорт · 2 гостя', 'Заезд 14:00, 2 ночи', 'Айгерим, +7 7•• ••• 12 34', 'Итого: 62 000 ₸'],
    status: 'confirmed',
  },
]

const now = () => new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="mb-3 text-xs font-semibold tracking-[0.28em] text-gold uppercase">{children}</p>
}

function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn('font-serif text-4xl leading-[1.05] font-medium text-ivory md:text-6xl', className)}>{children}</h2>
}

export default function App() {
  const [today] = useState(() => toISO(new Date()))
  const [checkIn, setCheckIn] = useState(() => addDays(today, 1))
  const [checkOut, setCheckOut] = useState(() => addDays(today, 3))
  const [guests, setGuests] = useState(2)
  const [scrolled, setScrolled] = useState(false)
  const [booking, setBooking] = useState<Room | null>(null)
  const [requests, setRequests] = useState<BotRequest[]>(INITIAL_REQUESTS)

  const nights = nightsBetween(checkIn, checkOut)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const changeCheckIn = (v: string) => {
    if (!v || v < today) return
    setCheckIn(v)
    // выезд всегда хотя бы через ночь после заезда
    if (nightsBetween(v, checkOut) < 1) setCheckOut(addDays(v, 1))
    if (nightsBetween(v, checkOut) > 30) setCheckOut(addDays(v, 30))
  }
  const changeCheckOut = (v: string) => {
    if (!v) return
    const n = nightsBetween(checkIn, v)
    if (n >= 1 && n <= 30) setCheckOut(v)
  }

  const addRequest = (lines: string[]) => {
    setRequests((rs) => [...rs, { id: (rs.at(-1)?.id ?? 1042) + 1, time: now(), lines, status: 'new' }])
  }
  const confirmRequest = (id: number) =>
    setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, status: 'confirmed' } : r)))

  const demoRequest = () => {
    const room = ROOMS[Math.floor(Math.random() * ROOMS.length)]
    const g = Math.min(room.guests, guests)
    const { total } = stayPrice(room, checkIn, nights)
    addRequest([
      `🛎 Новая бронь #${(requests.at(-1)?.id ?? 1042) + 1}`,
      `${room.name} · ${guestsText(g)}`,
      `${dayLabel(checkIn)} — ${dayLabel(checkOut)}, ${nightsText(nights)}`,
      'Тестовый гость, +7 7•• ••• 00 00',
      `Итого: ${money(total)}`,
    ])
  }

  return (
    <div id="top" className="min-h-svh overflow-x-clip font-sans">
      {/* ---------- Шапка ---------- */}
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-all duration-500',
          scrolled ? 'border-b border-white/5 bg-ink/85 backdrop-blur-xl' : 'bg-transparent',
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-20 md:px-8">
          <a href="#top" className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-semibold tracking-[0.18em] text-ivory md:text-3xl">AQ SARAY</span>
            <span className="hidden text-[10px] tracking-[0.3em] text-gold uppercase sm:inline">hotel</span>
          </a>
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Разделы">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="text-sm text-ivory/75 transition hover:text-gold">
                {n.label}
              </a>
            ))}
          </nav>
          <a
            href="#rooms"
            className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-[#e2c486]"
          >
            Забронировать
          </a>
        </div>
      </header>

      {/* ---------- Первый экран ---------- */}
      <section className="relative flex min-h-svh flex-col justify-end">
        <img
          src={img('hero')}
          alt="Фасад отеля вечером"
          className="absolute inset-0 h-full w-full object-cover object-[50%_40%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/50 to-ink md:via-ink/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />

        <div className="relative mx-auto w-full max-w-7xl px-4 pt-32 pb-10 md:px-8 md:pb-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl [text-shadow:0_2px_28px_rgba(0,0,0,0.75)]"
          >
            <Eyebrow>Отель · Ресторан · Спа</Eyebrow>
            <h1 className="font-serif text-5xl leading-[0.98] font-medium text-ivory sm:text-6xl md:text-8xl">
              Тишина, сервис <br className="hidden sm:block" />
              <em className="text-gold">и вид на горы</em>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/75 md:text-lg">
              Пять категорий номеров, ресторан с открытой кухней, бассейн и хамам. Бронь онлайн за минуту — без
              звонков и предоплаты.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <SearchBar
              today={today}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              nights={nights}
              onCheckIn={changeCheckIn}
              onCheckOut={changeCheckOut}
              onGuests={setGuests}
            />
          </motion.div>
        </div>
      </section>

      {/* ---------- Номера ---------- */}
      <section id="rooms" className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-32">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow>Номера</Eyebrow>
            <SectionTitle>Выберите номер</SectionTitle>
          </div>
          <a
            href="#top"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-panel px-4 py-2.5 text-sm text-ivory/85 transition hover:border-gold/50"
          >
            <CalendarDays className="size-4 text-gold" />
            {dayLabel(checkIn)} — {dayLabel(checkOut)} · {nightsText(nights)} · {guestsText(guests)}
            <span className="text-gold">изменить</span>
          </a>
        </Reveal>

        <div className="mt-12 flex flex-col gap-8 md:mt-16 md:gap-12">
          {ROOMS.map((room, i) => (
            <RoomCard
              key={room.id}
              room={room}
              flip={i % 2 === 1}
              checkIn={checkIn}
              nights={nights}
              guests={guests}
              onBook={() => setBooking(room)}
            />
          ))}
        </div>
      </section>

      {/* ---------- Telegram-бот ---------- */}
      <section id="bot" className="border-y border-white/5 bg-night">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <Eyebrow>Для администратора</Eyebrow>
            <SectionTitle>Брони приходят в Telegram</SectionTitle>
            <p className="mt-6 max-w-xl text-ivory/70 md:text-lg">
              Заявка с сайта за секунду попадает в чат с ботом: номер, даты, гости, контакты и сумма. Администратор
              подтверждает бронь одной кнопкой — даже ночью и с телефона.
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ['Мгновенно', 'Не нужно проверять почту и сайт'],
                ['Одной кнопкой', '«Подтвердить» — и гость получает ответ'],
                ['Для всей смены', 'Бот пишет в общий чат ресепшена'],
                ['Без комиссий', 'Прямые брони, а не через агрегаторы'],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                    <Check className="size-3.5" />
                  </span>
                  <span>
                    <span className="block font-semibold text-ivory">{t}</span>
                    <span className="text-sm text-ivory/60">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={demoRequest}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition hover:bg-[#e2c486]"
              >
                <Send className="size-4" /> Отправить тестовую бронь
              </button>
              <span className="text-sm text-ivory/50">или забронируйте любой номер выше</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <TelegramPreview botName="AQ SARAY · Брони" requests={requests} onConfirm={confirmRequest} />
          </Reveal>
        </div>
      </section>

      {/* ---------- Ресторан ---------- */}
      <section id="dining" className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-32">
        <Reveal>
          <Eyebrow>Ресторан и бар</Eyebrow>
          <SectionTitle className="max-w-3xl">Ужин без выхода из отеля</SectionTitle>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {DINING.map((d, i) => (
            <Reveal key={d.title} delay={i * 0.08}>
              <article className="group overflow-hidden rounded-3xl border border-white/5 bg-panel">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={img(d.photo)}
                    alt={d.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-serif text-2xl font-medium">{d.title}</h3>
                    <span className="shrink-0 text-xs text-gold">{d.hours}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/65">{d.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Спа ---------- */}
      <section id="spa" className="relative">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-12 md:px-8">
          <Reveal className="relative overflow-hidden rounded-3xl md:col-span-8 md:row-span-2">
            <img src={img('pool')} alt="Бассейн" loading="lazy" className="h-full min-h-[340px] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
              <Eyebrow>Спа</Eyebrow>
              <h2 className="font-serif text-4xl leading-tight font-medium md:text-5xl">Бассейн, хамам и сауна</h2>
              <p className="mt-3 max-w-lg text-ivory/75">
                20-метровый бассейн с панорамными окнами. Для гостей отеля — бесплатно, каждый день с 07:00 до 22:00.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="overflow-hidden rounded-3xl md:col-span-4">
            <img src={img('pool-2')} alt="Зона отдыха у бассейна" loading="lazy" className="aspect-[4/3] h-full w-full object-cover" />
          </Reveal>
          <Reveal delay={0.16} className="overflow-hidden rounded-3xl md:col-span-4">
            <img src={img('steam')} alt="Хамам" loading="lazy" className="aspect-[4/3] h-full w-full object-cover" />
          </Reveal>
        </div>
      </section>

      {/* ---------- Удобства ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-32">
        <Reveal>
          <Eyebrow>В отеле</Eyebrow>
          <SectionTitle>Всё рядом</SectionTitle>
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/5 bg-white/5 sm:grid-cols-2 lg:grid-cols-3">
          {AMENITIES.map((a) => {
            const Icon = AMENITY_ICONS[a.icon]
            return (
              <div key={a.title} className="bg-ink p-7 md:p-9">
                <Icon className="size-6 text-gold" strokeWidth={1.5} />
                <h3 className="mt-5 font-serif text-2xl font-medium">{a.title}</h3>
                <p className="mt-1.5 text-sm text-ivory/60">{a.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ---------- Галерея ---------- */}
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8 md:pb-32">
        <Reveal>
          <Eyebrow>Галерея</Eyebrow>
          <SectionTitle>Атмосфера</SectionTitle>
        </Reveal>
        <div className="mt-12 grid grid-flow-row-dense auto-rows-[160px] grid-cols-2 gap-3 md:auto-rows-[220px] md:grid-cols-4 md:gap-4">
          {GALLERY.map((g) => (
            <Reveal key={g.photo} className={cn('overflow-hidden rounded-2xl', g.span)}>
              <img src={img(g.photo)} alt={g.alt} loading="lazy" className="h-full w-full object-cover transition duration-700 hover:scale-105" />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Вопросы ---------- */}
      <section className="border-t border-white/5 bg-night">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <Eyebrow>Вопросы</Eyebrow>
            <SectionTitle>Перед поездкой</SectionTitle>
          </Reveal>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown className="size-5 shrink-0 text-gold transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-ivory/65">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Контакты ---------- */}
      <footer id="contacts" className="relative overflow-hidden">
        <img src={img('terrace')} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/60" />
        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-10 md:px-8 md:pt-28">
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="font-serif text-5xl font-semibold tracking-[0.14em] md:text-7xl">AQ SARAY</p>
              <p className="mt-4 max-w-md text-ivory/70">Ждём вас в любое время — ресепшен работает круглосуточно.</p>
              <a
                href="#rooms"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition hover:bg-[#e2c486]"
              >
                Выбрать номер <ArrowRight className="size-4" />
              </a>
            </div>
            <ul className="space-y-5 text-ivory/80">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-gold" /> {HOTEL.address}
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-gold" /> {HOTEL.phone}
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-gold" /> Заезд с {HOTEL.checkIn}, выезд до {HOTEL.checkOut}
              </li>
            </ul>
          </div>
          <div className="mt-16 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-ivory/45 md:flex-row md:justify-between">
            <p>Концепт сайта. Отель, номера, цены и контакты вымышленные.</p>
            <p>
              Фото —{' '}
              <a href="https://unsplash.com" target="_blank" rel="noopener" className="underline hover:text-gold">
                Unsplash
              </a>
              , логотипы на фото скрыты.
            </p>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {booking && (
          <BookingSheet
            key={booking.id}
            room={booking}
            checkIn={checkIn}
            checkOut={checkOut}
            nights={nights}
            guests={Math.min(guests, booking.guests)}
            onClose={() => setBooking(null)}
            onSubmit={addRequest}
            nextId={(requests.at(-1)?.id ?? 1042) + 1}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ================= Поиск по датам ================= */

interface SearchBarProps {
  today: string
  checkIn: string
  checkOut: string
  guests: number
  nights: number
  onCheckIn: (v: string) => void
  onCheckOut: (v: string) => void
  onGuests: (n: number) => void
}

function SearchBar({ today, checkIn, checkOut, guests, nights, onCheckIn, onCheckOut, onGuests }: SearchBarProps) {
  const field = 'flex min-w-0 flex-col gap-1 px-5 py-3.5'
  const label = 'text-[11px] font-semibold tracking-[0.2em] text-gold uppercase'
  return (
    <div className="mt-10 grid overflow-hidden rounded-3xl border border-white/10 bg-ink/70 backdrop-blur-xl md:mt-14 md:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
      <label className={cn(field, 'border-b border-white/10 md:border-r md:border-b-0')}>
        <span className={label}>Заезд</span>
        <input
          type="date"
          value={checkIn}
          min={today}
          onChange={(e) => onCheckIn(e.target.value)}
          className="w-full bg-transparent text-lg text-ivory outline-none"
        />
      </label>
      <label className={cn(field, 'border-b border-white/10 md:border-r md:border-b-0')}>
        <span className={label}>
          Выезд <span className="tracking-normal text-ivory/50 normal-case">· {nightsText(nights)}</span>
        </span>
        <input
          type="date"
          value={checkOut}
          min={addDays(checkIn, 1)}
          max={addDays(checkIn, 30)}
          onChange={(e) => onCheckOut(e.target.value)}
          className="w-full bg-transparent text-lg text-ivory outline-none"
        />
      </label>
      <div className={cn(field, 'border-b border-white/10 md:border-r md:border-b-0')}>
        <span className={label}>Гости</span>
        <div className="flex items-center justify-between gap-3">
          <span className="text-lg whitespace-nowrap">{guestsText(guests)}</span>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Меньше гостей"
              disabled={guests <= 1}
              onClick={() => onGuests(guests - 1)}
              className="grid size-8 place-items-center rounded-full border border-white/15 transition hover:border-gold disabled:opacity-30"
            >
              <Minus className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Больше гостей"
              disabled={guests >= 4}
              onClick={() => onGuests(guests + 1)}
              className="grid size-8 place-items-center rounded-full border border-white/15 transition hover:border-gold disabled:opacity-30"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>
      </div>
      <a
        href="#rooms"
        className="m-2 flex items-center justify-center gap-2 rounded-2xl bg-gold px-8 md:col-span-3 lg:col-span-1 py-4 font-semibold text-ink transition hover:bg-[#e2c486]"
      >
        Показать номера <ArrowRight className="size-4" />
      </a>
    </div>
  )
}

/* ================= Карточка номера ================= */

interface RoomCardProps {
  room: Room
  flip: boolean
  checkIn: string
  nights: number
  guests: number
  onBook: () => void
}

function RoomCard({ room, flip, checkIn, nights, guests, onBook }: RoomCardProps) {
  const { total, weekend } = stayPrice(room, checkIn, nights)
  const fits = guests <= room.guests
  return (
    <Reveal>
      <article
        className={cn(
          'grid overflow-hidden rounded-3xl border border-white/5 bg-panel md:grid-cols-[1.25fr_1fr]',
          flip && 'md:grid-cols-[1fr_1.25fr]',
        )}
      >
        <RoomGallery
          photos={room.photos.map((p, i) => ({ src: img(p), alt: `${room.name}, фото ${i + 1}` }))}
          className={cn('aspect-[4/3] md:aspect-auto md:min-h-[440px]', flip && 'md:order-2')}
        />
        <div className="flex flex-col p-6 md:p-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-serif text-3xl font-medium md:text-4xl">{room.name}</h3>
              <p className="mt-1 text-sm text-gold">{room.short}</p>
            </div>
            {room.left <= 2 && (
              <span className="shrink-0 rounded-full border border-gold/40 px-3 py-1 text-xs text-gold">
                {room.left === 1 ? 'Последний номер' : `Осталось ${room.left}`}
              </span>
            )}
          </div>
          <p className="mt-5 leading-relaxed text-ivory/70">{room.desc}</p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ivory/80">
            <span className="flex items-center gap-2">
              <Maximize className="size-4 text-gold" /> {room.area} м²
            </span>
            <span className="flex items-center gap-2">
              <Users className="size-4 text-gold" /> до {guestsText(room.guests)}
            </span>
            <span className="flex items-center gap-2">
              <BedDouble className="size-4 text-gold" /> {room.bed}
            </span>
          </div>
          <ul className="mt-5 flex flex-wrap gap-2">
            {room.features.map((f) => (
              <li key={f} className="rounded-full bg-white/5 px-3 py-1 text-xs text-ivory/70">
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-6 md:mt-10">
            <div>
              <p className="text-sm text-ivory/55">от {money(room.price)} / ночь</p>
              <p className="font-serif text-3xl font-semibold text-ivory">
                {money(total)} <span className="font-sans text-sm font-normal text-ivory/55">за {nightsText(nights)}</span>
              </p>
              {weekend > 0 && <p className="mt-0.5 text-xs text-ivory/45">пт и сб +15%</p>}
            </div>
            {fits ? (
              <button
                type="button"
                onClick={onBook}
                className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition hover:bg-[#e2c486]"
              >
                Забронировать
              </button>
            ) : (
              <span className="rounded-full border border-white/10 px-4 py-2.5 text-sm text-ivory/50">
                Вмещает до {guestsText(room.guests)}
              </span>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  )
}

/* ================= Окно брони ================= */

interface BookingSheetProps {
  room: Room
  checkIn: string
  checkOut: string
  nights: number
  guests: number
  nextId: number
  onClose: () => void
  onSubmit: (lines: string[]) => void
}

function BookingSheet({ room, checkIn, checkOut, nights, guests, nextId, onClose, onSubmit }: BookingSheetProps) {
  const [extras, setExtras] = useState<string[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [comment, setComment] = useState('')
  const [tried, setTried] = useState(false)
  const [sent, setSent] = useState(false)

  const stay = stayPrice(room, checkIn, nights)
  const extra = extrasPrice(room, extras, nights, guests)
  const total = stay.total + extra
  const phoneOk = phone.replace(/\D/g, '').length >= 10
  const nameOk = name.trim().length >= 2

  // Закрытие по Esc и запрет прокрутки страницы под окном
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const lines = useMemo(() => {
    const chosen = EXTRAS.filter((e) => extras.includes(e.id)).map((e) => e.name.toLowerCase())
    // в Telegram показываем номер частично: первые 2 и последние 4 цифры
    const digits = phone.replace(/\D/g, '').length
    let seen = 0
    const masked = phone.replace(/\d/g, (d) => (seen++ < 2 || seen > digits - 4 ? d : '•'))
    return [
      `🛎 Новая бронь #${nextId}`,
      `${room.name} · ${guestsText(guests)}`,
      `${dayLabel(checkIn)} — ${dayLabel(checkOut)}, ${nightsText(nights)}`,
      `${name.trim()}, ${masked}`,
      ...(chosen.length ? [`Доп.: ${chosen.join(', ')}`] : []),
      ...(comment.trim() ? [`💬 ${comment.trim()}`] : []),
      `Итого: ${money(total)}`,
    ]
  }, [extras, phone, nextId, room.name, guests, checkIn, checkOut, nights, name, comment, total])

  const submit = () => {
    setTried(true)
    if (!nameOk || !phoneOk) return
    onSubmit(lines)
    setSent(true)
  }

  const waText = encodeURIComponent(
    `Здравствуйте! Хочу забронировать номер «${room.name}» на ${dayLabel(checkIn)} — ${dayLabel(checkOut)} (${nightsText(nights)}), ${guestsText(guests)}. ${name.trim()}`,
  )

  const input =
    'w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-ivory outline-none transition placeholder:text-ivory/35 focus:border-gold/70'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6" role="dialog" aria-modal="true" aria-label={`Бронь: ${room.name}`}>
      <motion.button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        className="relative flex max-h-[92svh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-night md:rounded-3xl"
      >
        <div className="flex items-center gap-4 border-b border-white/10 p-4 md:p-5">
          <img src={img(room.photos[0])} alt="" className="size-14 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="font-serif text-2xl leading-tight font-medium">{room.name}</p>
            <p className="text-sm text-ivory/60">
              {dayLabel(checkIn)} — {dayLabel(checkOut)} · {nightsText(nights)} · {guestsText(guests)}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Закрыть" className="grid size-9 place-items-center rounded-full hover:bg-white/10">
            <X className="size-5" />
          </button>
        </div>

        {sent ? (
          <div className="flex flex-col items-center p-8 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-gold/15 text-gold">
              <Check className="size-7" />
            </span>
            <p className="mt-5 font-serif text-3xl font-medium">Заявка отправлена</p>
            <p className="mt-2 max-w-sm text-ivory/65">
              Администратор подтвердит бронь в течение 15 минут. Посмотрите, как заявка пришла отелю в Telegram.
            </p>
            <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row">
              <a
                href="#bot"
                onClick={onClose}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink"
              >
                <Send className="size-4" /> Смотреть в Telegram
              </a>
              <a
                href={`https://wa.me/${HOTEL.whatsapp}?text=${waText}`}
                target="_blank"
                rel="noopener"
                className="flex flex-1 items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm"
              >
                Написать в WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-6 overflow-y-auto p-4 md:p-6">
              <fieldset className="min-w-0">
                <legend className="mb-3 text-sm font-semibold text-ivory/80">Дополнительно</legend>
                <div className="space-y-2">
                  {EXTRAS.map((e) => {
                    const included = e.id === 'breakfast' && room.breakfastIncluded
                    const on = included || extras.includes(e.id)
                    return (
                      <label
                        key={e.id}
                        className={cn(
                          'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition',
                          on ? 'border-gold/60 bg-gold/5' : 'border-white/10 hover:border-white/25',
                          included && 'cursor-default',
                        )}
                      >
                        <input
                          type="checkbox"
                          className="size-4 accent-[#d4b06a]"
                          checked={on}
                          disabled={included}
                          onChange={() =>
                            setExtras((xs) => (xs.includes(e.id) ? xs.filter((x) => x !== e.id) : [...xs, e.id]))
                          }
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium">{e.name}</span>
                          <span className="block text-xs text-ivory/50">{e.hint}</span>
                        </span>
                        <span className="shrink-0 text-sm text-gold">{included ? 'включён' : money(e.price)}</span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm text-ivory/70">Имя</span>
                  <input className={cn(input, tried && !nameOk && 'border-red-400/70')} value={name} onChange={(e) => setName(e.target.value)} placeholder="Как к вам обращаться" autoComplete="name" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm text-ivory/70">Телефон</span>
                  <input
                    className={cn(input, tried && !phoneOk && 'border-red-400/70')}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^\d+\s()-]/g, ''))}
                    placeholder="+7 7__ ___ __ __"
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </label>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-sm text-ivory/70">Пожелания</span>
                <textarea className={cn(input, 'min-h-20 resize-none')} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Поздний заезд, детская кроватка…" />
              </label>
              {tried && (!nameOk || !phoneOk) && <p className="text-sm text-red-300">Укажите имя и телефон, чтобы администратор мог связаться с вами.</p>}
            </div>

            <div className="border-t border-white/10 bg-ink/60 p-4 md:p-6">
              <div className="space-y-1 text-sm text-ivory/65">
                <div className="flex justify-between">
                  <span>Проживание, {nightsText(nights)}{stay.weekend > 0 ? ' (пт–сб +15%)' : ''}</span>
                  <span>{money(stay.total)}</span>
                </div>
                {extra > 0 && (
                  <div className="flex justify-between">
                    <span>Дополнительно</span>
                    <span>{money(extra)}</span>
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-ivory/50">Итого, оплата при заселении</p>
                  <p className="font-serif text-3xl font-semibold">{money(total)}</p>
                </div>
                <button type="button" onClick={submit} className="rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-ink transition hover:bg-[#e2c486]">
                  Забронировать
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
