import axios from 'axios'


// const address = 'http://localhost:8080'
const address = 'https://boiling-hollows-71659.herokuapp.com'

class Client {
    constructor() {
        this.token = null
        this.refresh = null
        this.username = null
        this.email = null
        this.pk = null
        this.withCredentials = true
    }

    isLoggedIn() {
        return !!this.token
    }

    setUserData(data) {
        this.token = data?.access_token || data?.access // access_token risposta da login |  access risposta da refresh quando si aggiorna la pagina
        this.refresh = data?.refresh_token || data?.refresh // refresh_token risposta da login |  refresh risposta da refresh quando si aggiorna la pagina
        this.username = data.user?.username
        this.email = data.user?.email
        this.pk = data.user?.pk
    }

    getUserData() {
        return {
            token: this.token,
            refresh: this.refresh,
            email: this.email,
            pk: this.pk,
            username: this.username,
        }
    }

    deleteUserData() {
        this.token = null
        this.refresh = null
        this.username = null
        this.email = null
        this.pk = null
    }

    /* AUTH REQUESTS  */

	refreshLogin() {
        let data = {}
        if(this.refresh)
            data.refresh = this.refresh
		return axios.post(`${address}/api/rest-auth/token/refresh/`, data, {
            withCredentials: this.withCredentials, 
            timeout: 20000
        })
	}

    tokenVerification() {
        return axios.post(`${address}/api/rest-auth/token/verify/`, {
            token: this.token
            }, {
                headers: {
                    'Authorization' : `JWT ${this.token}`
                },
                withCredentials: true, 
                timeout: 20000
            }
        )
    }

    login(data) {
        this.withCredentials = data?.ricordami || false
		return axios.post(`${address}/api/rest-auth/login/`, {
			email: data.email,
			password: data.password,
		}, {withCredentials: data?.ricordami || false, timeout: 20000})
    }

    logout() {
		return axios.post(`${address}/api/rest-auth/logout/`, {
            refresh: this.refresh
		}, 
        {    
            withCredentials: true, 
            timeout: 20000
        })
    }

	registration(formData) {
		return axios.post(`${address}/api/rest-auth/registration/`,formData, 
        {   
            withCredentials: true,
            timeout: 20000
        })
	}

    verifyEmail(id) {
        return axios.post(`${address}/api/rest-auth/registration/verify-email/`, {
            key: id,
        }, {withCredentials: true, timeout: 20000})
    }

    passwordChange(data) {
        return axios.post(`${address}/api/rest-auth/password/change/`,
        {
            new_password1: data.new_password1,
            new_password2: data.new_password2,
            old_password: data.old_password
        }, {
            headers: {
                'Authorization' : `JWT ${this.token}`
            },
            withCredentials: true, 
            timeout: 20000
        })
    }

    
    passwordReset(email) {
        return axios.post(`${address}/api/rest-auth/password/reset/`,
        {
            email: email,
        }, {timeout: 20000})
    }

    passwordResetConfirm(data){
        return axios.post(`${address}/password-reset-confirm/${data.uid}/${data.token}/`,
        {
            uid: data.uid,
            token: data.token,
            new_password1: data.new_password1,
            new_password2: data.new_password2
        }, {timeout: 20000})
    }

    resendVerificationEmail(email){
        return axios.post(`${address}/api/rest-auth/registration/resend-email/`,
        {
            email: email
        }, {timeout: 20000})
    }

    /* API DATA REQUESTS */

    getUserFromToken(access_token) {
        return axios.post(`${address}/api/users/userfromtoken/`,{
            token: access_token
        },{
            headers: {
                'Authorization' : `JWT ${access_token}`
            },
            withCredentials: true, timeout: 20000
        })
    }

    getUsers() {
        return axios.get(`${address}/api/users/`)
    }

    getProfile(username) {
        return axios.get(`${address}/api/users/${username}/`, 
        {
            headers: {
                'Authorization' : `JWT ${this.token}`
            },
            withCredentials: true, timeout: 20000
        })
    }

    putProfileSettings(data, contentType) {
        if (!contentType)
            contentType = 'application/json'
        return axios.put(`${address}/api/users/${this.username}/`,
        data, 
        {
            headers: {
                'content-type': contentType,
                'Authorization' : `JWT ${this.token}`
            },
            withCredentials: true,
            timeout: 20000
        })
    }


    getMoviesByUser(username) {
       return axios.get(`${address}/api/movies/byuser/${username}/`,
        {
            withCredentials: true,
            timeout: 20000
        })
    }

    postMovieReview(data){
        return axios.post(`${address}/api/movies/`,
        data, {
            headers: {
                'Authorization' : `JWT ${this.token}`
            },
            withCredentials: true, 
            timeout: 20000})
    }

    putMovieReview(data, reviewId){
        return axios.put(`${address}/api/movies/${reviewId}/`,
        data, {
            headers: {
                'Authorization' : `JWT ${this.token}`
            },
            withCredentials:true, timeout: 20000
        })
    }

