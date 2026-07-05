import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Blog — True Stylez Hair Studio',
    description: 'Tips, guides, and insights on men\'s grooming from J The Barber in Troy, NY.',
    alternates: { canonical: '/blog' },
  }
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
