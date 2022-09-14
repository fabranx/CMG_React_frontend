import './App.css';
import TopBar from './components/topbar.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/home/home";
import Login from "./components/login/login";
import Registrazione from "./components/registrazione/registrazione";
import VerificaEmail from './components/verifica_email/verifica_email';
import VerificaEmailResend from './components/verifica_email/verifica_email_resend';
import Loading from './components/loadingpage/loadingpage'
import Dashboard from './components/dashboard/dashboard';
import NotFound from './components/not_found/notfound';
import Profilo from './components/profilo/paginaProfilo';
import ResetPassword from './components/reset_password/reset_password';
import ResetPasswordConfirm from './components/reset_password/reset_password_confirm';
import Cinema from './components/cinema/cinema';
import CinemaDetail from './components/cinema/cinema_detail';
import Giochi from './components/giochi/giochi';
import GiochiDetail from './components/giochi/giochi_detail';
import Musica from './components/musica/musica';
import MusicaDetail from './components/musica/musica_detail';
import React from 'react';
import { LoginContext } from "./components/context";
import { useEffect, useState } from 'react';
import {client} from "./Client";


function App() {
  const [isloading, setIsloading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
		client.refreshLogin()
			.then((res) => {
        let access = res.data.access
        let refresh = res.data.refresh
        return {access: access, refresh: refresh}
			})
      .then(tokens => {
        client.getUserFromToken(tokens.access)
          .then((res) => {
            let data = {
              access: tokens.access,
              refresh: tokens.refresh,
              user: {
                email: res.data.email,
                pk: res.data.user_id,
                username: res.data.user,
              }
            }
            client.setUserData(data)
            setIsLoggedIn(true)
            setIsloading(false)
          })
          .catch(error => {
            setIsloading(false)
          })
      })
			.catch((error) => {
        setIsloading(false)
			})
	}, [])

  return (
    <>
    {isloading ?
      <Loading />
      :
      <LoginContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
      <Router>
          <div style={{position:'static', top:'0', right:'0', bottom:'0', left:'0', width:'100%'}}>
            <TopBar/>
            <Switch>
              <Route exact path="/">
                <Home/>
              </Route>
              <Route exact path="/login">
                <Login/>
              </Route>
              <Route exact path="/registrazione">
                <Registrazione/>
              </Route>
              <Route path="/registrazione/verifica-email/:id">
                <VerificaEmail/>
              </Route>
              <Route exact path="/dashboard">
                <Dashboard/>
              </Route>
              <Route path="/profilo/:username">
                <Profilo/>
              </Route>
              <Route path="/reset-password">
                <ResetPassword/>
              </Route>
              <Route path="/password-reset-confirm/:uid/:token">
                <ResetPasswordConfirm/>
              </Route>
              <Route path="/resend-verification-email">
                <VerificaEmailResend/>
              </Route>
              <Route exact path="/cinema">
                <Cinema/>
              </Route>
              <Route path="/cinema/:tmdbID/">
                <CinemaDetail/>
              </Route>
              <Route exact path="/videogiochi">
                <Giochi/>
              </Route>
              <Route path="/videogiochi/:igdbID/">
                <GiochiDetail/>
              </Route>
              <Route exact path="/musica">
                <Musica/>
              </Route>
              <Route path="/musica/:albumID/">
                <MusicaDetail/>
              </Route>
              
              <Route path="*">
                <NotFound/>
              </Route>
            </Switch>
          </div>
        </Router>
      </LoginContext.Provider>
    }
    </>
  );
}

export default App;
