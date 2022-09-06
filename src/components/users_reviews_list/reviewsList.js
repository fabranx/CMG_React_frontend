import {Row, Container, Figure} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './reviewsList.css'
import {DateTime} from 'luxon'
import { Link } from 'react-router-dom'
import {Heart, HeartFill} from 'react-bootstrap-icons'
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar'




function ReviewsList({reviews}){

  function circularBarColor(rating){
    if(rating >= 7)
      return ' #0aff2c' // green
    else if(rating >= 5.5 && rating < 7)
      return ' #ebeb28' // yellow
    else return ' #ff3c28' // red
  }

  return (
    <Container className='mb-5'>
    <Row xs={1} className='justify-content-center'>
      <p className='text-center'> Recensioni Utenti</p>
      <hr></hr>
      {reviews.map(review => {
        let createdTimeObj = DateTime.fromISO(review.created_at)
        return (
          <Container key={review.id} className='reviewsList__width py-2 mt-3'>
            <div className='text-center p-2 mt-2'>
              {/* <img src={review.profile_image}></img> */}
              <Figure className='reviewList_immagine-profilo mx-auto d-flex justify-content-center align-items-center'>
                <Figure.Image 
                  className='reviewList_immagine-profilo'
                  fluid={true} 
                  thumbnail={false}
                  roundedCircle={true} 
                  src={review.profile_image ? review.profile_image : null}
                />
                <Figure.Caption as={Link} className='reviewsList__link fs-4 mx-2' to={`/profilo/${review.author_name}`} >
                {review.author_name}
                </Figure.Caption>
              </Figure>
            </div>
            <div className='d-flex justify-content-between px-5'>
              <p className='fw-lighter'>Data: {createdTimeObj.toLocaleString(DateTime.DATETIME_SHORT)}</p>
              <p className='fw-light text-center'>Preferito: {review.favourite ? <HeartFill fill='red'/> : <Heart/>}</p>
            </div>
            <Container className='reviewsList__circularbar_size mb-3'>
              <p className='text-center'>Voto</p>
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
            {review.review ? (
              <>
                <p className='text-center'>Recensione</p>
                <p className='px-5 text-break'>{review.review}</p>
              </>
            ) : null}
          </Container>
      )})}  
      </Row>
    </Container>
  )
}

export default ReviewsList