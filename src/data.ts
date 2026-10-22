// Данные отеля. Отель, номера и цены вымышленные.
// Фото — Unsplash (бесплатная лицензия), лежат в public/img/; логотипы чужих отелей замазаны.

export const img = (name: string) => `${import.meta.env.BASE_URL}img/${name}.jpg`

export const HOTEL = {
  name: 'AQ SARAY',
  address: 'ул. Набережная, 12',
  phone: '+7 700 000 00 00',
  whatsapp: '77000000000', // номер-заглушка: настоящий ставится только с согласия владельца
  checkIn: '14:00',
  checkOut: '12:00',
}

export interface Room {
  id: string
  name: string
  short: string
  desc: string
  area: number
  guests: number
  bed: string
  price: number // за ночь, будни
  photos: string[]
  features: string[]
  breakfastIncluded?: boolean
  left: number // свободно номеров этой категории
}

export const ROOMS: Room[] = [
  {
    id: 'standard',
    name: 'Стандарт',
    short: 'Тихий номер для командировки',
    desc: 'Светлый номер с большим окном, рабочим столом и кроватью queen size. Всё, что нужно, чтобы выспаться перед важным днём.',
    area: 24,
    guests: 2,
    bed: 'Queen size',
    price: 24000,
    photos: ['r-standard', 'r-standard-2', 'bath'],
    features: ['Рабочий стол', 'Душ', 'Smart TV', 'Wi-Fi 300 Мбит/с'],
    left: 6,
  },
  {
    id: 'comfort',
    name: 'Комфорт',
    short: 'Больше места и мягкий свет',
    desc: 'Тёплый интерьер, кресло для чтения и кровать king size с бельём из египетского хлопка. Кофемашина и мини-бар в номере.',
    area: 30,
    guests: 2,
    bed: 'King size',
    price: 31000,
    photos: ['r-comfort', 'pillows', 'bath-3'],
    features: ['Кофемашина', 'Мини-бар', 'Халаты и тапочки', 'Smart TV'],
    left: 4,
  },
  {
    id: 'view',
    name: 'Делюкс с панорамой',
    short: 'Окна в пол и вид на горы',
    desc: 'Угловой номер на верхних этажах: окна от пола до потолка, утреннее солнце и вид на горы. Отдельно стоящая ванна.',
    area: 36,
    guests: 2,
    bed: 'King size',
    price: 39000,
    photos: ['r-view', 'r-view-2', 'bath-2'],
    features: ['Панорамные окна', 'Ванна', 'Кофемашина', 'Мини-бар'],
    left: 2,
  },
  {
    id: 'family',
    name: 'Семейный',
    short: 'Для поездки с детьми',
    desc: 'Две комнаты: спальня с большой кроватью и гостиная с раскладным диваном. Детская кроватка — бесплатно, по запросу.',
    area: 48,
    guests: 4,
    bed: 'King size + диван',
    price: 46000,
    photos: ['r-family', 'r-family-2', 'bath'],
    features: ['Две комнаты', 'Детская кроватка', 'Гостиная', 'Две ТВ'],
    left: 3,
  },
  {
    id: 'suite',
    name: 'Люкс',
    short: 'Кабинет, гостиная и спальня',
    desc: 'Самый большой номер отеля: гостиная с библиотекой, отдельная спальня и мраморная ванная. Завтрак и спа включены.',
    area: 72,
    guests: 3,
    bed: 'King size',
    price: 68000,
    photos: ['r-suite', 'r-suite-2', 'r-suite-3', 'bath-2'],
    features: ['Гостиная', 'Ванна и душ', 'Завтрак включён', 'Спа включено'],
    breakfastIncluded: true,
    left: 1,
  },
]

export const WEEKEND_MARKUP = 0.15 // пятница и суббота дороже

export interface Extra {
  id: string
  name: string
  hint: string
  price: number
  per: 'stay' | 'guest-night'
}

export const EXTRAS: Extra[] = [
  { id: 'breakfast', name: 'Завтрак-буфет', hint: '07:00–10:30, за гостя в сутки', price: 4500, per: 'guest-night' },
  { id: 'transfer', name: 'Трансфер из аэропорта', hint: 'Встретим с табличкой', price: 7000, per: 'stay' },
  { id: 'late', name: 'Поздний выезд до 18:00', hint: 'Если номер свободен', price: 9000, per: 'stay' },
]

export const AMENITIES = [
  { icon: 'clock', title: 'Ресепшен 24/7', text: 'Заселим ночью, вызовем такси, сохраним багаж' },
  { icon: 'car', title: 'Парковка', text: 'Закрытая, с видеонаблюдением — бесплатно для гостей' },
  { icon: 'wifi', title: 'Быстрый Wi-Fi', text: '300 Мбит/с во всех номерах и в лобби' },
  { icon: 'waves', title: 'Бассейн и хамам', text: 'Каждый день 07:00–22:00, для гостей бесплатно' },
  { icon: 'briefcase', title: 'Конференц-зал', text: 'До 40 человек, проектор и кофе-брейки' },
  { icon: 'shirt', title: 'Прачечная', text: 'Стирка и глажка за 3 часа' },
] as const

export const DINING = [
  { photo: 'restaurant', title: 'Ресторан «Дастархан»', text: 'Казахская и европейская кухня, открытая кухня и гриль.', hours: '12:00–00:00' },
  { photo: 'bar', title: 'Лобби-бар', text: 'Кофе, десерты, коктейли и тихая музыка по вечерам.', hours: '10:00–02:00' },
  { photo: 'breakfast', title: 'Завтраки', text: 'Шведская линия, омлеты и вафли на заказ, свежие соки.', hours: '07:00–10:30' },
]

export const GALLERY = [
  { photo: 'lobby', alt: 'Лобби с люстрой', span: 'md:col-span-2 md:row-span-2' },
  { photo: 'entry', alt: 'Вход и лестница', span: '' },
  { photo: 'reception', alt: 'Стойка ресепшена', span: '' },
  { photo: 'lounge', alt: 'Лаунж у окон', span: '' },
  { photo: 'corridor', alt: 'Коридор', span: 'md:row-span-2' },
  { photo: 'terrace', alt: 'Терраса вечером', span: 'col-span-2' },
  { photo: 'dish', alt: 'Ужин в ресторане', span: '' },
]

export const FAQ = [
  { q: 'Во сколько заезд и выезд?', a: `Заезд с ${HOTEL.checkIn}, выезд до ${HOTEL.checkOut}. Ранний заезд и поздний выезд — по запросу, если номер свободен.` },
  { q: 'Можно ли с детьми?', a: 'Да. Дети до 6 лет живут бесплатно без отдельного места, детскую кроватку поставим по запросу.' },
  { q: 'Как оплатить?', a: 'Картой или Kaspi при заселении. Для брони предоплата не нужна — администратор подтвердит её в течение 15 минут.' },
  { q: 'Можно ли с животными?', a: 'Небольших собак и кошек — да, в номерах Комфорт и Семейный. Уборка после питомца — 5 000 ₸.' },
  { q: 'Есть ли трансфер?', a: 'Да, встретим в аэропорту или на вокзале. Отметьте трансфер при бронировании.' },
]
