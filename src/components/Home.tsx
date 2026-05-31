import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import Product from "./Product";
import { useState, useEffect } from "react";
import { createContext } from "react";
import CreateEvent from "./CreateEvent";
import Update from "./Update";
import ProductDetails from "./ProductDetails";

interface Event {
  id: string;
  name:{
    text: string
  };
  description: {
    text: string
  }
}

const API_KEY:String = import.meta.env.VITE_API_KEY;

export const NameContext = createContext<any>(null);

const Home = () => {
  const [eventData, setEventData] = useState<Event[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [err, setErr] = useState<String>("");
  const [search, setSearch] = useState<String>("");
  const [debounceSearch, setDebounceSearch] = useState<String>("")


  useEffect(()=>{
    const timer = setTimeout(()=>{
        setDebounceSearch(search);
    }, 800)
    return()=>clearTimeout(timer)
  }, [search])

  const fetchEvent = async ():Promise<void> => {
    try {
      const result = await fetch(
        "/api/v3/organizations/3003835690035/events/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (!result.ok) {
        throw new Error("Network response failed...");
      }
      const data = await result.json();
      console.log(data.events);
      setEventData(data?.events);
    } catch (error) {
      if(error instanceof Error){
        setErr(error.message);
      }else{
        setErr("Something is Wrong")
      } 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  const filterData = eventData.filter((item)=>item.name.text.toLowerCase().includes(debounceSearch.trim().toLowerCase()))


  return (
    <>
      <NameContext.Provider
        value={{
          eventData,
          setEventData,
          loading,
          setLoading,
          err,
          fetchEvent,
          search,
          setSearch,
          filterData
        }}
      >
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<Product />} />
            <Route path="/create" element={<CreateEvent />} />
            <Route path="/update/:id" element={<Update />}/>
            <Route path="/productdetails/:id" element={<ProductDetails />}/>
          </Routes>
        </BrowserRouter>
      </NameContext.Provider>
    </>
  );
};

export default Home;
