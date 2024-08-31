import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useState } from 'react'
import Head from 'next/head'
import Script from 'next/script'

function MyApp({ Component, pageProps }: AppProps) {
  const [key, setKey] = useState(0)

  const resetApp = () => {
    setKey(prevKey => prevKey + 1)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <link rel="icon" href="/favicon.png" />
        <meta name="google-adsense-account" content="ca-pub-1361426623128973" />
      </Head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-7YYVRBJ7J6"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-7YYVRBJ7J6');
        `}
      </Script>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1361426623128973"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <Header onReset={resetApp} />
      <main className="flex-grow">
        <Component {...pageProps} key={key} />
      </main>
      <Footer />
    </div>
  )
}

export default MyApp