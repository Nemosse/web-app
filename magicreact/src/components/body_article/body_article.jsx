import style from './body_article.module.css'


export default function body_article({
  children,
  text,
  opacity
}
) {
  return (
    <>
      <div className={style['ba-body']}>
        <div className={`${style['ba-topic']} cl-border`}>
          <h1>{text}</h1>
        </div>
        <div className={`${style['ba-body-center']} ${opacity ? style['opacity'] : ''}`}>
          <div className={`${style['ba-bc-content']} ${opacity ? style['opacity'] : ''}`}>
            {children}
          </div>
        </div>
        <div className='csc-bottom cl-border'></div>  
      </div>
    </>
  )
}