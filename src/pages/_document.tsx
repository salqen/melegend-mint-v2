import createEmotionServer from "@emotion/server/create-instance";
import styled from "@emotion/styled";
import { createEmotionCache } from "components/ui/ThemeProvider";
import Document, { Head, Html, Main, NextScript } from "next/document";

const Loader = styled.div`
  position: fixed;
  z-index: 99999999;
  top: 0;
  bottom: 0;
  width: 100%;
  left: 0;
  right: 0;
  background: black;
  display: flex;
  justify-content: center;
  align-content: center;

  svg {
    align-self: center;
    width: 150px;
    height: 150px;
  }
`;

class MelegendDocument extends Document {
  render() {
    return (
      <Html style={{ background: "#000" }}>
        <Head>
          <meta name="description" content="Melegend Minting page" />
          <meta name="theme-color" content="#000" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <Loader id="loader">Loading...</Loader>

          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MelegendDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const originalRenderPage = ctx.renderPage;

  // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);
  // This is important. It prevents emotion to render invalid HTML.
  // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
  };
};

export default MelegendDocument;
