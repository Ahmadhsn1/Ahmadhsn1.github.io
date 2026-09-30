// Single source of truth for identity and contact details.
// `phone` is written in international format without spaces, e.g. '+923001234567'.
// When it is empty the phone and WhatsApp actions are simply not rendered.
export const site = {
	name: 'Ahmad Hassan',
	role: 'AI Systems Engineer',
	roleLong: 'AI Systems Engineer · Full-Stack · Native Android',
	location: 'Lahore, Pakistan',
	timeZone: 'Asia/Karachi',
	email: 'ahmad.hsn0099@gmail.com',
	phone: '',
	github: 'https://github.com/Ahmadhsn1',
	githubHandle: 'Ahmadhsn1',
	linkedin: 'https://www.linkedin.com/in/ahmad-hassan0099/',
	linkedinHandle: 'ahmad-hassan0099',
}

export const formatPhone = (phone) => phone.replace(/^(\+\d{2})(\d{3})(\d+)$/, '$1 $2 $3')
export const whatsappUrl = (phone) => `https://wa.me/${phone.replace(/\D/g, '')}`
