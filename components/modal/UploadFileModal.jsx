import React from 'react'
import Button from '../Button'
import CloseIcon from '@mui/icons-material/Close'

function UploadFileModal(props) {
    return (
        <>
            <div onClick={() => props.setIsShow(false)} className={props.isShow ? 'absolute top-0 left-0 w-full h-screen bg-black/[.3]' : 'hidden'}></div>
            <div className={props.isShow ? 'absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-fit h-fit p-6 flex flex-col gap-6 bg-white shadow-lg rounded-2xl' : 'hidden'}>
                <h3 className='text-center'>Upload File</h3>
                <form onSubmit={props.handleUpload} className='flex flex-col gap-6'>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='upload-file' className='font-medium'>Tambah Data dengan File XLSX/XLS</label>
                        <input type='file' name='upload-file' onChange={props.handleFileChange} accept='.xlsx, .xls' className='w-full px-3 py-2.5 border border-grey rounded-lg text-base text-grey outline-none focus:border-iris/[.7] focus:ring-1 ring-iris/[.6] file:text-black file:border-none file:px-4 file:py-2 file:mr-3 file:bg-grey-light file:font-medium file:rounded-lg' />
                    </div>
                    <div className='flex justify-center'>
                        <Button type={'submit'} name={'Tambah Data'} buttonStyle={'w-fit px-4 py-2.5 text-white font-bold bg-iris hover:bg-iris/[.3] rounded-lg'} />
                    </div>
                </form>
                <Button type={'button'} onClick={() => props.setIsShow(false)} name={<CloseIcon />} buttonStyle={'absolute top-3 right-3 flex items-center p-1.5 rounded-full text-grey hover:bg-grey-light/[.3]'} />
            </div>
        </>
    )
}

export default UploadFileModal