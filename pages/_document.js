// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="id">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="apple-touch-icon" href="/icons/icon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
