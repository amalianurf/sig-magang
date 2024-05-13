'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as Logo from '../../public/logo-white.svg'

function SideBar() {
    const path = usePathname()

    return (
        <nav className='fixed flex flex-col gap-14 py-4 w-64 min-h-screen text-white'>
            <div className='px-10'>
                <Image src={Logo} height={32} alt='logo' priority />
            </div>
            <ul className='flex flex-col gap-2'>
                <li>
                    <Link href={'/admin/dashboard'}>
                        <div className={path.includes('/admin/dashboard') ? 'w-full bg-grey-light/[.2] px-10 py-3 font-bold uppercase hover:bg-grey-light/[.3]' : 'w-full px-10 py-3 font-medium uppercase hover:bg-grey-light/[.1]'}>Dashboard</div>
                    </Link>
                </li>
                <li>
                    <Link href={'/admin/maps'}>
                        <div className={path.includes('/admin/maps') ? 'w-full bg-grey-light/[.2] px-10 py-3 font-bold uppercase hover:bg-grey-light/[.3]' : 'w-full px-10 py-3 font-medium uppercase hover:bg-grey-light/[.1]'}>Peta</div>
                    </Link>
                </li>
                <li>
                    <Link href={'/admin/opportunity'}>
                        <div className={path.includes('/admin/opportunity') ? 'w-full bg-grey-light/[.2] px-10 py-3 font-bold uppercase hover:bg-grey-light/[.3]' : 'w-full px-10 py-3 font-medium uppercase hover:bg-grey-light/[.1]'}>Data Magang</div>
                    </Link>
                </li>
                <li>
                    <Link href={'/admin/company'}>
                        <div className={path.includes('/admin/company') ? 'w-full bg-grey-light/[.2] px-10 py-3 font-bold uppercase hover:bg-grey-light/[.3]' : 'w-full px-10 py-3 font-medium uppercase hover:bg-grey-light/[.1]'}>Data Perusahaan</div>
                    </Link>
                </li>
                <li>
                    <Link href={'/admin/sector'}>
                        <div className={path.includes('/admin/sector') ? 'w-full bg-grey-light/[.2] px-10 py-3 font-bold uppercase hover:bg-grey-light/[.3]' : 'w-full px-10 py-3 font-medium uppercase hover:bg-grey-light/[.1]'}>Data Sektor</div>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default SideBar