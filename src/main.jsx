import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import '@fontsource-variable/geist/wght.css'
import '@fontsource-variable/geist-mono/wght.css'
import '@fontsource/instrument-serif/latin-400-italic.css'
import App from '@/app/App.jsx'
import {ErrorBoundary} from '@/app/ErrorBoundary.jsx'
import '@/styles/index.css'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<ErrorBoundary>
			<App />
		</ErrorBoundary>
	</StrictMode>
)
