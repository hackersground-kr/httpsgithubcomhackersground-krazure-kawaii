import { Fragment, useRef, useState } from 'react'
import axios from 'axios'
import style from './CreatePage.module.css'

function CreatePage () {
  const [type, setType] = useState<any>(false)
  const [region, setRegion] = useState('경북')
  const facilities: any = ['대명11동주민자치센터/공공시설', '우리글터지역아동센터/공공시설', '꿈앤카페/카페']
  const facilities2: any = ['블루하라/카페', '모던29/카페', '안동시립도서관/공공시설']

  const fileInput: any = useRef(null)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [price, setPrice] = useState<any>(0)
  const [startDate, setStartDate] = useState<any>()
  const [endDate, setEndDate] = useState<any>()
  const [max, setMax] = useState<any>(0)
  const [category, setCategory] = useState('')
  const [address, setAddress] = useState('')
  const [file, setFile] = useState<any>()
  const [fileName, setFileName] = useState('')
  let formData = new FormData()

  const handleChange = async (e: any) => {
    if (!e.target.files) return
    setFile(await e.target.files[0])
    setFileName(await e.target.files[0]['name'])
  }

  const onSubmit = async () => {
    formData.append('file', file)
    formData.append('category', category)
    formData.append('title', title)
    formData.append('description', desc)
    formData.append('location', address)
    formData.append('startTime', startDate)
    formData.append('endTime', endDate)
    formData.append('price', price)
    formData.append('capacity', max)
    formData.append('type', type)

    axios.post('/api/lecture/insert', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'authorization': `Bearer  ${sessionStorage.getItem('CLIENT_TOKEN')}`
      }
    }).then (() => {
      window.location.href='/dashboard'
    }).catch((e) => {
      console.log(e)
    })
  }

  return (
    <Fragment>
      <div className={style.white} />

      <div className={style.main}>
        <div className={style.title}>강의 생성</div>

        <div className={style.card}>
          <div className={style.cardin}>
            <div className={style.sub}>강의 제목</div>
            <input type="text" className={style.input} placeholder='나의 강의' onChange={(e: any) => setTitle(e.target.value)} />

            <div className={style.sub}>강의 설명</div>
            <input type="text" className={style.input} placeholder='나의 강의 설명' onChange={(e: any) => setDesc(e.target.vaulue)} />

            <div className={style.sub}>강의 가격</div>
            <input type="number" className={style.input} placeholder='10000' onChange={(e: any) => setPrice(e.target.value)} />

            { !type ?
              <>
                <div className={style.sub}>강의 지역 (도, 시)</div>
                <button className={region === '대구' ? style.act_sel_btn_l : style.sel_btn_l} onClick={() => setRegion('경북')}>경북</button>
                <button className={region === '대구' ? style.sel_btn_r : style.act_sel_btn_r} onClick={() => setRegion('대구')}>대구</button>

                <div className={style.sub3}>강의실 상세 주소</div>
                <input type="text" className={style.input} placeholder='대구광역시 ...' onChange={(e: any) => setAddress(e.target.value)} />
              </>
            : <>
                <div className={style.sub}>원격 수업 링크 (Zoom, Meet ...)</div>
                <input type="text" className={style.input} placeholder='https://...' onChange={(e: any) => setAddress(e.target.value)} />
              </>
            }
          </div>

          <div className={style.cardin}>
            <div className={style.sub}>강의 시작 시간</div>
            <input type="date" className={style.input} onChange={(e: any) => setStartDate(e.target.value)} />
            
            <div className={style.sub}>강의 종료 시간</div>
            <input type="date" className={style.input} onChange={(e: any) => setEndDate(e.target.value)} />

            <div className={style.sub}>최대 강의 인원</div>
            <input type="number" className={style.input} placeholder='10' onChange={(e: any) => setMax(e.target.value)} />

            <div className={style.subct}>강의 카테고리</div>
            <input type="text" className={style.input} placeholder='프로그래밍' onChange={(e: any) => setCategory(e.target.value)} />

            <div className={style.sub}>강의 종류</div>
            <div className={style.sort}>
              <button className={type ? style.act_sel_btn_l : style.sel_btn_l} onClick={() => setType(false)}>오프라인 강의</button>
              <button className={type ? style.sel_btn_r : style.act_sel_btn_r} onClick={() => setType(true)}>온라인 강의</button>
            </div>
          </div>
        </div>

        <div className={style.finder} />

        { !type && region === '대구' ?
          <div className={style.finder}>
            <div className={style.sub2}>이런 곳은 어때요?</div>
            <div className={style.tb}><div className={style.tb_item}>이름</div><div className={style.tb_item}>종류</div></div>
              { facilities.map((el: any, idx: number) => {
                return <div key={idx} className={style.table}><div className={style.tb_item}>{ el.split('/')[0] }</div><div className={style.tb_item}>{ el.split('/')[1] }</div></div>
              }) }
            </div>
          : ( !type && region == '경북' ? 
              <div className={style.finder}>
                <div className={style.sub2}>이런 곳은 어때요?</div>
                <div className={style.tb}><div className={style.tb_item}>이름</div><div className={style.tb_item}>종류</div></div>
                  { facilities2.map((el: any, idx: number) => {
                    return <div key={idx} className={style.table}><div className={style.tb_item}>{ el.split('/')[0] }</div><div className={style.tb_item}>{ el.split('/')[1] }</div></div>
                  }) }
                </div>
           : null )
          }

        <div className={style.url}>{ fileName }</div>
        <button className={style.upload} onClick={() => fileInput.current.click()}>파일 업로드</button>
        <input type="file" className={style.file} ref={fileInput} onChange={handleChange} />

        <button className={style.submit} onClick={onSubmit}>생성하기</button>
      </div>
    </Fragment>
  )
}

export default CreatePage
