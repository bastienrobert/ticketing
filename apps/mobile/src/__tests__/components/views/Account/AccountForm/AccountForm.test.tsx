import { render, screen, userEvent } from '@testing-library/react-native'

import { AccountForm } from '~/components/views/Account/AccountForm'

describe('AccountForm', () => {
  it.each([
    ['Se connecter', 'sign-in'],
    ['Créer un compte', 'sign-up'],
  ])('"%s" sends the entered credentials', async (label, mode) => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()

    await render(
      <AccountForm error={null} submitting={false} onSubmit={onSubmit} />,
    )
    await user.type(screen.getByLabelText('Adresse e-mail'), 'ada@example.com')
    await user.type(screen.getByLabelText('Mot de passe'), 'password-for-tests')
    await user.press(screen.getByRole('button', { name: label }))

    expect(onSubmit).toHaveBeenCalledWith(mode, {
      email: 'ada@example.com',
      password: 'password-for-tests',
    })
  })

  it('does not submit while sending', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()

    await render(<AccountForm error={null} submitting onSubmit={onSubmit} />)
    await user.press(screen.getByRole('button', { name: 'Se connecter' }))
    await user.press(screen.getByRole('button', { name: 'Créer un compte' }))

    expect(onSubmit).not.toHaveBeenCalled()
  })
})
