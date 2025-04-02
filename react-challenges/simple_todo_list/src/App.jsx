import { useState } from "react";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [city, setCity] = useState("");

  const addCities = () => {
    if (city.trim() !== "") {
      setTodos((prevTodos) => [...prevTodos, city]);
      setCity(""); // Clear input after adding
    }
  };

  const removeTodo = (index) => {
    setTodos((prevTodos) => prevTodos.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
      <input
        placeholder="Add city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={addCities}>Add</button>
      <ul>
        {todos.map((city, index) => (
          <li key={index}>
            {city}
            &nbsp;
            <button className="remove-btn" onClick={() => removeTodo(index)}>
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
