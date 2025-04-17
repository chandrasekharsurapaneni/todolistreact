import { Button, Col, Container, Row } from "react-bootstrap";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";


function App() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [isEditable,setIsEditable]=useState({});
  const [isCompleted,setIsCompleted]=useState(false);


  async function handleAdd() {
    if (!title.trim()) return;
    await axios.post("http://localhost:8080/api/todos", {
      title: title,
      completed: false,
    });
    setTitle("");
    getTasks();
  }

  async function handleEdit(item,value){
    console.log(typeof(value)=="boolean");
    await axios.put(`http://localhost:8080/api/todos/${item.id}`, {
      
      
      title:typeof(value)=="boolean"?item.title:value ,
      completed:typeof(value)=="boolean"? !item.completed:item.completed,
    });
    setTitle("");
    getTasks();
  }

const handleInput=(e,id)=>{
setItems(items.map(item =>
  item.id === id ? { ...item, title: e.target.value } : item
))
}

  const handleDisable =(id)=>{
setIsEditable((prev)=>({...prev,[id]:!prev[id]}))
  }

  async function handleDelete(id) {
    await axios.delete(`http://localhost:8080/api/todos/${id}`);
    getTasks();
  }
  const handleEnter=(e,item)=>{
      if(e.key==='Enter'){
        handleEdit(item,e.target.value)
        handleDisable(item.id)
      }
      
  }
  async function getTasks() {
    try {
      const response = await axios.get("http://localhost:8080/api/todos");
      setItems(response.data);
    } catch (e) {
      console.log("something went wrong or loading");
    }
  }

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div className="App vh-100 p-0 ">
      <div className="d-flex flex-column align-items-center justify-content-center vh-100">
        <h1 className="mb-4" style={{color:"#0ff"}} >To Do List</h1>
        <Container className="container-box " style={{ maxWidth: "500px" }}>
          {items.map(item => (
            <Row key={item.id}>
              <Col>
              <input type="checkbox" checked={item.completed} onChange={()=>handleEdit(item,item.completed)} />
                <input
                  type="text"
                  value={item.title}
                  disabled={!isEditable[item.id]}
                  onKeyDown={(e)=>handleEnter(e,item)}
                  onChange={(e)=>handleInput(e,item.id)}
                  className={`my-2 task-input p-2 w-75 rounded m-3 ${item.completed? "text-decoration-line-through":"" }`}
                />
                <i className="bi bi-pencil-square" onClick={()=>handleDisable(item.id)}></i>
                <i
                  className="bi bi-trash-fill trash-icon m-3"
                  onClick={() => handleDelete(item.id)}
                ></i>
              </Col>
            </Row>
          ))}
          <Row >
            <Col>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter a task"
                className="task-input my-2 p-2 w-75 rounded m-3 "
              />
              <Button className="add-btn  " onClick={handleAdd}>
                Add
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default App;
