import { render, screen, userEvent } from '@testing-library/react-native'

import { FavoriteButton } from '~/components/ui/FavoriteButton'

describe('FavoriteButton', () => {
  it('toggles the favorite', async () => {
    const user = userEvent.setup()
    const onToggle = jest.fn()

    await render(
      <FavoriteButton
        title="Événement démo"
        selected={false}
        onToggle={onToggle}
      />,
    )
    const button = screen.getByRole('button', {
      name: 'Ajouter aux favoris : Événement démo',
    })

    await user.press(button)
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('announces an already added favorite', async () => {
    await render(
      <FavoriteButton title="Événement démo" selected onToggle={jest.fn()} />,
    )

    expect(
      screen.getByRole('button', {
        name: 'Retirer des favoris : Événement démo',
      }),
    ).toBeSelected()
  })
})
