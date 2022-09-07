import './reset_password.css'
import {Container, Form, Col, Button, Alert} from 'react-bootstrap'
import {useForm, Controller } from "react-hook-form"
import {LoginContext} from "../context"
import {client} from "../../Client"
import React, { useState } from 'react'
import {Redirect} from 'react-router-dom'
import Footer from '../footer/footer'


function ResetPassword() {
  const {isLoggedIn} = React.useContext(LoginContext)
  const [isEmailSend, setIsEmailSend] = useState(false)
  const [email, setEmail] = useState('')
  const { handleSubmit, clearErrors, control, formState: { errors }} = useForm();
  const onSubmit = (data) => {
    setEmail(data.email)
    client.passwordReset(data.email)
    .then(res => {
      setIsEmailSend(true)
    })
    .catch(err => console.log(err))
  }
  return (
    <>
      {isLoggedIn ? <Redirect to="/"/> : null}
      <div className="background-reset-password">
        <Container className='mt-5'>
          <h3 className="text-center fw-bold mt-5">Reset Password</h3>
          <p className="text-center">Inserisci email per reimpostare la tua password</p>
        </Container>
        {!isEmailSend ? (
          <Container className="d-flex align-items-center justify-content-center mt-5 mb-5">
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
                <Button variant="primary" type="submit">
                  Invio
                </Button>
              </Col>
            </Form>
          </Container>
        ) : 
        (
          <Container className="d-flex justify-content-center mt-5 mb-5">
            <Alert variant='success' >
             È stata inviata un email all'indirizzo "{email}". Clicca sul link all'interno per ripristinare la password
            </Alert>
          </Container>
        )}
      <Footer/>
      </div>
    </>
  )
}

export default ResetPassword