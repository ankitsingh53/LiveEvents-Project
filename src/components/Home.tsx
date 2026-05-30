import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import Product from './Product';
import { useState, useEffect } from 'react';
import { createContext } from 'react';
import CreateEvent from './CreateEvent';
import Update from './Update';

const API_KEY = import.meta.env.VITE_API_KEY;

export const NameContext = createContext(null);

const Home = () => {

    const[eventData, setEventData] = useState([])
    const[loading, setLoading] = useState(false)
    const[err, setErr] = useState()


    const fetchEvent = async ()=>{
                try {
                    const result = await fetch('/api/v3/organizations/3003649951906/events/', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${API_KEY}` ,
                            'Content-Type': 'application/json'
                        }
                    })
                    if(!result.ok){
                        throw new Error("Network response failed...")
                    }
                    const data = await result.json();
                    console.log(data.events)
                    setEventData(data?.events);
                } catch (error) {
                    console.log('Server error:', error.message)
                    setErr(error.message)
                }finally{
                    setLoading(false)
                }
            }

     useEffect(()=>{
            fetchEvent();
        },[])

  return (
    <>
    <NameContext.Provider value={{eventData, setEventData,loading,setLoading, err, fetchEvent}}>
    <BrowserRouter>
    <NavBar/>
    <Routes>
        <Route path='/' element={<Product/>}/>
        <Route path='/create' element={<CreateEvent/>}/>
        <Route path='/update' element={<Update/>}/>
    </Routes>
    </BrowserRouter>
    </NameContext.Provider> 
    </>
  )
}

export default Home