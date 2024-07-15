import { createBrowserRouter } from 'react-router-dom'
import Main from '../layouts/Main'
import Home from '../pages/Home/Home'
import ErrorPage from '../pages/ErrorPage'
import PrivateRoute from './PrivateRoute';
import Login from '../pages/Login/Login';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <PrivateRoute><Home /></PrivateRoute>,
      },
    ],
  },
  { path: '/login', element: <Login /> },
  // { path: '/signup', element: <SignUp /> },
])
