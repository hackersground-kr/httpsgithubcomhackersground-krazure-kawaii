import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import style from './Navigation.module.css'

import logo from '../../assets/imgs/logo_white.png'
import plogo from '../../assets/imgs/logo_purple.png'

function Navigation () {
  const [scroll, setScroll] = useState(0)
  const [navClass, setNavClass] = useState(false)
  const [user, setUser] = useState({} as any)
  console.log(user)

  const onScroll = () => {
    setScroll(window.scrollY)

    if (scroll >= 100) setNavClass(true)
    else setNavClass(false)
  }

  useEffect(() => {
    const getUser = async () => {
      axios.get('/api/auth/user/info', {
        headers: {
          'authorization': `Bearer ${sessionStorage.getItem('CLIENT_TOKEN')}`
        }}).then((resp => {
          setUser(resp.data.user)
        }))
      }
      if (sessionStorage.getItem('CLIENT_ID')) {
        getUser()
      }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  })

  return (
    <Fragment>
      <div className={navClass ? style.down_nav : style.nav}>
        <Link to={'/'} className={style.logo_contain}>
          { !navClass ?
            <img className={style.logo} src={logo} alt="" />
          : <img className={style.logo} src={plogo} alt="" /> }
          <div className={navClass ? style.down_title : style.title}>포용런</div>
        </Link>

        <div className={style.menu}>
          { !sessionStorage.getItem('CLIENT_TOKEN') ?
            <>
              <Link className={navClass ? style.down_btn : style.btn} to={'/login'}>로그인</Link>
              <Link className={navClass ? style.down_btn : style.btn} to={'/signup'}>회원가입</Link>
            </>
          : <Link className={navClass ? style.down_btn : style.btn} to={'/dashboard'}>
              {/* <img className={style.profile_img} src={user.profileImage} alt="" /> */}
              <FontAwesomeIcon className={style.pf} icon={faUser} />
            </Link>
          }
        </div>
      </div>
    </Fragment>
  )
}

export default Navigation
