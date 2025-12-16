'use client'

export default function Logo() {
  return (
    <div className="logo">
      <svg width="280" height="60" viewBox="0 0 280 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Infinity symbol */}
        <path 
          d="M25 18C18 18 12 24 12 30C12 36 18 42 25 42C32 42 38 36 38 30C38 24 44 18 51 18C58 18 64 24 64 30C64 36 58 42 51 42C44 42 38 48 38 54" 
          stroke="#3498DB" 
          strokeWidth="4" 
          fill="none"
          strokeLinecap="round"
        />
        <path 
          d="M51 42C58 42 64 36 64 30C64 24 58 18 51 18C44 18 38 24 38 30C38 36 32 42 25 42C18 42 12 36 12 30C12 24 18 18 25 18" 
          stroke="#3498DB" 
          strokeWidth="4" 
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Text: Into */}
        <text x="80" y="40" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="#1B4F72">Into</text>
        
        {/* Text: Bridge */}
        <text x="145" y="40" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="#000000">Bridge</text>
        
        {/* Text: .com */}
        <text x="245" y="40" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="normal" fill="#3498DB">.com</text>
      </svg>
    </div>
  )
}

