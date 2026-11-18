import { eventAdapter } from '~/data/adapters/events.adapters'

// 23:30 on 31 December in UTC is already 1 January in Paris
const EVENT = {
  id: 42,
  title: 'Événement démo',
  description: null,
  startsAt: '2026-12-31T23:30:00.000Z',
  venue: 'La Cigale',
  address: null,
  category: 'Concert',
  price: 1234.5,
}

describe('eventAdapter', () => {
  it('displays the date in Paris time', () => {
    expect(eventAdapter(EVENT)).toMatchObject({
      date: 'vendredi 1 janvier 2027 à 00:30',
      day: '01',
      month: 'janv.',
    })
  })

  it('gives Apple Pay an amount with two decimals, without separator', () => {
    expect(eventAdapter(EVENT).amount).toBe('1234.50')
  })

  it('does not offer payment without a price or for a free event', () => {
    expect(eventAdapter({ ...EVENT, price: null })).toMatchObject({
      price: 'Non communiqué',
      amount: null,
    })
    expect(eventAdapter({ ...EVENT, price: 0 })).toMatchObject({
      price: 'Gratuit',
      amount: null,
    })
  })
})
