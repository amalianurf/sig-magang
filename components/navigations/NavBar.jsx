'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function NavBar(props) {
    const navbarRef = useRef(null)
    const path = usePathname()

    useEffect(() => {
        const height = navbarRef.current.clientHeight
        props.setNavbarHeight(height)
    }, [])

    return (
        <nav ref={navbarRef} className='fixed w-full px-10 py-4 flex justify-between items-center bg-white shadow-md'>
            <Image src={''} alt='logo' />
            <ul className='flex items-center gap-14'>
                <li className={path == '/' ? 'py-1 text-lg text-iris font-semibold border-b-2 border-iris' : 'text-lg text-iris'}>
                    <Link href={'/'}>Peta</Link>
                </li>
                <li className={path.includes('/opportunity') ? 'py-1 text-lg text-iris font-semibold border-b-2 border-iris' : 'text-lg text-iris'}>
                    <Link href={'/opportunity'}>Data Magang</Link>
                </li>
            </ul>
        </nav>
    )
}

export default NavBar