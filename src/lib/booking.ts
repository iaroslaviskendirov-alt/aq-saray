import { EXTRAS, WEEKEND_MARKUP, type Room } from '@/data'

// Даты храним строкой YYYY-MM-DD (как в <input type="date">), считаем в локальном времени
export function toISO(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export function fromISO(s: string) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(s: string, n: number) {
  const d = fromISO(s)
  d.setDate(d.getDate() + n)
  return toISO(d)
}

export function nightsBetween(a: string, b: string) {
  return Math.round((fromISO(b).getTime() - fromISO(a).getTime()) / 86_400_000)
}

const fmtDay = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' })
export const dayLabel = (s: string) => fmtDay.format(fromISO(s)).replace('.', '')

export const money = (n: number) => `${Math.round(n).toLocaleString('ru-RU')} ₸`

export function plural(n: number, one: string, few: string, many: string) {
  const a = n % 10
  const b = n % 100
  if (a === 1 && b !== 11) return one
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few
  return many
}

export const nightsText = (n: number) => `${n} ${plural(n, 'ночь', 'ночи', 'ночей')}`
export const guestsText = (n: number) => `${n} ${plural(n, 'гость', 'гостя', 'гостей')}`

// Цена за проживание: пятница и суббота с наценкой
export function stayPrice(room: Room, checkIn: string, nights: number) {
  let total = 0
  let weekend = 0
  for (let i = 0; i < nights; i++) {
    const wd = fromISO(addDays(checkIn, i)).getDay()
    const isWeekend = wd === 5 || wd === 6
    if (isWeekend) weekend++
    total += room.price * (isWeekend ? 1 + WEEKEND_MARKUP : 1)
  }
  return { total: Math.round(total / 100) * 100, weekend }
}

export function extrasPrice(room: Room, ids: string[], nights: number, guests: number) {
  return EXTRAS.filter((e) => ids.includes(e.id))
    .filter((e) => !(e.id === 'breakfast' && room.breakfastIncluded))
    .reduce((sum, e) => sum + (e.per === 'guest-night' ? e.price * nights * guests : e.price), 0)
}
