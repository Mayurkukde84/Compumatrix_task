/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { DialogWithForm } from "./DialogWithForm";
import { DialogWithFormEdit } from "./DialogWithFormEdit";
import { DialogWithDetails } from "./DialogWithDetails";

const TABS = [
  {
    label: "All",
    value: "latest",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "In progress",
    value: "inprogress",
  },
  {
    label: "Completed",
    value: "completed",
  },
];

const TABLE_HEAD = [
  "Title",
  "Description",
  "Status",
  "Created At",
  "Updated At",
  "Actions",
];

const MembersTable = ({
  tasks,
  loading,
  formData,
  setFormData,
  setStatus,
  currentPageState,
  setCurrentPage,
  setEditSucces,
  setNewTaskSuccess
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState("");
 
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleOpen = () => setOpen((cur) => !cur);


  const handlePrevPage = () => {
    if (currentPageState > 1) {
      setCurrentPage(currentPageState - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPageState < tasks.totalPages) {
      setCurrentPage(currentPageState + 1);
    }
  };

  const handleTabs = (value) => {
    setStatus(value);
    setCurrentPage(1);
  };
  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    console.log("click");
    if (searchTerm.trim() === "") {
      return alert("pleas fill search input"); // Do nothing if search term is empty
    }
    try {
      const response = await fetch(
        `http://localhost:5000/task/search?search=${searchTerm}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
    
      if(data?.message){
         alert(data?.message) 
         setSearchTerm('')
        return setSearchResult('')
        
      }
      
      setSearchResult(data);
       // Pass the API response data to the parent component
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  console.log(searchResult)
  
  let result
 if(searchResult){
  result = searchResult?.tasks
 }else {
 result = tasks?.tasks
 }



  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Task list
            </Typography>
            {/* <Typography color="gray" className="mt-1 font-normal">
              See information about all members
            </Typography> */}
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            {/* <Button variant="outlined" size="sm">
              view all
            </Button> */}
            <Button
              className="flex items-center gap-3"
              size="sm"
              onClick={handleOpen}
            >
              <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Task
            </Button>
            <DialogWithForm
              formData={formData}
              setFormData={setFormData}
              open={open}
              handleOpen={handleOpen}
              setNewTaskSuccess={setNewTaskSuccess}
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Tabs value="latest" className="w-full md:w-max">
            <TabsHeader className="md:w-[35rem]">
              {TABS.map(({ label, value }) => (
                <Tab
                  key={value}
                  value={value}
                  onClick={() => {
                    handleTabs(value);
                  }}
                >
                  &nbsp;&nbsp;{label}&nbsp;&nbsp;
                </Tab>
              ))}
            </TabsHeader>
          </Tabs>
          <div className="w-full md:w-72 flex gap-2">
            <Input label="Search" value={searchTerm} onChange={handleChange} />
            <IconButton variant="text" onClick={handleSearchSubmit}>
              {<MagnifyingGlassIcon className="h-5 w-5" />}
            </IconButton>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0 ">
        {result.length == 0 ? (
          "no data"
        ) : (
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.map(
                (
                  { title, description, status, createdAt, updatedAt, _id },
                  index
                ) => {
                  const isLast = index === tasks.totalPages;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={_id}>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {title}
                            </Typography>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal opacity-70"
                            >
                              {/* {description} */}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal overflow-hidden whitespace-nowrap overflow-ellipsis max-w-xs"
                            style={{ textOverflow: "ellipsis" }}
                          >
                            {description.split(" ").slice(0, 10).join(" ")}{" "}
                            {/* Limit to 10 words */}
                          </Typography>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal opacity-70"
                          >
                            {/* {createdAt} */}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="w-max">
                          <Chip
                            variant="outlined"
                            color={
                              status === "pending"
                                ? "red"
                                : status === "completed"
                                  ? "green"
                                  : "blue"
                            }
                            value={status}
                          />
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {new Date(createdAt).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                            timeZone: "UTC",
                          })}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {new Date(updatedAt).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                            timeZone: "UTC",
                          })}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <DialogWithDetails id={_id} />
                        <DialogWithFormEdit
                          id={_id}
                          setEditSucces={setEditSucces}
                        />
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        )}
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page {currentPageState} of {tasks.totalPages}
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPageState === 1}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPageState === tasks.totalPages}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
export default MembersTable;
