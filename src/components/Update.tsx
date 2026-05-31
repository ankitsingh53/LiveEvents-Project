import { Box, Typography, Stack, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { NameContext } from "./Home";
import { useParams } from "react-router-dom";
import z from "zod";
import { isValid } from "zod/v3";

const schema = z.object({
  name: z.string().min(1, "Title is required"),
  summary: z.string().min(10, "min 10 characters"),
  date: z.string().min(1, "Date is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  password: z
    .string()
    .min(7, "Min 7 characters required")
    .regex(/[A-Z]/, "Must have one uppercase letter")
    .regex(/\d/, "Must have one number"),
});

const Update = () => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();
  const { id } = useParams();
  const { fetchEvent } = useContext(NameContext);
  const [err, setErr] = useState("");
  const [errors, setErrors] = useState({});
  const [useLibrary, setUseLibrary] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    summary: "",
    date: "",
    start_time: "",
    end_time: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };
  const customValidate = () => {
    const newErrors = {};
    let isValid = true;
    if (!formData.name) {
      newErrors.name = "Event name is required";
      isValid = false;
    }
    if (!formData.summary) {
      newErrors.summary = "Summary is required";
      isValid = false;
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
      isValid = false;
    }
    if (!formData.start_time) {
      newErrors.start_time = "Start time is required";
      isValid = false;
    }
    if (!formData.end_time) {
      newErrors.end_time = "End time is required";
      isValid = false;
    } else if (formData.end_time <= formData.start_time) {
      newErrors.end_time = "End time must be after start time";
      isValid = false;
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 7) {
      newErrors.password = "Min 7 Characters is required";
      isValid = false;
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Must have one uppercase letter";
      isValid = false;
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = "Must have one number";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const zodValidate = () => {
    const result = schema.safeParse(formData);
    if (result.success === false) {
      const newErrors = {};
      result.error.issues.forEach((e) => {
        newErrors[e.path[0]] = e.message;
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const changeToUtc = (date, time) => {
    return new Date(`${date}T${time}`).toISOString().replace(".000Z", "Z");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = useLibrary ? zodValidate() : customValidate();

    if (!isValid) return;
    try {
      const result = await fetch(`/api/v3/events/${id}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: {
            name: {
              html: formData.name,
            },
            start: {
              timezone: "Asia/Kolkata",
              utc: changeToUtc(formData.date, formData.start_time),
            },
            end: {
              timezone: "Asia/Kolkata",
              utc: changeToUtc(formData.date, formData.end_time),
            },
            summary: formData.summary,
            password: formData.password,
          },
        }),
      });
      if (result.ok) {
        await fetchEvent();
        setSuccess(true);
        setFormData({
          name: "",
          summary: "",
          date: "",
          start_time: "",
          end_time: "",
          password: "",
        });
      }
      const data = await result.json();
      console.log("Updated Event:", data);
    } catch (error) {
      setErr(error.message);
    }
  };

  if (err) {
    return <h1>Server Error: ${err}</h1>;
  }
  if(success){
    return (
      <>
      <h1>Event updated Successfully</h1>
      <button onClick={()=>navigate('/')}>Go to Home Page</button>
      </>
    )
  }

  return (
    <>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{ margin: "1% 25%", width: "40%", padding: "20px" }}
        onSubmit={handleSubmit}
      >
        <Typography variant="h3" gutterBottom>
          Update an event
        </Typography>
        <button
          type="button"
          onClick={() => {
            setUseLibrary(!useLibrary);
            setErrors({});
          }}
        >
          Switch to {useLibrary ? "Custom" : "Zod"} Validation
        </button>
        <p>Current: {useLibrary ? "Zod" : "Custom"}</p>
        <Stack spacing={2} sx={{ margin: "10px" }}>
          <Typography variant="body1" gutterBottom>
            Update the name of your event?
          </Typography>
          <TextField
            id="outlined-basic"
            label="Event title"
            variant="outlined"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
          <Typography variant="body1" gutterBottom>
            Update summary of an event
          </Typography>
          <TextField
            id="outlined-basic"
            label="Summary"
            variant="outlined"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
          />
          {errors.summary && <p style={{ color: "red" }}>{errors.summary}</p>}
          <Typography variant="body1" gutterBottom>
            Update your event start?
          </Typography>
          <TextField
            id="outlined-basic"
            variant="outlined"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
          />
          {errors.date && <p style={{ color: "red" }}>{errors.date}</p>}
          <Typography variant="body1" gutterBottom>
            Update Start Time:
          </Typography>
          <TextField
            id="outlined-basic"
            variant="outlined"
            name="start_time"
            type="time"
            value={formData.start_time}
            onChange={handleChange}
          />
          {errors.start_time && (
            <p style={{ color: "red" }}>{errors.start_time}</p>
          )}
          <Typography variant="body1" gutterBottom>
            Update End Time:
          </Typography>

          <TextField
            id="outlined-basic"
            variant="outlined"
            name="end_time"
            type="time"
            value={formData.end_time}
            onChange={handleChange}
          />
          {errors.end_time && <p style={{ color: "red" }}>{errors.end_time}</p>}
          <Typography variant="body1" gutterBottom>
            Update Password
          </Typography>
          <TextField
            id="outlined-basic"
            label="Password"
            variant="outlined"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
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
            onClick={() => navigate("/")}
          >
            Go Back
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default Update;
