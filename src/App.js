import './App.css';
import React from 'react'
import BaseRouter from './router'
import 'antd/dist/antd.min.css';
import { Provider } from 'react-redux'
import store from './redux/store'
import {BrowserRouter} from 'react-router-dom'
export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
      <BaseRouter></BaseRouter>
      </BrowserRouter>
      
    </Provider>

  )
}



