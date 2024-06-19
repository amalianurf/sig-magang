'use client'
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as Logo from '../../public/logo.svg'

function NavBar(props) {
    const navbarRef = useRef(null)
    const path = usePathname()

    useEffect(() => {
        const height = navbarRef.current.clientHeight
        props.setNavbarHeight(height)
    }, [])

    return (
        <nav ref={navbarRef} className='fixed w-full px-10 py-4 flex justify-between items-center bg-white shadow-md z-[1000]'>
            <Link href={'/'} onClick={() => { window.open(`${process.env.NEXT_PUBLIC_CLIENT}/`, '_self') }}>
                <Image src={Logo} height={32} alt='logo' priority />
            </Link>
            <ul className='flex items-center gap-14'>
                <li className={path == '/' ? 'py-1 text-lg text-iris font-semibold border-b-2 border-iris' : 'text-lg text-iris'}>
                    <Link href={'/'} onClick={() => { window.open(`${process.env.NEXT_PUBLIC_CLIENT}/`, '_self') }}>Beranda</Link>
                </li>
                <li className={path == '/maps' ? 'py-1 text-lg text-iris font-semibold border-b-2 border-iris' : 'text-lg text-iris'}>
                    <Link href={'/maps'} onClick={() => { window.open(`${process.env.NEXT_PUBLIC_CLIENT}/maps`, '_self') }}>Peta</Link>
                </li>
                <li className={path.includes('/opportunity') ? 'py-1 text-lg text-iris font-semibold border-b-2 border-iris' : 'text-lg text-iris'}>
                    <Link href={'/opportunity'} onClick={() => { window.open(`${process.env.NEXT_PUBLIC_CLIENT}/opportunity`, '_self') }}>Data Magang</Link>
                </li>
            </ul>
        </nav>
    )
}

export default NavBar