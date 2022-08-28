import { useState, useEffect } from "react"
import { useAuth } from '../Context'
import ListTags from './ListTags'
import Lists from './Lists'
import { getTodoList, postTodo, deleteTodo } from '../../services/todoAPI'
import { sweetAlert, showToast } from '../../services/sweetalert'
function ListBoard () {
  const [todoInput, setTodoInput] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [todoList, setTodoList] = useState([])
  const [loading, setLoading] = useState(false)
  const [waitDelete, setWaitDelete] = useState(false)
  const { token } = useAuth()

  useEffect(() => {
    setLoading(true)
    getTodoList(token).then(res => {
      setTodoList(res.data.todos)
      setLoading(false)
    }).catch(err => {
      showToast('取得待辦事項失敗', 'error')
      setLoading(false)
    })
  }, [])

  const handleSetTodoInput = (e) => {
    const { value } = e.target
    setTodoInput(value)
  }
  const handleSendTodoAPI = (e) => {
    e.preventDefault()
    if (todoInput.trim() === '' || todoInput === '') {
      sweetAlert('未輸入待辦事項', '是不是想偷懶', 'info')
      return
    }
    setLoading(true)
    postTodo(token, todoInput).then(res => {
      getTodoList(token).then(res => {
        setTodoList(res.data.todos)
        showToast('新增待辦事項成功', 'success')
        setLoading(false)
      }).catch(err => {
        showToast('取得待辦事項失敗', 'error')
        setLoading(false)
      })
      setTodoInput('')
    }).catch(err => {
      showToast('新增待辦事項失敗', 'error')
    })
  }

  const cleanFinishedTodo = async (e) => {
    e.preventDefault()
    setWaitDelete(true)
    const finishedTodo = todoList.filter(item => item.completed_at).map(item => {
      return new Promise(async resolve => {
        await deleteTodo(token, item.id)
        resolve()
      })
    })
    await Promise.all(finishedTodo)
    getTodoList(token).then(res => {
      setTodoList(res.data.todos)
      setWaitDelete(false)
      showToast('刪除已完成事項成功', 'success')
    }).catch(err => {
      console.log(err)
      setWaitDelete(false)
      showToast('刪除已完成事項失敗', 'error')
    })
  }
  return (
    <div className="conatiner todoListPage vhContainer">
      <div className="todoList_Content">
          <div className="inputBox">
              <input type="text" placeholder="請輸入待辦事項"
              onChange={ handleSetTodoInput } value={ todoInput } />
              <a href="#" onClick={ handleSendTodoAPI }>
                {
                  loading ? 
                  <div className="spinner-border spinner-border-sm text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  : <i className="fa fa-plus text-light" />
                }
              </a>
          </div>
          {
            todoList.length !== 0 ? (
              <div className="todoList_list">
              <ListTags filterType={ filterType } onFilterChange={ setFilterType } />
              <div className="todoList_items">
                  <Lists filterType={ filterType } todoList={ todoList }
                  onListChange={ setTodoList } />
                  <div className="todoList_statistics">
                    <p> { todoList.filter(item => item.completed_at).length } 個已完成項目</p>
                    <a href="#" onClick={ cleanFinishedTodo }>清除已完成項目
                      {
                        waitDelete ? 
                        <div className="spinner-border spinner-border-sm text-dark" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        : ''
                      }
                    </a>
                  </div>
              </div>
          </div>
            ) : 
            <div className="emptyBoard">
              <p className="my-3">目前尚無待辦事項</p>
              <img src="https://i.imgur.com/GLcmRcJ.png" className="emptyImg my-3" alt="" />
            </div>
          }
          
      </div>
    </div>
  )
}

export default ListBoard