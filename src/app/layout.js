import "@/styles/global.css";
import { GlobalProvider } from "../context/global";
import { Toaster } from "react-hot-toast";
import { GoogleTagManager } from "@next/third-parties/google";

export const metadata = {
  title: "Dados Médicos",
  description: "Sua corrida ainda mais segura!",
  icons: "/icons/favicon.svg",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <GlobalProvider>
          <GoogleTagManager gtmId="GTM-PQ3MPV9D" />
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
