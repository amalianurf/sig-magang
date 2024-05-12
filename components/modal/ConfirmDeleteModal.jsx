import Button from '../Button'
import CloseIcon from '@mui/icons-material/Close'

function ConfirmDeleteModal(props) {
    const handleCloseModal = () => {
        props.setConfirmDelete({ ...props.confirmDelete, showModal:false })
    }

    return (
        <>
            <div onClick={handleCloseModal} className={props.confirmDelete.showModal ? 'absolute top-0 left-0 w-full h-full bg-black/[.3] z-20' : 'hidden'}></div>
            <div className={props.confirmDelete.showModal ? 'fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-fit h-fit p-6 flex flex-col gap-6 bg-white shadow-lg rounded-2xl z-20' : 'hidden'}>
                <h3>Konfirmasi Hapus</h3>
                <div>Apakah Anda yakin ingin menghapus data?</div>
                <div className='flex justify-end items-center gap-5'>
                    <Button type={'button'} onClick={handleCloseModal} name={'Batal'} buttonStyle={'w-fit px-4 py-2 text-iris font-bold bg-white ring-1 ring-iris hover:ring-iris/[.3] hover:text-iris/[.3] rounded-lg'} />
                    <Button type={'button'} onClick={() => props.handleDelete(props.confirmDelete.id)} name={'Hapus'} buttonStyle={'w-fit px-4 py-2 text-white font-bold bg-red hover:bg-red/[.3] rounded-lg'} />
                </div>
                <Button type={'button'} onClick={handleCloseModal} name={<CloseIcon />} buttonStyle={'absolute top-3 right-3 flex items-center p-1.5 rounded-full text-grey hover:bg-grey-light/[.3]'} />
            </div>
        </>
    )
}

export default ConfirmDeleteModal