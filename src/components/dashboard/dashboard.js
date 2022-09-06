import './dashboard.css'
import { Redirect } from "react-router-dom"
import React from 'react'
import {LoginContext} from "../context"
import {Container, Row, Col} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import CardUltimeRecensioni from './card_recensioni'
import { useEffect, useState } from 'react'
import {client} from "../../Client"
import Loading from "../loadingpage/loadingpage"
import axios from 'axios'
import Footer from '../footer/footer'


function Dashboard() {
  const {isLoggedIn} = React.useContext(LoginContext)
  const [film, setFilm] = useState([])
  const [videogiochi, setVideogiochi] = useState([])
  const [musica, setMusica] = useState([])
  // const [libri, setLibri] = useState([])
  const [fetchedData, setFetchedData] = useState(false)

  useEffect(() => {
    if(isLoggedIn)
    {
      const getmovies = client.getMoviesByUser(client.username)
      const getgames = client.getGamesByUser(client.username)
      const getmusic = client.getMusicByUser(client.username)
      
      axios.all([getmovies,getgames, getmusic])
      .then(axios.spread((...responses) => {
        setFilm(responses[0].data)
        setVideogiochi(responses[1].data)
        setMusica(responses[2].data)
        setFetchedData(true)
      }))
      .catch(err => setFetchedData(true))

    }
  }, [isLoggedIn])

  return(
    <>
      <div className="background-dashboard">
      {isLoggedIn ? null : <Redirect to='/login'/>}
      {!fetchedData ? 
        <Loading/> : 
        <>
          <Container className='mt-5'>
            <h1 className='mb-4 text-center'>Dashboard</h1>
            <h4 className='mb-3'>Ultime Recensioni</h4>
            <Row>
              <Col md='6' className='mb-4'>
                <CardUltimeRecensioni categoria="Cinema" reviews={film} setreviews={setFilm} />
              </Col>
              <Col md='6' className='mb-4'>
                <CardUltimeRecensioni categoria="Videogiochi" reviews={videogiochi} setreviews={setVideogiochi}/>
              </Col>
            </Row> 
            <Row className='d-flex justify-content-center'>
              <Col md='6' className='mb-4'>
                <CardUltimeRecensioni categoria="Musica" reviews={musica} setreviews={setMusica}/>
              </Col>
              {/* <Col md='6' className='mb-4'>
                <CardUltimeRecensioni categoria="Libri" reviews={libri}/>
              </Col> */}
            </Row>  
          </Container>
          <Footer/>
        </>    
      }
      </div>
    </>
  )

}

export default Dashboard