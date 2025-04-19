import SuccessToastIcon from '../../assets/Icons/ToastSuccess.svg'
const SuccessToast = ({ toastMessage }) => {
    return (
        <>
            <div className='max-w-[800px] mx-auto fixed top-28 left-0 right-0 grid grid-cols-1' style={{ zIndex: 999 }}>
                <div className="grid grid-cols-[auto_1fr] items-center mx-[5%] p-4 gap-4 rounded-xl border border-success-300 bg-success-25 shadow-sm bg-customShadow">
                    <div className='relative rounded-[20px] border-none'>
                        <div className='absolute -inset-1 border-[1.667px] border-success-600 opacity-10 rounded-[20px]'></div>
                        <div className='absolute inset-0 border-[1.667px] border-success-600 opacity-50 rounded-[20px]'></div>
                        <div className='relative p-1'>
                            <img src={SuccessToastIcon} alt='Icon' className='w-5' />
                        </div>
                    </div>
                    <p className='font-inter text-sm not-italic font-semibold text-success-700'>{toastMessage}</p>
                </div>
            </div>
        </>
    );
}

export default SuccessToast;