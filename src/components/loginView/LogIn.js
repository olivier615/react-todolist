import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useAuth, useUserName } from "../Context"
import { sweetAlert, showToast } from '../../services/sweetalert'

function LogIn () {
  const { register, handleSubmit, formState: { errors } } = useForm()
  let navigate = useNavigate()
  const { token, setToken } = useAuth()
  const { userName, setUserName } = useUserName()
  const [loading, setLoading] = useState(false)
  const onSubmit = data => {
    setLoading(true)
    const { email, password } = data
    axios.post('https://todoo.5xcamp.us/users/sign_in', {
      'user': { 
        'email': email, 
        'password': password
      }
    }).then(res => {
      setToken(res.headers.authorization)
      setUserName(res.data.nickname)
      showToast('登入成功', 'success')
      setLoading(false)
      navigate('/todolist', { replace: true })
    }).catch(err => {
      sweetAlert(err.response.data.message , '帳號或密碼錯誤', 'warning')
      setLoading(false)
    })
  }

  return (
    <div>
      <form className="formControls" onSubmit={ handleSubmit(onSubmit) }>
        <h2 className="formControls_txt">最實用的線上代辦事項服務</h2>
        <label className="formControls_label" htmlFor="email">Email</label>
        <input className="formControls_input" type="text" id="email" name="email"
        placeholder="請輸入 email" required defaultValue=""
          { ...register("email", {
            required: {
              value: true,
              message: "此欄位必須填寫"
            },
            pattern: {
              value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
              message: "不符合 Email 規則"
            }
          })}
        />
        <span>{ errors.email?.message }</span>
        <label className="formControls_label" htmlFor="pwd">密碼</label>
        <input className="formControls_input" type="password" name="pwd" id="pwd"
        placeholder="請輸入密碼" required defaultValue=""
          { ...register("password", {
            required: {
              value: true,
              message: "此欄位必須填寫"
            },
            minLength: {
              value: 8,
              message: "密碼至少為 8 碼"
            }
          })}
        />
        <span>{ errors.password?.message }</span>
        <button className="formControls_btnSubmit" type="submit">
          {
            loading ? 
              <div className="spinner-border spinner-border-sm text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
          : '登入'
          }
        </button>
        <Link to={ '/signin' } className="formControls_btnLink">註冊帳號</Link>
      </form>
    </div>
  )
}

export default LogIn