'use client'
import React, { useState, useLayoutEffect, useRef, createContext } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import ConfirmLogoutModal from '@component/components/modal/ConfirmLogoutModal'
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
    const headerRef = useRef()
    const [headerHeight, setHeaderHeight] = useState()
    const [showModal, setShowModal] = useState(false)

    useLayoutEffect(() => {
        const handleResize = () => {
            if (headerRef.current) {
                setHeaderHeight(headerRef.current.clientHeight)
            }
        }

        handleResize()
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

    return (
        <>
            <Toaster position='top-center' reverseOrder={false} />
            <div className='relative flex bg-black'>
                <SideBar />
                <div className='flex flex-col w-full min-h-screen'>
                    <header ref={headerRef} className='max-w-full ml-64 flex justify-between px-10 py-4 text-white'>
                        <h3>{getTitle(path)}</h3>
                        <Button type={'button'} onClick={() => setShowModal(true)} name={'Keluar'} buttonStyle={'bg-red px-4 py-2 text-white font-bold text-sm uppercase rounded-lg'} />
                    </header>
                    <main className='max-w-full ml-64 h-full bg-white rounded-t-2xl'>
                        <HeaderContext.Provider value={{ headerHeight }}>
                            {children}
                        </HeaderContext.Provider>
                    </main>
                </div>
                {showModal && (
                    <ConfirmLogoutModal handleLogout={logout} showModal={showModal} setShowModal={setShowModal} />
                )}
            </div>
        </>
    )
}

export default layout