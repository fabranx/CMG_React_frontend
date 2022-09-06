import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { Link } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import './home.css'
import {LoginContext} from '../context'
import {client} from '../../Client'

function Home() {
  const {isLoggedIn, setIsLoggedIn} = React.useContext(LoginContext)

	const [alertShow, setAlertShow] = React.useState(sessionStorage.getItem('alert') === 'false' ? false : true) 

	return (
		<main>
			<div id="intro" className="sfondo"> {/* className="sfondo" applica lo sfondo in background*/}
			{console.log(alertShow)}
			{(isLoggedIn && alertShow)  && (
				<Container className='mt-3 home__alert_container'>
				<Alert className='home__alert' variant="info" show={alertShow} onClose={() => {sessionStorage.setItem('alert', false); setAlertShow(false)}} dismissible>
					<Alert.Heading className='text-center'>Ciao {client.username}</Alert.Heading>
				</Alert>
				</Container>
				)}
				<div className="mb-5">
					<Container className="d-flex align-items-center justify-content-center 100 mt-5">
						<Row className="d-flex justify-content-center text-center mt-5">
							<Col className="col-lg">
								<h2 className="display-3 border border-primary rounded-pill p-3 fst-italic fw-bolder">
									CMG Blog
								</h2>
								<h4 className="my-4">
									<span className="text-danger">Cinema </span>
									<span className="text-warning">Musica </span>
									<span className="text-success">Giochi </span>
									{/* <span className="text-primary">Libri </span> */}
								</h4>
							</Col>
						</Row>
					</Container>
					{isLoggedIn ? (
					<>
						<Container fluid className='d-flex rounded py-4 px-5 flex-column home__explore_background gap-2 text-center mt-5 justify-content-center'>
							<h4>Esplora</h4>
							<Button size="lg" variant='outline-danger' as={Link} to='/cinema'>Cinema</Button>
							<Button size="lg" variant='outline-warning' as={Link} to='/musica'>Musica</Button>
							<Button size="lg" variant='outline-success' as={Link} to='/videogiochi'>Giochi</Button>
						</Container>
						</>
					) :
						(	
							<Container>
								<Row>
									<Col className="d-grid gap-2 d-md-flex justify-content-md-center ">
										<Link to="/login" role="button" className="btn btn-outline-light">
											Login
										</Link>
										<Link to="/registrazione" role="button" className="btn btn-primary">
											Registrati
										</Link>
									</Col>
								</Row>
							</Container>
						)
					}
				</div>
			</div>
		</main>
	);
}

export default Home;