
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.jsx';
import Footer from './components/Footer.jsx';


createRoot(document.getElementById('root')).render(
  <ThemeProvider>

    <App />
    {/* <Footer /> */}
  </ThemeProvider>

)
