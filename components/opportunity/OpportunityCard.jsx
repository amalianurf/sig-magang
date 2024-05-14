'use client'
import React, { useLayoutEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

function OpportunityCard(props) {
    const contentRef = useRef(null)
    const [contentSize, setContentSize] = useState()

    useLayoutEffect(() => {
        const handleResize = () => {
            if (contentRef.current) {
                setContentSize(contentRef.current.clientHeight)
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const formatDate = (dateString) => {
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ]

        const newDate = new Date(dateString)
        const day = newDate.getDate().toString().padStart(2, '0')
        const month = months[newDate.getMonth()]
        const year = newDate.getFullYear()

        return `${day} ${month} ${year}`
    }

    return (
        <Link href={props.href}>
            <div className='w-full h-full flex rounded-lg shadow-md'>
                <div style={{ minWidth: `${contentSize}px`, minHeight: `${contentSize}px`, maxWidth: `${contentSize}px`, maxHeight: `${contentSize}px` }} className='flex items-center'>
                    <Image src={props.image} width={100} height={100} alt='logo' className='w-full max-h-full rounded-lg' priority />
                </div>
                <div ref={contentRef} className='w-full h-fit flex flex-col px-4 py-3 gap-1'>
                    <div className='text-black font-semibold line-clamp-1'>{props.name}</div>
                    <div className='text-grey'>
                        { props.brand_name && <div className='line-clamp-1'>{props.brand_name}</div> }
                        { props.city && <div>{props.city}</div> }
                        { props.start_period && <div>{formatDate(props.start_period)}</div> }
                        { props.activity_type && <div>{props.activity_type}</div> }
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default OpportunityCard