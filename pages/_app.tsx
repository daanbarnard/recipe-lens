import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useState } from 'react'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  const [key, setKey] = useState(0)

  const resetApp = () => {
    setKey(prevKey => prevKey + 1)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header onReset={resetApp} />
      <main className="flex-grow">
        <Component {...pageProps} key={key} />
      </main>
      <Footer />
    </div>
  )
}

export default MyApp