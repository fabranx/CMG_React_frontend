import { Container, Alert } from 'react-bootstrap'
import {useParams} from 'react-router-dom'
import './verifica_email.css'
import {useEffect, useState} from 'react'
import {client} from '../../Client'
import Footer from '../footer/footer'

function VerificaEmail() {
	let {id} = useParams()
	let [isVerified, setVerified] = useState(false)
	let [error, setError] = useState(null)


	useEffect(() =>{
			client.verifyEmail(id)
				.then(res => {
					setVerified(true)
				})
				.catch(err => {
					setError(err.response?.data?.detail)
				})
		}, [id])


	return( 
		 <div className='background-verify-email'>
       <Container className="d-flex align-items-center justify-content-center mt-5">
					{ isVerified ?
						<Alert variant='success' className='mt-5'> La tua email è stata verificata</Alert> :
						<Alert variant='danger' className='mt-5'> Errore nell verifica dell'email: { error ? error : null}</Alert>
					}
        </Container>
				<Footer/>
			</div>
    )
}

export default VerificaEmail