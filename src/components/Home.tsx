import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import Product from "./Product";
import { useState, useEffect } from "react";
import { createContext } from "react";
import CreateEvent from "./CreateEvent";
import Update from "./Update";
import ProductDetails from "./ProductDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface Event {
  id: string;
  name: {
    text: string;
  };
  description: {
    text: string;
  };
}
interface ContextData {
  eventData: Event[] | null;
  setEventData: React.Dispatch<React.SetStateAction<Event[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  err: string | "";
  fetchEvent: () => void;
  search: string | "";
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  filterData: Event[];
  setErr: React.Dispatch<React.SetStateAction<string>>;
}
const API_KEY: string = import.meta.env.VITE_API_KEY;
export const NameContext = createContext<ContextData | null>(null);
const Home = () => {
  const [eventData, setEventData] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [debounceSearch, setDebounceSearch] = useState<string>("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearch(search);
    }, 800);
    return () => clearTimeout(timer);
  }, [search]);
  const fetchEvent = async (): Promise<void> => {
    try {
      const result = await fetch(
        "https://www.eventbriteapi.com/v3/organizations/3003835690035/events/",
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
      setEventData(data?.events);
    } catch (error) {
      if (error instanceof Error) {
        setErr(error.message);
      } else {
        setErr("Something is Wrong");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const load = async () => {
      await fetchEvent();
    };
    load();
  }, []);
  const filterData: Event[] = eventData.filter((item) =>
    item.name.text.toLowerCase().includes(debounceSearch.trim().toLowerCase()),
  );
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
          filterData,
          setErr,
        }}
      >
        <ToastContainer />
        <BrowserRouter basename="/LiveEvents-Project">
          <NavBar />
          <Routes>
            <Route path="/" element={<Product />} />
            <Route path="/create" element={<CreateEvent />} />
            <Route path="/update/:id" element={<Update />} />
            <Route path="/productdetails/:id" element={<ProductDetails />} />
          </Routes>
        </BrowserRouter>
      </NameContext.Provider>
    </>
  );
};

export default Home;
