import {Container, Card, Row, Col} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './search_results.css'
import placeholder from '../images/placeholder.png'
import { Link } from 'react-router-dom';
import {useState, useEffect} from 'react'
import {DateTime} from 'luxon'



function SearchResults(props)
{
  const[dataKeys, setDataKeys] = useState({
    url: undefined,
    image: function (object) {return null},
    title: undefined,
    id: undefined,
    link: undefined,
    release_date: function (object) {return null},
    description: undefined,
  })


  useEffect(() => {
    switch (props.dataCategory) {
      case "Movies":
          setDataKeys({
            url: "https://www.themoviedb.org/t/p/w500",
            image: function (object) { return object['poster_path']},
            title: "title",
            id: "id",
            link: "/cinema",
            release_date: function(object) {if(object['release_date']) return object['release_date'].split('-')[0]
             else return ''},
            description: "overview"
          })
        break;
      
      case "Games":
        setDataKeys({
          url: "//images.igdb.com/igdb/image/upload/t_cover_big/",
          image: function (object) {return object?.cover?.image_id + '.jpg' || ''},
          title: "name",
          id: "id",
          link: "/videogiochi",
          release_date: function(object) {
            if(object?.first_release_date)
            {
              let datetimeObj = DateTime.fromSeconds(parseInt(object?.first_release_date))
              return datetimeObj.toLocaleString(DateTime.DATE_SHORT)
            }
            else return ''

          },
          description: "summary",
        })
        break;

      case "Music":
        setDataKeys({
          url: "",
          image: function (object) {return object?.images[0]?.url},
          title: "name",
          id: "id",
          link: "/musica",
          release_date: function(object) {
            if(object?.release_date)
            {
              return object?.release_date
            }
            else return ''

          },
          description: "type",
        })

        break;
    
      default:
        break;
    }
  },[props.dataCategory])


  return (
    <>
      <Container className='mt-5 mb-5'>
        <Row xs={1} sm={1} md={1} xl={1} xxl={1} className="g-4">
          {props.data && props.data.map((object) => (
            <Col key={(object[dataKeys.id])} className='d-flex justify-content-center '>
              <Card bg='dark' className='mt-2 mb-2  search_result_card search_overflow '>
                <div className='d-flex flex-row justify-content-center mt-4'>
                  <div className='search__bg-image search__zoom'>
                    <Card.Img variant="top" className='cover_image_search'
                      src={dataKeys.image(object) != null ? `${dataKeys.url}${dataKeys.image(object)}` : placeholder}/>
                    <Link to={`${dataKeys.link}/${object[dataKeys.id]}`}>
                      <Card.ImgOverlay className="search-imgOverlay"></Card.ImgOverlay>
                    </Link>
                  </div>
                </div>
                <Card.Body className=''>
                  <Card.Title className='text-center'>
                    <Link className='search-link ' to={`${dataKeys.link}/${object[dataKeys.id]}`}>
                    {object[dataKeys.title]}
                    </Link>
                  </Card.Title> 
                  <Card.Text>Anno: {dataKeys.release_date(object)}</Card.Text>
                  <Card.Text>{object[dataKeys.description]}</Card.Text>
                </Card.Body>
              </Card>
            </Col>

          ))}
        </Row>
     </Container>
  </>
  )
}

export default SearchResults