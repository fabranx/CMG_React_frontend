import { useEffect, useState, useContext } from "react"
import axios from 'axios'
import {Container, Tabs, Tab} from 'react-bootstrap'
import { client, requestsWithTokenHandler } from '../../Client'
import './paginaProfilo_Tab.css'
import TabReviewsItems from './paginaProfilo_Tab_Items'
import Loading from "../loadingpage/loadingpage"
import 'bootstrap/dist/css/bootstrap.min.css'
import {LoginContext} from "../context"



function PaginaProfiloReviewsTab({username}){

  const {setIsLoggedIn} = useContext(LoginContext)

  const [reviewFetchedData, setReviewFetchedData] = useState(false)
  const [film, setFilm] = useState([])
  const [videogiochi, setVideogiochi] = useState([])
  const [musica, setMusica] = useState([])

  useEffect(() => {

    const getReviews = () => {
      const getmovies = client.getMoviesByUser(username)
      const getgames = client.getGamesByUser(username)
      const getmusic = client.getMusicByUser(username)
      
      axios.all([getmovies,getgames, getmusic])
      .then(axios.spread((...responses) => {
        setFilm(responses[0].data)
        setVideogiochi(responses[1].data)
        setMusica(responses[2].data)
        setReviewFetchedData(true)
      }))
      .catch(err => {setReviewFetchedData(true)})
    }

    const errorOnRefreshToken = () => {
      setIsLoggedIn(false)
      client.deleteUserData()
      client.logout().catch((err) => {})
    }
    requestsWithTokenHandler(getReviews, errorOnRefreshToken)

    return () => { 
      setReviewFetchedData(false)
      setVideogiochi([])
      setFilm([])
      setMusica([])
    }
  }, [setIsLoggedIn, username])

  return(
    <Container className="mb-5">
    <p>Recensioni</p>
    {reviewFetchedData ? (
      <Tabs
      defaultActiveKey="cinema"
      id="reviews-tab"
      className="mb-3"
      justify
      variant='tabs'
    >
    <Tab eventKey='cinema' title='Cinema'>
      <TabReviewsItems reviews={film} category='Cinema'/>
    </Tab>
    <Tab eventKey='musica' title='Musica'>
      <TabReviewsItems reviews={musica} category='Musica'/>
    </Tab>
    <Tab eventKey='videogiochi' title='Videogiochi'>
      <TabReviewsItems reviews={videogiochi} category='Videogiochi'/>
    </Tab>    
    </Tabs>
    ) : <Loading/>}

  </Container>
  )
}

export default PaginaProfiloReviewsTab