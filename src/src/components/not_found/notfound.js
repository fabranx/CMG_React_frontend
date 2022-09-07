import 'bootstrap/dist/css/bootstrap.min.css'
import {Container} from 'react-bootstrap'
import Footer from '../footer/footer'
import './notfound.css'


function NotFound()
{
  return(
    <div className='d-flex align-items-center justify-content-center background404'>
      <Container className='not-found-margin-top'>
        <h2>404</h2>
        <h3>Pagina Non Trovata</h3>
      </Container>
      <Footer/>
    </div>
  )
}

export default NotFound