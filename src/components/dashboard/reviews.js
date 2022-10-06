import {Button, Container, Modal, Form} from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {DateTime} from 'luxon'
import {Heart, HeartFill, Trash} from 'react-bootstrap-icons'
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css';
import './reviews.css'
import { client, requestsWithTokenHandler } from '../../Client'
import {LoginContext} from '../context'




function Reviews(props){

  const {
    deleteelementfunction,
    setreviews,
    reviews,
    category,
    urlpath,
    idcode,
    ...modalprops} = props

  const {setIsLoggedIn} = useContext(LoginContext)
  const [mutableReviews, setMutableReviews] = useState(reviews)
  const [searchReview, setSearchReview] = useState('')

  useEffect(() => {
    setMutableReviews(reviews)
  }, [reviews])

  const onDeleteSubmit = (id) => {

    const deleteFunction = () => {
      if(typeof client[deleteelementfunction] === 'function')
      {
        client[deleteelementfunction](id)
        .then(() => {
          setreviews(reviews.filter(review => review.id !== id))
        })
        .catch(err => console.log(err))
      }
      else throw new Error(`Errore client non ha il metodo ${deleteelementfunction}`) 
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

    requestsWithTokenHandler(deleteFunction, errorOnRefreshToken)

  }

  function circularBarColor(rating){
    if(rating >= 7)
      return ' #0aff2c' // green
    else if(rating >= 5.5 && rating < 7)
      return ' #ebeb28' // yellow
    else return ' #ff3c28' // red
  }

  function onFormSearchChange(e){
    setSearchReview(e.target.value)
  }

  function onFormSelectChange(e){
    sortReviews(e.target.value)
  }

  function sortReviews(sortby) {
    let sortReviews = [...reviews]
    switch (sortby) {
      case 'newest':
        setMutableReviews(reviews) // reviews - lista già ordinata per data meno recente
        break;
      case 'oldest':
        const reverseReview = reviews.slice().reverse(); // .slice().reverse() non modifica array originale - .reverse() invece modifica array originale
        setMutableReviews(reverseReview)
        break;
      case 'bestRating':
        sortReviews.sort((a,b) => parseFloat(b.rating - a.rating))
        setMutableReviews(sortReviews)
        break;
      case 'worstRating':
        sortReviews.sort((a,b) => parseFloat(a.rating - b.rating))
        setMutableReviews(sortReviews)
        break;
      
      default:
        break;
    }
  }

  return(
    <Modal
      {...modalprops}
      size='xl'
      aria-labelledby="contained-modal-title-vcenter"
      centered
      fullscreen='xl-down'
    >
      <Modal.Header closeButton closeVariant='white'  className='settings-modal p-3'> 
        <Modal.Title>
            Recensioni {category}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body  className='reviews__modal'> 
          <Container className='d-flex justify-content-center'>
            <Form className='d-flex'>
              <Form.Control className='me-3' size='sm' onChange={(e) => onFormSearchChange(e)}  type='text' placeholder="Cerca"/>
              <Form.Select  onChange={(e) => onFormSelectChange(e)}  size='sm'>
                <option style={{color:'black'}} value={'newest'}>ordine: più recenti</option>
                <option style={{color:'black'}} value={'oldest'}>ordine: meno recenti</option>
                <option style={{color:'black'}} value={'bestRating'}>ordine: voto più alto</option>
                <option style={{color:'black'}} value={'worstRating'}>ordine: voto più basso</option>
              </Form.Select>
            </Form>
          </Container>

          <Container fluid>
              {mutableReviews.filter((review) => review.title.toLowerCase().includes(searchReview)).map(review => {
                let createdTimeObj = DateTime.fromISO(review.created_at)
                let updatedTimeObj = DateTime.fromISO(review.updated_at)
                return (
                  <div  
                    key={review[idcode]} 
                    className='fs-6 text-break border border-secondary rounded border-3 m-4 p-4' 
                  >
                    <div className='reviews__link fs-3 text-center mb-4'>
                      <Link className='reviews__link' to={`${urlpath}${review[idcode]}`}>{review.title}</Link>
                    </div>
                    <div className='d-md-flex justify-content-between'>
                      <p className='fw-lighter'>Data pubblicazione: {createdTimeObj.toLocaleString(DateTime.DATETIME_SHORT)}</p>
                      <p className='fw-lighter'>Ultima modifica: {updatedTimeObj.toLocaleString(DateTime.DATETIME_SHORT)}</p>
                    </div>
                    <div className='d-md-flex justify-content-around'>
                      <p className='fw-light'>Preferito: {review.favourite ? <HeartFill fill='red'/> : <Heart/>}</p>                    </div>
                    <Container className='reviews__circularbar_size'>
                      <p>Il tuo voto</p>
                      <CircularProgressbar 
                        value={review.rating} 
                        text={review.rating} 
                        minValue={0} 
                        maxValue={10}
                        strokeWidth={5}
                        styles={buildStyles({
                          pathColor: circularBarColor(review.rating),
                          textColor: circularBarColor(review.rating),
                          trailColor: '#999',
                          textSize:'24px' 
                        })}
                      />
                    </Container>
                    <p className='fw-light'>Recensione:</p>
                    <div className='border border-secondary rounded p-3'>
                      <p className='fw-light'>{review.review}</p>
                    </div>
                    <div className='d-flex justify-content-end mt-3'>
                      <Button onClick={() => onDeleteSubmit(review.id)} variant='outline-danger' >Elimina {<Trash fill='grey'/>}</Button>
                    </div> 
                  
                  </div>
                  )
                })
              }
          </Container>
      </Modal.Body>

    </Modal>
  )
}

export default Reviews