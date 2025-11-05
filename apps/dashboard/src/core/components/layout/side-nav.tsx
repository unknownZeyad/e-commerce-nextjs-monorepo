'use client'
import { cn } from '@packages/client/src/lib/utils';
import { ChartNoAxesCombined, PackageSearch, ShoppingBasket, SlidersHorizontal, Store, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdPermMedia } from "react-icons/md";

const navSections = [
  {
    title: 'General',
    links: [
      {
        label: 'Analytics',
        href: '/dashboard/analytics',
        icon: <ChartNoAxesCombined className='w-[20px] aspect-square'/>
      },
      {
        label: 'Categories',
        href: '/dashboard/categories',
        icon: <SlidersHorizontal className='w-[20px] aspect-square'/>
      },
      {
        label: 'Orders',
        href: '/dashboard/orders',
        icon: <ShoppingBasket className='w-[20px] aspect-square'/>
      },
      {
        label: 'Inventories',
        href: '/dashboard/inventories',
        icon: <PackageSearch className='w-[20px] aspect-square'/>
      },
      {
        label: 'Products',
        href: '/dashboard/products',
        icon: <Store className='w-[20px] aspect-square'/>
      },
      {
        label: 'Media Management',
        href: '/dashboard/media',
        icon: <MdPermMedia className='w-[20px] aspect-square'/>
      },
    ]
  },
  {
    title: 'Settings',
    links: [
      {
        label: 'Profile',
        href: '/dashboard/settings',
        icon: <UserRound className='w-[20px] aspect-square'/>
      }
    ]
  },
]

function SideNav() {
  const pathname = usePathname()
  return (
    <aside className="w-[250px] p-5 h-full overflow-auto">
      <h1 className="text-2xl font-bold uppercase">Spark</h1>

      <nav className='mt-20 flex flex-col gap-10'>
        {navSections.map(({ links, title },idx) => (
          <div key={idx}>
            <h6 className='dark:text-white/50 text-sm mb-3 ml-4'>{title}</h6>
            <div className='flex flex-col gap-1'>
              {links.map(({ href, icon, label }, index) => (
                <Link
                  href={href} 
                  key={index}
                  className={cn(
                    'flex text-sm items-center gap-2 p-2 pl-3 duration-200 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer dark:text-white',
                    pathname.startsWith(href) && 'dark:bg-white/10'
                  )}
                >
                  {icon}
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default SideNav