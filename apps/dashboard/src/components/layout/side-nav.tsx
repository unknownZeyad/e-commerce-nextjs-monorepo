'use client'
import { cn } from '@packages/client/src/lib/utils';
import { ChartNoAxesCombined, PackageSearch, ShoppingBasket, SlidersHorizontal, Store, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navSections = [
  {
    title: 'General',
    links: [
      {
        label: 'Analytics',
        href: '/dashboard/analytics',
        icon: <ChartNoAxesCombined />
      },
      {
        label: 'Categories',
        href: '/dashboard/categories',
        icon: <SlidersHorizontal />
      },
      {
        label: 'Orders',
        href: '/dashboard/orders',
        icon: <ShoppingBasket />
      },
      {
        label: 'Inventories',
        href: '/dashboard/inventories',
        icon: <PackageSearch />
      },
      {
        label: 'Products',
        href: '/dashboard/products',
        icon: <Store />
      },
    ]
  },
  {
    title: 'Settings',
    links: [
      {
        label: 'Profile',
        href: '/dashboard',
        icon: <UserRound />
      }
    ]
  },
]

function SideNav() {
  const pathname = usePathname()
  return (
    <aside className="w-[250px] py-5 h-full overflow-auto">
      <h1 className="text-2xl font-bold uppercase">Spark</h1>

      <nav className='mt-20 flex flex-col gap-10'>
        {navSections.map(({ links, title },idx) => (
          <div key={idx}>
            <h6 className='dark:text-white/50 mb-3'>{title}</h6>
            <div className='flex flex-col gap-1'>
              {links.map(({ href, icon, label }, index) => (
                <Link
                  href={href} 
                  key={index}
                  className={cn(
                    'flex items-center gap-3 p-3 duration-200 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer dark:text-white/70',
                    href.startsWith(pathname) && 'dark:bg-white/10'
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