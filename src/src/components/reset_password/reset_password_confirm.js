import { Button, Container, Form, Col, Alert } from "react-bootstrap"
import {useParams} from 'react-router-dom'
import './reset_password_confirm.css'
import React, {useState} from 'react'
import {useForm, Controller } from "react-hook-form"
import {LoginContext} from "../context"
import {client} from '../../Client'
import {Redirect} from 'react-router-dom'
import Footer from "../footer/footer"


function ResetPasswordConfirm() {
	let {uid} = useParams()
	let {token} = useParams()
  const {isLoggedIn} = React.useContext(LoginContext)
	const { handleSubmit, clearErrors, setError, control, formState: { errors }} = useForm();
	const [isPasswordReset, setIsPasswordReset] = useState(false)

	const onSubmit = data => {
		let formdata = {
			uid: uid,
			token: token,
			new_password1: data.new_password1,
			new_password2: data.new_password2
		}
		client.passwordResetConfirm(formdata)
		.then((res) => {
			setIsPasswordReset(true)
		})
		.catch((error) => {
			// imposta errore in setError in modo da far apparire eventuali errori in nel form di react-hook-form
			if (error.response) {
				for(const key in error.response.data){
					setError("server_error", {type: "focus", message: error.response.data[key]}, { shouldFocus: true });
				}
			}
			else {
				setError("Error", {type: "focus", message: "Error"}, { shouldFocus: true })
			}
		})
	}

	return( 
		<>
      {isLoggedIn ? <Redirect to="/"/> : null}
		 	<div className='background-reset-password-confirm'>
			<Container className="mt-5">
				<h3 className="text-center fw-bold mt-5">Reset Password</h3>
				<p className="text-center">Reimposta la password</p>
			</Container>
			{!isPasswordReset ? (
				<Container className="d-flex align-items-center justify-content-center mt-5 mb-5">
				<Form className="form_width" onSubmit={event => {clearErrors(); handleSubmit(onSubmit)(event)}}>
					<Col>
						<Controller 
							control={control}
							name="new_password1"
							rules={{ required: true, minLength: 8 }}
							render={({ field: { onChange, onBlur, value, ref } }) => (
								<Form.Group className="mb-3" controlId="formBasicPassword">
									<Form.Label >Password</Form.Label>
									<Form.Control type="password" placeholder="Password" onChange={onChange} />
									{errors.new_password1 && errors.new_password1.type==="required" && <span style={{color: "red" }}>Questo campo è obbligatorio</span>}
									{errors.new_password1 && errors.new_password1.type==="minLength" && <span style={{color: "red" }}>Lunghezza minima 8 caratteri</span>}
								</Form.Group>
							)}
						/>	

						<Controller 
							control={control}
							name="new_password2"
							rules={{ required: true, minLength: 8 }}
							render={({ field: { onChange, onBlur, value, ref } }) => (
								<Form.Group className="mb-3" controlId="formBasicPassword">
									<Form.Label >Password</Form.Label>
									<Form.Control type="password" placeholder="Reinserisci password" onChange={onChange} />
									{errors.new_password2 && errors.new_password2.type==="required" && <span style={{color: "red" }}>Questo campo è obbligatorio</span>}
									{errors.new_password2 && errors.new_password2.type==="minLength" && <span style={{color: "red" }}>Lunghezza minima 8 caratteri</span>}
								</Form.Group>
							)}
						/>	
						{errors.server_error && <span style={{color: "red" }}>{errors.server_error.message}</span>}
					</Col>
					<Button variant="primary" type="submit">
						Invio
					</Button>
				</Form>
			</Container>
			) : (
				<Container className="d-flex justify-content-center mt-5 mb-5">
				<Alert variant='success' >
					La password è stata modificata con successo
				</Alert>
			</Container>
			)}
			<Footer/>
			</div>
		</>
	)
}

export default ResetPasswordConfirm