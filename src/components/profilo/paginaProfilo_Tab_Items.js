import {Accordion, Container, Row, Col, Button} from 'react-bootstrap'
import {useEffect} from 'react'
import {DateTime} from 'luxon'
import {Heart, HeartFill, Trash} from 'react-bootstrap-icons'
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar'
import { Link } from 'react-router-dom';


import './paginaProfilo_Tab_Items.css'
import 'bootstrap/dist/css/bootstrap.min.css'


function TabReviewsItems({reviews, category}) {

  function ratingColor(rating){
    let int_rating = parseInt(rating)
    if(int_rating >= 7)
      return ' #0aff2c' // green
    else if(int_rating >= 5.5 && int_rating < 7)
      return ' #ebeb28' // yellow
    else return ' #ff3c28' // red
  }

  let urlpath
  let idCode
  switch (category) {
    case 'Cinema':
      urlpath = '/cinema/'
      idCode = 'movieId'
      break;
    case 'Videogiochi':
      urlpath = '/videogiochi/'
      idCode = 'gameId'
      break;
    case 'Musica':
      urlpath = '/musica/'
      idCode = 'albumId'
      break;
    case 'Libri':
      urlpath = '/libri/'
      idCode = 'bookId'
      break;
    default:
      break;
  }

  return(
    <>
      {reviews.length === 0 ? null :
      <Accordion>
        {reviews.map((review, index) => {
          let createdTimeObj = DateTime.fromISO(review.created_at)
          let updatedTimeObj = DateTime.fromISO(review.updated_at)

          return (

            <Accordion.Item eventKey={index} key={review.id}>
            <Accordion.Header>
              <Row className='d-flex justify-content-between w-100'>
                <Col xs='auto'>
                  <span className=''>{review.title}</span>
                </Col>
                <Col xs='auto'>
                  <div className='d-flex'>
                  <span className='mx-3'>
                    {review.favourite ? <HeartFill fill='red'/> : <Heart/>}
                  </span>
                  <span style={{backgroundColor: ratingColor(review.rating)}} className='tab_items__rating_background'>{review.rating}</span>
                  </div>
                </Col>
              </Row>
            </Accordion.Header>
            <Accordion.Body>
                  <div  
                    className='fs-6 text-break  m-4 p-4' 
                  >
                    <div className='tab_items__link fs-3 text-center mb-4'>
                      <Link className='tab_items__link' to={`${urlpath}${review[idCode]}`}>{review.title}</Link>
                    </div>
                    <div className='d-md-flex justify-content-between'>
                      <p className='fw-lighter'>Data pubblicazione: {createdTimeObj.toLocaleString(DateTime.DATETIME_SHORT)}</p>
                      <p className='fw-lighter'>Ultima modifica: {updatedTimeObj.toLocaleString(DateTime.DATETIME_SHORT)}</p>
                    </div>
                    <div className='d-md-flex justify-content-around'>
                      <p className='fw-light'>Preferito: {review.favourite ? <HeartFill fill='red'/> : <Heart/>}</p>                    </div>
                    <Container className='tab_items__circularbar_size'>
                      <p>Voto</p>
                      <CircularProgressbar 
                        value={review.rating} 
                        text={review.rating} 
                        minValue={0} 
                        maxValue={10}
                        strokeWidth={5}
                        styles={buildStyles({
                          pathColor: ratingColor(review.rating),
                          textColor: ratingColor(review.rating),
                          trailColor: '#999',
                          textSize:'24px' 
                        })}
                      />
                    </Container>
                    <p className='fw-light'>Recensione:</p>
                    <div className='border border-secondary rounded p-3'>
                      <p className='fw-light'>{review.review}</p>
                    </div>
                  
                  </div>
            </Accordion.Body>
          </Accordion.Item>
          )
        }
        )}
      </Accordion>
      }
    </>
  )
}

export default TabReviewsItems