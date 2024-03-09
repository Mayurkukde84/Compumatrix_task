import { useState, useEffect } from "react";
import MembersTable from "./components/MembersTable";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusState, setStatus] = useState("latest");
  const [currentPageState, setCurrentPage] = useState(1);
  const [editSuccess,setEditSucces]=useState("")
  const [newTaskSuccess,setNewTaskSuccess]=useState("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/task/gettask?status=${statusState}&page=${currentPageState}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        
        
        setTasks(data);
        setEditSucces('')
        setNewTaskSuccess('')
    
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPageState,  statusState,editSuccess,newTaskSuccess]);

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <MembersTable
      statusState={statusState}
      setStatus={setStatus}
      tasks={tasks}
      loading={loading}
      formData={formData}
      setFormData={setFormData}
      currentPageState={currentPageState}
      setCurrentPage={setCurrentPage}
      setEditSucces={setEditSucces}
      setNewTaskSuccess={setNewTaskSuccess}
     
    
    />
  );
};

export default App;
