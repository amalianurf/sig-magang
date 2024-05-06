import React from 'react'
import Button from '../Button'
import toast from 'react-hot-toast'
import * as Excel from 'exceljs'
import CloseIcon from '@mui/icons-material/Close'

function UploadFileModal(props) {
    const convertWorksheetToJson = (worksheet) => {
        const jsonData = []

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return

            const rowData = {}
            row.eachCell((cell, colNumber) => {
                const columnName = worksheet.getRow(1).getCell(colNumber).value
                rowData[columnName] = cell.value
            })

            const isEmpty = Object.values(rowData).every(cell => cell === null || cell === undefined || cell === '')
            if (!isEmpty) {
                jsonData.push(rowData)
            }
        })
    
        return jsonData
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]

        if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
            const reader = new FileReader()

            reader.readAsArrayBuffer(file)

            reader.onload = async (event) => {
                try {
                    const data = event.target.result
                    const workbook = new Excel.Workbook()
                    await workbook.xlsx.load(data)

                    const worksheet = workbook.worksheets[0]
                    const jsonData = convertWorksheetToJson(worksheet)
    
                    props.setExcelData(jsonData)
                } catch (error) {
                    console.log(error)
                }
            }
        } else {
            toast.error('File tidak didukung')
        }
    }

    return (
        <>
            <div onClick={() => props.setIsShow(false)} className={props.isShow ? 'absolute top-0 left-0 w-full h-full bg-black/[.3] z-20' : 'hidden'}></div>
            <div className={props.isShow ? 'fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-fit h-fit p-6 flex flex-col gap-6 bg-white shadow-lg rounded-2xl z-20' : 'hidden'}>
                <h3 className='text-center'>Upload File</h3>
                <form onSubmit={props.handleUpload} className='flex flex-col gap-6'>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='upload-file' className='font-medium'>Tambah Data dengan File XLSX/XLS</label>
                        <input type='file' name='upload-file' onChange={handleFileChange} accept='.xlsx, .xls' className='w-full px-3 py-2.5 border border-grey rounded-lg text-base text-grey outline-none focus:border-iris/[.7] focus:ring-1 ring-iris/[.6] file:text-black file:border-none file:px-4 file:py-2 file:mr-3 file:bg-grey-light file:font-medium file:rounded-lg' required />
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