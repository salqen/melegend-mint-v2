import { CacheProvider, css, EmotionCache, Global } from "@emotion/react";
import ThemeProvider, { createEmotionCache } from "components/ui/ThemeProvider";
import TransactionPresenter from "components/ui/TransactionPresenter";
import WalletConnectWindow from "components/ui/WalletConnectWindow";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface Props extends AppProps {
  emotionCache?: EmotionCache;
}

const global = css`
  :root {
    --primary: #1a1a1a;
    --primary-text: #ffffff;
    --secondary: #ff7700;
    --secondary-text: #ffffff;
    --accent: #272626a4;
    --accent-text: #ffffff;
  }

  body {
    color: white;
  }
`;

function MageBrotherHoodApp(props: Props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  useEffect(() => {
    setTimeout(() => document.getElementById("loader")?.remove(), 200);
  }, []);

  return (
    <>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>Melegend mint</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
        </Head>

        <ThemeProvider>
          <Component {...pageProps} />

          <Global styles={global} />
          <WalletConnectWindow />
          <TransactionPresenter />
        </ThemeProvider>
      </CacheProvider>
    </>
  );
}

export default MageBrotherHoodApp;
