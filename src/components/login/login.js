import { Link, Redirect } from "react-router-dom"
import React from 'react'
import { Button, Container, Form, Col, Alert } from "react-bootstrap"
import {useForm, Controller } from "react-hook-form"
import 'bootstrap/dist/css/bootstrap.min.css'
import './login.css'
import {LoginContext} from "../context"
import {client} from "../../Client"
import Footer from "../footer/footer"

function Login() {

		const {isLoggedIn, setIsLoggedIn} = React.useContext(LoginContext)
		const { handleSubmit, clearErrors,setError, control, formState: { errors }} = useForm();

		const onSubmit = data => {
			client.login(data)
			.then((res) => {
				client.setUserData(res.data)
				setIsLoggedIn(true)
			})
			.catch((error) => {
				// imposta errore in setError in modo da far apparire eventuali errori in nel form di react-hook-form
				if (error.response) {
					for(const key in error.response.data){
						setError("server_error", {type: "focus", message: error.response.data[key]}, { shouldFocus: true });
					}
				}
				else {
					setError("error", {type: "focus", message: error.message}, { shouldFocus: true })
				}
			})
		}
	
		return(
		<>
		{isLoggedIn ? <Redirect to='/'/> : null}
		<div className="background-login">
			<div>
				<Container className="mt-5">
					<h3 className="text-center fw-bold mt-5">Login</h3>
					<p className="text-center">Accedi al tuo profilo</p>
				</Container>
				<Container className="d-flex align-items-center justify-content-center mt-5">
					<Form className="form_width" onSubmit={event => {clearErrors(); handleSubmit(onSubmit)(event)}}>
						<Col>
							<Controller 
								control={control}
								name="email"
								rules={{ required: true }}
								render={({ field: { onChange, onBlur, value, ref } }) => (
									<Form.Group className="mb-3" controlId="formBasicEmail">
									<Form.Label >Email</Form.Label>
									<Form.Control type="email" placeholder="Inserisci email" onChange={onChange}/>
									{errors.email && <span style={{color: "red" }}>Questo campo è obbligatorio</span>}
								</Form.Group>
								)}
							/>

							<Controller 
								control={control}
								name="password"
								rules={{ required: true, minLength: 8 }}
								render={({ field: { onChange, onBlur, value, ref } }) => (
									<Form.Group className="mb-3" controlId="formBasicPassword">
									<Form.Label >Password</Form.Label>
									<Form.Control type="password" placeholder="Password" onChange={onChange} />
									{errors.password && errors.password.type==="required" && <span style={{color: "red" }}>Questo campo è obbligatorio</span>}
									{errors.password && errors.password.type==="minLength" && <span style={{color: "red" }}>Lunghezza minima 8 caratteri</span>}
								</Form.Group>
								)}
							/>	
							<Controller
								name="ricordami"
								control={control}
								defaultValue={false}
								render={({field: {onChange}}) => (
									<Form.Group className="mb-3" controlId="formBasicCheckbox">
										<Form.Check onChange={onChange} type="checkbox" label="Ricordami" />
									</Form.Group>
								)}
							/>
							{errors.server_error && <span style={{color: "red" }}>{errors.server_error.message}</span>}
							{errors.error && <span style={{color: "red" }}>{errors.error.message}</span>}
						
						</Col>
						<Col className="d-grid gap-2 d-md-flex justify-content-md-start">
							<Button variant="primary" type="submit">
								Login
							</Button>
						</Col>
						<p className="text-center link-password">
							<Link to="/reset-password" className="link-password">Password Dimenticata?</Link>
						</p>
					</Form>
				</Container>
				<div className="d-flex justify-content-center mt-5">
					<Alert variant='info'>
						Se non hai ancora un account, registrarti è semplice e gratuito.{' '}
						<Alert.Link as={Link} to='/registrazione'>Clicca qui</Alert.Link>
						{' '}per iniziare
					</Alert>
				</div>
			</div>
			<Footer/>

		</div>
		</>
	)

}


export default Login;