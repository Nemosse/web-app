import style from './footer.module.css'
import Image from 'next/image'
import MagicLogo from '@/assets/magicLogo.png'
import FbLogo from '@/assets/fb_icon.png'
import TtLogo from '@/assets/tt_icon.png'
import TwLogo from '@/assets/tw_icon.webp'
import YtLogo from '@/assets/yt_icon.png'
import IgLogo from '@/assets/ig_icon.webp'
import Link from 'next/link'

export default function() {
    return (
        <div className={`${style.footer}`}>
            <div className={style.box1}>
                <Link href={"/"} className={style.box1Link}><Image className={style.logoImage} src={MagicLogo}/></Link>
            </div>
            <div className={style.box2}>
                <ul>
                    <li><Link target="_blank" href="https://www.facebook.com/MagicTheGathering.apac/"><Image className={style.contactIcon} src={FbLogo}/></Link></li>
                    <li><Link target="_blank" href="https://twitter.com/wizards_magic"><Image className={style.contactIcon} src={TtLogo}/></Link></li>
                    <li><Link target="_blank" href="https://www.twitch.tv/magic"><Image className={style.contactIcon} src={TwLogo}/></Link></li>
                    <li><Link target="_blank" href="https://www.youtube.com/channel/UC8ZGymAvfP97qJabgqUkz4A"><Image className={style.contactIcon} src={YtLogo}/></Link></li>
                    <li><Link target="_blank" href="https://www.instagram.com/wizards_magic/"><Image className={style.contactIcon} src={IgLogo}/></Link></li>
                </ul>
                <p>MTG Official Contract</p>
            </div>
            <div className={style.box3}>
                <p>Fair use disclaimer for education only.</p>
            </div>
        </div>
    )
}