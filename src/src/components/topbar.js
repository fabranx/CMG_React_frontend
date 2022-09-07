import React, { useEffect } from 'react'
import { Navbar, Container, Nav, NavDropdown} from 'react-bootstrap'
import {Link} from "react-router-dom"
import {LoginContext} from "./context"
import {client} from '../Client'

import SearchSelect from './search_select'

function TopBar() {
  
  const [expanded, setExpanded] = React.useState(false)  // cambia lo stato della navbar, quando si clicca su un link la navbar viene chiusa
  const {isLoggedIn, setIsLoggedIn} = React.useContext(LoginContext)
  const [users, setUsers] = React.useState([])

  function logout() {
    client.logout()
      .then((res) => {
      })
      .catch((error) => {
      })
    setIsLoggedIn(false)
    setExpanded(false)
    client.deleteUserData()
    sessionStorage.removeItem('alert')
  }

  useEffect(() => {
    client.getUsers()
    .then(res => setUsers(res.data))
    .catch()
  },[])

  return (
    <Navbar sticky="top" expanded={expanded} expand='md' bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/" >CMG Blog</Navbar.Brand>
        <Navbar.Toggle onClick={() => setExpanded(!expanded)} aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>Home</Nav.Link>
            <Nav.Link as={Link} to="/cinema" onClick={() => setExpanded(false)}>Cinema</Nav.Link>
            <Nav.Link as={Link} to="/videogiochi" onClick={() => setExpanded(false)}>Videogiochi</Nav.Link>
            <Nav.Link as={Link} to="/musica" onClick={() => setExpanded(false)}>Musica</Nav.Link>
            {/* <Nav.Link as={Link} to="/libri" onClick={() => setExpanded(false)}>Libri</Nav.Link> */}
          </Nav>
          <Nav>
            {  // se è impostato il token mostra logout altrimenti login
              isLoggedIn ? (
                <>   
                  <SearchSelect users={users}/>

                  <NavDropdown align='end' title={client.username}>
                    <NavDropdown.Item as={Link} to="/dashboard" onClick={() => setExpanded(false)}>Dashboard</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to={`/profilo/${client.username}`} onClick={() => setExpanded(false)}>Profilo</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                  </NavDropdown>
                </>
                ) : (
                  <Nav.Link as={Link} to="/login" onClick={() => setExpanded(false)}>Login</Nav.Link>
                )
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default TopBar