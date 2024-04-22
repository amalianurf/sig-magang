import React from 'react'
import Button from '../Button'

function SectorForm(props) {
    return (
        <form onSubmit={props.handleSubmit} className='flex flex-col gap-5'>
            <div className='flex flex-col gap-1'>
                <label htmlFor='name' className='font-medium'>Nama Sektor</label>
                <input type='text' name='name' value={props.value} onChange={props.handleChange} placeholder='Nama Sektor' className='w-[560px] px-4 py-2 border border-grey rounded-lg text-base outline-none focus:border-iris/[.7] focus:ring-1 ring-iris/[.6]' required />
            </div>
            <Button type={'submit'} name={props.buttonName} buttonStyle={'w-fit px-4 py-2.5 text-white font-bold bg-iris hover:bg-iris/[.3] rounded-lg'} />
        </form>
    )
}

export default SectorForm