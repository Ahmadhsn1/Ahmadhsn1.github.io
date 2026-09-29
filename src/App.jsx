import {About} from './components/About.jsx'
import {Contact} from './components/Contact.jsx'
import {Footer} from './components/Footer.jsx'
import {Header} from './components/Header.jsx'
import {Hero} from './components/Hero.jsx'
import {Process} from './components/Process.jsx'
import {ProjectGrid} from './components/ProjectGrid.jsx'
import {ScrollEffects} from './components/ScrollEffects.jsx'

export default function App() {
	return (
		<>
			<div className="backdrop" aria-hidden="true">
				<span className="backdrop-glow glow-a" />
				<span className="backdrop-glow glow-b" />
				<span className="backdrop-grid" />
				<span className="backdrop-grain" />
			</div>
			<ScrollEffects />
			<Header />
			<main id="home">
				<Hero />
				<ProjectGrid />
				<Process />
				<About />
				<Contact />
			</main>
			<Footer />
		</>
	)
}
