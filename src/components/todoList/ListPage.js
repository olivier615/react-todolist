import { Link, useNavigate } from "react-router-dom"
import { useEffect } from 'react'
import ListBoard from './ListBoard'
import { useAuth, useUserName } from "../Context"
import { checkLogIn } from '../../services/todoAPI'
import { showToast } from '../../services/sweetalert'
function ListPage () {
  let navigate = useNavigate()
  const { token, setToken } = useAuth()
  const { userName } = useUserName()
  useEffect(() => {
    checkLogIn(token).catch(err => {
      console.log(err)
      showToast('請重新登入', 'warning')
      navigate('/', { replace: true })
    })
  }, [])

  const logOut = () => {
    setToken(null)
    showToast('您已登出', 'success')
  }

  return (
    <div id="todoListPage" className="bg-half">
    <nav>
        <h1>ONLINE TODO LIST</h1>
        <ul>
          <li className="todo_sm"><span>{ userName }的代辦</span></li>
          <li><a href="#" onClick={ logOut }>登出</a></li>
        </ul>
    </nav>
    <ListBoard />
  </div>
  )
}

export default ListPage