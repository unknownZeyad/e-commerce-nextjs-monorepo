import SideNav from '@/core/components/layout/side-nav'
import React, { ReactNode } from 'react'

function DashboardLayout({ children }: { readonly children: ReactNode }) {
  return (
    <main className='h-screen p-6 gap-7 flex dark:bg-[#111] bg-zinc-50'>
      <SideNav/>
      <div className="flex-1 overflow-hidden border border-white/10 dark:bg-black bg-white rounded-3xl p-8 pr-3">
        <div className='overflow-auto w-full pr-3 h-full'>
          {children}
        </div>
      </div>
    </main>
  )
}

export default DashboardLayout