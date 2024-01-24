import '@/styles/global.css'
import { GlobalProvider } from "../context/global"
export const metadata = {
  title: 'Câmera de Chamada',
  description: 'Seu acesso VIP',
}

export default function RootLayout({ children }) {
  return (
    <GlobalProvider>
      <html lang="pt-br">
        <body>{children}</body>
      </html>
    </GlobalProvider>
  )
}
