import './musica.css'
import {Container, Form, Button} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomCarousel from '../custom_carousel/custom_carousel';
import { useCallback, useEffect, useState } from 'react';
import {client} from "../../Client"
import Loading from '../loadingpage/loadingpage';
import SearchResults from '../search_results/search_results';
import Footer from '../footer/footer';


function Musica() {
  const [musicData, setMusicData] = useState({})
  const [isDataFetched, setDataFetched] = useState(false)
  const [fetchError, setFetchError] = useState(false)
  
  const [reloadContent, setReloadContent] = useState(true)

  const [searchInput, setSearchInput] = useState(sessionStorage.getItem('musicsearch') || '')
  const [searchType, setSearchType] = useState(sessionStorage.getItem('musicsearchtype') ||'album')

  const [musicSearched, setMusicSearched] = useState(JSON.parse(sessionStorage.getItem('musicdata')) || [])
  const [isSearchFetched, setSearchFetched] = useState(false)


  const fetchMusic = useCallback((controller) => {
    const generi = ["alternative", "rock", "hard-rock", "heavy-metal", "metal", "grunge", "road-trip",  "blues", "pop", "classical", "disco", "dance", "electronic", "jazz"]

    if(reloadContent)
    {
      let musicsearch = sessionStorage.getItem('musicsearch')
      let musicdata = sessionStorage.getItem('musicdata')
      let musicsearchtype = sessionStorage.getItem('musicsearchtype')

      if(musicsearch && musicdata.length>0 && musicsearchtype) {
        setSearchFetched(true)
        setDataFetched(true)
      }
      else{  
        if(!controller){
          controller = new AbortController()
        }
        client.LatestAlbumSpotify(generi, controller)
        .then((res) => {
          setMusicData(res.data)
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
  },[reloadContent])


  useEffect(() => {
    const controller = new AbortController()
    fetchMusic(controller)
    return () => {
      controller.abort()
      setReloadContent(false)
    }
  }, [fetchError, fetchMusic])


  function onFormSearchChange(e)
  {
    if(e.target.value === '')
    {
      setSearchFetched(false)
      sessionStorage.removeItem('musicdata')
      sessionStorage.removeItem('musicsearch')
      sessionStorage.removeItem('musicsearchtype')
      if(Object.entries(musicData).length === 0){
        setDataFetched(false)
        fetchMusic()
      }
    }
    setSearchInput(e.target.value)
  }

  function onFormSelectChange(e)
  {
    setSearchType(e.target.value)
  }

  function onFormSubmit(e)
  {
    e.preventDefault()
    if(searchInput.length > 0){
      client.SearchAlbumSpotify(searchInput, searchType)
      .then((res) => {
        setMusicSearched(res.data)
        setSearchFetched(true)
      })
      .catch(err => console.log(err))
    }

  }
  
  return (
    <>
      <div className="background-musica">
        <Container className='d-flex justify-content-center mt-5'>
          <Form className='d-flex musica__search_form_width' onSubmit={onFormSubmit}>
            <Form.Control onChange={(e) => onFormSearchChange(e)} defaultValue={searchInput} type='text' placeholder="Cerca"/>
            <Form.Select onChange={(e) => onFormSelectChange(e)} defaultValue={searchType} size='sm' style={{width:'150px'}} className='mx-1'>
              <option style={{color:'black'}} value={'album'}>Album</option>
              <option style={{color:'black'}} value={'artist'}>Artista</option>
            </Form.Select>
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
                  {Object.keys(musicData).map((key) => { // key = generi
                    return(
                      <Container fluid className='mt-5' key={key}>
                        <p className='text-center fw-bold fs-4'>{key}</p>
                        <CustomCarousel keyStart={key} dataCategory="Music" data={musicData[key]}/>
                      </Container>
                    )
                  })}
                </>
              ) : (
                <>
                  {sessionStorage.setItem('musicdata', JSON.stringify(musicSearched))}
                  {sessionStorage.setItem('musicsearch', searchInput)}
                  {sessionStorage.setItem('musicsearchtype',searchType )}
                  <SearchResults dataCategory='Music' data={musicSearched}/>
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

export default Musica
