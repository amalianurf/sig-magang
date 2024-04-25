'use client'
import { usePathname } from 'next/navigation'
import SideBar from '@component/components/navigations/SideBar'
import Button from '@component/components/Button'
import { Toaster } from 'react-hot-toast'

function layout({ children }) {
    const path = usePathname()
    const title = {
        '/admin/dashboard': 'Dashboard',
        '/admin/maps': 'Peta',
        '/admin/opportunity': 'Data Magang',
        '/admin/company': 'Data Perusahaan',
        '/admin/sector': 'Data Sektor'
    }

    const getTitle = (path) => {
        for (const key of Object.keys(title)) {
            if (path.includes(key)) {
                return title[key]
            }
        }
        return null
    }

    return (
        <>
            <Toaster position='top-center' reverseOrder={false} />
            <div className='flex bg-black'>
                <SideBar />
                <div className='flex flex-col w-full min-h-screen ml-64'>
                    <header className='w-full flex justify-between px-10 py-4 text-white'>
                        <h3>{getTitle(path)}</h3>
                        <Button type={'button'} name={'Logout'} buttonStyle={'bg-red px-4 py-2 text-white font-bold text-sm uppercase rounded-lg'} />
                    </header>
                    <main className='w-full h-full bg-white rounded-t-2xl'>
                        {children}
                    </main>
                </div>
            </div>
        </>
    )
}

export default layout