    deleteMovieReview(reviewId){
        return axios.delete(`${address}/api/movies/${reviewId}`,
        {
            headers:{
                'Authorization' : `JWT ${this.token}`
            },
            withCredentials:true, timeout: 20000
        })
    }

    getReviewsByMovieId(movieId){
        return axios.get(`${address}/api/movies/bymovieId/${movieId}`,
        {
            withCredentials: true,
            timeout: 20000
        })
    }

    getReviewsByGameId(igdbID){
        return axios.get(`${address}/api/games/bygameId/${igdbID}`,
        {
            withCredentials: true,
            timeout: 20000
        })
    }

    getReviewsByAlbumId(albumID){
        return axios.get(`${address}/api/music/byAlbumId/${albumID}`,
        {
            withCredentials: true,
            timeout: 20000
        })
    }



    getGamesByUser(username) {
        return axios.get(`${address}/api/games/byuser/${username}/`,
         {
             withCredentials: true,
             timeout: 20000
         })
     }


     postGameReview(data){
        return axios.post(`${address}/api/games/`,
        data, {
            headers: {
                'Authorization' : `JWT ${this.token}`
            },
            withCredentials: true, 
            timeout: 20000})
    }

    putGameReview(data, reviewId){
        return axios.put(`${address}/api/games/${reviewId}/`,
        data, {
            headers: {
                'Authorization' : `JWT ${this.token}`
            },
            withCredentials:true, timeout: 20000
        })
    }

    deleteGameReview(reviewId){
        return axios.delete(`${address}/api/games/${reviewId}`,
        {
            headers:{
                'Authorization' : `JWT ${this.token}`
            },
            withCredentials:true, timeout: 20000
        })
    }

    
    getMusicByUser(username) {
        return axios.get(`${address}/api/music/byuser/${username}/`,
         {
             withCredentials: true,
             timeout: 20000
         })
     }


     postMusicReview(data){
        return axios.post(`${address}/api/music/`,
        data, {
            headers: {
                'Authorization' : `JWT ${this.token}`
            },
            withCredentials: true, 
            timeout: 20000})
    }

    putMusicReview(data, reviewId){
        return axios.put(`${address}/api/music/${reviewId}/`,
        data, {
            headers: {
                'Authorization' : `JWT ${this.token}`
            },
            withCredentials:true, timeout: 20000
        })
    }

    deleteMusicReview(reviewId){
        return axios.delete(`${address}/api/music/${reviewId}`,
        {
            headers:{
                'Authorization' : `JWT ${this.token}`
            },
            withCredentials:true, timeout: 20000
        })
    }

    // TMDB REQUESTS

    LatestMoviesTMDB(generi, controller){
        return axios.post(`${address}/api/movies/tmdb/movies/`, {
            generi: generi,
        }, {timeout: 20000, signal: controller.signal})
    }

    SearchMoviesTMDB(query){
        return axios.post(`${address}/api/movies/tmdb/search/`, {
            query: query
        }, {timeout: 20000})
    }

    MovieInfo(id){
        return axios.post(`${address}/api/movies/tmdb/moviebyID/`, {
            movieID: id
        },{timeout: 20000})
    }

    // IGDB REQUESTS

    LatestGamesIGDB(generi, controller){
        return axios.post(`${address}/api/games/igdb/games/`, {
            generi:generi,
        }, {timeout:20000, signal: controller.signal})
    }

    SearchGamesIGDB(query){
        return axios.post(`${address}/api/games/igdb/search/`, {
            query: query
        }, {timeout: 20000})
    }

    GameInfo(id){
        return axios.post(`${address}/api/games/igdb/gamebyID/`, {
            gameID: id
        },{timeout: 20000})
    }
    

    // SPOTIFY REQUESTS

    LatestAlbumSpotify(generi, controller){
        return axios.post(`${address}/api/music/spotify/album/`, {
            generi:generi,
        }, {timeout:20000, signal: controller.signal})
    }

    SearchAlbumSpotify(query, type){
        return axios.post(`${address}/api/music/spotify/search/`, {
            query: query,
            type: type
        }, {timeout: 20000})
    }

    AlbumInfoSpotify(id){
        return axios.post(`${address}/api/music/spotify/albumbyID/`, {
            albumID: id
        },{timeout: 20000})
    }
}

export const client = new Client();


export const requestsWithTokenHandler = (toSubmitFunction, errorOnRefreshTokenFunction) => {
    // richiesta nuovo token se il token fornito è scaduto

    client.tokenVerification()
    .then(() => {
        toSubmitFunction()
    })
    .catch((err) => {
      let prevData = client.getUserData()
      client.refreshLogin()
      .then((res) => {
        let newData = {
          access: res.data.access,
          refresh: res.data.refresh,
          user: {
            email: prevData.email,
            pk: prevData.pk,
            username: prevData.username,
          }
        }
        client.setUserData(newData)
        toSubmitFunction()
      })
      .catch(() => {
        client.logout()
        .then(() => {errorOnRefreshTokenFunction()})
        .catch(() => {errorOnRefreshTokenFunction()})
      })
    })
}