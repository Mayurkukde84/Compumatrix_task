/* eslint-disable react/prop-types */
import React, { useState,useEffect } from "react";

import {
  Button,
  Dialog,
  Card,

  CardBody,
  CardFooter,
  Typography,
  Input,
 
  IconButton,
  Textarea
} from "@material-tailwind/react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Chip } from "@material-tailwind/react";

export function DialogWithFormEdit({id,setEditSucces}) {
  
  const [openEdit, setOpenEdit] = React.useState(false);
  const handleOpenEdit = () => setOpenEdit((cur) => !cur);
  const [task, setTask] = useState(null);
  const [formState, setFormState] = useState({
    title:task?.title,
    description:task?.description,
    status:task?.status
  });
 
  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };


  const handleSubmitEditForm = async () => {
    try {
      const response = await fetch(`http://localhost:5000/task/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formState)
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      
setEditSucces('success')
      // Task updated successfully
      console.log('Task updated successfully');
      handleOpenEdit();
      formState.description("")
      formState.status("")
      formState.title("")
      
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/task/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
         
        }
      });
      setEditSucces('success')
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      console.log('Task deleted successfully');
    
    } catch (error) {
      console.error('Error deleting task:', error);
      
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/task/get/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch task');
        }

        const data = await response.json();
        
        setTask(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

 
  return (
    <>

   
      
    
        <IconButton variant="text" onClick={handleOpenEdit}>
          <PencilIcon className="h-4 w-4" />
        </IconButton>
        <IconButton variant="text" onClick={handleDelete}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
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
              Edit Task
            </Typography>
            <Typography
              className="mb-3 font-normal w-fit"
              variant="paragraph"
              color="gray"
            >
                 <Chip  color={
                            task?.status === "pending"
                              ? "red"
                              : task.status === "completed"
                                ? "green"
                                : "blue"
                          } variant="outlined" value={task.status}/>

            </Typography>
            <Typography className="-mb-2" variant="h6">
              Title
            </Typography>
            <Input
              label="Task"
              size="lg"
              name="title"
              defaultValue={formState.title || task?.title}
              onChange={handleChange}
           
            />
            <Typography className="-mb-2" variant="h6">
              Description
            </Typography>
            <Textarea
              label="Description"
              size="lg"
              name="description"
              value={formState.description || task?.description}
              onChange={handleChange}
            />
             <Typography className="-mb-2" variant="h6">
              Status
            </Typography>
            <select
              value={formState.status }
              onChange={handleChange}
              name="status"
              className="border border-gray-500 h-8 rounded-lg"
            >
              <option value={"pending"} >Pending</option>
              <option value={"inprogress"}>In Progress</option>
              <option value={"completed"} >Completed</option>
            </select>

          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient"  fullWidth onClick={handleSubmitEditForm}>
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
}

