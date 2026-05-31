import Box from "@mui/material/Box";
import { useContext } from "react";
import { NameContext } from "./Home";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader";

const API_KEY:String = import.meta.env.VITE_API_KEY;

const Product = () => {
  const { filterData, loading, err, fetchEvent } = useContext(NameContext);

  const handleDelete = async (id:Number) => {
    const check:Boolean = confirm("Do you really want to delete this event");
    if (check) {
      try {
        const result = await fetch(`/api/v3/events/${id}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        });
        // if (result.ok) {
        //   fetchEvent();
        //   toast.success("Event Deleted Successfully",{
        //     autoClose:1000
        //   })
        // }
          fetchEvent();
          toast.success("Event Deleted Successfully",{
            autoClose:1000
          })   
      } catch (error) {
        console.log(error);
      }
    }
  };
  if (loading) {
    return <Loader/>
  }
  if (err) {
    return <h3>Error: {err}</h3>;
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
        {filterData.length!==0 ? filterData.map((item) => (
          <Box
            key={item.id}
            sx={{
              padding: "30px",
              boxShadow: "0 0 10px 0",
              width: "300px",
              minHeight: "250px",
              height: "auto"
            }}
          >
            <h2>{item.name?.text}</h2>
            <p>{item.description?.text}</p>
            <Stack spacing={1}>
              <Button sx={{ backgroundColor: "grey", color: "white" }}>
                 <Link
                  to={`/productdetails/${item.id}`}
                  style={{ textDecoration: "none", color: "white" }}
                >
                View Details
                </Link>
              </Button>
              <Button sx={{ backgroundColor: "grey", color: "white" }}>
                <Link
                  to={`/update/${item.id}`}
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Update Event
                </Link>
              </Button>
              <Button
                sx={{ backgroundColor: "grey", color: "white" }}
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </Button>
            </Stack>
          </Box>
        )) : <h2>Results not found</h2>
      }
      </Box>
    </>
  );
};

export default Product;
