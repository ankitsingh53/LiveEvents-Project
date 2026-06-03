import Box from "@mui/material/Box";
import { useContext, useState } from "react";
import { NameContext } from "./Home";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader";
import "../App.css";
interface ItemData {
  id: number | string;
  name: {
    text: string;
  };
  description: {
    text: string;
  };
}
// type GetSpecific = (pageNumber: number) => void;
const API_KEY: string = import.meta.env.VITE_API_KEY;
const Product = () => {
  const context = useContext(NameContext);
  const [currentpage, SetCurrentPage] = useState(1);
  const [popUp, setpopUp] = useState<boolean>(false);
  const [deleteId, setDeleteID] = useState<number | null>();
  if (!context) return;
  const { filterData, loading, err, fetchEvent, setErr } = context;
  const itemsPerPage = 10;
  const starIndex = (currentpage - 1) * itemsPerPage;
  const endIndex = starIndex + itemsPerPage;
  const currentItems = filterData.slice(starIndex, endIndex);
  const totalPages = Math.ceil(filterData.length / itemsPerPage);
  const goToSpecificPage = (pageNumber: number) => {
    SetCurrentPage(pageNumber);
  };
  const handleDelete = async (id: number) => {
    try {
      const result = await fetch(`https://www.eventbriteapi.com/v3/events/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      if (result.ok) {
        fetchEvent();
        toast.success("Event Deleted Successfully", {
          autoClose: 2000,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        setErr(error.message);
      }
    }
  };
  if (loading) {
    return <Loader />;
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
          margin: "70px",
          gap: "50px",
        }}
      >
        {currentItems.length !== 0 ? (
          currentItems.map((item: ItemData) => (
            <Box
              key={item.id}
              sx={{
                padding: "30px",
                boxShadow: "0 0 10px 0",
                width: "300px",
                minHeight: "350px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflowWrap: "break-word",
              }}
            >
              <Box>
                <h2>{item.name?.text}</h2>
                <p>{item.description?.text}</p>
              </Box>
              <Stack spacing={1}>
                <Button
                  sx={{ backgroundColor: "rgb(14, 114, 28)", color: "white" }}
                >
                  <Link
                    to={`/productdetails/${item.id}`}
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    View Details
                  </Link>
                </Button>
                <Button
                  sx={{ backgroundColor: "rgb(20, 81, 112)", color: "white" }}
                >
                  <Link
                    to={`/update/${item.id}`}
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    Update Event
                  </Link>
                </Button>
                <Button
                  sx={{ backgroundColor: "rgb(161, 9, 9)", color: "white" }}
                  onClick={() => {
                    setDeleteID(Number(item.id));
                    setpopUp(true);
                  }}
                >
                  Delete
                </Button>
              </Stack>
            </Box>
          ))
        ) : (
          <h2>Results not found</h2>
        )}
        {popUp && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 999,
            }}
          >
            <Box
              sx={{
                background: "white",
                padding: "30px",
                borderRadius: "10px",
                textAlign: "center",
              }}
            >
              <h3>Are you sure you want to delete?</h3>
              <Stack direction="row" spacing={1} sx={{ marginTop: "10px" }}>
                <Button variant="contained" onClick={() => setpopUp(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleDelete(Number(deleteId));
                    setpopUp(false);
                  }}
                  sx={{ backgroundColor: "rgb(161, 9, 9)", color: "white" }}
                >
                  Yes
                </Button>
              </Stack>
            </Box>
          </Box>
        )}
      </Box>
      {currentItems.length !== 0 && (
        <div
          style={{
            margin: "20px auto",
            padding: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <button
            style={{
              padding: "10px",
              fontSize: "1rem",
              borderRadius: "10px",
            }}
            onClick={() => SetCurrentPage((prev) => prev - 1)}
            disabled={currentpage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => goToSpecificPage(i + 1)}
              className={currentpage === i + 1 ? "active" : ""}
              style={{
                padding: "10px",
                fontSize: "1rem",
                border: "none",
                outline: "none",
                borderRadius: "10px",
              }}
            >
              {i + 1}
            </button>
          ))}
          <button
            style={{
              padding: "10px",
              fontSize: "1rem",
              borderRadius: "10px",
            }}
            onClick={() => SetCurrentPage((prev) => prev + 1)}
            disabled={currentpage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default Product;
