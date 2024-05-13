'use client'
import React, { useState, useEffect, useRef, createContext } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import SideBar from '@component/components/navigations/SideBar'
import Button from '@component/components/Button'
import { Toaster } from 'react-hot-toast'
import Cookies from 'js-cookie'

export const HeaderContext = createContext()

function layout({ children }) {
    const path = usePathname()
    const title = {
        '/admin/dashboard': 'Dashboard',
        '/admin/maps': 'Peta',
        '/admin/opportunity': 'Data Magang',
        '/admin/company': 'Data Perusahaan',
        '/admin/sector': 'Data Sektor'
    }
    const router = useRouter()
    const token = Cookies.get('access-token')
    const headerRef = useRef()
    const [headerHeight, setHeaderHeight] = useState()

    useEffect(() => {
        const height = headerRef.current.clientHeight
        setHeaderHeight(height)
    }, [])

    const getTitle = (path) => {
        for (const key of Object.keys(title)) {
            if (path.includes(key)) {
                return title[key]
            }
        }
        return null
    }

    const logout = () => {
        Cookies.remove('access-token')
        router.push('/login')
    }

    if (typeof window !== 'undefined' && !token) {
        router.push('/login')
    } else {
        return (
            <>
                <Toaster position='top-center' reverseOrder={false} />
                <div className='relative flex bg-black'>
                    <SideBar />
                    <div className='flex flex-col w-full min-h-screen'>
                        <header ref={headerRef} className='max-w-full ml-64 flex justify-between px-10 py-4 text-white'>
                            <h3>{getTitle(path)}</h3>
                            <Button type={'button'} onClick={logout} name={'Logout'} buttonStyle={'bg-red px-4 py-2 text-white font-bold text-sm uppercase rounded-lg'} />
                        </header>
                        <main className='max-w-full ml-64 h-full bg-white rounded-t-2xl'>
                            <HeaderContext.Provider value={{ headerHeight }}>
                                {children}
                            </HeaderContext.Provider>
                        </main>
                    </div>
                </div>
            </>
        )
    }
}

export default layout