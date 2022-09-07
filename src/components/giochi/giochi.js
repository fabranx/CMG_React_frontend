import './giochi.css'
import {Container, Form, Button} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomCarousel from '../custom_carousel/custom_carousel';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {client} from "../../Client"
import Loading from '../loadingpage/loadingpage';
import SearchResults from '../search_results/search_results';
import Footer from '../footer/footer';


function Giochi() {
  const [gamesData, setGamesData] = useState({})
  const [isDataFetched, setDataFetched] = useState(false)
  const [fetchError, setFetchError] = useState(false)
  
  const [reloadContent, setReloadContent] = useState(true)
  
  const [searchInput, setSearchInput] = useState(sessionStorage.getItem('gamesearch') || '')
  const [gamesSearched, setGamesSearched] = useState(JSON.parse(sessionStorage.getItem('gamedata')) || [])
  const [isSearchFetched, setSearchFetched] = useState(false)

  const generi = useMemo(() => ({'Fighting':'Picchiaduro', 'Shooter':'Shooter','Adventure':'Avventura', 'Platform':'Platform',
  'Racing':'Corse','Role-playing (RPG)':'Gioco di ruolo','Simulator':'Simulazione',
  'Sport':'Sportivi','Strategy':'Strategici', "Hack and slash/Beat 'em up":"Hack and slash/Beat 'em up", 'Recent':'Recenti'}), []) 

  const fetchGames = useCallback((controller) => {
    if(reloadContent)
    {
      let gamesearch = sessionStorage.getItem('gamesearch') 
      let gamedata = sessionStorage.getItem('gamedata')

      if(gamesearch && gamedata.length>0) {
        setSearchFetched(true)
        setDataFetched(true)
      }
      else{
        if(!controller){
          controller = new AbortController()
        }  
        client.LatestGamesIGDB(Object.keys(generi), controller)
        .then((res) => {
          setGamesData(res.data)
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
    fetchGames(controller)
    return () => {
      controller.abort()
      setReloadContent(false)
    }
  }, [fetchError, fetchGames])


  function onFormChange(e)
  {
    if(e.target.value === '')
    {
      setSearchFetched(false)
      sessionStorage.removeItem('gamesearch')
      sessionStorage.removeItem('gamedata')
      if(Object.entries(gamesData).length === 0){
        setDataFetched(false)
        fetchGames()
      }
    }
    setSearchInput(e.target.value)
  }

  function onFormSubmit(e)
  {
    e.preventDefault()
    if(searchInput.length > 0){
      client.SearchGamesIGDB(searchInput)
      .then((res) => {
        setGamesSearched(res.data)
        setSearchFetched(true)
      })
      .catch(err => console.log(err))
    }
  }

  return (
    <>
      <div className="background-giochi">
        <Container className='d-flex justify-content-center mt-5'>
          <Form className='d-flex giochi__search_form_width' onSubmit={onFormSubmit}>
            <Form.Control onChange={(e) => onFormChange(e)} defaultValue={searchInput} type='text' placeholder="Cerca Giochi"/>
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
                  {Object.keys(gamesData).map((key) => { // key = generi
                    return(
                      <Container fluid className='mt-5' key={key}>
                        <p className='text-center fw-bold fs-4'>{generi[key]}</p>
                        <CustomCarousel keyStart={key} dataCategory="Games" data={gamesData[key]}/>
                      </Container>
                    )
                  })}
                </>
              ) : (
                <>
                {sessionStorage.setItem('gamesearch', searchInput)}
                {sessionStorage.setItem('gamedata', JSON.stringify(gamesSearched))}
                <SearchResults dataCategory='Games' data={gamesSearched}/>
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

export default Giochi