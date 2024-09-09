import "./style.css";
import Trash from "../../assets/trash.svg";
import Edit from "../../assets/Edit.svg"
import api from "../../services/api";
import { useEffect, useState, useRef } from "react";

function Home() {
  const [users, setUsers] = useState([])
  const [isEditing, setIsEditing] = useState(false); 
  const [editUserId, setEditUserId] = useState(null); 

  const inputName = useRef()
  const inputAge = useRef()
  const inputEmail = useRef()

  async function getUsers() {
    const usersFromApi = await api.get("/usuarios")
    setUsers(usersFromApi.data)
  }

  async function createUser() {
    await api.post("/usuarios", {
      name: inputName.current.value,
      age: inputAge.current.value,
      email: inputEmail.current.value,
    })
    getUsers()
    clearForm()
  }

  async function updateUser(id) {
    await api.put(`/usuarios/${id}`, {
      name: inputName.current.value,
      age: inputAge.current.value,
      email: inputEmail.current.value,
    });
    getUsers();
    clearForm();
  }

  async function deleteUsers(id) {
    await api.delete(`/usuarios/${id}`)
    getUsers()
  }

  function loadUserToEdit(user) {
    setIsEditing(true); 
    setEditUserId(user.id); 
    inputName.current.value = user.name; 
    inputAge.current.value = user.age;
    inputEmail.current.value = user.email;
  }

  function clearForm() {
    inputName.current.value = ""
    inputAge.current.value = ""
    inputEmail.current.value = ""
    setIsEditing(false); 
    setEditUserId(null); 
  }

  function handleSubmit() {
    if (isEditing) {
      updateUser(editUserId); 
    } else {
      createUser(); 
    }
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div className="container">
      <form>
        <h1>{isEditing ? "Editar Usuário" : "Cadastro de Usuários"}</h1>
        <input placeholder="Nome" name="nome" type="text" ref={inputName} />
        <input placeholder="Idade" name="idade" type="number" ref={inputAge} />
        <input placeholder="Email" name="email" type="email" ref={inputEmail} />
        <button type="button" onClick={handleSubmit}>
        {isEditing ? "Atualizar" : "Cadastrar"}
        </button>
        {isEditing && <button type="button" onClick={clearForm}>Cancelar</button>}
      </form>

      {users.map((user) => (
        <div key={user.id} className="card">
          <div>
            <p>
              Nome: <span>{user.name}</span>
            </p>
            <p>
              Idade: <span>{user.age}</span>
            </p>
            <p>
              Email: <span>{user.email}</span>
            </p>
          </div>
          <button onClick={() => deleteUsers(user.id)}>
            <img src={Trash} alt="Deletar"  />
          </button>
          <button onClick={() => loadUserToEdit(user)}>
            <img src={Edit} alt="Editar" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Home;
