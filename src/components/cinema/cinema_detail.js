import './cinema_detail.css'
import {useState, useEffect, useContext, useMemo} from 'react'
import {useLocation, useParams} from 'react-router-dom'
import { Container, Image, Row, Col } from 'react-bootstrap'
import { client, requestsWithTokenHandler } from '../../Client'
import Loading from '../loadingpage/loadingpage'
import NotFound from '../not_found/notfound'
import CustomCarousel from '../custom_carousel/custom_carousel'
import placeholder from '../images/placeholder.png'
import {LoginContext} from '../context'
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css';
import ReviewField from '../input_review_field/review_field'
import ReviewsList from '../users_reviews_list/reviewsList'
import Footer from '../footer/footer'


function CinemaDetail()
{
  let {tmdbID} = useParams()
  const [isDataFetched, setDataFetched] = useState(false)
  const [movieInfo, setMovieInfo] = useState({})
  const [fetchError, setFetchError] = useState(false)
  const {isLoggedIn, setIsLoggedIn} = useContext(LoginContext)

  const url = 'https://www.themoviedb.org/t/p/w780'
  const jobs = {'Producer': 'Produttore', 'Writer': 'Sceneggiatore', 'Director': 'Regista'}
  const [vote, setVote] = useState(null)
  const [favourite , setFavourite] = useState(false)
  const [textReview, setTextReview] = useState('')

  const [usersReviews, setUsersReviews] = useState([])

  const [userReviewMovieData, setUserReviewMovieData] = useState(null)

  const [formSuccessfullySubmit, setFormSuccessfullySubmit] = useState(false)
  const [formSubmitError, setFormSubmitError] = useState(false)

  useEffect(() => {
    client.MovieInfo(tmdbID)
    .then(res => {
      setMovieInfo(res.data)
      setDataFetched(true)
    })
    .catch(err => {
      setFetchError(err.response.data)
      setDataFetched(true)
    })

    client.getReviewsByMovieId(tmdbID)
    .then(res =>{
      setUsersReviews(res.data.filter(review => review.author != client.pk))
    })
    .catch(err => console.log(err))

    if(isLoggedIn){
      client.getMoviesByUser(client.username)
      .then(res => {
        // filtra tramite le recensioni dell'utente ID e restituisce solo il solo primo elemento essendo ID univoco
        let userReviewData = res.data.filter(movie => movie.movieId === Number(tmdbID))[0]
        if(userReviewData)  // se esiste un recensione per il film avente id = tmdbID
        {
          setUserReviewMovieData(userReviewData) 
          setVote(userReviewData.rating)
          setFavourite(userReviewData.favourite)
          setTextReview(userReviewData.review)
        }
      })
      .catch(err => console.log(err))

    }
  }, [tmdbID])

  const location = useLocation()
  useEffect(() => {
    // 'aggiorna' la pagina quando cambia l'indirizzo (movieId)
    setDataFetched(false)
    setVote(null)
    setMovieInfo({})
    setTextReview('')
    setFavourite(false)
    setUserReviewMovieData(null)
    setFormSuccessfullySubmit(false)

  }, [location])

  function circularBarColor(rating){
    if(rating >= 7)
      return ' #0aff2c' // green
    else if(rating >= 5.5 && rating < 7)
      return ' #ebeb28' // yellow
    else return ' #ff3c28' // red
  }

  const memoizedBarColor = useMemo(() => circularBarColor(movieInfo?.vote_average), [movieInfo?.vote_average])

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
    formdata.append('title', movieInfo.title)
    formdata.append('movieId', movieInfo.id)
    formdata.append('review', textReview)
    formdata.append('rating', vote)
    formdata.append('favourite', favourite)

    const submitFunction = () => {
      if(userReviewMovieData)
      {
        formdata.append('id', userReviewMovieData.id)
        client.putMovieReview(formdata, userReviewMovieData.id)
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
        client.postMovieReview(formdata)
        .then(e => {
          setFormSuccessfullySubmit(true)
          setFormSubmitError(false)
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

  return(
    <div className='background-cinema-detail'>
      {!isDataFetched ? <Loading/> : 
        (<>
          {!fetchError ? 
            (<>
              <Container className='mt-5 mb-5'>
                <h2 className='text-center fw-bold mb-4'>{movieInfo.title}</h2>
                <Container className='d-flex justify-content-center'>
                  <Image rounded className='cinema-detail__poster' src={
                    movieInfo.poster_path ? url+movieInfo.poster_path : placeholder
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

                <Container className='cinema-detail__descrizione mb-5 mt-5'>
                  <h4 className='text-center fw-bold mt-1'>Informazioni</h4>
                  <hr style={{cmovieolor:'red', opacity:'0.75', marginTop:'0', height:'1px'}}></hr>
                  <Container className='d-md-flex flex-wrap justify-content-md-center'>
                    
                    <Container className='mt-2'>
                      <Row md='auto' className='justify-content-center'>
                        <div className='p-2 cinema-detail__infoWidth'>
                          <Col className='text-center fw-bold'>Data di rilascio</Col>
                          <Col className='text-center'>{movieInfo.release_date ? movieInfo.release_date : '-'}</Col>
                        </div>
                      </Row>
                      {/* <p className='p-2'>{movieInfo.release_date && ('Data di rilascio: ' + movieInfo.release_date)}</p>
                      <p className='p-2'>{movieInfo.runtime && (`Durata: ${movieInfo.runtime} m`)}</p> */}
                    </Container>

                    <Container className='mt-2'>
                      <Row md='auto' className='justify-content-around'>
                        <div className='p-2 cinema-detail__infoWidth'>
                          <Col className='text-center fw-bold'>Paesi di Produzione</Col>
                          <Col className='text-center'>{movieInfo.production_countries.length > 0 ? movieInfo.production_countries.map(country => country.name).join(' - ') : ' - '}</Col>
                        </div>
                        <div className='p-2 cinema-detail__infoWidth'>
                          <Col className='text-center fw-bold'>Genere</Col>
                          <Col className='text-center'>{movieInfo.genres.length > 0 ? movieInfo.genres.map(genere => genere.name).join(' - ') : ' - '}</Col>
                        </div>
                      </Row>

                    </Container>
                    <Container className='text-center'>
                      {/* <div className='p-2 cinema-detail__infoWidth'> */}
                        <Row md='auto' className='justify-content-center mb-3' >
                          <div className='p-2 cinema-detail__infoWidth'>
                            <Col>Punteggio Medio</Col>
                            <Col>
                              {movieInfo.vote_average ? 
                                ( 
                                  // <p className={`cinema-detail__badge_${badgeColor(movieInfo.vote_average)}`}>{movieInfo.vote_average}</p>
                                  <Container className='cinema-detail__circularbar_size mt-3'>
                                    <CircularProgressbar 
                                      value={(movieInfo.vote_average).toFixed(1)} 
                                      text={(movieInfo.vote_average).toFixed(1)} 
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
                                  <Container className='cinema-detail__circularbar_size mt-3'>
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

                <Container className='cinema-detail__descrizione'>
                  <h4 className='text-center fw-bold mt-1'>Descrizione</h4>
                  <hr style={{color:'red', opacity:'0.75', marginTop:'0', height:'1px'}}></hr>
                  <p>{movieInfo.overview && movieInfo.overview}</p>
                </Container>

                <Container className='cinema-detail__descrizione mt-5'>
                  <h4 className='text-center fw-bold mt-1'>Persone</h4>
                  <hr style={{color:'red', opacity:'0.75', marginTop:'0', height:'1px'}}></hr>
                  <Container className='d-md-flex justify-content-md-center'>
                    <div className='cast-width p-2'>
                      <h4 className='text-center'>Attori</h4>
                      <hr style={{color:'darkgray', opacity:'0.75', marginTop:'0', height:'1px'}}></hr>
                      <div>
                        <ul>
                          {movieInfo.credits.cast.slice(0,10).map((actor) => {
                            if(actor.name.length > 0 && actor.character.length > 0){
                              return (
                                <li key={actor.name+actor.credit_id}>
                                  {actor.name} - {actor.character}
                                </li>
                              )
                            } 
                            else return null
                            }
                          )}
                        </ul>
                      </div>
                    </div>
                    <div className='cast-width p-2'>
                      <h4 className='text-center'>Produzione</h4>
                      <hr style={{color:'darkgray', opacity:'0.75', marginTop:'0', height:'1px'}}></hr>
                      <div>
                        <ul>
                          {movieInfo.credits.crew.map(crew => {
                            if(Object.keys(jobs).includes(crew.job)){
                              return (
                                <li key={crew.name+crew.credit_id}>
                                  {crew.name} - ({jobs[crew.job]})
                                </li>
                              )
                            }
                            else return null
                          })}
                        </ul>
                      </div>
                    </div>
                  </Container>
                </Container>  
              </Container>

              <Container fluid className='mt-5'>
                <p className='text-center fw-bold fs-4'>Film Simili</p>
                <CustomCarousel keyStart='Film Simili' dataCategory='Movies' data={movieInfo.recommendations.results}/>
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


export default CinemaDetail