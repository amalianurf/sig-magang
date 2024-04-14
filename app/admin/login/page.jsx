'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import toast, { Toaster } from 'react-hot-toast'
import Button from '@component/components/Button'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'

function page() {
    const [form, setForm] = useState({
        email: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const router = useRouter()

    const handleLogin = async (e) => {
        e.preventDefault()

        if (form.email == '' || form.password == '') {
            toast.error('Harap lengkapi semua data.')
        } else {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            }).then(async (response) => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message)
                    })
                }
                return response.json()
            }).then((data) => {
                Cookies.set('access-token', data.accessToken)
                router.push('/admin/dashboard')
            }).catch((error) => {
                toast.error(error.message)
                console.error('Error:', error.message)
            })
        }
    }

    return (
        <>
            <Toaster position='top-center' reverseOrder={false} />
            <div className='bg-blue-light w-full h-screen grid place-items-center'>
                <div className='flex flex-col gap-9 bg-white w-fit h-fit px-14 py-12 rounded-2xl shadow-md'>
                    <h1 className='text-iris-normal text-center'>LOGIN ADMIN</h1>
                    <form onSubmit={handleLogin} className='flex flex-col gap-9 w-[440px]'>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor='email' className='font-medium'>Email</label>
                            <input type='email' name='email' value={form.email} onChange={handleFormChange} placeholder='Email' className='w-full px-4 py-2 border border-grey-normal rounded-lg text-base outline-none' required />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor='password' className='font-medium'>Password</label>
                            <div className='relative'>
                                <input type={showPassword ? 'text' : 'password'} name='password' value={form.password} onChange={handleFormChange} placeholder='Password' className='w-full px-4 py-2 border border-grey-normal rounded-lg text-base outline-none' required />
                                <Button type={'button'} onClick={() => setShowPassword(!showPassword)} name={showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />} buttonStyle={'absolute right-4 -top-1/5 translate-y-1/3 text-grey-normal'} />
                            </div>
                        </div>
                        <div className='flex justify-center'>
                            <Button type={'submit'} name={'MASUK'} buttonStyle={'w-1/2 py-3 text-white font-bold bg-iris-normal rounded-lg'} />
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default page