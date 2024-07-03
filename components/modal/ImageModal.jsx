import Image from 'next/image'
import Button from '../Button'
import CloseIcon from '@mui/icons-material/Close'

function ImageModal(props) {
    const handleCloseModal = () => {
        props.setShowImage({
            isShow: false,
            image: ''
        })
    }

    return (
        <>
            <div onClick={handleCloseModal} className={props.showImage.isShow ? 'absolute top-0 left-0 w-full h-full bg-black/[.3] z-[1000]' : 'hidden'}></div>
            <div className={props.showImage.isShow ? 'fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-1/2 h-fit flex flex-col gap-6 shadow-lg rounded-2xl z-[1000]' : 'hidden'}>
                <Image src={props.showImage.image} alt='feature-image' className='w-full rounded-2xl' />
                <Button type={'button'} onClick={handleCloseModal} name={<CloseIcon />} buttonStyle={'absolute top-3 right-3 flex items-center p-1.5 rounded-full text-grey hover:bg-grey-light/[.3]'} />
            </div>
        </>
    )
}

export default ImageModal