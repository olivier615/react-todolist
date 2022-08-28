import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth, useUserName } from "../Context"
import { useForm } from "react-hook-form"
import axios from "axios"
import { sweetAlert, showToast } from '../../services/sweetalert'

function SignUp () {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  let navigate = useNavigate()
  const { token, setToken } = useAuth()
  const { userName, setUserName } = useUserName()
  const onSubmit = data => {
    setLoading(true)
    const { email, password, checkPassword, nickname } = data
    if (password !== checkPassword) {
      sweetAlert('密碼不相符', '請重新確認密碼', 'warning')
      setLoading(false)
      return
    }
    axios.post('https://todoo.5xcamp.us/users', {
      'user': { 
        'email': email,
        'password': password,
        'nickname': nickname
      }
    }).then(res => {
      setToken(res.headers.authorization)
      setUserName(res.data.nickname)
      setLoading(false)
      navigate('/todolist', { replace: true })
      showToast('註冊成功', 'success')
    }).catch(err => {
      sweetAlert(err.response.data.message, err.response.data.error[0] , 'warning')
      setLoading(false)
    })
  }

  return (
    <div>
      <form className="formControls" onSubmit={ handleSubmit(onSubmit) }>
        <h2 className="formControls_txt">註冊帳號</h2>
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
        <label className="formControls_label" htmlFor="name">您的暱稱</label>
        <input className="formControls_input" type="text" name="name" id="name"
        placeholder="請輸入您的暱稱" required defaultValue=""
          { ...register("nickname", {
            required: {
              value: true,
              message: "此欄位必須填寫"
            },
            minLength: {
              value: 2,
              message: "暱稱需要至少 2 個字元"
            }
          })}
        />
        <span>{ errors.nickname?.message }</span>
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
        <label className="formControls_label" htmlFor="rePwd">再次輸入密碼</label>
        <input className="formControls_input" type="password" name="pwd" id="rePwd"
        placeholder="請再次輸入密碼" required defaultValue=""
          { ...register("checkPassword", {
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
        <span>{ errors.checkPassword?.message }</span>
        <button className="formControls_btnSubmit" type="submit">
          {
            loading ? 
              <div className="spinner-border spinner-border-sm text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
          : '註冊帳號'
          }
          
        </button>
        <Link to={ '/' } className="formControls_btnLink">登入</Link>
      </form>
      
    </div>
  )
}

export default SignUp