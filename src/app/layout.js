import '@/styles/global.css'
import { GlobalProvider } from "../context/global"
export const metadata = {
  title: 'RunKing App',
  description: 'This is a RunKing App Page.',
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
