// Coded covers for products whose screens are not public. Content mirrors each README.
function AriaArt() {
	return (
		<div className="art art-aria">
			<div className="art-chat">
				<p className="art-bubble is-user">need an appointment tomorrow after 5</p>
				<p className="art-tool">
					<span>tool</span> availability · e-Booking service
				</p>
				<p className="art-bubble">These slots are open tomorrow — shall I hold one?</p>
				<div className="art-slots">
					<span>17:30</span>
					<span className="is-picked">18:00</span>
					<span>18:45</span>
				</div>
				<p className="art-tool">
					<span>otp</span> verification sent · audit logged
				</p>
			</div>
		</div>
	)
}

function RetailArt() {
	const lines = [
		['چاول', 'Basmati rice · 2.5 kg', '1,125'],
		['چینی', 'Sugar · 1 kg', '165'],
		['دودھ', 'Milk pack · ×3', '810'],
	]
	return (
		<div className="art art-retail">
			<div className="art-till">
				<p className="art-till-head">
					<span>Bill #1042</span>
					<span>Shift · Counter 1</span>
				</p>
				{lines.map(([urdu, name, price]) => (
					<p className="art-till-line" key={name}>
						<span className="art-urdu">{urdu}</span>
						<span>{name}</span>
						<b>Rs {price}</b>
					</p>
				))}
				<p className="art-till-total">
					<span>Total</span>
					<b>Rs 2,100</b>
				</p>
				<div className="art-split">
					<span>Cash 1,500</span>
					<span className="is-khata">Khata 600</span>
				</div>
			</div>
		</div>
	)
}

function FitArt() {
	return (
		<div className="art art-fit">
			<div className="art-phone">
				<p className="art-phone-kicker">Plan change proposal</p>
				<p className="art-phone-title">Your last three sessions were rated brutal.</p>
				<p className="art-phone-text">Reduce weekly volume and keep your goal date?</p>
				<div className="art-bars">
					{[62, 80, 94, 100, 70].map((h, i) => (
						<span key={i} style={{height: `${h}%`}} />
					))}
				</div>
				<div className="art-actions">
					<span className="is-primary">Approve</span>
					<span>Keep plan</span>
				</div>
			</div>
		</div>
	)
}

const arts = {aria: AriaArt, retailflow: RetailArt, fitmind: FitArt}

export function ProjectArt({name}) {
	const Art = arts[name]
	return Art ? <Art /> : null
}
