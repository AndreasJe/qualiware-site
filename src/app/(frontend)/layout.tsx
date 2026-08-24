import type { Metadata } from 'next'
import '../../styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'QualiWare — Enterprise Architecture & Digital Twin of an Organization',
    template: '%s — QualiWare',
  },
  description:
    'Build a living digital model of your organization. Enterprise Architecture, GRC and Digital Twin of an Organization.',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
