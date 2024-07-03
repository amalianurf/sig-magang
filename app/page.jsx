'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import NavBar from '@component/components/navigations/NavBar'
import Button from '@component/components/Button'
import ImageModal from '@component/components/modal/ImageModal'
import FeatureImgA from '../public/feature-1.svg'
import FeatureImgB from '../public/feature-2.svg'
import FeatureImgC from '../public/feature-3.svg'

function page() {
    const [navbarHeight, setNavbarHeight] = useState(70)
    const [showImage, setShowImage] = useState({
        isShow: false,
        image: ''
    })

    const handleFeatureImage = (image) => {
        setShowImage({
            isShow: true,
            image: image
        })
    }

    return (
        <div className='relative min-h-screen'>
            <header>
                <NavBar setNavbarHeight={setNavbarHeight} />
            </header>
            <main style={{ paddingTop: navbarHeight }} className='w-full'>
                <section className='relative w-full bg-blue-light'>
                    <div className='flex flex-col gap-6 bg-[url("../public/hero.svg")] bg-contain bg-no-repeat bg-right px-16 py-12'>
                        <div className='w-1/2 flex flex-col gap-4'>
                            <h2 className='font-bold text-iris uppercase'>Sistem Informasi Geografis Lowongan Magang</h2>
                            <p>Sistem Informasi Geografis Lowongan Magang merupakan sebuah sistem informasi yang menyajikan data lowongan magang dalam bentuk peta<br /><br />Aplikasi ini akan menampilkan sebaran data lowongan magang berdasarkan lokasi perusahaannya dan dapat menampilkan jumlah data per Kabupaten/Kota di Indonesia</p>
                        </div>
                        <Button type={'button'} href={`${process.env.NEXT_PUBLIC_CLIENT}/maps`} onClick={() => window.open(`${process.env.NEXT_PUBLIC_CLIENT}/maps`, '_self')} name={'Jelajahi Peta'} buttonStyle={'w-fit px-3 py-2 text-white font-bold bg-iris hover:bg-iris/[.3] rounded-lg'} />
                    </div>
                </section>
                <section className='flex flex-col justify-center px-16 pt-8 pb-16 gap-7'>
                    <h2 className='text-iris text-center'>Fitur Utama</h2>
                    <div className='flex gap-11 justify-center items-start'>
                        <div className='flex flex-col gap-3 px-2 justify-center text-center'>
                            <div className='w-full flex justify-center'>
                                <Image onClick={() => handleFeatureImage(FeatureImgA)} src={FeatureImgA} alt='feature-image' className='rounded-md cursor-pointer' />
                            </div>
                            <h4>Peta Lowongan Magang</h4>
                            <p>Menampilkan peta disertai warna klasifikasi dari jumlah lowongan magang per daerah Kabupaten/Kota</p>
                        </div>
                        <div className='flex flex-col gap-3 px-2 justify-center text-center'>
                            <div className='w-full flex justify-center'>
                                <Image onClick={() => handleFeatureImage(FeatureImgB)} src={FeatureImgB} alt='feature-image' className='rounded-md cursor-pointer' />
                            </div>
                            <h4><em>Popup</em> Jumlah Data per Daerah</h4>
                            <p>Menampilkan popup jumlah perusahaan dan jumlah lowongan magang per daerah Kabupaten/Kota</p>
                        </div>
                        <div className='flex flex-col gap-3 px-2 justify-center text-center'>
                            <div className='w-full flex justify-center'>
                                <Image onClick={() => handleFeatureImage(FeatureImgC)} src={FeatureImgC} alt='feature-image' className='rounded-md cursor-pointer' />
                            </div>
                            <h4>Filter Data</h4>
                            <p>Filter data berdasarkan sektor perusahaan dan/atau berdasarkan tanggal periode mulai magang</p>
                        </div>
                    </div>
                </section>
            </main>
            <footer className='absolute bottom-0 w-full px-6 py-1 flex justify-center items-center bg-neutral-dark'>
                <div className='font-medium'>Copyright © 2024 Amalia Nur Fitri</div>
            </footer>
            { showImage.isShow && (
                <ImageModal showImage={showImage} setShowImage={setShowImage} />
            )}
        </div>
    )
}

export default page