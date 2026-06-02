import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
interface CurrentEvent {
  id: string;
  name: {
    text: string;
  };
  description: {
    text: string;
  };
  start: {
    local: string;
    utc: string;
    timezone: string;
  };
  end: {
    local: string;
    utc: string;
    timezone: string;
  };
}
const API_KEY: string = import.meta.env.VITE_API_KEY;
const ProductDetails = () => {
  const { id } = useParams();
  const [result, setResult] = useState<CurrentEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string>("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/v3/events/${id}/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response failed...");
        }
        const data = await response.json();
        setResult(data);
      } catch (error) {
        if (error instanceof Error) {
          setErr(error.message);
        } else {
          setErr("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
  if (loading) {
    return <Loader />;
  }
  if (err) {
    return <h3>Error: {err}</h3>;
  }
  if(!result) return;
  const eventDate = new Date(result.start.local);
  const date = eventDate.toLocaleDateString();
  const time = eventDate.toLocaleTimeString("en-IN");
  const endtime = new Date(result?.end?.local).toLocaleTimeString("en-IN");
  return (
    <>
      <Box
        sx={{
          padding: "30px",
          boxShadow: "0 0 10px 0",
          width: "40%",
          minHeight: "250px",
          height: "auto",
          textAlign: "justify",
          margin: "60px",
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
          sx={{ display: "flex", alignItems: "flex-end" }}
        >
          Go To Home Page
        </Button>
      </Box>
    </>
  );
};
export default ProductDetails;
