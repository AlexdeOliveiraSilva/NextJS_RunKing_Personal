import "@/styles/global.css";
import { GlobalProvider } from "../context/global";
import { Toaster } from "react-hot-toast";
export const metadata = {
  title: "Câmera de Chamada",
  description: "Seu acesso VIP",
};

export default function RootLayout({ children }) {
  return (
    <GlobalProvider>
      <html lang="pt-br">
        <body>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
            }}
          />
          {children}
        </body>
      </html>
    </GlobalProvider>
  );
}
