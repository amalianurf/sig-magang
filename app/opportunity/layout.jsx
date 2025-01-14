'use client'
import React, { useState } from 'react'
import NavBar from '@component/components/navigations/NavBar'

function layout({ children }) {
    const [navbarHeight, setNavbarHeight] = useState(70)

    return (
        <>
            <header>
                <NavBar setNavbarHeight={setNavbarHeight} />
            </header>
            <main style={{ paddingTop: navbarHeight }} className='w-full'>
                {children}
            </main>
        </>
    )
}

export default layout