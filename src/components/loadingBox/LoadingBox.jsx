import { Spinner } from 'react-bootstrap'
import './loadingBox.scss'

const LoadingBox = () => {
    return (
        <>
            <Spinner animation='border' role='status'>


            </Spinner>
            <span className='visuallyHidden'>Loading...</span>
        </>
    )
}

export default LoadingBox