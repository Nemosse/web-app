import MagicLogo from '@/assets/magicLogo.png'
import LanguageIcon from '@/assets/TH.png'
import Anonoymous from '@/assets/anonymous_profile.png'
import Image from 'next/image'
import style from './headerNavBar.module.css'
import Link from 'next/link'
import ThreeLine from '@/assets/three_line.jpg'
import { useCallback, useEffect, useRef, useState } from "react";
import { AuthContext } from '@/pages/AuthContext.js';
import { useRouter } from 'next/router';
import { useContext } from 'react';


export default function () {
  const router = useRouter();
  const dropdownRef = useRef(null);
  const sidenavRef = useRef(null);
  const authenticatedDropdownRef = useRef(null);

  const [normUsername, setUsername] = useState('');
  const [normPassword, setPassword] = useState('');

  const { authenticated, username, login, logout, displayname, profileImage, isAdmin } = useContext(AuthContext);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };


  const loginDropdown = useCallback(() => {
    const dropdown = dropdownRef.current;
    if (dropdown) {
      dropdown.classList.toggle(style['show']);
    }
  }, []);

  const OpensideNavBar = useCallback(() => {
    const sideNav = sidenavRef.current;
    if (sideNav) {
      sideNav.classList.toggle(style['show']);
    }
  }, []);

  const authenticatedDropdown = useCallback(() => {
    const authdropdown = authenticatedDropdownRef.current;
    if (authdropdown) {
      authdropdown.classList.toggle(style['show']);
    }
  }, []);

  const onClickOutside = useCallback((event) => {
    if (!event.target.matches(".dropbtn") && !event.target.matches(".dropcontent")) {
      const dropdowns = document.getElementsByClassName(style["login-dropdown-content"]);
      Array.from(dropdowns).forEach((openDropdown) => {
        if (openDropdown.classList.contains(style['show'])) {
          openDropdown.classList.remove(style['show']);
        }
      });
    }
    if (!event.target.matches('.auth-dropbtn') && !event.target.matches(".auth-dropcontent")) {
      const authdropdowns = document.getElementsByClassName(style['auth-dropdown-content']);
      Array.from(authdropdowns).forEach((authOpenDropdown) => {
        if (authOpenDropdown.classList.contains(style['show'])) {
          authOpenDropdown.classList.remove(style['show'])
        }
      });
    }
  }, []);


  const handleSubmitLogin = async (e) => {
    e.preventDefault()

    try {
      login(normUsername, normPassword)
      if (authenticated)
      {
        setUsername('');
        setPassword('');
        const invalids = document.getElementsByClassName(style["invalid-login"]);
        Array.from(invalids).forEach((invalid) => {
          if (invalid.classList.contains(style['invalid'])) {
            invalid.classList.remove(style['invalid']);
          }
        });
      }
      else
      {
        const invalids = document.getElementsByClassName(style["invalid-login"]);
        Array.from(invalids).forEach((invalid) => {
          if (!invalid.classList.contains(style['invalid'])) {
            invalid.classList.toggle(style['invalid']);
          }
        });
      }
    }
    catch (error)
    {
      console.log(error)
    }


  }

  const handleSubmitLogout = async (e) => {
    e.preventDefault()

    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.log(error);
    }

  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      onClickOutside(event);
    };


    if (typeof window !== "undefined") {
      window.addEventListener("click", handleClickOutside);
    }


    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("click", handleClickOutside);
      }
    };
  }, [onClickOutside]);




  return (

    <div className={`${style.headerNavBar}`}>
      <div className={style.logoSection}>
        <Link href={"/"}><Image className={style.logoImage} src={MagicLogo} /></Link>
      </div>
      <div className={style.containerFlexEnd}>
        <div className={style.menuSection}>
          <div className={style['sidenav']} ref={sidenavRef}>
            <a href="javascript:void(0)" className={style['closebtn']} onClick={OpensideNavBar}>&times;</a>
            {authenticated ? (
              <form onSubmit={handleSubmitLogout}>
                <button type='submit' value={'submit'} className={`${style['authed-logout-btn']} `}>Log out</button>
                <Link href={`/user/profile/${username}`} class={`${style['sidenav-authed-btn']}`}>Profile</Link>
                <a className={`${style['sidenav-authed-btn']}`}>Collection</a>
                <a className={`${style['sidenav-authed-btn']}`}>Deck Builder</a>
              </form>
            ) : (
              <form onSubmit={handleSubmitLogin}>
                <div className={style['sidenav-unauthenticate']}>
                  <input type="text" className={`${style['sidenav-login-bar']} dropcontent`} placeholder={'Username'} value={normUsername} onChange={handleUsernameChange} />
                  <input type="password" className={`${style['sidenav-login-bar']} dropcontent`} placeholder={'Password'} value={normPassword} onChange={handlePasswordChange} />
                  <div className={`${style['invalid-login']}`}>Invalid username or password.</div>
                  <label className={`${style['login-checkbox']} dropcontent`}>
                    <input type="checkbox" className={`dropcontent`} />
                    Remember Me
                  </label>
                  <div className={style['sidenav-login-db-btn-section']}>
                    <button type='submit' value={'submit'} className={`${style['sidenav-login-loginbtn']} dropcontent`}>Log in</button>
                    <Link href={'/register'}><input type='button' className={`${style['sidenav-login-registerbtn']} dropcontent`} value={'Register'} /></Link>
                  </div>
                </div>
              </form>
            )}
            <Link href={"/what-is-mtg"} class={style['sidenav-btn']}>What is MTG?</Link>
            <a className={style['sidenav-btn']}>Rule</a>
            <a className={style['sidenav-btn']}>How to play</a>
            <a className={style['sidenav-btn']}>Keywords</a>
            <Link href={"/cards-library"} class={style['sidenav-btn']}>Cards Library</Link>
          </div>
          <Image src={ThreeLine} className={style.threeline} onClick={OpensideNavBar} />
          <ul className={style.navBarUl}>
            {/* <li className={style.navBarLi}><Image className={style.languageIcon} src={LanguageIcon} /></li> */}
            <li className={style.navBarLi}><Link className={style.navBarLiA} href={"/what-is-mtg"}>What is MTG?</Link></li>
            <li className={style.navBarLi}><a className={style.navBarLiA}>Rule</a></li>
            <li className={style.navBarLi}><a className={style.navBarLiA}>How to play</a></li>
            <li className={style.navBarLi}><a className={style.navBarLiA}>Keywords</a></li>
            <li className={style.navBarLi}><Link className={style.navBarLiA} href={"/cards-library"}>Cards Library</Link></li>
          </ul>
        </div>
        <div className={style.userSection}>
          {authenticated ? (
            <form onSubmit={handleSubmitLogout}>
              <div className={`${style['authenticate']} auth-dropbtn`} onClick={authenticatedDropdown}>
                <Image src={profileImage.src} className={`${style['userIcon-authenticated']} dropbtn`}  width={100} height={100}/>
                <div className={style['display-name']}>{displayname}</div> {/*Longest 8 character*/}
                <div className={style.dropdown}>
                  <div id='auth-dropdown-content' className={`${style['auth-dropdown-content']} auth-dropcontent`} ref={authenticatedDropdownRef}>
                    <Link href={`/user/profile/${username}`} className={`${style['authed-btn']} auth-dropcontent`}>Profile</Link>
                    <a className={`${style['authed-btn']} auth-dropcontent`}>Collection</a>
                    <a className={`${style['authed-btn']} auth-dropcontent`}>Deck Builder</a>
                    <button type='submit' value={'submit'} className={`${style['authed-logout-btn']} auth-dropcontent `}>Log out</button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className={style['unauthenticate']}>
              <Image src={Anonoymous} className={`${style['userIcon']} dropbtn`} onClick={loginDropdown} />
              <div className={`${style['login-section-fs']}`}>
                <input type="button" className={` ${style.button} ${style.loginButton} dropbtn`} value={`Login`} onClick={loginDropdown} />
              </div>
              <div className={style.dropddown}>
                <form onSubmit={handleSubmitLogin}>
                  <div id='login-dropdown-content' className={`${style['login-dropdown-content']} dropcontent`} ref={dropdownRef}>
                    <div className={`${style['login-section']} dropcontent`}>
                      <input type="text" className={`${style['login-bar']} dropcontent`} value={normUsername} onChange={handleUsernameChange} placeholder={'Username'} />
                      <input type="password" className={`${style['login-bar']} dropcontent`} value={normPassword} onChange={handlePasswordChange} placeholder={'Password'} />
                      <div className={`${style['invalid-login']} `}>Invalid username or password.</div>
                      <label className={`${style['login-checkbox']} dropcontent`}>
                        <input type="checkbox" className={`dropcontent`} />
                        Remember Me
                      </label>
                      <div className={style['login-db-btn-section']}>
                        <button type='submit' value={'submit'} className={`${style['login-loginbtn']} dropcontent`}>Log in</button>
                        <Link href={'/register'}><input type='button' className={`${style['login-registerbtn']} dropcontent`} value={'Register'} /></Link>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className={`${style['login-section-fs']}`}>
                <Link href={'/register'}><input type="button" className={`${style['login-section-fs']} ${style.button} ${style.registerButton}`} value={`Register`} /></Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div >




  )
}
