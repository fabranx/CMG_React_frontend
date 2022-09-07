import './musica_detail.css'
import {useState, useEffect, useContext, useMemo} from 'react'
import {useLocation, useParams} from 'react-router-dom'
import { Button, Container, Image, Row, Col} from 'react-bootstrap'
import { client, requestsWithTokenHandler } from '../../Client'
import Loading from '../loadingpage/loadingpage'
import NotFound from '../not_found/notfound'
import CustomCarousel from '../custom_carousel/custom_carousel'
import placeholder from '../images/placeholder.png'
import {LoginContext} from '../context'
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css';
import {Duration} from 'luxon'
import {Spotify} from 'react-bootstrap-icons'
import {Link} from 'react-router-dom'
import ReviewField from '../input_review_field/review_field'
import ReviewsList from '../users_reviews_list/reviewsList'
import Footer from '../footer/footer'



function MusicaDetail()
{
  let {albumID} = useParams()
  const [isDataFetched, setDataFetched] = useState(false)
  const [musicInfo, setMusicInfo] = useState({})
  const [fetchError, setFetchError] = useState(false)
  const {isLoggedIn, setIsLoggedIn} = useContext(LoginContext)

  const [vote, setVote] = useState(null)
  const [favourite , setFavourite] = useState(false)
  const [textReview, setTextReview] = useState('')

  const [usersReviews, setUsersReviews] = useState([])

  const [userReviewMusicData, setUserReviewMusicData] = useState(null)

  const [formSuccessfullySubmit, setFormSuccessfullySubmit] = useState(false)
  const [formSubmitError, setFormSubmitError] = useState(false)

  useEffect(() => {
    client.AlbumInfoSpotify(albumID)
    .then(res => {
      setMusicInfo(res.data)
      setDataFetched(true)
    })
    .catch(err => {
      setFetchError(err?.response?.data)
      setDataFetched(true)
    })

    client.getReviewsByAlbumId(albumID)
    .then(res =>{
      setUsersReviews(res.data.filter(review => review.author !== client.pk))
    })
    .catch(err => console.log(err))

    if(isLoggedIn){
      client.getMusicByUser(client.username)
      .then(res => {
        // filtra tramite le recensioni dell'utente ID e restituisce solo il solo primo elemento essendo ID univoco
        let userReviewData = res.data.filter(music => music.albumId === albumID)[0]
        if(userReviewData)  // se esiste un recensione per l'album avente id = albumID
        {
          setUserReviewMusicData(userReviewData) 
          setVote(userReviewData.rating)
          setFavourite(userReviewData.favourite)
          setTextReview(userReviewData.review)
        }
      })
      .catch(err => console.log(err))
    }
  }, [albumID, isLoggedIn])

  const location = useLocation()
  useEffect(() => {
    // 'resetta' la pagina quando cambia l'indirizzo (albumId)
    setDataFetched(false)
    setVote(null)
    setMusicInfo({})
    setTextReview('')
    setFavourite(false)
    setUserReviewMusicData(null)
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
    formdata.append('title', musicInfo.name)
    formdata.append('albumId', musicInfo.id)
    formdata.append('review', textReview)
    formdata.append('rating', vote)
    formdata.append('favourite', favourite)

    const submitFunction = () => {
      if(userReviewMusicData)
      {
        formdata.append('id', userReviewMusicData.id)
        client.putMusicReview(formdata, userReviewMusicData.id)
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
        client.postMusicReview(formdata)
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

  function circularBarColor(popularity){
    if(popularity >= 7)
      return ' #3cffff' // blue
    else if(popularity >= 4.0 && popularity < 7)
      return ' #0aff2c' // green
    else return ' #ebeb28' // yellow
  }

  const memoizedBarColor = useMemo(() => circularBarColor(musicInfo.popularity/10), [musicInfo.popularity])



  function album_duration(tracks){

    if(tracks && tracks.length > 0)
    {
      let duration_ms = tracks.reduce((previousValue, currentValue) => previousValue + currentValue.duration_ms, 0)
      let duration_object = Duration.fromMillis(duration_ms).shiftTo('minutes', 'seconds').toObject()

      return `${duration_object.minutes}m ${Math.round(duration_object.seconds)}s`
    }
  }

  const memoizedAlbumDuration = useMemo(() => album_duration(musicInfo?.tracks?.items), [musicInfo?.tracks?.items])

  function n_disc_album(tracks){
    if(tracks && tracks.length > 0)
    {
      let disc_tracks = {}
      tracks.map((track) => {
        if(!disc_tracks[track.disc_number]){
          disc_tracks[track.disc_number] = []
          disc_tracks[track.disc_number].push(track)
        }
        else{
          disc_tracks[track.disc_number].push(track)
        }    
        return true  // react warning array.prototype.map expects a return value from arrow function
      })

      return(
        <>
          {Object.keys(disc_tracks).map((key) => (
            <div key={key}>
              <h5 className='text-center'>Disco {key}</h5>
              {
                disc_tracks[key].map((track) => (
                <div key={track.id}>
                  <Row>
                    <Col sm className='d-flex align-items-center justify-content-sm-start justify-content-center'>{track.track_number} - {track.name}</Col>                        
                    <Col sm className='d-flex justify-content-center align-items-center'><audio controls src={track?.preview_url}></audio></Col>
                  </Row>
                  <hr style={{color:'grey', opacity:'0.5', marginTop:'0', height:'1px'}}></hr>
                </div>
              ))}
            </div>
          ))}
        </>
      )
    }
    else return null
  }

  const memoizedDiscTracks = useMemo(() => n_disc_album(musicInfo?.tracks?.items), [musicInfo?.tracks?.items])

  // function checkDuplicates(){
  //   const set = new Set(musicInfo['similar'])    
  //   console.log(musicInfo['similar'].length, set.size)

  //   if(musicInfo['similar'].length !== set.size)
  //   {
  //     console.log("DUPLICATI TROVATI")

  //   }
  // }

  return(
    <div className='background-musica-detail'>
      {!isDataFetched ? <Loading/> : 
        (<>
          {!fetchError ? 
            (<>
              <Container className='mt-5 mb-5'>
                <h2 className='text-center fw-bold mb-4'>{musicInfo.name}</h2>
                <div className='text-center fw-light mb-4'>{musicInfo.artists.map(artist => <h4 key={artist.id}>{artist.name}</h4>)}</div>

                <Container className='d-flex justify-content-center'>
                  <Image rounded className='musica-detail__poster' src={
                    musicInfo.images ? musicInfo.images[0].url : placeholder
                    }></Image> 
                </Container>
                <Container className='d-flex justify-content-center my-4'>
                  <Button size='sm' variant='success' as={Link} to={{pathname: musicInfo.external_urls.spotify}} target='_blank' className='musica-detail__banner-spotify m-1'>
                      Ascolta su Spotify {' '}
                      <Spotify/>
                  </Button>
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
                ) : (<p className='text-center mt-5'>Accedi per lasciare una valutazione</p>)}

                <Container className='musica-detail__descrizione mb-5 mt-5'>
                  <h4 className='text-center fw-bold mt-1'>Informazioni</h4>
                  <hr style={{color:'red', opacity:'0.75', marginTop:'0', height:'1px'}}></hr>
                  <Container className='d-md-flex flex-wrap justify-content-md-center'>
                    
                    <Container className='mt-2'>
                      <Row md='auto' className='justify-content-around'>
                        <div className='p-2 musica-detail__infoWidth'>
                          <Col className='text-center fw-bold'>Data di rilascio</Col>
                          <Col className='text-center'>{musicInfo.release_date ? musicInfo.release_date : ' - '}</Col>
                        </div>
                        <div className='p-2 musica-detail__infoWidth'>
                          <Col className='text-center fw-bold'>Durata</Col>
                          <Col className='text-center'>{memoizedAlbumDuration}</Col>
                        </div>
                      </Row>
                    </Container>
                    
                    <Container className='mt-2'>
                      <Row md='auto' className='justify-content-around'>
                        {musicInfo.album_type ?
                          <div className='p-2 musica-detail__infoWidth'>
                            <Col className='text-center fw-bold'>Tipo</Col>
                            <Col className='text-center'>{musicInfo.album_type}</Col>
                          </div>
                          : null
                        }
                        {musicInfo.genres.length > 0 ?
                          <div className='p-2 musica-detail__infoWidth'>
                            <Col className='text-center fw-bold'>Genere</Col>
                            <Col className='text-center'>{musicInfo.genres.map(genere => genere.name).join(' - ')}</Col>
                          </div>
                          : null
                        }
                        {
                          musicInfo.label &&
                          <div className='p-2 musica-detail__infoWidth'>
                            <Col className='text-center fw-bold'>Etichetta</Col>
                            <Col className='text-center'>{musicInfo.label}</Col>
                          </div>
                        }
                        {
                          musicInfo.total_tracks &&
                          <div className='p-2 musica-detail__infoWidth'>
                            <Col className='text-center fw-bold'>N. Tracce</Col>
                            <Col className='text-center'>{musicInfo.total_tracks}</Col>
                          </div>
                        }
                      </Row>
                    </Container>

                    <Container className='text-center'>
                        <Row md='auto' className='justify-content-center mb-3' >
                          <div className='p-2 musica-detail__infoWidth'>
                            <Col>Popolarità</Col>
                            <Col>
                              {musicInfo.popularity ? 
                                ( 
                                  <Container className='musica-detail__circularbar_size mt-3'>
                                    <CircularProgressbar 
                                      value={(musicInfo.popularity/10).toFixed(1)} 
                                      text={(musicInfo.popularity/10).toFixed(1)} 
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
                                  <Container className='musica-detail__circularbar_size mt-3'>
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

                <Container className='musica-detail__descrizione'>
                  <h4 className='text-center fw-bold mt-1'>Tracce</h4>
                  <hr style={{color:'red', opacity:'0.75', marginTop:'0', height:'1px'}}></hr>
                    {memoizedDiscTracks}
                </Container>
              </Container>

              <Container fluid className='mt-5'>
                <p className='text-center fw-bold fs-4'>Album Simili</p>
                {/* {checkDuplicates()} */}
                <CustomCarousel dataCategory="Music" data={musicInfo['similar']}/>
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


export default MusicaDetail