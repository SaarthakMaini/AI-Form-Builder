import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

function Header() {
  return (
    <div className="p-3 border shadow-sm">
        <div className="flex items-center justify-between mx-4">
            <Image src={'/logo.svg'} width={175} height={175} alt="Logo"/>
            <Button>Get Started</Button>
        </div>
    </div>
  )
}

export default Header