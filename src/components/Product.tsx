import React from 'react'
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';

const Product = () => {

    const[eventData, setEventData] = useState()

    useEffect(()=>{
        const fetchEvent = async ()=>{
            try {
                const result = await fetch('https://www.eventbriteapi.com/v3/organizations/3003649951906/events/', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer E757XUPYRQE7FTXWUBAN',
                        'Content-Type': 'application/json'
                    }
                })
                const data = await result.json();
                console.log(data.events)
                // setEventData(data);
            } catch (error) {
                console.log('Server error:', error)
            }
        }

        // fetchEvent();
    },[])

  return (
    <>
    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', margin: '30px'}}>
        <Box sx={{padding: '30px', boxShadow: '0 0 10px 2px'}}>
            <div>Image</div>
            <h1>Hello</h1>
            <p>Description</p>
        </Box>
    </Box>
    </>
  )
}

export default Product