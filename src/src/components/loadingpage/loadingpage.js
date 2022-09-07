import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import './loadingpage.css'

function Loading()
{
  return(
    <div className='d-flex align-items-center justify-content-center background-loading'>
      <Spinner className='loading-margin-top' animation="grow" variant="warning" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  )
}

export default Loading