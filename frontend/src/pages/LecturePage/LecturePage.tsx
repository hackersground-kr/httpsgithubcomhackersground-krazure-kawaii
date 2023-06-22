import { Fragment, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faHashtag, faComments } from '@fortawesome/free-solid-svg-icons'
import style from './LecturePage.module.css'

import BG from '../../assets/imgs/bg.png'
// import StarFull from '../../assets/svgs/star-full.svg'
// import StarNone from '../../assets/svgs/star-none.svg'

function LecturePage () {
  const [enter, setEnter] = useState('')

  const onSubmit = () => {
    console.log(enter)
  }

  return (
    <Fragment>
      <div className={style.white} />

      <div className={style.main}>
        <div className={style.sort}>
          <div className={style.contain}>
            <img className={style.thumb} src={BG} alt="" />
            <div className={style.info}>
              <div className={style.status}>
                <div className={style.online} />
                <div className={style.text}>온라인 수업</div>
              </div>
              <div className={style.title}>파이썬 서버 구축하는 방법</div>
              <div className={style.item}><FontAwesomeIcon className={style.icon} icon={faPencil} /> 김동영</div>
              <div className={style.item}><FontAwesomeIcon className={style.icon} icon={faHashtag} /> 프로그래밍</div>
              <div className={style.price}>₩10,000</div>
              <button className={style.btn}>신청하기</button>
            </div>
          </div>

          <div className={style.desc}>파이썬 Flask를 통한 백엔드 서버 구축 과정에 대하여 배우는 강의입니다.</div>
        </div>

        <div className={style.comments}>
          <div className={style.comments_menu}>
            <FontAwesomeIcon className={style.icon} icon={faComments} />
          </div>

          <div className={style.enter}>
            <div className={style.enter_contain}>
              <textarea onChange={(e: any) => setEnter(e.target.value)} value={enter} rows={5} placeholder='무슨 생각을 하고 있나요?' className={style.enter} />
              <button onClick={onSubmit} className={style.submit}>등록</button>
            </div>
          </div>

        </div>
      </div>
    </Fragment>
  )
}

export default LecturePage