import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gift Requests',
  description: 'Submit and track gift requests',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

