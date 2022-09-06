import React, { useState, useEffect } from 'react';
import {Container, Form, Button} from 'react-bootstrap'
import {Heart, HeartFill, CheckCircleFill, XCircleFill} from 'react-bootstrap-icons'
import './review_field.css'


function ReviewField(props) {
  const onFormSubmit = props?.onFormSubmit
  const vote = props.vote
  const onVoteChange = props.onVoteChange
  const setFavourite = props.setFavourite
  const favourite = props.favourite
  const onTextReviewChange = props.onTextReviewChange
  const textReview = props.textReview
  const formSuccessfullySubmit = props.formSuccessfullySubmit
  const formSubmitError = props.formSubmitError


  return ( 
    <Container fluid className='d-flex flex-wrap justify-content-center mt-5 review-field__border p-4'>
    <Form onSubmit={onFormSubmit} className='review-field__form'>
      <Container fluid className='d-flex flex-column justify-content-center'>
        <Form.Label className='d-flex justify-content-center'>Il tuo voto</Form.Label >
        <div className='d-flex justify-content-center'>
          <Form.Range className='review-field__slider' 
          defaultValue={vote || 0} step={0.5} min={0} max={10} onChange={onVoteChange}></Form.Range>
        </div>
        <h4 className='d-flex justify-content-center'>{vote || "- -"}</h4>
        <div className='d-flex justify-content-center align-items-center'>
          <Form.Label onClick={() => setFavourite(!favourite)} className='m-2 review-field__hover-hand'>Preferito {' '}
          {favourite ? <HeartFill fill='red'/> : <Heart/> }
          </Form.Label>
        </div>
        <textarea className='text-white bg-dark' onChange={onTextReviewChange} value={textReview}></textarea>
      </Container>
      <Container fluid className='d-flex justify-content-center mt-3'>
      <Button variant="outline-danger" type="submit">
        Conferma
      </Button>
      {formSuccessfullySubmit ? 
          <CheckCircleFill className='my-auto ms-2' fontSize={'20px'} fill='green'/> :
         null}
      {!formSuccessfullySubmit && formSubmitError ? 
        <XCircleFill className='my-auto ms-2' fontSize={'20px'} fill='red' />
       : null}
      </Container>
    </Form>
  </Container>
  
   );
}

export default ReviewField;