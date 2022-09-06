import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom_carousel.css'
import {Card} from 'react-bootstrap'
import { useState, useEffect } from "react";
import placeholder from '../images/placeholder.png'
import {Link} from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {memo} from 'react'

function CustomCarousel(props)
{
  const[dataKeys, setDataKeys] = useState({
    url: undefined,
    image: function (object) {return null},
    title: undefined,
    id: undefined,
    link: undefined,
  })

  useEffect(() => {
    switch (props.dataCategory) {
      case "Movies":
          setDataKeys({
            url: "https://www.themoviedb.org/t/p/w500",
            image: function (object) { return object?.poster_path},
            title: "title",
            id: "id",
            link: "/cinema",
          })
        break;
      
      case "Games":
        setDataKeys({
          url: "//images.igdb.com/igdb/image/upload/t_cover_big/",
          image: function (object) {
            return object?.cover?.image_id + '.jpg'
          },
          title: "name",
          id: "id",
          link: "/videogiochi",
        })
        break;

      case "Music":
        setDataKeys({
          url: "",
          image: function (object) { return object?.images[0]?.url},
          title: "name",
          id: "id",
          link: "/musica",
        })
        break;
    
      default:

        break;
    }
  },[])

  const responsive = {
    desktop_md: {
      breakpoint: {
        max: 1500,
        min: 1100
      },
      items: 5,
      slidesToSlide: 3,
      partialVisibilityGutter: 40
    },
    desktop_sm: {
      breakpoint: {
        max: 1100,
        min: 900
      },
      items: 4,
      slidesToSlide: 3,
      partialVisibilityGutter: 40
    },
    mobile: {
      breakpoint: {
        max: 680,
        min: 0
      },
      items: 1,
      slidesToSlide: 1,
      partialVisibilityGutter: 20
    },
    tablet: {
      breakpoint: {
        max: 900,
        min: 680
      },
      items: 3,
      slidesToSlide: 2,
      partialVisibilityGutter: 20
    }
  }

  return(
    <Carousel
      arrows
      autoPlaySpeed={8000}
      autoPlay={true}
      centerMode={true}
      className="mb-5"
      containerClass='carousel-card-overflow'
      draggable={true}
      focusOnSelect={false}
      infinite
      itemClass="custom-item"
      keyBoardControl
      minimumTouchDrag={80}
      renderButtonGroupOutside={false}
      renderDotsOutside={false}
      responsive={responsive}
      showDots={false}
      sliderClass=''
      slidesToSlide={3}
      swipeable={true}
    >
    {props.data.map((object) => 
      <Link to={`${dataKeys.link}/${object[dataKeys.id]}`} key={props.keyStart + object[dataKeys.id]}>
        <Card id="card-pointer"
          className='bg-body rounded carousel__zoom '>
          {(dataKeys.image(object) !== null) ? (
            // <Card.Img draggable={false} className="fluid rounded cover_carousel" src={`${dataKeys.url}${dataKeys.image(object)}`}/>
            <LazyLoadImage src={`${dataKeys.url}${dataKeys.image(object)}`} className="fluid rounded cover_carousel" />
            ) : (
            <Card.Img draggable={false} className="fluid rounded cover_carousel" src={placeholder}/>
          )}
          <Card.ImgOverlay draggable={false} className="imgOverlay">
            <Card.Title className="carousel_card_text">{object[dataKeys.title]}</Card.Title>
          </Card.ImgOverlay>
        </Card>
      </Link>
    )}
      
    </Carousel>
  )
}

function areEqual(prevProps, nextProps) {
  return prevProps.dataCategory === nextProps.dataCategory && prevProps.keyStart === nextProps.keyStart
}

export default memo(CustomCarousel, areEqual)