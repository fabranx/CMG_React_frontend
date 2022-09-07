import {Modal, Button, Form} from 'react-bootstrap'
import {LoginContext} from "../context"
import {useContext, useState} from 'react'
import {useForm, Controller } from "react-hook-form"
import { client, requestsWithTokenHandler } from '../../Client'
import { useHistory } from 'react-router-dom'
import './paginaProfilo_settings.css'
import 'bootstrap/dist/css/bootstrap.min.css';


function Settings(props) {
  const {isLoggedIn, setIsLoggedIn} = useContext(LoginContext)
  const { 
    handleSubmit,getValues, setError, clearErrors, reset, control,formState: { 
      errors, isDirty 
    }} = useForm();

  const { 
    handleSubmit: handleSubmitPsw, setError: setErrorPsw, clearErrors: clearErrorsPsw, 
    reset: resetPsw, control: controlPsw, formState: { 
      errors: errorsPsw, isDirty: isDirtyPsw
    }} = useForm();

  let history = useHistory()

  const errorOnRefreshToken = () => {
    client.logout()
    .then((res) => {
      setIsLoggedIn(false)
      client.deleteUserData()
    })
    .catch((error) => {
      setIsLoggedIn(false)
      client.deleteUserData()
    })
  }

  const onSubmit = (data) => {
    const submitFunction = () => {
      let formData = new FormData()
      let name = data.username || props.userdata.username // data.username se viene passato il valore del form (se modificato) altrimenti considera lo username attuale
      formData.append('username', name)
      let contentType = 'application/json'
      // se è selezionata nuova immagine e se non è selezionato il checkbox per ripristinare l'immagine di default
      if(data.image && !data.checkBoxDefaultImage)
      {
        formData.append('image', data.image)
        contentType = 'multipart/form-data'
      }
      // se è selezionato il checkbox per ripristinare l'immagine di default
      if(data.checkBoxDefaultImage)
      {
        formData.append('image', '')
        contentType = 'application/json'
      }
      reset()
      client.putProfileSettings(formData, contentType)
      .then(res => {
        history.push(`/profilo/${res.data.username}`)
        window.location.reload()
      })
      .catch(error => {
        for(const key in error.response.data){
          setError("server_error", {type: "focus", message: error.response?.data[key]}, { shouldFocus: true });
        }
      })
    }

    requestsWithTokenHandler(submitFunction, errorOnRefreshToken) 
  } 

  const [isPasswordChanged, setIsPasswordChanged] = useState(false)

  const onPasswordChangeSubmit = (data) => {

    const passwordChangeSubmit = () => {
      client.passwordChange(data)
      .then(res => {
        if(res.status === 200)
        {
          setIsPasswordChanged(true)
          setTimeout(() => {
            setIsLoggedIn(false)          
            client.deleteUserData()
            client.logout().catch((err) => {})
          }, 3000)
        }
      })
      .catch(error => {
        for(const key in error.response.data){
          setErrorPsw("server_error",{type: "focus", message: error.response?.data[key]}, { shouldFocus: true } )
        }
      })
    }

    requestsWithTokenHandler(passwordChangeSubmit, errorOnRefreshToken)
  }

  return (
    <>
    {(isLoggedIn && props.isloggeduserprofile) ? (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        fullscreen='lg-down'
      >
        <Modal.Header closeButton closeVariant='white'  className='settings-modal p-3'> 
          <Modal.Title>
             Impostazioni Profilo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body  className='settings-modal p-5'> 
          <Modal.Title className='mb-3'>
             Cambia immagine di profilo e username
          </Modal.Title>
          <Form onSubmit={event => {clearErrors(); handleSubmit(onSubmit)(event)}}>
            <Controller       
                name="image"
                control={control}
                defaultValue=''
                render={({field: {onChange}}) => (
                  <Form.Group className="mb-3">
                    <Form.Label>Seleziona immagine di profilo</Form.Label>
                    <Form.Control onChange={e => {
                        onChange(e.target.files[0])}
                      }
                      type="file"
                      size="lg"
                    />
                  </Form.Group>)} 
            />
            <Controller 
              name="checkBoxDefaultImage"
              defaultValue={false}
              control={control}
              render={({field: {onChange}}) => (
                <Form.Group className="mb-3">
                   <Form.Check onChange={onChange} defaultChecked={false} type="checkbox" label="Seleziona per eliminare l'immagine (verrà usata l'immagine di default)" />
                </Form.Group>
              )} 
            />
            <Controller
                name="username"
                defaultValue={props.userdata.username}
                control={control}
                render={({field: {onChange}}) => (
                  <Form.Group className="mb-3">
                    <Form.Label>Modifica nome Utente</Form.Label>
                    <Form.Control onChange={onChange} type='text' defaultValue={getValues("username")} size="lg" />
                  </Form.Group>)}
            />
            <Button disabled={!isDirty} variant="primary" type="submit">
              Conferma
            </Button>
            {errors.server_error && <span className='d-flex justify-content-center text-danger'>Errore: "{errors.server_error.message}"</span>} 
          </Form>

          <hr/>

          <Form onSubmit={event => {clearErrorsPsw(); handleSubmitPsw(onPasswordChangeSubmit)(event)}}>
            <Modal.Title className='mt-3 mb-3'>
              Modifica Password
            </Modal.Title>
            <Controller 
              control={controlPsw}
              name="old_password"
              rules={{ required: true, minLength: 8 }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label >Vecchia Password</Form.Label>
                  <Form.Control type="password" placeholder="Inserisci Password Attuale" onChange={onChange} />
                  {errorsPsw.old_password && errorsPsw.old_password.type==="required" && <span style={{color: "red" }}>Questo campo è obbligatorio</span>}
                  {errorsPsw.old_password && errorsPsw.old_password.type==="minLength" && <span style={{color: "red" }}>Lunghezza minima 8 caratteri</span>}
              </Form.Group>
              )}
            />
            <Controller 
              control={controlPsw}
              name="new_password1"
              rules={{ required: true, minLength: 8 }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label >Nuova Password</Form.Label>
                  <Form.Control type="password" placeholder="Inserisci Nuova Password" onChange={onChange} />
                  {errorsPsw.new_password1 && errorsPsw.new_password1.type==="required" && <span style={{color: "red" }}>Questo campo è obbligatorio</span>}
                  {errorsPsw.new_password1 && errorsPsw.new_password1.type==="minLength" && <span style={{color: "red" }}>Lunghezza minima 8 caratteri</span>}
                </Form.Group>
              )}
            />	
            <Controller 
              control={controlPsw}
              name="new_password2"
              rules={{ required: true, minLength: 8 }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label >Nuova Password</Form.Label>
                  <Form.Control type="password" placeholder="Reinserisci Nuova Password" onChange={onChange} />
                  {errorsPsw.new_password2 && errorsPsw.new_password2.type==="required" && <span style={{color: "red" }}>Questo campo è obbligatorio</span>}
                  {errorsPsw.new_password2 && errorsPsw.new_password2.type==="minLength" && <span style={{color: "red" }}>Lunghezza minima 8 caratteri</span>}
                </Form.Group>
              )}
            />
            <Button disabled={!isDirtyPsw} variant="primary" type="submit">
              Conferma
            </Button>
            {errorsPsw.server_error && <span className='d-flex justify-content-center text-danger'>Errore: "{errorsPsw.server_error.message}"</span>} 
            {isPasswordChanged ? 
              (
                <>
                  <span className='d-flex justify-content-center text-success'>
                    La password è stata correttamente cambiata
                  </span>
                </>
              )
               : null}
          </Form>
        </Modal.Body>
        <Modal.Footer  className='settings-modal p-4'>
          <Button variant="outline-danger" onClick={() => {
              reset() // reimposta i valori del form alla chiusura
              resetPsw()
              props.onHide()
            }}>Chiudi</Button>
        </Modal.Footer>
      </Modal>) : (<h2>Errore utente non loggato</h2>)}
    </>
    
  );
}


export default Settings