'use client'

import { useActionState, useId } from 'react'
import { Arrow } from '../../../../components/Arrow'
import { signInAction, type SignInState } from './actions'
import styles from './sign-in.module.css'

const initial: SignInState = { status: 'idle' }

export const SignInForm = () => {
  const [state, action, pending] = useActionState(signInAction, initial)
  const uid = useId()

  return (
    <form action={action} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor={`${uid}-email`}>
          Work email
        </label>
        <input
          id={`${uid}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={`${uid}-password`}>
          Password
        </label>
        <input
          id={`${uid}-password`}
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={styles.input}
        />
      </div>

      <button type="submit" className={`qw-btn qw-btn--solid ${styles.submit}`} disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in'}
        <Arrow width={26} strokeWidth={1.6} />
      </button>

      {state.status === 'error' && (
        <p className={styles.error} role="alert">
          {state.message}
        </p>
      )}
    </form>
  )
}
