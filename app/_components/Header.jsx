"use client"

import React, {useEffect} from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function Header() {
  const {user, isSignedIn} = useUser();
  const path = usePathname()
  useEffect(()=>{
    console.log(path)
  }, [])
  return (
    !path.includes('aiform') &&
    <div className={`p-3 border shadow-sm ${path?.startsWith('/dashboard') ? 'sticky top-0 z-50 bg-white' : ''}`}>
        <div className="flex items-center justify-between mx-4">
            <Image src={'/logo.svg'} width={175} height={175} alt="Logo"/>
            {
              isSignedIn?<div className="flex items-center gap-5">
                <Link href={'/dashboard'}>
                <Button variant="outline" className='cursor-pointer'>Dashboard</Button>
                </Link>
                <UserButton forceRedirectUrl="/dashboard"/>
              </div>:<SignInButton fallbackRedirectUrl="/dashboard" forceRedirectUrl='/dashboard'><Button className='cursor-pointer'>Get Started</Button></SignInButton>
            }
        </div>
    </div>
  )
}

export default Header