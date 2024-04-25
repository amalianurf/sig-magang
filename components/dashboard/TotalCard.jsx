import React from 'react'

function TotalCard(props) {
  return (
    <div className='w-full h-full flex items-center gap-3 px-4 py-3 rounded-lg border border-grey'>
        <div className='w-fit h-fit p-3 bg-grey-light rounded-full text-black'>{props.icon}</div>
        <div className='w-full flex flex-col gap-1'>
            <div className='text-3xl font-bold text-black'>{props.total}</div>
            <div className='text-sm text-grey uppercase'>{props.name}</div>
        </div>
    </div>
  )
}

export default TotalCard