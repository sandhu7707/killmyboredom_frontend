import './App.css';
import BusinessRegistration from './business-registration/business-registration';
import Home from './home/home';
import {createBrowserRouter, RouterProvider} from 'react-router';
import NavBar from './nav-bar/nav-bar';
import RegisterUser from './register-user/register-user';
import { getUserDetails, UserContext } from './utils/user-utils';
import { useState } from 'react';
import BusinessPageById from './business-page/business-page-by-id';
import RegisteredBusinesses from './business-page/registered-businesses/registered-businesses';
import EditBusinessDetails from './edit-business-details/edit-business-details';
import SignInUser from './signin-user/signin-user';
import { CssVarsProvider, extendTheme } from '@mui/joy';

function App() {
  console.log('App:rendered')

  const [user, setUser] = useState(getUserDetails())
  const router = createBrowserRouter([
    {
      path: '/',
      Component: NavBar,
      children: [{
        path: '/',
        Component: Home
      },
      {
        path: "/business-registration",
        Component: BusinessRegistration
      },{
        path: '/register-user',
        Component: RegisterUser
      },{
        path: '/business-page/:businessId',
        Component: BusinessPageById
      },{
        path: '/edit-business-details/:businessId',
        Component: EditBusinessDetails
      },{
        path: '/registered-businesses',
        Component: RegisteredBusinesses
      },{
        path: 'sign-in',
        Component: SignInUser
      }]
    }
  ])
  return (
    <div id="app" className="App">
        <UserContext value={{user, setUser}}>
          <RouterProvider router={router}></RouterProvider>
        </UserContext>
    </div>
  );
}

export default App;
