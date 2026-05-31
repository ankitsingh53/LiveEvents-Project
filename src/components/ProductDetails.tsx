import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface CurrentEvent {
  id: string;
  name:{
    text: string
  };
  description: {
    text: string
  }
  start: {
    local: String | Number | Date
  }
  end: {
    local: String | Number | Date
  }
}

const API_KEY:String = import.meta.env.VITE_API_KEY;

const ProductDetails = () => {
  const { id } = useParams();
  const [result, setResult] = useState<CurrentEvent| any>();
  const [loading, setLoading] = useState<Boolean>(true)
  const [err, setErr] = useState<String>("")

  const navigate = useNavigate();
  
  useEffect(()=>{
    const fetchData = async () => {
    try {
      const response = await fetch(`/api/v3/events/${id}/`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response failed...");
      }
      const data = await response.json();   
      setResult(data);
    } catch (error) {
      if(error instanceof Error){
        setErr(error.message)
      }else{
        setErr("Something went wrong")
      }
    }finally{
        setLoading(false)
    }
  };

  fetchData()
  },[id])

  if(loading){
    return <h2>Loading...</h2>
  }
  if (err) {
    return <h3>Error: {err}</h3>;
  }
  const eventDate = new Date(result?.start?.local)
  const date = eventDate.toLocaleDateString()
  const time = eventDate.toLocaleTimeString("en-IN")

  const endtime = new Date(result?.end?.local).toLocaleTimeString("en-IN")


  return (
    <>
      <Box
        sx={{
          padding: "30px",
          boxShadow: "0 0 10px 0",
          width: "300px",
          minHeight: "250px",
          height: "auto",
          textAlign: "justify",
          margin: "40px",
        }}
      >
        <h2>{result?.name?.text}</h2>
        <p>{result?.description.text}</p>
        <p>Date:- {date}</p>
        <p>Start time:- {time}</p>
        <p>End time:- {endtime}</p>

        <Button
            variant="contained"
            size="large"
            color="primary"
            type="submit"
            onClick={() => navigate("/")}
          >
            Go To Home Page
          </Button>

      </Box>
    </>
  );
};

export default ProductDetails;
