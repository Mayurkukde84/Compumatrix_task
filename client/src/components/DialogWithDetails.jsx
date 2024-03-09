import React, { useState, useEffect } from "react";
import { Select, Option } from "@material-tailwind/react";

import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Tooltip,
  IconButton,
  Textarea,
} from "@material-tailwind/react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Chip } from "@material-tailwind/react";

export function DialogWithDetails({ id }) {
  const [openEdit, setOpenEdit] = React.useState(false);
  const handleOpenEdit = () => setOpenEdit((cur) => !cur);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/task/get/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch task");
        }

        const data = await response.json();
        console.log(data);
        setTask(data);
        
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id,openEdit]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <IconButton variant="text" onClick={handleOpenEdit}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
          />
        </svg>
      </IconButton>

      <Dialog
        size="xs"
        open={openEdit}
        onClose={handleOpenEdit} // Changed handler to onClose
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Info Task
            </Typography>
            <Typography
              className="mb-3 font-normal w-fit"
              variant="paragraph"
              color="gray"
            >
              <Chip
                color={
                  task?.status === "pending"
                    ? "red"
                    : task.status === "completed"
                      ? "green"
                      : "blue"
                }
                variant="outlined"
                value={task.status}
              />
            </Typography>
            <Typography className="-mb-2" variant="h6">
              Title
            </Typography>
            <Input  disabled label="Task" size="lg" name="title" value={task?.title} />
            <Typography className="-mb-2" variant="h6">
              Description
            </Typography>
            <Textarea
              label="Description"
              size="lg"
              name="description"
              value={task?.description}
              disabled
              className="h-[15rem] overflow-y-auto"
            />
            <Button onClick={handleOpenEdit}>Cancel</Button>
          </CardBody>
        </Card>
      </Dialog>
    </>
  );
}
