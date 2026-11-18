import { startTransition, useActionState } from 'react'

import { Account } from '~/components/views/Account'

import { useFavoritesContext } from '~/contexts/FavoritesContext'

import { authClient } from '~/lib/auth'
import { i18n } from '~/lib/i18n'

import type {
  AccountCredentials,
  AccountMode,
} from '~/components/views/Account'

interface AccountSubmission {
  mode: AccountMode
  credentials: AccountCredentials
}

// statuses of Better Auth's email routes: 400 invalid input, 401 wrong credentials, 422 email taken
function getErrorMessage(status: number) {
  switch (status) {
    case 400:
      return i18n.t('account.error.invalid_credentials')
    case 401:
      return i18n.t('account.error.wrong_credentials')
    case 422:
      return i18n.t('account.error.email_taken')
    default:
      return i18n.t('account.error.network')
  }
}

async function submitCredentials({ mode, credentials }: AccountSubmission) {
  if (mode === 'sign-up') {
    // Better Auth requires a name: the email stands in until the app asks for one
    return authClient.signUp.email({ ...credentials, name: credentials.email })
  }

  return authClient.signIn.email(credentials)
}

export default function AccountPage() {
  const { data: session } = authClient.useSession()
  const { clearFavorites } = useFavoritesContext()

  const [error, submit, submitting] = useActionState(
    async (_error: string | null, submission: AccountSubmission) => {
      try {
        const { error } = await submitCredentials(submission)
        return error ? getErrorMessage(error.status) : null
      } catch {
        return i18n.t('account.error.network')
      }
    },
    null,
  )

  function onSubmit(mode: AccountMode, credentials: AccountCredentials) {
    startTransition(() => submit({ mode, credentials }))
  }

  async function onSignOut() {
    await authClient.signOut().catch(() => {})
    clearFavorites()
  }

  return (
    <Account
      email={session?.user.email ?? null}
      error={error}
      submitting={submitting}
      onSubmit={onSubmit}
      onSignOut={onSignOut}
    />
  )
}
