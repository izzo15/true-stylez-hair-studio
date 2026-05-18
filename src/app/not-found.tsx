import Link from 'next/link'

export const metadata = {
  title: "Page Not Found | True Stylez Hair Studio",
  description: "The page you're looking for doesn't exist. Return to the homepage or contact us.",
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="relative">
        <span 
          className="text-9xl font-bold text-accent"
        >
          4
        </span>
        
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl scissor-spin"
        >
          ✂️
        </div>
        
        <span 
          className="text-9xl font-bold text-accent"
        >
          4
        </span>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mt-8 mb-4">Snip! Page Not Found</h2>
        <p className="text-gray-400 mb-6">This page got cut. Let's get you back.</p>
        <Link href="/" className="px-6 py-2 bg-accent text-white rounded-full">
          Back to Stylez
        </Link>
      </div>
    </div>
  )
}