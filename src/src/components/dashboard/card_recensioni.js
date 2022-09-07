import 'bootstrap/dist/css/bootstrap.min.css'
import './card_recensioni.css'
import { Link } from "react-router-dom"
import React from 'react'
import {Card, ListGroup} from 'react-bootstrap'
import Reviews from './reviews'
import { useState } from 'react';


function CardUltimeRecensioni(props) {
  const [showReviews, setShowReviews] = useState(false);
  const LIST_LENGTH = 5

  let urlpath
  let idCode
  let deleteElementFunction
  switch (props.categoria) {
    case 'Cinema':
      urlpath = '/cinema/'
      idCode = 'movieId'
      deleteElementFunction = 'deleteMovieReview'
      break;
    case 'Videogiochi':
      urlpath = '/videogiochi/'
      idCode = 'gameId'
      deleteElementFunction = 'deleteGameReview'

      break;
    case 'Musica':
      urlpath = '/musica/'
      idCode = 'albumId'
      deleteElementFunction = 'deleteMusicReview'

      break;
    case 'Libri':
      urlpath = '/libri/'
      idCode = 'bookId'
      break;
    default:
      break;
  }

  let reviews
  props['reviews'] ? reviews = props['reviews'] : reviews = []  
  let reviewsToRenderList = [];
  for(let i=0; i<LIST_LENGTH; i++)
  {
    reviews[i] ?
        reviewsToRenderList.push(
          <ListGroup.Item 
            key={`${props.categoria}-${i}`} 
            as={Link} 
            to={`${urlpath}${reviews[i][idCode]}`} 
            className="d-flex justify-content-between align-items-start">
            <span>{reviews[i].title}</span>
            <span>{reviews[i].rating}</span>
          </ListGroup.Item>
        ) :
        reviewsToRenderList.push(
          <ListGroup.Item 
            key={`${props.categoria}-${i}`} 
            className="d-flex justify-content-between align-items-start">
            <span>{''}</span>
            <span>{'--'}</span>
          </ListGroup.Item>
        )
  }
  return(
    <>
      <Card>
        <Card.Header onClick={() => setShowReviews(true)} className="category-link text-center">
          {props.categoria}
        </Card.Header>
        <ListGroup variant="flush">
          {reviewsToRenderList.map(list => list)}
        </ListGroup>
      </Card>
      <Reviews
        reviews = {props['reviews']}
        category = {props['categoria']}
        urlpath = {urlpath}
        idcode = {idCode}
        show={showReviews}
        deleteelementfunction = {deleteElementFunction}
        setreviews={props.setreviews}
        onHide={() => setShowReviews(false)}
      />
    </>
  )
}


export default CardUltimeRecensioni