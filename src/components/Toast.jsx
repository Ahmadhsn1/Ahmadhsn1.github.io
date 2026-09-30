import {createContext, useCallback, useContext, useRef, useState} from 'react'

const ToastContext = createContext(() => {})

export function ToastProvider({children}) {
	const [toast, setToast] = useState(null)
	const timer = useRef(0)

	const show = useCallback((message) => {
		clearTimeout(timer.current)
		setToast({message, id: Date.now()})
		timer.current = setTimeout(() => setToast(null), 2400)
	}, [])

	return (
		<ToastContext.Provider value={show}>
			{children}
			<div className="toast-region" role="status" aria-live="polite">
				{toast && (
					<div className="toast" key={toast.id}>
						<span className="toast-check">✓</span>
						{toast.message}
					</div>
				)}
			</div>
		</ToastContext.Provider>
	)
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext)
