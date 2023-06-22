import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import style from './Dashboard.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faAt, faCalendar, faVenusMars } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'

import IMG from '../../assets/imgs/header.png'
import BG from '../../assets/imgs/bg.png'

function Dashboard () {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>({})
  const [lectures, setLectures] = useState([])
  console.log(lectures)

  useEffect(() => {
    const getUser = async () => {
      const response = (await axios.get('/api/auth/user/info', {
        headers: {
          'authorization': `Bearer ${sessionStorage.getItem('CLIENT_TOKEN')}`
        }
      })).data
      console.log(response.user)
      setUser(response.user)
    }
    if (sessionStorage.getItem('CLIENT_TOKEN')) getUser()
    else navigate('/login')

    if (user.role === 'teacher') {
      const getLectures = async () => {
        const response: any = (await axios.get('/api/lecture/teacher/view', {
          headers: {
            'authorization': `Bearer ${sessionStorage.getItem('CLIENT_TOKEN')}`
          }
        }))
  
        setLectures(response)
        console.log(response)
      }
      getLectures()

    } else if (user.role === 'student') {
      const getLectures = async () => {
        const response: any = (await axios.get('/api/lecture/student/view', {
          headers: {
            'authorization': `Bearer ${sessionStorage.getItem('CLIENT_TOKEN')}`
          }
        }).catch(() => {
          navigate('/login')
        }))
  
        setLectures(response.data)
        console.log(response.data)
      }
      getLectures()
    }
  }, [])

  return (
    <div className={style.main}>
      <div className={style.white} />
      <div className={style.contain}>
        <img className={style.bg} src={BG} alt="" />
        <div className={style.profile}>
          <img className={style.img} src={IMG} alt="" />
          <div className={style.info}>
            <div className={style.name}><FontAwesomeIcon className={style.name_icon} icon={faAt} /> { user.nickname }</div>

            <div className={style.envelope}><FontAwesomeIcon className={style.env} icon={faEnvelope} />{ user.email }</div>
            <div className={style.age}><FontAwesomeIcon className={style.age_} icon={faCalendar} />{ moment(user.birth).format('YYYY-MM-DD') }</div>
            <div className={style.gender}><FontAwesomeIcon className={style.gender_} icon={faVenusMars} />{ user.gender === 'M' ? '남성' : '여성' }</div>
          </div>
        </div>

        <div className={style.active}>
          { user.role === 'teacher' ?
            <>
              <div className={style.title_contain}>
                <div className={style.title}>내가 생성한 강의</div>
                <button className={style.title_btn} onClick={() => navigate('/create')}>강의 만들기</button>
              </div>
              <div className={style.card_contain}>
                {/* { lectures.map((el: any) => {
                  return <div className={style.card}>
                    <img className={style.thumb} src={BG} alt="" />
                    <div className={style.types}>
                      <div className={style.type}><div className={style.offline} />오프라인 수업</div>
                    </div>
                    <div className={style.card_text}>쉽게 배우는 파이썬 강의</div>
                    <div className={style.tags}>
                      <div className={style.tag}>#프로그래밍</div>
                    </div>
                  </div>
                }) } */}
              </div>
            </>
          : 
            <>
              <div className={style.title}>현재 수강 중인 강의</div>
              <div className={style.card_contain}>
                <div className={style.card}>
                  <img className={style.thumb} src={BG} alt="" />
                  <div className={style.types}>
                    <div className={style.type}><div className={style.offline} />오프라인 수업</div>
                  </div>
                  <div className={style.card_text}>쉽게 배우는 파이썬 강의</div>
                  <div className={style.tags}>
                    <div className={style.tag}>#프로그래밍</div>
                  </div>
                </div>
              </div>
            </>}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
