import { Box, Typography, Stack, TextField, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { NameContext } from "./Home";
import { useParams } from "react-router-dom";
import z from "zod";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface FormType {
  name: string;
  summary: string;
  date: string;
  start_time: string;
  end_time: string;
}
interface Errors {
  name?: string;
  summary?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
}
interface EventItem {
  id: string;
  name: {
    text: string;
  };
  description: {
    text: string;
  };
  start: {
    local: string;
  };
  end: {
    local: string;
  };
  summary: string;
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
    message: "End time must be after start time",
    path: ["end_time"],
  });
const API_KEY: string = import.meta.env.VITE_API_KEY;
const Update = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [err, setErr] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [useLibrary, setUseLibrary] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormType>({
    name: "",
    summary: "",
    date: "",
    start_time: "",
    end_time: "",
  });
  const context = useContext(NameContext);
  if (!context) {
    return;
  }
  const { fetchEvent, filterData } = context;
  const currentData = (filterData as EventItem[]).find(
    (item: { id: string }) => {
      return item.id === id;
    },
  );
  useEffect(() => {
    if (!currentData) return;
    const startLocal = currentData?.start?.local;
    const endLocal = currentData?.end?.local;
    const newFormData = {
      name: currentData?.name?.text || "",
      summary: currentData?.summary || "",
      date: startLocal?.split("T")[0] || "",
      start_time: startLocal?.split("T")[1]?.slice(0, 5) || "",
      end_time: endLocal?.split("T")[1]?.slice(0, 5) || "",
    };
    setFormData(newFormData);
  }, [currentData]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };
  const customValidate = () => {
    const newErrors: Errors = {};
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
        newErrors[e.path[0] as string] = e.message;
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
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    const isValid: boolean = useLibrary ? zodValidate() : customValidate();
    if (!isValid) return;
    try {
      const result = await fetch(`https://www.eventbriteapi.com/v3/events/${id}/`, {
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
          },
        }),
      });
      if (result.ok) {
        fetchEvent();
        toast.success("Event Updated Successfully", {
          autoClose: 2000,
        });
        navigate("/");
        setFormData({
          name: "",
          summary: "",
          date: "",
          start_time: "",
          end_time: "",
        });
      }
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
            slotProps={{
              htmlInput: {
                min: new Date().toISOString().split("T")[0],
              },
            }}
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
