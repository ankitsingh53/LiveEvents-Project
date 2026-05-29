import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import Product from './Product';

const Home = () => {
  return (
    <>
    <BrowserRouter>
    <NavBar/>
    <Routes>
        <Route path='/' element={<Product/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default Home