import { Redirect } from "react-router-dom"
import React from 'react'
import { Button, Container, Form, Col } from "react-bootstrap"
import {useForm, Controller } from "react-hook-form"
import 'bootstrap/dist/css/bootstrap.min.css'
import './registrazione.css'
import { client } from "../../Client"
import {LoginContext} from "../context"
import Footer from "../footer/footer"

function Registrazione() {

		const {isLoggedIn, setIsLoggedIn} = React.useContext(LoginContext)
		const { handleSubmit, setError, clearErrors, control, formState: { errors }} = useForm();

		const onSubmit = data => {
			let formData;
			if(!data.username) {
				formData = {
					email: data.email,
					password1: data.password1,
					password2: data.password2,
				}
			} else {
				formData = {
					username: data.username,
					email: data.email,
					password1: data.password1,
					password2: data.password2,
				}
			}
			client.registration(formData)
			.then((res) => {
				client.setUserData(res.data)		
				setIsLoggedIn(true)
			})
			.catch((error) => {
				// imposta errore in setError in modo da far apparire eventuali errori in nel form di react-hook-form
				if(error.response){
					for(const key in error.response?.data){
						setError("server_error", {type: "focus", message: error.response?.data[key]}, { shouldFocus: true });
					}
				}
				else{
					setError("error", {type: "focus", message: error.message}, { shouldFocus: true });
				}
			})
		};
	
		return(
		<>
		{isLoggedIn ? <Redirect to='/'/> : null} 
		<div className="background-registrazione">
		<div>
			<Container className='mt-5'>
				<h3 className="text-center fw-bold mt-5">Registrati</h3>
				<p className="text-center">Registrati subito e accedi al tuo profilo</p>
				
			</Container>
			<Container className="d-flex align-items-center justify-content-center mt-5 mb-5">
				{/* onSubmit - chiama prima clearErrors() per eliminare tutti gli errori in particolare quelli del server
				che inserisco manualmente con setError(), che altrimenti rimangono e non permettono di reinviare il form modificato */}
				<Form className="form_width" onSubmit={event => {clearErrors(); handleSubmit(onSubmit)(event)}}>
					<Col>
					<Controller 
						defaultValue={""}
						control={control}
						name="username"
						rules={{ required: false }}
						render={({ field: { onChange, onBlur, value, ref } }) => (
							<Form.Group className="mb-3" controlId="formBasicUser">
							<Form.Label >Username</Form.Label>
							<Form.Control type="text" placeholder="Inserisci Username" onChange={onChange}/>
						</Form.Group>
						)}
					/>
					<Controller 
						control={control}
						name="email"
						rules={{ required: true }}
						render={({ field: { onChange, onBlur, value, ref } }) => (
							<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label >Email</Form.Label>
							<Form.Control type="email" placeholder="Inserisci Email" onChange={onChange}/>
							{errors.email && <span style={{color: "red" }}>Questo campo è obbligatorio</span>}
						</Form.Group>
						)}
					/>

					<Controller 
						control={control}
						name="password1"
						rules={{ required: true, minLength: 8 }}
						render={({ field: { onChange, onBlur, value, ref } }) => (
							<Form.Group className="mb-3" controlId="formBasicPassword">
							<Form.Label >Password</Form.Label>
							<Form.Control type="password" placeholder="Password" onChange={onChange} />
							{errors.password1 && errors.password1.type==="required" && <span style={{color: "red" }}>Questo campo è obbligatorio</span>}
							{errors.password1 && errors.password1.type==="minLength" && <span style={{color: "red" }}>Lunghezza minima 8 caratteri</span>}
						</Form.Group>
						)}
					/>	

					<Controller 
						control={control}
						name="password2"
						rules={{ required: true, minLength: 8 }}
						render={({ field: { onChange, onBlur, value, ref } }) => (
							<Form.Group className="mb-3" controlId="formBasicPassword">
							<Form.Label >Password</Form.Label>
							<Form.Control type="password" placeholder="Reinserisci Password" onChange={onChange} />
							{errors.password2 && errors.password2.type==="required" && <span style={{color: "red" }}>Questo campo è obbligatorio</span>}
							{errors.password2 && errors.password2.type==="minLength" && <span style={{color: "red" }}>Lunghezza minima 8 caratteri</span>}
						</Form.Group>
						)}
					/>	
						{/* 
						<Form.Group className="mb-3" controlId="formBasicCheckbox">
							<Form.Check type="checkbox" label="Check me out" />
						</Form.Group> */}
						{errors.server_error && <span style={{color: "red" }}>{errors.server_error.message}</span>}
						{errors.error && <span style={{color: "red" }}>{errors.error.message}</span>}
					</Col>
					<Col className="d-grid gap-2 d-md-flex justify-content-md-start">
						<Button variant="primary" type="submit">
							Registrati
						</Button>
					</Col>
				</Form>
			</Container>
		</div>
		<Footer/>
		</div>
		</>
	)

}


export default Registrazione;