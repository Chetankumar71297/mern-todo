import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
const api_base = "https://mern-todo-api-osu5.onrender.com";

const HomePage = () => {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    GetTodos();
  }, []);

  const GetTodos = () => {
    fetch(api_base + "/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("Error: ", err));
  };

  const changeCompleteStatusTodo = async (id) => {
    const data = await fetch(api_base + "/todo/complete/" + id).then((res) =>
      res.json()
    );
    console.log(data);
    console.log(todos);
    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }

        return todo;
      })
    );
    if (data) {
      toast.success(`Status of ${data.text} changed successfully`);
    }
  };

  const addTodo = async () => {
    const data = await fetch(api_base + "/todo/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newTodo,
      }),
    }).then((res) => res.json());

    setTodos([...todos, data]);

    setPopupActive(false);
    setNewTodo("");
    if (data) {
      toast.success(`New task ${data.text} created successfully`);
    }
  };

  const deleteTodo = async (id) => {
    const data = await fetch(api_base + "/todo/delete/" + id, {
      method: "DELETE",
    }).then((res) => res.json());

    setTodos((todos) => todos.filter((todo) => todo._id !== data.result._id));

    if (data) {
      toast.success(`Task ${data.result.text} is deleted successfully`);
    }
  };

  return (
    <>
      <div className="App">
        <h1>Welcome, Chetan</h1>
        <h4>Your tasks</h4>

        <div className="todos">
          {todos.length > 0 ? (
            todos.map((todo) => (
              <div
                className={"todo" + (todo.complete ? " is-complete" : "")}
                key={todo._id}
                onClick={() => changeCompleteStatusTodo(todo._id)}
              >
                <div className="checkbox"></div>

                <div className="text">{todo.text}</div>

                <div
                  className="delete-todo"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTodo(todo._id);
                  }}
                >
                  x
                </div>
              </div>
            ))
          ) : (
            <p>You currently have no tasks</p>
          )}
        </div>

        <div className="addPopup" onClick={() => setPopupActive(true)}>
          +
        </div>

        {popupActive ? (
          <div className="popup">
            <div className="closePopup" onClick={() => setPopupActive(false)}>
              X
            </div>
            <div className="content">
              <h3>Add Task</h3>
              <input
                type="text"
                className="add-todo-input"
                onChange={(e) => setNewTodo(e.target.value)}
                value={newTodo}
              />
              <div className="button" onClick={addTodo}>
                Create Task
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default HomePage;
