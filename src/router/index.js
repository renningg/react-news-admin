import { useRoutes } from 'react-router-dom'
import React from 'react'
import Login from '../views/login/Login'
import NewsSand from '../views/NewsSand/NewsSand'
import Redirect from '../utils/Redirect'
import NotFound from '../views/404/404'
import News from '../views/news-visitor/News'
import Detail from '../views/news-visitor/Detail'
export default function Index() {
  const element = useRoutes([
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/news-visitor',
      element: <News />
    },
    {
      path: '/detail/:id',
      element: <Detail></Detail>
    },
    {
      path: '*',
      element: <AuthComponent><NewsSand /></AuthComponent>
    },
    {
      path: '*',
      element: <NotFound />
    },
  ])
  return (
    element
  )
  // return (
  //   <BrowserRouter>
  //     <Routes>
  //       <Route path='/login' element={<Login></Login>}></Route>
  //       <Route path='/news-visitor' element={<News></News>}></Route>
  //       <Route path='/detail/:id' element={<Detail></Detail>}></Route>
  //       <Route path='*' element={<AuthComponent><NewsSand>
  //       </NewsSand></AuthComponent>}></Route>
  //       <Route path='*' element={<NotFound></NotFound>} />
  //     </Routes>
  //   </BrowserRouter>
  // )
}

function AuthComponent({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Redirect to='/login'></Redirect>
}
