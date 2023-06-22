import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faAt } from '@fortawesome/free-solid-svg-icons'
import style from './LoginPage.module.css'

import Team from '../../assets/svgs/team.svg'
import Mobile from '../../assets/svgs/mobile.svg'
import Logo from '../../assets/imgs/logo_purple.png'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [passwd, setPasswd] = useState('')

  const onLogin = async () => {
    const response = await axios.post('/api/auth/login', { email, password: passwd })

    sessionStorage.setItem('CLIENT_TOKEN', response.data.token)
    window.location.href='/'
  }

  return (
    <div className={style.container}>
      <img className={style.team} src={Team} alt="" />
      <div className={style.contain}>
        <div className={style.form}>
          <div className={style.title}>
            <img className={style.logo} src={Logo} alt="" />
            <div className={style.text}>포용런</div>
          </div>
          <div className={style.input_contain}>
            <FontAwesomeIcon className={style.icon} icon={faAt} />
            <input className={style.input} type="text" placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className={style.input_contain}>
            <FontAwesomeIcon className={style.icon} icon={faLock} />
            <input className={style.input} type="text" placeholder='Password' onChange={(e) => setPasswd(e.target.value)} />
          </div>

          <button className={style.btn} onClick={onLogin}>로그인</button>

          <Link to={'/signup'} className={style.up}>계정이 없다면?</Link>
        </div>
      </div>
      <img className={style.mobile} src={Mobile} alt="" />
    </div>
  )
}
