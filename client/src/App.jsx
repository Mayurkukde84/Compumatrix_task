import { useState,useEffect } from "react";
import MembersTable from "./components/MembersTable"



const App = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusState,setStatus] = useState('latest')
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  console.log(statusState)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/task/gettask?status=${statusState}`);
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formData, statusState]);

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <MembersTable statusState={statusState} setStatus={setStatus} tasks={tasks} loading={loading} formData={formData} setFormData={setFormData}/>
  )
}

export default App
