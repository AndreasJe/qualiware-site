'use client'

import { useActionState, useId, useState } from 'react'
import { Arrow } from '../Arrow'
import { submitCase, type CaseState } from './actions'
import { propertyHref } from '../../lib/links'
import type { Session } from '../../lib/session'
import styles from './SupportHome.module.css'

const initial: CaseState = { status: 'idle' }

const SEVERITIES = [
  { value: 'High', label: 'Critical — production down, no workaround' },
  { value: 'Medium', label: 'High — a major function is impaired' },
  { value: 'Low', label: 'Normal — question or request' },
]

/** Our own case form. It creates the ticket in Zoho Desk through a server action. */
export const SubmitCaseForm = ({ session }: { session: Session | null }) => {
  const [state, action, pending] = useActionState(submitCase, initial)
  const uid = useId()
  const [severity, setSeverity] = useState('Low')

  if (state.status === 'ok') {
    return (
      <div className={styles.formCard}>
        <div className={styles.successPanel} role="status">
          <div className={`qw-eyebrow ${styles.successEyebrow}`}>
            {state.preview ? 'Saved (preview)' : `Case ${state.caseId}`}
          </div>
          <p className={styles.successText}>{state.message}</p>
          <p className={styles.successMeta}>
            Critical cases are picked up within two hours during business hours. For anything
            production-critical right now, phone <strong>+45 45 470 700</strong>.
          </p>
        </div>
      </div>
    )
  }

  /*
   * Reading this page needs no account; submitting does.
   *
   * A case attaches to a contract and an SLA, and a typed email address is a
   * claim rather than proof. The action enforces this server-side too — this
   * is the courtesy, not the control.
   */
  if (!session) {
    return (
      <div className={styles.formCard}>
        <div className={styles.successPanel}>
          <div className={`qw-eyebrow ${styles.successEyebrow}`}>Sign in to open a case</div>
          <p className={styles.successText}>
            Everything else on this page is open. Raising a case needs an account, because it
            attaches to your support contract and its response times.
          </p>
          <p className={styles.successMeta}>
            No account? Your QualiWare contact creates one. For anything production-critical
            right now, phone <strong>+45 45 470 700</strong>.
          </p>
          <a
            href={propertyHref('main', '/sign-in')}
            className={`qw-btn qw-btn--solid ${styles.contactButton}`}
          >
            Sign in
            <Arrow width={26} strokeWidth={1.6} />
          </a>
        </div>
      </div>
    )
  }

  const partnerCustomers = session.audiences.includes('partner')
    ? session.supportedCustomers
    : []

  return (
    <div className={styles.formCard}>
      <form action={action} className={styles.form}>
        <p className={styles.privacy}>
          Raising this as <strong>{session.fullName}</strong>
          {session.organisation ? ` · ${session.organisation}` : ''}
        </p>

        <div className={styles.fields}>
          <div className={`${styles.field} ${styles.full}`}>
            <label className={styles.label} htmlFor={`${uid}-subject`}>
              What is happening? <abbr title="required">*</abbr>
            </label>
            <input
              id={`${uid}-subject`}
              name="subject"
              required
              className={styles.input}
              placeholder="Publish job fails on the production repository"
            />
          </div>

          {/*
            Partners raise cases on behalf of an end customer. Whether QualiWare
            provides that support depends on the level the partner sold on — so
            the entitlement is shown next to each name, before anything is
            written.
          */}
          {partnerCustomers.length > 0 && (
            <div className={`${styles.field} ${styles.full}`}>
              <label className={styles.label} htmlFor={`${uid}-onBehalfOf`}>
                Which customer is this for? <abbr title="required">*</abbr>
              </label>
              <select
                id={`${uid}-onBehalfOf`}
                name="onBehalfOf"
                required
                className={styles.input}
                defaultValue=""
              >
                <option value="" disabled>
                  Choose a customer
                </option>
                {partnerCustomers.map((customer) => (
                  <option key={customer.customerName} value={customer.customerName}>
                    {customer.customerName}
                    {customer.supportLevelSold === 'none'
                      ? ' — no support agreement'
                      : ` — ${customer.supportLevelSold} support`}
                  </option>
                ))}
              </select>
              <span className={styles.privacy}>
                Customers you did not sell a support agreement to are supported by you directly,
                not by QualiWare.
              </span>
            </div>
          )}

          <fieldset className={`${styles.field} ${styles.full}`}>
            <legend className={styles.label}>Severity</legend>
            <div className={styles.chips}>
              {SEVERITIES.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={styles.chip}
                  data-active={severity === option.value}
                  aria-pressed={severity === option.value}
                  onClick={() => setSeverity(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <input type="hidden" name="severity" value={severity} />
          </fieldset>

          <div className={`${styles.field} ${styles.full}`}>
            <label className={styles.label} htmlFor={`${uid}-description`}>
              Details <abbr title="required">*</abbr>
            </label>
            <textarea
              id={`${uid}-description`}
              name="description"
              rows={6}
              required
              className={styles.input}
              placeholder="QualiWare version, what you expected, what happened, and the exact error text."
            />
          </div>
        </div>

        <button
          type="submit"
          className={`qw-btn qw-btn--solid ${styles.submit}`}
          disabled={pending}
        >
          {pending ? 'Sending…' : 'Submit case'}
          <Arrow width={26} strokeWidth={1.6} />
        </button>

        {state.status === 'error' && (
          <p className={styles.formError} role="alert">
            {state.message}
          </p>
        )}

        <p className={styles.privacy}>
          Cases are handled under our data processing agreement. We only use these details to
          resolve the case.
        </p>
      </form>
    </div>
  )
}
