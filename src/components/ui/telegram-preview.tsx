import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronLeft, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BotRequest {
  id: number
  time: string
  lines: string[] // строки сообщения: первая — заголовок
  status: 'new' | 'confirmed'
}

interface TelegramPreviewProps {
  botName: string
  requests: BotRequest[]
  onConfirm: (id: number) => void
  className?: string
}

// Макет телефона с чатом Telegram-бота: так администратор видит новые брони
export function TelegramPreview({ botName, requests, onConfirm, className }: TelegramPreviewProps) {
  const scroller = useRef<HTMLDivElement>(null)

  // Новая заявка или ответ — прокручиваем чат вниз
  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [requests])

  return (
    <div
      className={cn(
        'relative mx-auto w-full max-w-[340px] rounded-[2.6rem] border border-white/10 bg-[#0b0b0d] p-2.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]',
        className,
      )}
    >
      <div className="overflow-hidden rounded-[2.1rem] bg-[#0e1621]">
        {/* Шапка чата */}
        <div className="flex items-center gap-3 bg-[#17212b] px-4 pt-7 pb-3">
          <ChevronLeft className="size-5 text-[#6ab3f3]" aria-hidden />
          <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-[#d9b56a] to-[#9c7a3c] font-serif text-sm font-semibold text-[#1a1408]">
            AQ
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{botName}</p>
            <p className="text-xs text-[#6d7f8f]">бот</p>
          </div>
        </div>

        {/* Сообщения */}
        <div
          ref={scroller}
          className="flex h-[440px] flex-col gap-2.5 overflow-y-auto px-3 py-4 [scrollbar-width:none]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(106,179,243,0.06), transparent 40%), radial-gradient(circle at 80% 70%, rgba(217,181,106,0.06), transparent 45%)',
          }}
        >
          <p className="mx-auto rounded-full bg-black/30 px-3 py-0.5 text-[11px] text-white/70">Сегодня</p>
          <AnimatePresence initial={false}>
            {requests.map((r) => (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="flex flex-col gap-2"
              >
                <div className="max-w-[88%] rounded-2xl rounded-bl-md bg-[#182533] px-3 py-2 text-[13px] leading-snug text-white">
                  <p className="font-semibold">{r.lines[0]}</p>
                  {r.lines.slice(1).map((l) => (
                    <p key={l} className="text-white/85">
                      {l}
                    </p>
                  ))}
                  <p className="mt-1 text-right text-[10px] text-[#6d7f8f]">{r.time}</p>
                </div>
                {r.status === 'new' ? (
                  <div className="grid max-w-[88%] grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => onConfirm(r.id)}
                      className="flex items-center justify-center gap-1 rounded-lg bg-[#2b5278]/70 py-2 text-xs font-medium text-white transition hover:bg-[#2b5278]"
                    >
                      <Check className="size-3.5" /> Подтвердить
                    </button>
                    <span className="flex items-center justify-center gap-1 rounded-lg bg-[#2b5278]/40 py-2 text-xs font-medium text-white/80">
                      <Phone className="size-3.5" /> Позвонить
                    </span>
                  </div>
                ) : (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-[#2b5278] px-3 py-2 text-[13px] text-white"
                  >
                    ✅ Бронь подтверждена, гость получил уведомление
                  </motion.p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
