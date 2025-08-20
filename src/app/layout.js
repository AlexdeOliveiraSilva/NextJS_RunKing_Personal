import "@/styles/global.css";
import { GlobalProvider } from "../context/global";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Dados Médicos",
  description: "Sua corrida ainda mais segura!",
  icons: "/icons/favicon.svg",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-PQ3MPV9D');
            `,
          }}
        />
      </head>
      <body>
        <GlobalProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
            }}
          />
          {children}

          <noscript
            dangerouslySetInnerHTML={{
              __html: `
            <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PQ3MPV9D"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `,
            }}
          />
        </GlobalProvider>
      </body>
    </html>
  );
}
