'use client'

import { useActionState, useId, useState } from 'react'
import { Arrow } from '../../components/Arrow'
import type { FormBlockBlock } from '../../payload-types'
import { submitForm, type SubmitState } from './actions'
import styles from './FormBlock.module.css'

const initialState: SubmitState = { status: 'idle' }

export const FormBlock = (props: FormBlockBlock) => {
  const { eyebrow, heading, lead, expectations, sideQuote, formFields, submitLabel, privacyNote } =
    props
  const [state, action, pending] = useActionState(submitForm, initialState)
  const uid = useId()

  // Chip sets are single-select and post their value through a hidden input.
  const [chips, setChips] = useState<Record<string, string>>(() => {
    const seed: Record<string, string> = {}
    formFields?.forEach((field) => {
      if (field.fieldType === 'chips' && field.name) {
        const first = field.options?.[0]?.value
        if (first) seed[field.name] = first
      }
    })
    return seed
  })

  const hasSideColumn = Boolean(lead || expectations?.length || sideQuote)

  return (
    <section className={`qw-section ${styles.section}`}>
      <div className={`qw-shell ${hasSideColumn ? styles.split : styles.single}`}>
        {hasSideColumn && (
          <div className={styles.sideColumn}>
            {eyebrow && <div className={`qw-eyebrow ${styles.eyebrow}`}>{eyebrow}</div>}
            {heading && <h2 className={`qw-h2 ${styles.heading}`}>{heading}</h2>}
            {lead && <p className={`qw-lead ${styles.lead}`}>{lead}</p>}

            {Boolean(expectations?.length) && (
              <ul className={`qw-arrow-list ${styles.expectations}`}>
                {expectations?.map((item, i) => (
                  <li key={item.id ?? i}>
                    <Arrow width={26} stroke="var(--qw-green)" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            )}

            {sideQuote && (
              <blockquote className={styles.sideQuote}>
                <p>{sideQuote}</p>
              </blockquote>
            )}
          </div>
        )}

        <div className={styles.formColumn}>
          {!hasSideColumn && (
            <>
              {eyebrow && <div className={`qw-eyebrow ${styles.eyebrow}`}>{eyebrow}</div>}
              {heading && <h2 className={`qw-h2 ${styles.heading}`}>{heading}</h2>}
            </>
          )}

          <form action={action} className={styles.form}>
            <input type="hidden" name="__formName" value={heading || eyebrow || 'Form'} />

            <div className={styles.fields}>
              {formFields?.map((field, i) => {
                const name = field.name || `field-${i}`
                const id = `${uid}-${name}`
                const label = field.label || name
                const width = field.width === 'full' ? styles.full : styles.half

                if (field.fieldType === 'chips') {
                  return (
                    <fieldset key={field.id ?? i} className={`${styles.field} ${styles.full}`}>
                      <legend className={styles.label}>{label}</legend>
                      <div className={styles.chips}>
                        {field.options?.map((option, oi) => {
                          const value = option.value ?? ''
                          const active = chips[name] === value
                          return (
                            <button
                              key={option.id ?? oi}
                              type="button"
                              className={styles.chip}
                              data-active={active}
                              aria-pressed={active}
                              onClick={() => setChips((c) => ({ ...c, [name]: value }))}
                            >
                              {value}
                            </button>
                          )
                        })}
                      </div>
                      <input type="hidden" name={name} value={chips[name] ?? ''} />
                    </fieldset>
                  )
                }

                return (
                  <div key={field.id ?? i} className={`${styles.field} ${width}`}>
                    <label className={styles.label} htmlFor={id}>
                      {label}
                      {field.required && <abbr title="required"> *</abbr>}
                    </label>

                    {field.fieldType === 'textarea' ? (
                      <textarea
                        id={id}
                        name={name}
                        rows={5}
                        required={Boolean(field.required)}
                        className={styles.input}
                      />
                    ) : field.fieldType === 'select' ? (
                      <select
                        id={id}
                        name={name}
                        required={Boolean(field.required)}
                        className={styles.input}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Please choose
                        </option>
                        {field.options?.map((option, oi) => (
                          <option key={option.id ?? oi} value={option.value ?? ''}>
                            {option.value}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={id}
                        name={name}
                        type={field.fieldType === 'email' ? 'email' : 'text'}
                        required={Boolean(field.required)}
                        className={styles.input}
                      />
                    )}
                  </div>
                )
              })}
            </div>

            <button
              type="submit"
              className={`qw-btn qw-btn--solid ${styles.submit}`}
              disabled={pending}
            >
              {pending ? 'Sending…' : submitLabel || 'Submit'}
              <Arrow width={26} strokeWidth={1.6} />
            </button>

            {state.status !== 'idle' && (
              <p
                className={styles.feedback}
                data-status={state.status}
                role="status"
                aria-live="polite"
              >
                {state.message}
              </p>
            )}

            {privacyNote && <p className={styles.privacy}>{privacyNote}</p>}
          </form>
        </div>
      </div>
    </section>
  )
}

export default FormBlock
