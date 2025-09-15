import { LibraryBig, LineChart, MessageSquare, Shield } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'
import { Progress } from '@/components/ui/progress'
import {Button} from '@/components/ui/button'
import Link from 'next/link'

function SideNav() {
  const menuList = [
    {
        id:1,
        name: "My Forms",
        icon: LibraryBig,
        path: '/dashboard'
    },
    {
        id:2,
        name: "Responses",
        icon: MessageSquare,
        path: '/dashboard/responses'
    },
    {
        id:3,
        name: "Analytics",
        icon: LineChart,
        path: '/dashboard/analytics'
    },
    {
        id:4,
        name: "Upgrade",
        icon: Shield,
        path: '/dashboard/upgrade'
    },
  ]
  const path = usePathname()
  useEffect(() => {
    console.log(path),
    [path]
  })

  return (
    <div className="h-screen shadow-md border">
        <div className='p-5'>
            {
                menuList.map((menu, index) => (
                    <Link key={index} href={menu.path} className={`flex items-center gap-3 p-4 mb-3 hover:bg-primary hover:text-white rounded-lg cursor-pointer ${path == menu.path && 'bg-primary text-white' }`}>
                        <menu.icon />
                        {menu.name }
                    </Link>
                ))
            }
        </div>
        <div className="fixed bottom-20 p-6 w-64">
            <Button className="w-full">+ Create Form</Button>
            <div className='my-7'>
                <Progress value={33}/>
                <h2 className="text-sm mt-2"><strong>2 Out of 3 Forms Created</strong></h2>
                <h2 className="text-xs mt-3"><strong>Upgrade your plan for unlimited AI Forms</strong></h2>
            </div>
        </div>
    </div>
  )
}

export default SideNav