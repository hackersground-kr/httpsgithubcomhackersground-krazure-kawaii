import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import style from './MainPage.module.css'
import Slides from '../../components/Slides/Slides'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import BG from '../../assets/imgs/bg.png'

function MainPage () {
  const navigate = useNavigate()

  return (
    <Fragment>
      <div className={style.nav} />
      <Slides />

      <div className={style.middle}>
        <div className={style.search_text}>어떠한 <span className={style.purple}>정보</span>를 원하시나요?</div>
        <div className={style.search_contain}>
          <input type="text" className={style.search} />
          <button className={style.search_btn}><FontAwesomeIcon icon={faSearch} /></button>
        </div>

        <div className={style.menu}>
          <div className={style.menu_title}>이런 강의는 어때요?</div>
          <div className={style.card_contain}>

              <div className={style.card} onClick={() => navigate('/lecture/1')}>
                <img className={style.thumb} src={BG} alt="" />
                <div className={style.types}>
                  <div className={style.type}><div className={style.offline} />오프라인 수업</div>
                </div>
                <div className={style.card_text}>쉽게 배우는 파이썬 강의</div>
                <div className={style.tags}>
                  <div className={style.tag}>#프로그래밍</div>
                </div>
              </div>

              <div className={style.card} onClick={() => navigate('/lecture/1')}>
                <img className={style.thumb} src={BG} alt="" />
                <div className={style.types}>
                  <div className={style.type}><div className={style.online} />온라인 수업</div>
                </div>
                <div className={style.card_text}>HTML, CSS 기초 강의</div>
                <div className={style.tags}>
                  <div className={style.tag}>#프로그래밍</div>
                  <div className={style.tag}>#웹개발</div>
                </div>
              </div>
          </div>
        </div>
      </div>

    </Fragment>
  )
}

export default MainPage
