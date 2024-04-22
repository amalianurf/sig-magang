'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function SideBar() {
    const path = usePathname()

    return (
        <nav className='flex flex-col gap-14 py-4 w-64 min-h-screen text-white'>
            <Image src={''} alt='logo' />
            <ul className='flex flex-col gap-2'>
                <li>
                    <Link href={'/admin/dashboard'}>
                        <div className={path == '/admin/dashboard' ? 'w-full bg-grey-light/[.2] px-10 py-3 font-bold uppercase hover:bg-grey-light/[.3]' : 'w-full px-10 py-3 font-medium uppercase hover:bg-grey-light/[.1]'}>Dashboard</div>
                    </Link>
                </li>
                <li>
                    <Link href={'/admin/maps'}>
                        <div className={path == '/admin/maps' ? 'w-full bg-grey-light/[.2] px-10 py-3 font-bold uppercase hover:bg-grey-light/[.3]' : 'w-full px-10 py-3 font-medium uppercase hover:bg-grey-light/[.1]'}>Peta</div>
                    </Link>
                </li>
                <li>
                    <Link href={'/admin/opportunity'}>
                        <div className={path == '/admin/opportunity' ? 'w-full bg-grey-light/[.2] px-10 py-3 font-bold uppercase hover:bg-grey-light/[.3]' : 'w-full px-10 py-3 font-medium uppercase hover:bg-grey-light/[.1]'}>Data Magang</div>
                    </Link>
                </li>
                <li>
                    <Link href={'/admin/company'}>
                        <div className={path == '/admin/company' ? 'w-full bg-grey-light/[.2] px-10 py-3 font-bold uppercase hover:bg-grey-light/[.3]' : 'w-full px-10 py-3 font-medium uppercase hover:bg-grey-light/[.1]'}>Data Perusahaan</div>
                    </Link>
                </li>
                <li>
                    <Link href={'/admin/sector'}>
                        <div className={path == '/admin/sector' ? 'w-full bg-grey-light/[.2] px-10 py-3 font-bold uppercase hover:bg-grey-light/[.3]' : 'w-full px-10 py-3 font-medium uppercase hover:bg-grey-light/[.1]'}>Data Sektor</div>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default SideBar