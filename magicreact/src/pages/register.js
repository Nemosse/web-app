import Head from 'next/head'
import BodyArticle from '@/components/body_article/body_article'
import style from '@/components/body_article/body_article.module.css'
import Image from 'next/image'
import logo from '@/assets/magicLogo.png'
import axios from 'axios'
import { useState } from 'react'
import { useRouter } from 'next/router';
import { AuthContext } from '@/pages/AuthContext.js';
import { useContext } from 'react';

export default function Register() {
  const { authenticated, register, error_code} = useContext(AuthContext);

  const router = useRouter();
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm_password, setConfirmPassword] = useState('')
  const [isAdmin, setAdmin] = useState(false)
  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = {};

    if (username.trim() === '') {
      validationErrors.username = 'Min 6 characters - Max 25 characters';
    }
    else if (!checkLetter(username)){
      validationErrors.username = 'Username must be english only'
    }

    if (email.trim() === '') {
      validationErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      validationErrors.email = 'Please enter a valid email address';
    }

    if (password.trim() === '') {
      validationErrors.password = 'Min 8 characters - Max 30 characters';
    }

    if (confirm_password.trim() === '') {
      validationErrors.confirm_password = 'Please confirm your password';
    } else if (confirm_password !== password) {
      validationErrors.confirm_password = 'Passwords do not match';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    else {
      try {
        register(username, email, password, confirm_password)
        
        if (authenticated)
        {
          // login(username, password)
          router.push('/');
        }
        else
        {
          if (error_code == 1)
          {
            validationErrors.username = 'Min 6 characters - Max 25 characters';
          }
          else if (error_code == 2)
          {
            validationErrors.email = 'Valid email is required';
          }
          else if (error_code == 3) 
          {
            validationErrors.password = 'Min 8 characters - Max 30 characters';
          }
          else if (error_code == 4) 
          {
            validationErrors.confirm_password = 'Passwords do not match';
          }
          else if (error_code == 5)
          {
            validationErrors.username = 'Username already taken'
          }
          else
          {
            console.log('something wrong not have error_code')
          }
        }
      }
      catch (error) {
        console.log(error)
      }

    }

  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleChangeIsAdmin = (e) => {
    setAdmin(e.target.value);
  };

  const isValidEmail = (email) => {
    // Basic email validation regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkLetter = (inputtxt) => {
    const letters = /^[A-Za-z0-9]+$/
    if (inputtxt.match(letters)) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <Head>
        <title>Register</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <BodyArticle text='Register' opacity={true}>
        <form onSubmit={handleSubmit}>
          <div className={`${style['register-section']}`}>
            <Image src={logo} className={style['reg-logo']} />
            <div className={style['insert-section']}>
              <div>
                <input
                  type="text"
                  className={`${style['register-bar']}`}
                  placeholder={'Username'}
                  value={username}
                  onChange={handleUsernameChange}
                  required
                  minLength={6}
                  maxLength={25}
                />
                {errors.username && <span className={style['error-span']}>{errors.username}</span>}
              </div>
              <div>
                <input type="email"
                  className={`${style['register-bar']}`}
                  placeholder={'Email'}
                  value={email}
                  onChange={handleEmailChange}
                  required
                  maxLength={100}
                />
                {errors.email && <span className={style['error-span']}>{errors.email}</span>}
              </div>
              <div>
                <input type="password"
                  className={`${style['register-bar']}`}
                  placeholder={'Password'}
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  minLength={8}
                  maxLength={30}
                />
                {errors.password && <span className={style['error-span']}>{errors.password}</span>}
              </div>
              <div>
                <input type="password"
                  className={`${style['register-bar']}`}
                  placeholder={'Confirm-Password'}
                  value={confirm_password}
                  onChange={handleChangeConfirmPassword}
                  required
                  minLength={8}
                  maxLength={30}
                />
                {errors.confirm_password && <span className={style['error-span']}>{errors.confirm_password}</span>}
              </div>
            </div>

            <div className={style['reg-button-section']}>
              <label>
                <input
                  type="checkbox"
                  value={isAdmin}
                  onChange={handleChangeIsAdmin}
                />
                Admin
              </label>
              <button type='submit' className={`${style['reg-button']}`} value={'Submit'}>Sign Up</button>
            </div>
          </div>
        </form>
      </BodyArticle>
    </>
  )
}