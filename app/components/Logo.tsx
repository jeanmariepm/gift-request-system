'use client'

import Image from 'next/image'

export default function Logo() {
  return (
    <div className="logo">
      <Image 
        src="/into-logo.svg" 
        alt="IntoBridge Logo" 
        width={280} 
        height={60}
        priority
      />
    </div>
  )
}

