import { Box, Typography, Stack, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { NameContext } from "./Home";
import z from "zod";
import { toast } from "react-toastify";

interface GetFormData {
  name: string;
  summary: string;
  date: string;
  start_time: string;
  end_time: string;
}

interface FormErrors {
  name?: string;
  summary?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
}

const schema = z
  .object({
    name: z.string().min(1, "Title is required"),
    summary: z.string().min(10, "min 10 characters"),
    date: z.string().min(1, "Date is required"),
    start_time: z.string().min(1, "Start time is required"),
    end_time: z.string().min(1, "End time is required"),
  })
  .refine((obj) => obj.start_time < obj.end_time, {
    message: "End time must be after Start time",
    path: ["end_time"],
  });
const API_KEY = import.meta.env.VITE_API_KEY;
const CreateEvent = () => {
  const navigate = useNavigate();
  const context = useContext(NameContext);
  const [errors, setErrors] = useState<FormErrors>({});
  const [err, setErr] = useState<string>("");
  const [useLibrary, setUseLibrary] = useState<boolean>(false);
  const [formData, setFormData] = useState<GetFormData>({
    name: "",
    summary: "",
    date: "",
    start_time: "",
    end_time: "",
  });
  if (!context) return;
  const { fetchEvent } = context;
  const today = new Date().toISOString().split("T")[0];
  const onChangeCheck = (data:GetFormData) => {
    let newErrors: FormErrors = {}
    if (data.summary.trim()) {
      if (!data.name) {
        newErrors.name = "This field is required";
      }
    }
     if (data.date) {
      if (!data.name.trim()) {
        newErrors.name = "This field is required";
      }
      if (!data.summary.trim()) {
        newErrors.summary = "This field is required";
      }
    } 
     if (data.start_time) {
      if (!data.name.trim()) {
        newErrors.name = "This field is required";
      }
      if (!data.summary.trim()) {
        newErrors.summary = "This field is required";
      }
      if (!data.date) {
        newErrors.date = "This field is required";
      }
    }
    if (data.end_time) {
      if (!data.name.trim()) {
        newErrors.name = "This field is required";
      }
      if (!data.summary.trim()) {
        newErrors.summary = "This field is required";
      }
      if (!data.date) {
        newErrors.date = "This field is required";
      }
      if (!data.start_time) {
        newErrors.start_time = "This field is required";
      }
    }
    setErrors(newErrors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(updatedFormData);
    setErrors({ ...errors, [e.target.name]: "" });
    onChangeCheck(updatedFormData);
  };

  const customValidate = () => {
    const newErrors: FormErrors = {};
    let isValid: boolean = true;
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
    setErrors(newErrors);
    return isValid;
  };

  const zodValidate = () => {
    const result = schema.safeParse(formData);
    if (result.success === false) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((e) => {
        newErrors[String(e.path[0])] = e.message;
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const changeToUtc = (date: string, time: string) => {
    return new Date(`${date}T${time}`).toISOString().replace(".000Z", "Z");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid: boolean = useLibrary ? zodValidate() : customValidate();
    if (!isValid) return;
    try {
      const result = await fetch(
        "https://www.eventbriteapi.com/v3/organizations/3004242831212/events/",
        {
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
              currency: "USD",
              summary: formData.summary,
            },
          }),
        },
      );
      if (result.ok) {
        fetchEvent();
        navigate("/");
        toast.success("Event Created Successfully", {
          autoClose: 1000,
        });
        setFormData({
          name: "",
          summary: "",
          date: "",
          start_time: "",
          end_time: "",
        });
      }
      // const data = await result.json();
    } catch (error) {
      if (error instanceof Error) {
        setErr(error.message);
      } else {
        setErr("Something went wrong");
      }
    }
  };

  if (err) {
    return <h1>Server Error: ${err}</h1>;
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
          Create an event
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
            What’s the name of your event?
          </Typography>
          <TextField
            id="outlined-basic"
            label="Event title"
            variant="outlined"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
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
          {errors.summary && <p style={{ color: "red" }}>{errors.summary}</p>}
          <Typography variant="body1" gutterBottom>
            When does your event start?
          </Typography>
          <TextField
            id="outlined-basic"
            variant="outlined"
            name="date"
            slotProps={{
              htmlInput: {
                min: today,
              },
            }}
            type="date"
            value={formData.date}
            onChange={handleChange}
          />
          {errors.date && <p style={{ color: "red" }}>{errors.date}</p>}
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
          {errors.start_time && (
            <p style={{ color: "red" }}>{errors.start_time}</p>
          )}
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
          {errors.end_time && <p style={{ color: "red" }}>{errors.end_time}</p>}
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

export default CreateEvent;
