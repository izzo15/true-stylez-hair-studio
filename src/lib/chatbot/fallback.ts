/**
 * The Apprentice — Fallback Responses
 *
 * Lightweight keyword-based responses used when the OpenAI API is
 * unavailable (missing key, rate-limited, timed-out, etc.).
 * The chatbot route falls back to these automatically.
 */

const CURRENCY = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

/** Canonical service list sourced from the DB seed */
const SERVICE_LIST = [
  { name: 'Haircut', price: 30, duration: 40 },
  { name: 'Haircut & Beard', price: 50, duration: 50 },
  { name: 'Beard Trim', price: 20, duration: 30 },
  { name: 'Hot Towel Shave', price: 35, duration: 30 },
  { name: 'Head Shave', price: 30, duration: 30 },
  { name: 'High Skin Fade', price: 40, duration: 40 },
  { name: 'Mid Skin Fade', price: 40, duration: 40 },
  { name: 'Low Skin Fade', price: 40, duration: 40 },
  { name: 'Kids Haircut', price: 25, duration: 30 },
  { name: 'Female Cut', price: 30, duration: 40 },
  { name: 'College Haircut', price: 25, duration: 45 },
  { name: 'Line Up', price: 20, duration: 25 },
]

const HOURS_TEXT = [
  'Tue – Fri: 10 AM – 6 PM',
  'Sat: 10 AM – 4:30 PM',
  'Sun & Mon: Closed',
].join('\n')

const ADDRESS =
  '332 Congress St, Suite 1, Troy, NY 12180'

/** ── Public API ─────────────────────────────────────────────────────────── */

/**
 * Match the user message against known topics and return the best
 * canned response.  Falls through to a generic "call the shop" reply.
 */
export const fallbackResponse = (userMessage: string): string => {
  const msg = userMessage.toLowerCase()
  const words = msg.split(/\s+/)

  /* ── Greetings ────────────────────────────────────────────────────────── */

  if (isGreeting(words)) {
    return (
      "Yo! I'm The Apprentice here at True Stylez. Jonathan's busy cutting hair right now, but I'm here to help with services, bookings, or any questions. What can I do for you today?"
    )
  }

  /* ── Services & prices ─────────────────────────────────────────────────── */

  if (matchesAny(msg, ['price', 'cost', 'how much', 'service', 'menu', 'cut', 'fade', 'trim', 'shave', 'hair'])) {
    const lines = SERVICE_LIST.map(
      (s) => `• ${s.name} — ${CURRENCY.format(s.price)} (${s.duration} min)`
    )
    return (
      'Here are our services and prices:\n\n' +
      lines.join('\n') +
      '\n\nWant to check availability or book any of these?'
    )
  }

  /* ── Availability / booking ────────────────────────────────────────────── */

  if (matchesAny(msg, ['book', 'appointment', 'schedule', 'slot', 'available', 'free', 'open', 'when can'])) {
    return (
      "I'd be happy to help you book! To get you started I just need three things:\n\n" +
      `1. Which service?  ${SERVICE_LIST[0].name} — ${CURRENCY.format(SERVICE_LIST[0].price)} is a great starting point.\n` +
      "2. Which day?    (Tue–Sat, we're closed Sun & Mon)\n" +
      "3. Jonathan or any available barber?\n\n" +
      "Drop those in and I'll check the schedule for you. You can also book directly on our booking widget anytime."
    )
  }

  /* ── Shop hours ────────────────────────────────────────────────────────── */

  if (matchesAny(msg, ['hour', 'open', 'close', 'closed', 'when are you'])) {
    return (
      `Our hours:\n${HOURS_TEXT}\n\n` +
      `We're at ${ADDRESS}. Give us a ring at (518) 961-6997 if you need to confirm holiday hours!`
    )
  }

  /* ── Location / directions ─────────────────────────────────────────────── */

  if (matchesAny(msg, ['where', 'location', 'address', 'find', 'directions', 'located', 'troy'])) {
    return (
      `We're at ${ADDRESS}.\n\n` +
      '• Google Maps: search "True Stylez Hair Studio Troy NY"\n' +
      '• Or just call (518) 961-6997 and we\'ll talk you in!'
    )
  }

  /* ── Barber / team ─────────────────────────────────────────────────────── */

  if (matchesAny(msg, ['jonathan', 'barber', 'staff', 'team', 'who', 'master'])) {
    return (
      "Jonathan (J The Barber) is our master barber — over 15 years of experience, precision fades, beard sculpting, classic men's cuts. Books up fast; I'd recommend grabbing a slot at least a week out for his prime times.\n\n" +
      'Want to check Jonathan\'s availability or see the rest of the team?'
    )
  }

  /* ── Products ──────────────────────────────────────────────────────────── */

  if (matchesAny(msg, ['product', 'pomade', 'gel', 'wax', 'oil', 'shampoo', 'conditioner', 'buy', 'store', 'sell'])) {
    return (
      'We stock professional-grade products to keep your cut sharp between visits:\n\n' +
      '• Matte Paste — $22 (medium hold, no shine)\n' +
      '• Sea Salt Spray — $18 (texture + volume)\n' +
      '• Beard Oil — $25 (softens + conditions)\n' +
      '• Texturizing Cream — $20 (flexible hold)\n' +
      '• Daily Shampoo — $16 (gentle daily cleanser)\n\n' +
      'Ask your barber for the right match during your cut!'
    )
  }

  /* ── Face shape / style advice ─────────────────────────────────────────── */

  if (matchesAny(msg, ['face shape', 'style advice', 'recommend', 'what cut', 'what style', 'suggest', 'advice'])) {
    return (
      'Love to help you find your perfect cut! I just need to ask a few quick questions:\n\n' +
      '1. What\'s your face shape?  (oval, round, square, heart, oblong, diamond, or not sure?)\n' +
      "2. What's your maintenance style?  (low / medium / high)\n" +
      "3. What vibe are you going for?  (professional, edgy, classic, trendy)\n\n" +
      "Shoot me your answers and I'll hook you up with a recommendation."
    )
  }

  /* ── Default ───────────────────────────────────────────────────────────── */

  return (
    "I'm having a bit of trouble connecting to my knowledge base right now. " +
    'For immediate assistance, call the shop at (518) 961-6997 or pop over to our booking page to check availability online. ' +
    "I'll be back online shortly!"
  )
}

