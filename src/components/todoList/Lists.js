import { useState, useEffect } from "react"
import { getTodoList, toggleTodo, deleteTodo } from '../../services/todoAPI'
import { useAuth } from '../Context'
import { showToast } from '../../services/sweetalert'
function Lists (props) {
  const [loading, setLoading] = useState('')
  const { filterType, todoList, onListChange } = props
  const { token } = useAuth()

  const handleToggle = (token, id) => {
    setLoading(id)
    toggleTodo(token, id).then(res => {
      getTodoList(token).then(res => {
        onListChange(res.data.todos)
        setLoading('')
        showToast('更改待辦事項狀態完成', 'success')
      }).catch(err => {
        showToast('取得待辦事項失敗', 'error')
        setLoading('')
      })
    }).catch(err => {
      showToast('更改待辦事項狀態失敗', 'error')
      setLoading('')
    })
  }

  const handleDeleteTodo = (e, token, id) => {
    e.preventDefault()
    setLoading(id)
    deleteTodo(token, id).then(res => {
      getTodoList(token).then(res => {
        onListChange(res.data.todos)
        setLoading('')
        showToast('刪除待辦事項成功', 'success')
      }).catch(err => {
        showToast('取得待辦事項失敗', 'error')
        setLoading('')
      })
    }).catch(err => {
      showToast('刪除待辦事項失敗', 'error')
      setLoading('')
    })
  }

  const filteredData = (filterType === 'all')
    ? todoList
    : (filterType === 'wait')
    ? todoList.filter(item => item.completed_at === null)
    : todoList.filter(item => item.completed_at !== null)

  return (
    <ul className="todoList_item">
      { filteredData.map(item => {
        return (
          <li key={ item.id }>
            <label className="todoList_label">
              <input className="todoList_input" type="checkbox" value={ item.completed_at ? item.completed_at : '' }
              checked={ item.completed_at ? 'checked' : '' } onChange={ () => handleToggle(token, item.id) } />
              <span>{ item.content }</span>
              {
                loading === item.id ?
                <div className="ms-2 spinner-border spinner-border-sm text-secondary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                : ''
              }
            </label>
            <a href="#" onClick={ (e) => handleDeleteTodo(e, token, item.id) }>
              <i className="fa fa-times" />
            </a>
          </li>
        )
      }) 
  }
    </ul>
  )
}

export default Lists