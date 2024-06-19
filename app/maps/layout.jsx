'use client'
import React, { useState, createContext } from 'react'
import NavBar from '@component/components/navigations/NavBar'
import { Toaster } from 'react-hot-toast'

export const HeaderContext = createContext()

function layout({ children }) {
    const [navbarHeight, setNavbarHeight] = useState()

    return (
        <>
            <Toaster position='top-center' reverseOrder={false} />
            <header>
                <NavBar setNavbarHeight={setNavbarHeight} />
            </header>
            <main style={{ paddingTop: navbarHeight }} className='relative w-full'>
                <HeaderContext.Provider value={{ navbarHeight }}>
                    {children}
                </HeaderContext.Provider>
            </main>
        </>
    )
}

export default layout