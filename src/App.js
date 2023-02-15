import React from 'react'
import Login from './components/users/loginRegister';
import Profile from './components/profile/Profile';
import Post from './components/posts/Post'
import Feed from './components/Feed/Feed'
import { getUserbyID } from "./components/users/api";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom' 

export default class App extends React.Component {
  constructor(props) {
    super(props)

    // Retrieve token from local storage
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        return tokenString || '';
    };

    this.state = {
      token: getToken(),
      currentUser: {
        id: '',
        firstName: 'fake',
        lastName: '',
        userName: '',
        // password: '',
        // email: '',
        // location: '',
        friends: [],
        // posts: [''],
        // img: '',
        // timestamps: ''
      }
    };
  }

  // Removes token from local storage and sets URL to /login 
  logout = () => {
    localStorage.removeItem('token');
    this.setState({
      token: ''
    }, () => {
      window.history.pushState({}, 'Login', '/login');
    });
  }
  
  
  updateCurrentUserFromDatabase = (userId) => {
    setTimeout(500)
    console.log('***********')
    getUserbyID(userId)
    .then((response) => {
      console.log(response.data.users.location)
      this.setState({
        currentUser : {
          id: userId,
          firstName: response.data.users.firstName,
          lastName: response.data.users.lastName,
          userName: response.data.users.userName,
          password: response.data.users.password,
          email: response.data.users.email,
          location: response.data.users.location,
          friends: response.data.users.friends,
          posts: response.data.users.posts,
          img: response.data.users.img,
          timestamps: response.data.users.timestamps,
        }
      })
      
    })
  }



  // method to take all users returned from the database from the getAllUsers api and add them to the users state
  setUsers = (users) => {
    this.setState({
      users: users,
    })
  }

  setCurrentUser = (currentUser) => {
    this.setState({ currentUser })
  }

  // Saves token to local storage
  saveToken = (userToken) => {
    localStorage.setItem('token', userToken);
    this.setState({
      token: userToken
    });
  };

  render() {
    const { token } = this.state;

    // Checks if a token exists if not the login page is loaded
    if (!token) {
      return <Login setToken={this.saveToken} 
      setCurrentUser={this.setCurrentUser}/>;
    } else {

    return(
      <Router>
        <>
        
          <h1>Naptser Social app</h1>

          {/* Nav bar links to each React Route */}
          <nav>
            <Link to = "/feed">Feed</Link>
            <Link to = "/profile">Profile</Link>

            {/* Logout button */}
            <button onClick={this.logout}>Logout</button>
          </nav>

          {/* Creating the React Paths to different pages */}
          <Route path = "/feed" component={() => <Feed/>}/> 
          <Route path = "/profile" component={() => <Profile currentUser={this.state.currentUser}
                                                             updateCurrentUserFromDatabase={this.updateCurrentUserFromDatabase}/>}/>

        </>
      </Router>
    )
    }
  }
} 

// Alternative code to use functional components 
// import useToken from './useToken';
// import { useState } from 'react';


// function App() {

//   const { token, setToken } = useToken();

//   const logout = () => {
//     localStorage.removeItem('token');
//     setToken('');
//   };

//   if(!token) {
//     return <Login setToken={setToken} />
//   } else {
//   return(
//     <div className="wrapper">
//       <h1>Application</h1>
//       <button onClick={logout}>Logout</button>
//       <BrowserRouter>
//           <Route path="/feed">
//             {/* <Feed /> */}
//           </Route>
//           <Route path="/profile">
//             {/* <Profile /> */}
//           </Route>
//       </BrowserRouter>
//     </div>
//   );
// }
// }

// export default App;
