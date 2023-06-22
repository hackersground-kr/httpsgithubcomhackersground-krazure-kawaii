import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock, faAt, faVenusMars, faBirthdayCake, faBoltLightning, faImage } from '@fortawesome/free-solid-svg-icons'
import style from './UpPage.module.css'

import Join from '../../assets/svgs/join.svg'
import Inn from '../../assets/svgs/innov.svg'
import Logo from '../../assets/imgs/logo_purple.png'

export default function LoginPage() {
  const fileInput: any = useRef(null)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [passwd, setPasswd] = useState('')
  const [gender, setGender] = useState(false)
  const [role, setRole] = useState('student')
  const [birth, setBirth] = useState<any>()
  const [file, setFile] = useState<any>()
  const [fileName, setFileName] = useState('')
  let formData = new FormData()
  
  const handleChange = async (e: any) => {
    if (!e.target.files) return
    setFile(await e.target.files[0])
    setFileName(await e.target.files[0]['name'])
  }

  const getSignUp = async () => {
    formData.append('email', email)
    formData.append('nickname', username)
    formData.append('password', passwd)
    formData.append('gender', gender ? 'F' : 'M')
    formData.append('birth', birth)
    formData.append('role', role)
    formData.append('file', file)

    axios.post('/api/auth/signUp', formData).then(() => {
      window.location.href='/'
    }).catch((e) => {
      console.log(e)
    })
  }

  const onClickTeacher = () => {
    setRole('teacher')
    console.log('teacher')
  }
  const onClickStudent = () => {
    setRole('student')
  }

  return (
    <div className={style.container}>
      <img className={style.inn} src={Inn} alt="" />
      <div className={style.contain}>
        <div className={style.form}>
          <div className={style.title}>
            <img className={style.logo} src={Logo} alt="" />
            <div className={style.text}>포용런</div>
          </div>
          <div className={style.side}>
            <div className={style.side_item}>
              <div className={style.input_contain}>
                <FontAwesomeIcon className={style.icon} icon={faAt} />
                <input className={style.input} type="text" placeholder='이메일' onChange={(e: any) => setEmail(e.target.value)} />
              </div>
              <div className={style.input_contain}>
                <FontAwesomeIcon className={style.icon} icon={faUser} />
                <input className={style.input} type="text" placeholder='사용자명'  onChange={(e: any) => setUsername(e.target.value)}/>
              </div>
              <div className={style.input_contain}>
                <FontAwesomeIcon className={style.icon} icon={faLock} />
                <input className={style.input} type="text" placeholder='비밀번호' onChange={(e: any) => setPasswd(e.target.value)} />
              </div>
              <div className={style.input_contain}>
                <FontAwesomeIcon className={style.icon} icon={faImage} />
                <button className={style.upload} onClick={() => fileInput.current.click()}>파일 업로드</button>
                <input type="file" className={style.file} ref={fileInput} onChange={handleChange} />
              </div>
              <div className={style.url}>{ fileName }</div>
            </div>

            <div className={style.side_item}>
              <div className={style.input_contain}>
                <FontAwesomeIcon className={style.icon} icon={faVenusMars} />
                <div className={style.side}>
                  <button className={gender ? style.act_sel_btn_l : style.sel_btn_l} onClick={() => setGender(false)}>남</button>
                  <button className={gender ? style.sel_btn_r : style.act_sel_btn_r} onClick={() => setGender(true)}>여</button>
                </div>
              </div>
              <div className={style.input_contain}>
                <FontAwesomeIcon className={style.icon} icon={faBirthdayCake} />
                <input className={style.input} type="date" onChange={(e: any) => setBirth(e.target.value)} />
              </div>
              <div className={style.input_contain}>
                <FontAwesomeIcon className={style.icon} icon={faBoltLightning} />
                <div className={style.side}>
                  <button className={role === 'teacher' ? style.sel_btn_l : style.act_sel_btn_l} onClick={onClickTeacher}>강의자</button>
                  <button className={role === 'student' ? style.sel_btn_r : style.act_sel_btn_r} onClick={onClickStudent}>수강생</button>
                </div>
              </div>

              <button className={style.btn} onClick={getSignUp}>회원가입</button>
              <Link to={'/login'} className={style.up}>이미 가입 하셨나요?</Link>
            </div>
          </div>
        </div>
      </div>
      <img className={style.join} src={Join} alt="" />
    </div>
  )
}