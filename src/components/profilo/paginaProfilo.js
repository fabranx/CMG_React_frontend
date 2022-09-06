import {useParams, Redirect} from 'react-router-dom'
import React from 'react'
import {useEffect, useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './paginaProfilo.css'
import {Container, Image, Button, Figure, Col, Row, Tabs, Tab} from 'react-bootstrap'
import {GearFill} from 'react-bootstrap-icons'
import {LoginContext} from "../context"
import { client, requestsWithTokenHandler } from '../../Client'
import NotFound from '../not_found/notfound'
import Loading from '../loadingpage/loadingpage'
import Settings from './paginaProfilo_settings'
import PaginaProfiloReviewsTab from './paginaProfilo_Tab'
import Footer from '../footer/footer'


function Profilo() {
  const {isLoggedIn, setIsLoggedIn} = React.useContext(LoginContext)
  const [error, setError] = useState()
  const [isLoggedUserProfile, setLoggedUserProfile] = useState(false)
  const [userData, setUserData] = useState()
  const [fetchedData, setFetchedData] = useState(false)
  const [showSettings, setShowSettings] = useState(false)



  let {username} = useParams()

  useEffect(() => {

    const getProfileInfo = () => {
      client.getProfile(username)
      .then(res => {
        setUserData(res.data)
  
        if(client.username === res.data.username)
          setLoggedUserProfile(true)
        
        setFetchedData(true)
      })
      .catch(err => {
        if(err.response){
          setError(err.response.data.detail)
          setFetchedData(true)
        }
        else
        {
          setError("Errore")
          setFetchedData(true)
        }
      })     
    }

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

    requestsWithTokenHandler(getProfileInfo, errorOnRefreshToken)
    

    return () => { // cleanup function unmount component
      setError()
      setUserData()
      setFetchedData(false)
      setShowSettings(false)
      setLoggedUserProfile(false)
    }
  }, [username])

  return(
      <>
          <div className='background-profilo'>

      {isLoggedIn ? null : <Redirect to='/login'/>}
      {!fetchedData ? <Loading/> :
        error ? 
          error === "Not found." ?
              <>
                <NotFound/>
              </>
            :
              <h2 className='d-flex align-items-center justify-content-center background'>
                {error}
              </h2>
         :
            <>
            <Container className='mb-5'>
              <Row>
                <Col className='mt-5'>
                  <h2>Profilo</h2>
                </Col>
                
                { isLoggedUserProfile ? 
                  <Col className='mt-5 d-flex justify-content-end'>  
                    <Button size='lg' variant='outline-dark' onClick={() => setShowSettings(true)} >
                      <GearFill className='settings-button-rotate' size={'1.5em'} />
                    </Button>
                  </Col> : null
                }
              </Row>
              <Figure className='immagine-profilo mx-auto d-block'>
                <Figure.Image as={Image}
                  className='immagine-profilo mx-auto d-block'
                  fluid={true} 
                  thumbnail={true}
                  roundedCircle={true} 
                  src={userData.image ? userData.image : null}
                />
                <Figure.Caption className='fs-1 fst-normal text-light text-center'>
                  {username}
                </Figure.Caption>
              </Figure>

              <Settings
                isloggeduserprofile={isLoggedUserProfile.toString()}
                userdata={userData}
                show={showSettings}
                onHide={() => setShowSettings(false)}
              />
            </Container>

            <PaginaProfiloReviewsTab username={username}/>

            <Footer/>
            </>
        }
          </div>

      </>
  )
}

export default Profilo