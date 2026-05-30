import Box from "@mui/material/Box";
import { useContext } from "react";
import { NameContext } from "./Home";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const API_KEY = import.meta.env.VITE_API_KEY;

const Product = () => {
  const { eventData, loading, err, fetchEvent } = useContext(NameContext);

  const handleDelete = async (id) => {
    const check = confirm('Do you really want to delete this event')
    if(check){
    try {
     const result =  await fetch(
        `/api/v3/events/${id}/`,
        {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        },
      );
      if(result.ok){
      await fetchEvent();
      }

    } catch (error) {
        console.log(error)
    }
  }
  };

  if (loading) {
    return <h5>Loading...</h5>;
  }
  if (err) {
    return <h5>Error: {err}</h5>;
  }
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          margin: "30px",
          gap: "50px",
        }}
      >
        {eventData.map((item) => (
          <Box
            key={item.id}
            sx={{
              padding: "30px",
              boxShadow: "0 0 10px 0",
              width: "300px",
              minHeight: "250px",
              height: "auto",
              textAlign: "justify",
            }}
          >
            <h2>{item.name?.text}</h2>
            <p>{item.description?.text}</p>
            <Stack spacing={1}>
              <Button sx={{ backgroundColor: "grey", color: "white" }}>
                View Details
              </Button>
              <Button sx={{ backgroundColor: "grey", color: "white" }}>
               <Link to='/update' style={{textDecoration: 'none', color: 'white'}}>Update Event</Link>
              </Button>
              <Button
                sx={{ backgroundColor: "grey", color: "white" }}
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </Button>
            </Stack>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default Product;
