import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/register", {
        username,
        password,
      });

      alert("Registered successfully!");
      navigate("/login");

    } catch {
      alert("User already exists");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        style={styles.input}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleRegister} style={styles.button}>
        Register
      </button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px",
    color: "white"
  },
  input: {
    display: "block",
    margin: "10px auto",
    padding: "10px",
    width: "250px"
  },
  button: {
    padding: "10px 20px",
    background: "#3b82f6",
    color: "white",
    border: "none"
  }
};

export default Register;