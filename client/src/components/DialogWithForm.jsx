/* eslint-disable react/prop-types */

import {
  Button,
  Dialog,
  Card,

  CardBody,
  CardFooter,
  Typography,
  Input,
  
  Textarea,
} from "@material-tailwind/react";
 
// eslint-disable-next-line react/prop-types
export function DialogWithForm({open,handleOpen,formData,setFormData,setNewTaskSuccess}) {
   


      const handleChange = (e)=>{
        const {name,value} = e.target;
        setFormData({
            ...formData,
            [name]:value
        })
      }

      const handleSubmit = async () => {
        try {
          const response = await fetch("http://localhost:5000/task/createtask", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
          });
          if (!response.ok) {
            throw new Error("Failed to create task");
          }
          // Reset form fields after successful submission
          setFormData({
            title: "",
            description: "",
          });
          setNewTaskSuccess('success')
          alert("Task created successfully!");
          
          handleOpen()
        } catch (error) {
          console.error(error);
          alert("Failed to create task. Please try again later.");
        }
      };
 
  return (
    <>
      
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Add Task
            </Typography>
            <Typography
              className="mb-3 font-normal"
              variant="paragraph"
              color="gray"
            >
              Enter your tasks
            </Typography>
            <Typography className="-mb-2" variant="h6">
              Title
            </Typography>
            <Input
              label="Task"
              size="lg"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <Typography className="-mb-2" variant="h6">
              Description
            </Typography>
            <Textarea
              label="Description"
              size="lg"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
            
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" onClick={handleSubmit} fullWidth>
              +ADD
            </Button>
            
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
}