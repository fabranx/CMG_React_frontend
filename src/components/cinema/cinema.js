import './cinema.css'
import {Container, Form, Button} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomCarousel from '../custom_carousel/custom_carousel';
import { useEffect, useState, useCallback, useMemo} from 'react';
import {client} from "../../Client"
import Loading from '../loadingpage/loadingpage';
import SearchResults from '../search_results/search_results';
import Footer from '../footer/footer';


function Cinema() {
  const [moviesData, setMoviesData] = useState({})
  const [isDataFetched, setDataFetched] = useState(false)
  const [fetchError, setFetchError] = useState(false)
  
  const [reloadContent, setReloadContent] = useState(true)
  
  const [searchInput, setSearchInput] = useState(sessionStorage.getItem('moviesearch') || '')
  const [moviesSearched, setMoviesSearched] = useState(JSON.parse(sessionStorage.getItem('moviedata')) || [])
  const [isSearchFetched, setSearchFetched] = useState(false)

  const generi = useMemo(() => (['Animazione', 'Azione', 'Commedia', 'Avventura', 'Documentario', 'Fantasy', 'Horror', 'Fantascienza', 'Thriller']), []) 

  const fetchMovies = useCallback((controller) => {
    if(reloadContent)
    {

      let moviesearch = sessionStorage.getItem('moviesearch')
      let moviedata = sessionStorage.getItem('moviedata')
      if(moviesearch && moviedata.length>0){
        setSearchFetched(true)
        setDataFetched(true)
      }
      else{
        if(!controller){
          controller = new AbortController()
        }
        client.LatestMoviesTMDB(generi, controller)
        .then((res) => {
          setMoviesData(res.data)
          setDataFetched(true)
        })
        .catch(err => {
          if(err.message.includes("timeout"))
            setFetchError("Impossibile accedere alla risorsa")
          else
            setFetchError(err.message)
        })
      }
    }
  },[generi, reloadContent])

  useEffect(() => {
    const controller = new AbortController()
    fetchMovies(controller)

    return () => {
      controller.abort()
      setReloadContent(false)
    }

  }, [fetchError, fetchMovies])


  function onFormChange(e)
  {
    if(e.target.value === '')
    {
      setSearchFetched(false)
      sessionStorage.removeItem('moviesearch')
      sessionStorage.removeItem('moviedata')
      if(Object.entries(moviesData).length === 0){
        setDataFetched(false)
        fetchMovies()
      }
    }
    setSearchInput(e.target.value)
  }

  function onFormSubmit(e)
  {
    e.preventDefault()
    client.SearchMoviesTMDB(searchInput)
    .then((res) => {
      setMoviesSearched(res.data)
      setSearchFetched(true)
    })
    .catch(err => console.log(err))
  }
  
  return (
    <>
      <div className="background-cinema">
        <Container className='d-flex justify-content-center mt-5'>
          <Form className='d-flex search_form_width' onSubmit={onFormSubmit}>
            <Form.Control onChange={(e) => onFormChange(e)} defaultValue={searchInput} type='text' placeholder="Cerca Film"/>
            <Button className='ms-2' variant="outline-danger" type='submit'>Cerca</Button>
          </Form>
        </Container>

        {!isDataFetched && fetchError ?  
          (
            <Container>
              <h3 className='text-center mt-5'>{fetchError}</h3>
              <Button onClick={()=> {setFetchError(false); setReloadContent(true)}}>Ricarica</Button>
            </Container>
          ) : (
          <>
            {(!isDataFetched) ? (<Loading/>) : (
            <>
              {!isSearchFetched ? (
                <>
                  {Object.keys(moviesData).map((key) => { // key = generi
                    return(
                      <Container fluid className='mt-5' key={key}>
                        <p className='text-center fw-bold fs-4'>{key}</p>
                        <CustomCarousel keyStart={key} dataCategory="Movies" data={moviesData[key].results}/>
                      </Container>
                    )
                  })}
                </>
              ) : (
                <>
                  {sessionStorage.setItem('moviesearch', searchInput)}
                  {sessionStorage.setItem('moviedata', JSON.stringify(moviesSearched))}
                  <SearchResults dataCategory='Movies' data={moviesSearched}/>
                </>
              )}
            </>
            )}
          </>
        )}

        <Footer/>
      </div>
    </>
  )
}

export default Cinema