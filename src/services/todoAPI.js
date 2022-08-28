import axios from 'axios'
export const postTodo = async (token, todo) => {
  return await axios({
    headers: { Authorization: token },
    method: 'post',
    url: 'https://todoo.5xcamp.us/todos',
    data: { todo : { content: todo } }
  })
}

export const checkLogIn = async (token) => {
  return await axios({
    headers: { Authorization: token },
    method: 'get',
    url: 'https://todoo.5xcamp.us/check'
  })
}

export const getTodoList = async (token) => {
  return await axios({
    headers: { Authorization: token },
    method: 'get',
    url: 'https://todoo.5xcamp.us/todos'
  })
}

export  const toggleTodo = async (token, id) => {
  return await axios({
    headers: { Authorization: token },
    method: 'patch',
    url: `https://todoo.5xcamp.us/todos/${ id }/toggle`
  })
}

export const deleteTodo = async (token, id) => {
  return await axios({
    headers: { Authorization: token },
    method: 'delete',
    url: `https://todoo.5xcamp.us/todos/${ id }`
  })
}
