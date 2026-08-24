import path from 'path'
import { fileURLToPath } from 'url'

import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import sharp from 'sharp'

import { isSuperAdmin } from './access'
import { Users } from './collections/Users'
import { Accounts } from './collections/Accounts'
import { Authors } from './collections/Authors'
import { Tenants } from './collections/Tenants'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Docs } from './collections/Docs'
import { Categories } from './collections/Categories'
import { Partners } from './collections/Partners'
import { Integrations } from './collections/Integrations'
import { FormSubmissions } from './collections/FormSubmissions'

import type { Config } from './payload-types'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
  },
  collections: [
    Users,
    Accounts,
    Authors,
    Tenants,
    Media,
    Pages,
    Posts,
    Docs,
    Categories,
    Partners,
    Integrations,
    FormSubmissions,
  ],
  /*
   * Payload builds absolute links from this — most importantly the password
   * reset link in the email it sends. Left unset, that link is wrong, so reset
   * appears to work and delivers something unusable.
   */
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  /*
   * Postgres in production, SQLite for local development.
   *
   * SQLite locks the whole file for a write, so a single background process
   * holding it blocks every other writer — which surfaces as "database is
   * locked" and a hung admin. Fine for one developer; unusable with three
   * editors and a running web server.
   *
   * Chosen by connection string, so the same build runs either way:
   *   postgres://…  ->  Postgres
   *   file:./…      ->  SQLite
   */
  db: (process.env.DATABASE_URI ?? '').startsWith('postgres')
    ? postgresAdapter({
        pool: { connectionString: process.env.DATABASE_URI as string },
      })
    : sqliteAdapter({
        client: { url: process.env.DATABASE_URI || 'file:./qualiware.db' },
      }),

  /*
   * Without an adapter Payload writes mail to the console, which means
   * password reset silently does nothing. That matters more now that this
   * replaces Zoho's help-centre login: it is the only way back into an
   * account.
   *
   * Configured over SMTP so it can point at whatever the platform provides.
   * Left unset in development on purpose — console output is the right
   * behaviour there.
   */
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.SMTP_FROM_ADDRESS || 'no-reply@qualiware.com',
        defaultFromName: process.env.SMTP_FROM_NAME || 'QualiWare',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT ?? 587),
          // STARTTLS on 587, implicit TLS on 465.
          secure: Number(process.env.SMTP_PORT ?? 587) === 465,
          auth:
            process.env.SMTP_USER && process.env.SMTP_PASSWORD
              ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
              : undefined,
        },
      })
    : undefined,
  sharp,
  folders: {},
  plugins: [
    multiTenantPlugin<Config>({
      tenantsSlug: 'tenants',
      collections: {
        pages: {},
        posts: {},
        docs: {},
        categories: {},
        partners: {},
        integrations: {},
      },
      userHasAccessToAllTenants: (user) => isSuperAdmin(user as never),
    }),
    nestedDocsPlugin({
      collections: ['categories', 'docs'],
      generateLabel: (_, doc) => (doc?.title as string) || '',
      // Categories build their URL purely from the parent chain. Docs articles
      // additionally sit under their category, so the chain is prefixed with
      // the `categoryPath` maintained by the Docs hooks.
      generateURL: (docs, currentDoc) => {
        const chain = docs.reduce((url, doc) => `${url}/${doc.slug as string}`, '')
        const prefix = (currentDoc?.categoryPath as string | undefined) ?? ''
        return `${prefix}${chain}`
      },
    }),
  ],
})
