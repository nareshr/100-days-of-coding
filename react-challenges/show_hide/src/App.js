import { useState } from "react";
import "./styles.css";

export default function App() {
  const [showHide, setShowHide] = useState(true);

  return (
    <div className="container">
      <button onClick={() => setShowHide(!showHide)}>Show / Hide</button>
      {showHide && <h1>Welcome to React Challenges!</h1>}
    </div>
  );
}
