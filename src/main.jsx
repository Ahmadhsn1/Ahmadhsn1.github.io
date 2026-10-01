import {StrictMode} from 'react'
import {createRoot, hydrateRoot} from 'react-dom/client'
import '@fontsource-variable/geist/wght.css'
import '@fontsource-variable/geist-mono/wght.css'
import '@fontsource/instrument-serif/latin-400-italic.css'
import App from '@/app/App.jsx'
import {ErrorBoundary} from '@/app/ErrorBoundary.jsx'
import '@/styles/index.css'

const root = document.getElementById('root')
const app = (
	<StrictMode>
		<ErrorBoundary>
			<App />
		</ErrorBoundary>
	</StrictMode>
)

// Prerendered pages already contain the markup, so React attaches to it instead of rebuilding it.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
