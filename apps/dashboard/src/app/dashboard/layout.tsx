import SideNav from '@/components/layout/side-nav'
import React, { ReactNode } from 'react'

function DashboardLayout({ children }: { readonly children: ReactNode }) {
  return (
    <main className='h-screen p-6 gap-7 flex dark:bg-[#111] bg-zinc-50'>
      <SideNav/>
      <div className="flex-1 dark:bg-black bg-white rounded-3xl p-8">
        {children}
      </div>
    </main>
  )
}

export default DashboardLayout