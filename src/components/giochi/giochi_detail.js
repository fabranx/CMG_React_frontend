import './giochi_detail.css'
import {useState, useEffect, useContext, useMemo} from 'react'
import {useLocation, useParams} from 'react-router-dom'
import { Container, Image, Col, Row } from 'react-bootstrap'
import { client, requestsWithTokenHandler } from '../../Client'
import Loading from '../loadingpage/loadingpage'
import NotFound from '../not_found/notfound'
import CustomCarousel from '../custom_carousel/custom_carousel'
import placeholder from '../images/placeholder.png'
import {LoginContext} from '../context'
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar'
import { DateTime } from 'luxon'
import 'react-circular-progressbar/dist/styles.css';
import ReviewField from '../input_review_field/review_field'
import ReviewsList from '../users_reviews_list/reviewsList'
import Footer from '../footer/footer'


function GiochiDetail()
{
  let {igdbID} = useParams()
  const [isDataFetched, setDataFetched] = useState(false)
  const [gameInfo, setGameInfo] = useState({})
  const [fetchError, setFetchError] = useState(false)
  const {isLoggedIn, setIsLoggedIn} = useContext(LoginContext)

  const url = '//images.igdb.com/igdb/image/upload/t_cover_big/'
  const [vote, setVote] = useState(null)
  const [favourite , setFavourite] = useState(false)
  const [textReview, setTextReview] = useState('')

  const [usersReviews, setUsersReviews] = useState([])

  const [userReviewGameData, setUserReviewGameData] = useState(null)

  const [formSuccessfullySubmit, setFormSuccessfullySubmit] = useState(false)
  const [formSubmitError, setFormSubmitError] = useState(false)

  const [reload, setReload] = useState(false)

  useEffect(() => {
    client.GameInfo(igdbID)
    .then(res => {
      setGameInfo(res.data[0])
      setDataFetched(true)
    })
    .catch(err => {
      setFetchError(err?.response?.data)
      setDataFetched(true)
    })

    client.getReviewsByGameId(igdbID)
    .then(res =>{
      setUsersReviews(res.data.filter(review => review.author !== client.pk))
    })
    .catch(err => console.log(err))

    if(isLoggedIn){
      client.getGamesByUser(client.username)
      .then(res => {
        // filtra tramite le recensioni dell'utente ID e restituisce solo il solo primo elemento essendo ID univoco
        let userReviewData = res.data.filter(game => game.gameId === Number(igdbID))[0]
        if(userReviewData)  // se esiste un recensione per il film avente id = tmdbID
        {
          setUserReviewGameData(userReviewData) 
          setVote(userReviewData.rating)
          setFavourite(userReviewData.favourite)
          setTextReview(userReviewData.review)
        }
      })
      .catch(err => console.log(err))
    }
  }, [igdbID , reload, isLoggedIn])

  const location = useLocation()
  useEffect(() => {
    // 'aggiorna' la pagina quando cambia l'indirizzo (gameId)
    setDataFetched(false)
    setVote(null)
    setGameInfo({})
    setTextReview('')
    setFavourite(false)
    setUserReviewGameData(null)
    setFormSuccessfullySubmit(false)

  }, [location])

  function onVoteChange(e){
    setVote(e.target.value)
  }

  function onTextReviewChange(e){
    setTextReview(e.target.value)
  }

  function onFormSubmit(e){
    e.preventDefault()
    let formdata = new FormData()
    formdata.append('author', client.pk)
    formdata.append('title', gameInfo.name)
    formdata.append('gameId', gameInfo.id)
    formdata.append('review', textReview)
    formdata.append('rating', vote)
    formdata.append('favourite', favourite)

    const submitFunction = () => {
      if(userReviewGameData)
      {
        formdata.append('id', userReviewGameData.id)
        client.putGameReview(formdata, userReviewGameData.id)
        .then(e => {
          setFormSuccessfullySubmit(true)
          setFormSubmitError(false)
        })
        .catch(err => {
          setFormSuccessfullySubmit(false)
          setFormSubmitError(true)
        })
      }
      else{
        client.postGameReview(formdata)
        .then(e => {
          setFormSuccessfullySubmit(true)
          setFormSubmitError(false)
          setReload(!reload)  // tramite useEffect aggiorna il componente in modo che si ottiene l'id della recensione così da evitare la doppia recensione dello stesso titolo

        })
        .catch(err => {
          setFormSuccessfullySubmit(false)
          setFormSubmitError(true)
        }) 
      }
    }

    const errorOnRefreshToken = () => {
      setFormSuccessfullySubmit(false)
      setFormSubmitError(true)

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

    requestsWithTokenHandler(submitFunction, errorOnRefreshToken)

  }

  
  function circularBarColor(rating){
    if(rating >= 7)
      return ' #0aff2c' // green
    else if(rating >= 5.5 && rating < 7)
      return ' #ebeb28' // yellow
    else return ' #ff3c28' // red
  }
  const memoizedBarColor = useMemo(() => circularBarColor(gameInfo.rating/10), [gameInfo.rating])


  function unixDateTime_ToString(unixDateTime){
    let datetimeObj = DateTime.fromSeconds(parseInt(unixDateTime))
    return datetimeObj.toLocaleString(DateTime.DATE_SHORT)
  }
  const memoizedStringDateTime = useMemo(() => unixDateTime_ToString(gameInfo.first_release_date), [gameInfo.first_release_date])

  return(
    <div className='background-giochi-detail'>
      {!isDataFetched ? <Loading/> : 
        (<>
          {!fetchError ? 
            (<>
              <Container className='mt-5 mb-5'>
                <h2 className='text-center fw-bold mb-4'>{gameInfo.name}</h2>
                <Container className='d-flex justify-content-center'>
                  <Image rounded className='giochi-detail__poster' src={
                    gameInfo?.cover?.image_id ? url+gameInfo?.cover?.image_id+'.jpg' : placeholder
                    }></Image> 
                </Container>
                
                {isLoggedIn ? (
                  <ReviewField 
                    onFormSubmit={onFormSubmit}
                    vote = {vote}
                    onVoteChange = {onVoteChange}
                    setFavourite = {setFavourite}
                    favourite = {favourite}
                    onTextReviewChange = {onTextReviewChange}
                    textReview = {textReview}
                    formSuccessfullySubmit = {formSuccessfullySubmit}
                    formSubmitError = {formSubmitError}
                  />
                ) : (<p className='text-center mt-3'>Accedi per lasciare una valutazione</p>)}

                <Container className='giochi-detail__descrizione mb-5 mt-5'>
                  <h4 className='text-center fw-bold mt-1'>Informazioni</h4>
                  <hr style={{color:'red', opacity:'0.75', marginTop:'0', height:'1px'}}></hr>
                  <Container className='d-md-flex flex-wrap justify-content-center'>
                    
                    <Container className='mt-2'>
                      <Row md='auto' className='justify-content-center'>
                        <div className='p-2 giochi-detail__infoWidth'>
                          <Col className='text-center fw-bold'>Data di rilascio</Col>
                          <Col className='text-center'>{gameInfo.first_release_date && memoizedStringDateTime}</Col>
                        </div>
                      </Row>
                    </Container>

                    <Container className='mt-2'>
                      <Row md='auto' className='justify-content-around'>
                        {gameInfo.involved_companies && gameInfo.involved_companies.map(company =>(
                          <div className='p-2 giochi-detail__infoWidth' key={company.id}>
                            <Col className='text-center fw-bold'>{company.company.name}</Col>
                            {company.developer  && (<Col className='text-center fw-light'>Sviluppatore</Col>)}
                            {company.publisher  && (<Col className='text-center fw-light'>Publisher</Col>)}
                            {company.porting    && (<Col className='text-center fw-light'>Porting</Col>)}
                            {company.supporting && (<Col className='text-center fw-light'>Supporto</Col>)}
                          </div>
                        ))}
                      </Row>
                    </Container>

                    <Container className='text-center'>
                        <Row md='auto' className='justify-content-center mb-3' >
                          <div className='p-2 giochi-detail__infoWidth'>
                            <Col>Punteggio Medio</Col>
                            <Col>
                              {gameInfo.rating ? 
                                ( 
                                  <Container className='giochi-detail__circularbar_size mt-3'>
                                    <CircularProgressbar 
                                      value={(gameInfo.rating/10).toFixed(1)} 
                                      text={(gameInfo.rating/10).toFixed(1)} 
                                      minValue={0} 
                                      maxValue={10}
                                      strokeWidth={5}
                                      styles={buildStyles({
                                        pathColor: memoizedBarColor,
                                        textColor: memoizedBarColor,
                                        trailColor: '#999',
                                        textSize:'28px' 
                                    })}
                                    />
                                  </Container>
                                ) : 
                                ( 
                                  <Container className='giochi-detail__circularbar_size mt-3'>
                                    <CircularProgressbar 
                                      value={0} 
                                      text='ND' 
                                      minValue={0} 
                                      maxValue={10}
                                      strokeWidth={5}
                                      styles={buildStyles({
                                        pathColor: '#999',
                                        textColor: '#999',
                                        trailColor: '#999',
                                        textSize:'28px' 
                                      })}
                                    />
                                  </Container>
                                )
                              }
                            </Col>
                          </div>
                        </Row>
                    </Container>
                  </Container>
                </Container>

                <Container className='giochi-detail__descrizione mb-5 mt-5'>
                  <h4 className='text-center fw-bold mt-1'>Piattaforme</h4>
                  <hr style={{color:'red', opacity:'0.75', marginTop:'0', height:'1px'}}></hr>
                  <Container className='p-2'>
                    <Row md='auto' className='justify-content-center mb-2'>
                        {gameInfo.platforms && gameInfo.platforms.map(platform => (
                          <Col key={platform.id} style={{width:'150px'}} className='text-center'>• {platform.name}</Col>
                        ))}
                    </Row>
                  </Container>
                </Container>

                <Container className='giochi-detail__descrizione mb-5 mt-5'>
                  <h4 className='text-center fw-bold mt-1'>Descrizione</h4>
                  <hr style={{color:'red', opacity:'0.75', marginTop:'0', height:'1px'}}></hr>
                  <p>{gameInfo.summary && gameInfo.summary}</p>
                </Container>
                {
                  gameInfo.storyline && (
                    <Container className='giochi-detail__descrizione mb-5 mt-5'>
                      <h4 className='text-center fw-bold mt-1'>Trama</h4>
                      <hr style={{color:'red', opacity:'0.75', marginTop:'0', height:'1px'}}></hr>
                      <p>{gameInfo.storyline}</p>
                    </Container>
                  )
                }
              </Container>


              <Container fluid className='mt-5'>
                <p className='text-center fw-bold fs-4'>Giochi Simili</p>
                {gameInfo?.similar_games && 
                  <CustomCarousel keyStart='Giochi Simili' dataCategory='Games' data={gameInfo?.similar_games}/>
                }
              </Container>

              <ReviewsList  reviews={usersReviews}/>

            </>)
          : ( <NotFound/> )
          }
        </>)
      }
      <Footer/>
    </div>
  )
}


export default GiochiDetail