"use client"
import { LibraryBig, LineChart, MessageSquare, Shield } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Progress } from '@/components/ui/progress'
import {Button} from '@/components/ui/button'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { db } from '@/configs'
import { JsonForms } from '@/configs/schema'
import { eq, desc } from 'drizzle-orm'

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

  const {user} = useUser()
  const [formList, setFormList] = useState([])
  
  const path = usePathname()
  useEffect(() => {
    if (user) {
      GetFormList()
    }
  }, [user])

  const [percent, setPercent] = useState(0)
  const GetFormList = async () => {
    try {
      const result = await db
        .select()
        .from(JsonForms)
        .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(JsonForms.id));
      setFormList(result || [])
      const pct = Math.min(100, Math.max(0, Math.round(((result?.length || 0) / 20) * 100)))
      setPercent(pct)
    } catch (e) {
      setFormList([])
      setPercent(0)
    }
  };

  

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
                <Progress value={percent} />
                <h2 className="text-sm mt-2"><strong>{formList?.length || 0} Out of 20 Forms Created</strong></h2>
                <h2 className="text-xs mt-3"><strong>Upgrade your plan for unlimited AI Forms</strong></h2>
            </div>
        </div>
    </div>
  )
}

export default SideNav