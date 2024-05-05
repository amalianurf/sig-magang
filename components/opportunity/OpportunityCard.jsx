import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

function OpportunityCard(props) {
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        return `${day}-${month}-${year}`
    }

    return (
        <Link href={props.href}>
            <div className='w-full h-full flex rounded-lg shadow-md'>
                <div className='w-auto h-full aspect-square object-cover'>
                    <Image src={props.image} width={100} height={100} alt='logo' className='w-full h-full rounded-lg' priority />
                </div>
                <div className='w-full flex flex-col px-4 py-3 gap-1'>
                    <div className='text-xl text-black font-semibold'>{props.name}</div>
                    <div className='text-grey'>
                        { props.brand_name && <div>{props.brand_name}</div> }
                        { props.city && <div>{props.city}</div> }
                        { props.start_period && <div>{formatDate(props.start_period)}</div> }
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default OpportunityCard