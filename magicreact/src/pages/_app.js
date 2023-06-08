import '@/styles/globals.css'
import HeaderNavBar from '@/components/header/headerNavBar'
import Footer from '@/components/footer/footer'
import AuthProvider from './AuthContext.js';

export default function App({ Component, pageProps }) {
  return <>
    <AuthProvider>
      <HeaderNavBar />
      <Component {...pageProps} />
      <Footer />
    </AuthProvider>
  </>
}
