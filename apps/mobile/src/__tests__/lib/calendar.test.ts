import {
  getCalendarPermissions,
  requestCalendarPermissions,
  type PermissionResponse,
} from 'expo-calendar'

import { addToCalendar } from '~/lib/calendar'

const mockCreateEvent = jest.fn()

jest.mock('expo-calendar', () => ({
  getCalendarPermissions: jest.fn(),
  requestCalendarPermissions: jest.fn(),
  getDefaultCalendarSync: () => ({ createEvent: mockCreateEvent }),
}))

const EVENT = {
  title: 'Événement démo',
  description: 'Concert de fin d’année',
  startsAt: '2026-12-31T18:30:00.000Z',
  venue: 'La Cigale',
  address: '120 boulevard de Rochechouart, Paris',
}

function mockPermission(granted: boolean, canAskAgain: boolean) {
  return { granted, canAskAgain } as PermissionResponse
}

describe('addToCalendar', () => {
  beforeEach(() => jest.clearAllMocks())

  it('do not request permissions if access is permanently denied', async () => {
    jest
      .mocked(getCalendarPermissions)
      .mockResolvedValue(mockPermission(false, false))

    await expect(addToCalendar(EVENT)).resolves.toBe('blocked')
    expect(requestCalendarPermissions).not.toHaveBeenCalled()
    expect(mockCreateEvent).not.toHaveBeenCalled()
  })

  it('does not add anything when the user refuses', async () => {
    jest
      .mocked(getCalendarPermissions)
      .mockResolvedValue(mockPermission(false, true))
    jest
      .mocked(requestCalendarPermissions)
      .mockResolvedValue(mockPermission(false, false))

    await expect(addToCalendar(EVENT)).resolves.toBe('refused')
    expect(mockCreateEvent).not.toHaveBeenCalled()
  })

  it('adds a two-hour event when access is granted', async () => {
    jest
      .mocked(getCalendarPermissions)
      .mockResolvedValue(mockPermission(true, true))

    await expect(addToCalendar(EVENT)).resolves.toBe('added')
    expect(requestCalendarPermissions).not.toHaveBeenCalled()
    expect(mockCreateEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        location: 'La Cigale, 120 boulevard de Rochechouart, Paris',
        startDate: new Date('2026-12-31T18:30:00.000Z'),
        endDate: new Date('2026-12-31T20:30:00.000Z'),
      }),
    )
  })
})
