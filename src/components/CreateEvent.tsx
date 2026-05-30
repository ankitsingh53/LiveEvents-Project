import { Box, Typography, Stack, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { NameContext } from "./Home";

const CreateEvent = () => {
     const {fetchEvent} = useContext(NameContext);

  const [err, setErr] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    summary: "",
    date: "",
    start_time: "",
    end_time: "",
    currency: "",
  });

  const API_KEY = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // console.log(formData)

  const changeToUtc = (date, time)=>{
    return new Date(`${date}T${time}`).toISOString().replace(".000Z", "Z");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await fetch("/api/v3/organizations/3003649951906/events/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: {
            name: {
              html: formData.name
            },
            start: {
              timezone: "Asia/Kolkata",
              utc: changeToUtc(formData.date, formData.start_time),
            },
            end: {
              timezone: "Asia/Kolkata",
              utc: changeToUtc(formData.date, formData.end_time),
            },
            currency: formData.currency,
            summary: formData.summary
          },
        }),
      });

      if(result.ok){
      await fetchEvent();
      }

      const data = await result.json();
      console.log("Created Event:", data);
    } catch (error) {
        setErr(error.message)
    }
  };

  if(err){
    return <h1>Server Error: ${err}</h1>
  }

//   console.log(value);

  return (
    <>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{ margin: "5% 25%", width: "40%", padding: "20px" }}
        onSubmit={handleSubmit}
      >
        <Typography variant="h3" gutterBottom>
          Create an event
        </Typography>
        <Stack spacing={2} sx={{ margin: "10px" }}>
          <Typography variant="body1" gutterBottom>
            What’s the name of your event?
          </Typography>
          <TextField
            id="outlined-basic"
            label="Event title"
            variant="outlined"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <Typography variant="body1" gutterBottom>
            Short summary of an event
          </Typography>
          <TextField
            id="outlined-basic"
            label="Summary"
            variant="outlined"
            name="summary"
            type="text"
            value={formData.summary}
            onChange={handleChange}
          />
          <Typography variant="body1" gutterBottom>
            When does your event start?
          </Typography>
          <TextField
            id="outlined-basic"
            variant="outlined"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
          />
          <Typography variant="body1" gutterBottom>
            Start Time:
          </Typography>
          <TextField
            id="outlined-basic"
            variant="outlined"
            name="start_time"
            type="time"
            value={formData.start_time}
            onChange={handleChange}
          />
          <Typography variant="body1" gutterBottom>
            End Time:
          </Typography>

          <TextField
            id="outlined-basic"
            variant="outlined"
            name="end_time"
            type="time"
            value={formData.end_time}
            onChange={handleChange}
          />
          <Button
            variant="contained"
            size="large"
            color="primary"
            type="submit"
          >
            Submit
          </Button>
          <Button
            variant="contained"
            size="large"
            color="primary"
            type="submit"
            onClick={()=>navigate('/')}
          >
            Go Back
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default CreateEvent;