/**
 * Suggest context-aware quick-reply labels the user can tap right after
 * reading our fallback reply.
 */
export const getSuggestedQuickReplies = (userMessage: string): string[] => {
  const msg = userMessage.toLowerCase()
  const words = msg.split(/\s+/)

  if (matchesAny(msg, ['price', 'cost', 'how much', 'service', 'menu'])) {
    return ['See all services', 'Check availability', 'Book a haircut', 'Ask about products']
  }

  if (matchesAny(msg, ['book', 'appointment', 'available', 'slot', 'free', 'when'])) {
    return ["Check Jonathan's schedule", 'See this week\'s availability', 'Book a skin fade', 'Book a beard trim']
  }

  if (matchesAny(msg, ['hour', 'open', 'close'])) {
    return ['See holiday hours', 'Get directions', 'Call the shop', 'Book online']
  }

  if (matchesAny(msg, ['location', 'address', 'where', 'find', 'directions'])) {
    return ['Get directions', 'Call the shop', 'See hours', 'Book online']
  }

  if (matchesAny(msg, ['jonathan', 'barber', 'staff', 'team', 'who'])) {
    return ["Check Jonathan's availability", 'See all barbers', 'Book with Jonathan', "Ask about specialties"]
  }

  if (matchesAny(msg, ['face shape', 'recommend', 'style', 'cut', 'suggest', 'advice'])) {
    return ['I have oval face', 'I have round face', 'I have square face', "I'm not sure"]
  }

  return ['See services & pricing', 'Check availability', 'Get style advice', 'Hours & location']
}

/** ── Private helpers ───────────────────────────────────────────────────── */

function isGreeting(words: string[]): boolean {
  return words.some(
    (w) =>
      ['hi', 'hello', 'hey', 'yo', 'sup', 'good', 'howdy', 'greetings'].includes(w)
  )
}

function matchesAny(text: string, keywords: string[]): boolean {
  return keywords.some((kw) => text.includes(kw))
}
