import { Fragment } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper"
SwiperCore.use([Navigation, Pagination, Autoplay])
import 'swiper/css'

import Education from '../../assets/svgs/education.svg'
import Love from '../../assets/svgs/love.svg'
import Balloon from '../../assets/svgs/balloon.svg'

import style from './Slides.module.css'

function Slides () {
  return (
    <Fragment>
      <Swiper className={style.slide} spaceBetween={0} slidesPerView={1} autoplay={{ delay: 3000 }}>
        <SwiperSlide>
          <div className={style.header}>
            <div className={style.title}>
              <div className={style.first}>누군가에게는 새로운</div>
              <div className={style.last}>시작</div>
            </div>
            <img className={style.education} src={Balloon} alt="" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className={style.header}>
            <img className={style.love} src={Love} alt="" />
            <div className={style.title2}>
              <div className={style.first}>누구나 참여 가능한</div>
              <div className={style.last}>포용</div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className={style.header}>
            <div className={style.title}>
              <div className={style.first}>모두에게 차별없는</div>
              <div className={style.last}>교육</div>
            </div>
            <img className={style.education} src={Education} alt="" />
          </div>
        </SwiperSlide>
      </Swiper>
    </Fragment>
  )
}

export default Slides