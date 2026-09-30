import {Environment, Html, Lightformer, RoundedBox} from '@react-three/drei'
import {Canvas, useFrame, useThree} from '@react-three/fiber'
import {useEffect, useMemo, useRef} from 'react'
import * as THREE from 'three'

const {damp} = THREE.MathUtils

const PHASE_COLORS = {
	typing: '#ff6a3d',
	thinking: '#ff6a3d',
	error: '#ff4d4d',
	fixing: '#ffc56e',
	success: '#7dd3a8',
	coffee: '#7dd3a8',
}

// Arm poses for the character's right arm (screen left). The left arm mirrors y/z.
// s = shoulder rotation, e = elbow rotation (radians, XYZ order).
const ARM_POSES = {
	type: {s: [-0.7, -0.07, -0.15], e: [0.25, -0.42, 1.02]},
	chin: {s: [-0.99, -0.4, 0.62], e: [-0.59, -0.64, 1.27]},
	mug: {s: [-0.9, -0.52, 1.38], e: [-0.53, -0.52, 0.1]},
	fist: {s: [-1.62, 0.95, -1.33], e: [-0.3, -0.04, -0.34]},
}

const HEAD_POSES = {
	typing: [0.16, 0, 0],
	thinking: [-0.16, -0.18, 0.14],
	error: [0.22, 0, 0],
	fixing: [0.18, 0, 0],
	success: [-0.1, 0, 0],
	coffee: [-0.3, 0.12, -0.06],
}

const GAZE = {
	typing: [0, -0.012],
	thinking: [0.014, 0.016],
	error: [0, -0.008],
	fixing: [0, -0.012],
	success: [0, 0],
	coffee: [0, 0],
}

if (import.meta.env.DEV) window.__dev3d = {ARM_POSES, HEAD_POSES}

const armPose = (side, phase) => {
	if (side === 'right') return phase === 'thinking' ? ARM_POSES.chin : ARM_POSES.type
	if (phase === 'coffee') return ARM_POSES.mug
	if (phase === 'success') return ARM_POSES.fist
	return ARM_POSES.type
}

const hash = (n) => {
	const x = Math.sin(n * 127.1) * 43758.5453
	return x - Math.floor(x)
}

function useMaterials() {
	return useMemo(() => {
		const std = (color, props = {}) => new THREE.MeshStandardMaterial({color, ...props})
		const phys = (color, props = {}) => new THREE.MeshPhysicalMaterial({color, ...props})
		return {
			skin: phys('#f5c09b', {roughness: 0.52, sheen: 0.6, sheenColor: new THREE.Color('#ff9f84'), sheenRoughness: 0.5}),
			skinShade: phys('#eaa987', {roughness: 0.55, sheen: 0.4, sheenColor: new THREE.Color('#ff9f84')}),
			hair: phys('#4e2c17', {roughness: 0.5, clearcoat: 0.15, clearcoatRoughness: 0.6, sheen: 0.5, sheenColor: new THREE.Color('#a8703f')}),
			hairLight: phys('#6b3e20', {roughness: 0.5, clearcoat: 0.15, sheen: 0.5, sheenColor: new THREE.Color('#b27a45')}),
			shirt: std('#f6f7fa', {roughness: 0.78}),
			shirtShade: std('#e1e5ec', {roughness: 0.8}),
			jeans: std('#3a5a8c', {roughness: 0.85}),
			shoe: phys('#6b4228', {roughness: 0.35, clearcoat: 0.6}),
			eyeWhite: phys('#ffffff', {roughness: 0.06, clearcoat: 1}),
			iris: phys('#4d7fb2', {roughness: 0.15, clearcoat: 1}),
			pupil: phys('#0a0e16', {roughness: 0.05, clearcoat: 1}),
			glint: new THREE.MeshBasicMaterial({color: '#ffffff'}),
			brow: std('#3d2213', {roughness: 0.7}),
			mouth: std('#6e2620', {roughness: 0.6}),
			teeth: std('#ffffff', {roughness: 0.3}),
			tongue: std('#ff7f7f', {roughness: 0.5}),
			blush: new THREE.MeshBasicMaterial({color: '#ff8d8d', transparent: true, opacity: 0.16, depthWrite: false}),
			chair: std('#232328', {roughness: 0.55}),
			wood: phys('#4a3223', {roughness: 0.6, clearcoat: 0.2, clearcoatRoughness: 0.5}),
			metal: std('#1c1c20', {roughness: 0.35, metalness: 0.7}),
			alu: std('#34353c', {roughness: 0.3, metalness: 0.75}),
			keys: std('#141417', {roughness: 0.6}),
			glow: new THREE.MeshBasicMaterial({color: PHASE_COLORS.typing, toneMapped: false}),
			mug: phys('#ff6a3d', {roughness: 0.25, clearcoat: 0.8}),
			coffee: std('#3a2215', {roughness: 0.2}),
			leaf: std('#3f8f5f', {roughness: 0.6, side: THREE.DoubleSide}),
			leafDark: std('#2c6e48', {roughness: 0.6, side: THREE.DoubleSide}),
			pot: std('#e6e1d7', {roughness: 0.7}),
			duck: phys('#ffd23f', {roughness: 0.25, clearcoat: 1}),
			beak: std('#ff8c42', {roughness: 0.4}),
			bug: phys('#ff4d4d', {roughness: 0.2, clearcoat: 1}),
			bugDark: std('#171012', {roughness: 0.5}),
			sweat: phys('#a6dcff', {roughness: 0, transmission: 0.6, transparent: true, opacity: 0.85}),
			bulb: new THREE.MeshBasicMaterial({color: '#ffd27a', toneMapped: false}),
			steam: new THREE.MeshBasicMaterial({color: '#ffffff', transparent: true, opacity: 0.12, depthWrite: false}),
			bubble: std('#f2efe8', {roughness: 0.4}),
		}
	}, [])
}

function Part({geometry, material, ...props}) {
	return (
		<mesh castShadow receiveShadow material={material} {...props}>
			{geometry}
		</mesh>
	)
}

function Arm({side, phase, mats, typing, children}) {
	const shoulder = useRef()
	const elbow = useRef()
	const mirror = side === 'left' ? -1 : 1

	useFrame((state, dt) => {
		const pose = armPose(side, phase)
		const t = state.clock.elapsedTime
		const tap = typing ? Math.sin(t * (phase === 'fixing' ? 30 : 22) + (side === 'left' ? Math.PI : 0)) * 0.07 : 0
		const pump = phase === 'success' && side === 'left' ? Math.sin(t * 12) * 0.12 : 0
		shoulder.current.rotation.x = damp(shoulder.current.rotation.x, pose.s[0], 7, dt)
		shoulder.current.rotation.y = damp(shoulder.current.rotation.y, pose.s[1] * mirror, 7, dt)
		shoulder.current.rotation.z = damp(shoulder.current.rotation.z, pose.s[2] * mirror + pump * mirror, 7, dt)
		elbow.current.rotation.x = damp(elbow.current.rotation.x, pose.e[0] + tap, 9, dt)
		elbow.current.rotation.y = damp(elbow.current.rotation.y, pose.e[1] * mirror, 7, dt)
		elbow.current.rotation.z = damp(elbow.current.rotation.z, pose.e[2] * mirror, 7, dt)
	})

	return (
		<group ref={shoulder} name={`shoulder-${side}`} position={[0.215 * -mirror, 1.07, 0]}>
			<Part material={mats.shirt} position={[0, -0.11, 0]} geometry={<capsuleGeometry args={[0.066, 0.15, 8, 20]} />} />
			<Part material={mats.shirtShade} position={[0, -0.215, 0]} rotation={[Math.PI / 2, 0, 0]} geometry={<torusGeometry args={[0.058, 0.024, 12, 28]} />} />
			<group ref={elbow} name={`elbow-${side}`} position={[0, -0.24, 0]}>
				<Part material={mats.skin} position={[0, -0.09, 0]} geometry={<capsuleGeometry args={[0.046, 0.13, 8, 20]} />} />
				<group name={`hand-${side}`} position={[0, -0.2, 0]}>
					<Part material={mats.skin} scale={[1, 0.8, 1.15]} geometry={<sphereGeometry args={[0.056, 32, 32]} />} />
					<Part material={mats.skin} position={[0.035 * -mirror, 0.01, 0.03]} rotation={[0.4, 0, 0.5 * mirror]} geometry={<capsuleGeometry args={[0.017, 0.04, 6, 12]} />} />
					{children}
				</group>
			</group>
		</group>
	)
}

function Mug({mats, name, position, rotation, visible = true, steam = true}) {
	const puffs = useRef([])
	useFrame((state) => {
		const t = state.clock.elapsedTime
		puffs.current.forEach((puff, i) => {
			if (!puff) return
			const p = (t * 0.5 + i / 3) % 1
			puff.position.y = 0.08 + p * 0.16
			puff.position.x = Math.sin(t * 2 + i * 2) * 0.012
			puff.scale.setScalar(0.25 + p * 0.5)
			puff.material.opacity = Math.sin(p * Math.PI) * 0.12
		})
	})
	return (
		<group name={name} position={position} rotation={rotation} visible={visible}>
			<Part material={mats.mug} geometry={<cylinderGeometry args={[0.052, 0.046, 0.11, 32]} />} />
			<Part material={mats.coffee} position={[0, 0.052, 0]} geometry={<cylinderGeometry args={[0.046, 0.046, 0.004, 32]} />} />
			<Part material={mats.mug} position={[0.058, 0, 0]} geometry={<torusGeometry args={[0.03, 0.01, 12, 24]} />} />
			{steam &&
				[0, 1, 2].map((i) => (
					<mesh key={i} ref={(node) => (puffs.current[i] = node)} material={mats.steam.clone()}>
						<sphereGeometry args={[0.03, 16, 16]} />
					</mesh>
				))}
		</group>
	)
}

function Head({phase, mats, reduceMotion}) {
	const head = useRef()
	const eyes = useRef()
	const irises = useRef([])
	const browL = useRef()
	const browR = useRef()
	const sweat = useRef()
	const blink = useRef({next: 2.5})

	useFrame((state, dt) => {
		const t = state.clock.elapsedTime
		const [hx, hy, hz] = HEAD_POSES[phase]
		const busy = !reduceMotion && (phase === 'typing' || phase === 'fixing')
		const bob = busy ? Math.sin(t * 3.2) * 0.035 : 0
		const hop = phase === 'success' && !reduceMotion ? Math.abs(Math.sin(t * 7)) * 0.02 : 0
		const pointer = state.pointer
		head.current.rotation.x = damp(head.current.rotation.x, hx - pointer.y * 0.08, 5, dt)
		head.current.rotation.y = damp(head.current.rotation.y, hy + bob + pointer.x * 0.2, 5, dt)
		head.current.rotation.z = damp(head.current.rotation.z, hz + bob * 0.4, 5, dt)
		head.current.position.y = damp(head.current.position.y, 1.205 + hop, 10, dt)

		const [gx, gy] = GAZE[phase]
		irises.current.forEach((iris) => {
			iris.position.x = damp(iris.position.x, gx + pointer.x * 0.008, 8, dt)
			iris.position.y = damp(iris.position.y, gy + pointer.y * 0.006, 8, dt)
		})

		const b = blink.current
		if (t > b.next) b.next = t + 2.2 + hash(t) * 3
		const closing = b.next - t > 2 ? 1 : 1
		const phaseT = t - (b.next - 0.14)
		eyes.current.scale.y = phaseT > 0 && phaseT < 0.14 ? 0.1 : closing

		const worried = phase === 'error'
		const raised = phase === 'success' ? 0.012 : 0
		browL.current.rotation.z = damp(browL.current.rotation.z, Math.PI / 2 + (worried ? -0.35 : 0), 8, dt)
		browR.current.rotation.z = damp(browR.current.rotation.z, Math.PI / 2 + (worried ? 0.35 : phase === 'thinking' ? -0.25 : 0), 8, dt)
		browL.current.position.y = damp(browL.current.position.y, 0.088 + raised + (worried ? 0.01 : 0), 8, dt)
		browR.current.position.y = damp(browR.current.position.y, 0.088 + raised + (worried ? 0.01 : phase === 'thinking' ? 0.02 : 0), 8, dt)

		if (sweat.current) {
			const p = (t * 0.8) % 1
			sweat.current.position.y = 0.1 - p * 0.08
			sweat.current.scale.setScalar(p < 0.85 ? 1 : (1 - p) * 6)
		}
	})

	const happy = phase === 'success' || phase === 'coffee'
	const eyeX = 0.074

	return (
		<group ref={head} position={[0, 1.205, 0.01]}>
			<group position={[0, 0.17, 0]}>
				<Part material={mats.skin} scale={[1, 1.04, 0.97]} geometry={<sphereGeometry args={[0.2, 64, 64]} />} />
				<Part material={mats.skin} position={[0, -0.075, 0.035]} scale={[1.02, 0.82, 0.95]} geometry={<sphereGeometry args={[0.16, 48, 48]} />} />
				{[-1, 1].map((s) => (
					<group key={s}>
						<Part material={mats.skin} position={[0.195 * s, -0.005, -0.01]} scale={[0.55, 1, 0.8]} geometry={<sphereGeometry args={[0.048, 24, 24]} />} />
						<mesh material={mats.blush} position={[0.112 * s, -0.062, 0.155]} scale={[1, 0.6, 0.35]}>
							<sphereGeometry args={[0.036, 20, 20]} />
						</mesh>
					</group>
				))}

				{/* hair */}
				<Part material={mats.hair} position={[0, 0.02, -0.02]} rotation={[-0.55, 0, 0]} scale={[1.04, 1.08, 1.04]} geometry={<sphereGeometry args={[0.2, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.52]} />} />
				<Part material={mats.hair} position={[0, -0.005, -0.065]} scale={[1.02, 1, 0.88]} geometry={<sphereGeometry args={[0.19, 48, 48]} />} />
				<Part material={mats.hair} position={[0.0, 0.165, 0.085]} rotation={[-0.35, 0, -0.22]} scale={[1.55, 0.72, 1.05]} geometry={<sphereGeometry args={[0.1, 48, 48]} />} />
				<Part material={mats.hairLight} position={[0.07, 0.19, 0.05]} rotation={[-0.2, 0, -0.45]} scale={[1.2, 0.6, 1.05]} geometry={<sphereGeometry args={[0.095, 48, 48]} />} />
				<Part material={mats.hair} position={[-0.1, 0.13, 0.08]} rotation={[-0.3, 0, 0.5]} scale={[1, 0.6, 0.9]} geometry={<sphereGeometry args={[0.075, 32, 32]} />} />
				{[-1, 1].map((s) => (
					<Part key={s} material={mats.hair} position={[0.188 * s, 0.03, 0.035]} rotation={[0, 0.35 * s, 0]} geometry={<boxGeometry args={[0.025, 0.08, 0.05]} />} />
				))}

				{/* eyes */}
				<group ref={eyes} visible={!happy}>
					{[-1, 1].map((s, i) => (
						<group key={s} position={[eyeX * s, 0.005, 0.148]}>
							<Part material={mats.eyeWhite} scale={[0.92, 1.08, 0.75]} geometry={<sphereGeometry args={[0.058, 40, 40]} />} />
							<group ref={(node) => node && (irises.current[i] = node)}>
								<mesh material={mats.iris} position={[0, 0, 0.03]} scale={[1, 1, 0.6]}>
									<sphereGeometry args={[0.034, 32, 32]} />
								</mesh>
								<mesh material={mats.pupil} position={[0, 0, 0.044]} scale={[1, 1, 0.55]}>
									<sphereGeometry args={[0.019, 24, 24]} />
								</mesh>
								<mesh material={mats.glint} position={[0.012, 0.014, 0.054]}>
									<sphereGeometry args={[0.008, 12, 12]} />
								</mesh>
								<mesh material={mats.glint} position={[-0.01, -0.012, 0.052]}>
									<sphereGeometry args={[0.004, 10, 10]} />
								</mesh>
							</group>
						</group>
					))}
				</group>
				{happy &&
					[-1, 1].map((s) => (
						<mesh key={s} material={mats.brow} position={[eyeX * s, 0, 0.19]}>
							<torusGeometry args={[0.03, 0.008, 10, 24, Math.PI]} />
						</mesh>
					))}

				<mesh ref={browL} material={mats.brow} position={[-eyeX, 0.088, 0.182]} rotation={[0, -0.2, Math.PI / 2]}>
					<capsuleGeometry args={[0.013, 0.055, 6, 12]} />
				</mesh>
				<mesh ref={browR} material={mats.brow} position={[eyeX, 0.088, 0.182]} rotation={[0, 0.2, Math.PI / 2]}>
					<capsuleGeometry args={[0.013, 0.055, 6, 12]} />
				</mesh>

				<Part material={mats.skinShade} position={[0, -0.045, 0.198]} scale={[1, 0.8, 0.85]} geometry={<sphereGeometry args={[0.03, 24, 24]} />} />

				{/* mouths */}
				<group position={[0, -0.112, 0.176]} rotation={[-0.35, 0, 0]}>
					{(phase === 'typing' || phase === 'fixing') && (
						<mesh material={mats.mouth} rotation={[0, 0, Math.PI]} scale={0.75}>
							<torusGeometry args={[0.035, 0.008, 10, 24, Math.PI]} />
						</mesh>
					)}
					{phase === 'thinking' && (
						<mesh material={mats.mouth} position={[0.015, 0.005, 0]} rotation={[0, 0, Math.PI + 0.45]} scale={0.6}>
							<torusGeometry args={[0.035, 0.009, 10, 24, Math.PI]} />
						</mesh>
					)}
					{phase === 'error' && (
						<mesh material={mats.mouth} position={[0, -0.012, 0]} scale={[0.7, 0.5, 0.7]}>
							<torusGeometry args={[0.035, 0.012, 10, 24, Math.PI]} />
						</mesh>
					)}
					{phase === 'success' && (
						<group position={[0, 0.012, 0.002]}>
							<mesh material={mats.mouth}>
								<circleGeometry args={[0.048, 32, Math.PI, Math.PI]} />
							</mesh>
							<mesh material={mats.teeth} position={[0, -0.006, 0.001]}>
								<planeGeometry args={[0.08, 0.012]} />
							</mesh>
							<mesh material={mats.tongue} position={[0, -0.032, 0.001]} scale={[1, 0.45, 1]}>
								<circleGeometry args={[0.022, 24]} />
							</mesh>
						</group>
					)}
					{phase === 'coffee' && (
						<mesh material={mats.mouth} scale={[1, 1, 0.4]}>
							<sphereGeometry args={[0.016, 16, 16]} />
						</mesh>
					)}
				</group>

				{phase === 'error' && (
					<mesh ref={sweat} material={mats.sweat} position={[0.17, 0.1, 0.11]} scale={1}>
						<sphereGeometry args={[0.018, 16, 16]} />
					</mesh>
				)}
			</group>
		</group>
	)
}

function Character({phase, mats, reduceMotion}) {
	const root = useRef()
	const torso = useRef()
	const typing = !reduceMotion && (phase === 'typing' || phase === 'fixing')

	useFrame((state, dt) => {
		const t = state.clock.elapsedTime
		root.current.rotation.y = damp(root.current.rotation.y, state.pointer.x * 0.12, 3, dt)
		torso.current.scale.y = 1 + Math.sin(t * 1.8) * 0.012
		torso.current.rotation.x = damp(torso.current.rotation.x, phase === 'coffee' || phase === 'success' ? -0.04 : 0.1, 4, dt)
	})

	return (
		<group ref={root} position={[0, 0, -0.4]}>
			{/* chair */}
			<RoundedBox args={[0.5, 0.07, 0.46]} radius={0.03} position={[0, 0.47, -0.02]} material={mats.chair} castShadow receiveShadow />
			<RoundedBox args={[0.54, 0.62, 0.08]} radius={0.04} position={[0, 0.9, -0.24]} rotation={[-0.08, 0, 0]} material={mats.chair} castShadow receiveShadow />
			{/* legs */}
			{[-1, 1].map((s) => (
				<group key={s}>
					<Part material={mats.jeans} position={[0.1 * s, 0.56, 0.12]} rotation={[Math.PI / 2, 0, 0]} geometry={<capsuleGeometry args={[0.08, 0.26, 8, 20]} />} />
					<Part material={mats.jeans} position={[0.1 * s, 0.34, 0.3]} geometry={<capsuleGeometry args={[0.07, 0.3, 8, 20]} />} />
					<Part material={mats.shoe} position={[0.1 * s, 0.09, 0.34]} scale={[1, 0.65, 1.6]} geometry={<sphereGeometry args={[0.075, 32, 32]} />} />
				</group>
			))}

			<group ref={torso}>
				<Part material={mats.shirt} position={[0, 0.87, 0]} scale={[1.2, 1, 0.84]} geometry={<capsuleGeometry args={[0.19, 0.24, 12, 32]} />} />
				{[-1, 1].map((s) => (
					<group key={s}>
						<Part material={mats.shirt} position={[0.175 * s, 1.04, 0]} scale={[1, 0.85, 0.9]} geometry={<sphereGeometry args={[0.085, 32, 32]} />} />
						<RoundedBox args={[0.085, 0.05, 0.018]} radius={0.008} position={[0.045 * s, 1.14, 0.125]} rotation={[-0.45, 0, -0.65 * s]} material={mats.shirt} castShadow />
					</group>
				))}
				<Part material={mats.skinShade} position={[0, 1.125, 0.125]} scale={[0.75, 1, 0.35]} geometry={<sphereGeometry args={[0.04, 24, 24]} />} />
				{[1.02, 0.94, 0.86].map((y) => (
					<Part key={y} material={mats.shirtShade} position={[0, y, 0.16]} geometry={<sphereGeometry args={[0.009, 12, 12]} />} />
				))}
				<RoundedBox args={[0.08, 0.075, 0.01]} radius={0.004} position={[-0.1, 0.98, 0.153]} rotation={[0, -0.25, 0]} material={mats.shirtShade} />
				<Part material={mats.skinShade} position={[0, 1.16, 0.01]} geometry={<cylinderGeometry args={[0.055, 0.06, 0.12, 24]} />} />
			</group>

			<Head phase={phase} mats={mats} reduceMotion={reduceMotion} />

			<Arm side="right" phase={phase} mats={mats} typing={typing} />
			<Arm side="left" phase={phase} mats={mats} typing={typing}>
				<Mug mats={mats} name="held-mug" position={[-0.02, 0.02, 0.08]} rotation={[0, Math.PI, 0]} visible={phase === 'coffee'} steam={phase === 'coffee'} />
			</Arm>
		</group>
	)
}

function Laptop({phase, mats}) {
	const bug = useRef()
	useFrame((state) => {
		if (!bug.current) return
		const t = state.clock.elapsedTime
		bug.current.position.x = Math.sin(t * 1.4) * 0.12
		bug.current.position.y = 0.14 + Math.sin(t * 2.8) * 0.03
		bug.current.rotation.z = Math.cos(t * 1.4) * 0.6
	})

	return (
		<group name="laptop" position={[0, 0.77, -0.05]}>
			<RoundedBox args={[0.46, 0.018, 0.31]} radius={0.008} material={mats.alu} castShadow receiveShadow />
			<mesh material={mats.keys} position={[0, 0.0095, -0.02]} rotation={[-Math.PI / 2, 0, 0]}>
				<planeGeometry args={[0.4, 0.17]} />
			</mesh>
			<group position={[0, 0.005, 0.15]} rotation={[0.3, 0, 0]}>
				<RoundedBox args={[0.46, 0.31, 0.014]} radius={0.008} position={[0, 0.155, 0]} material={mats.alu} castShadow receiveShadow />
				<mesh material={mats.glow} position={[0, 0.157, -0.0075]} rotation={[0, Math.PI, 0]}>
					<planeGeometry args={[0.42, 0.27]} />
				</mesh>
				<mesh material={mats.glow} position={[0, 0.16, 0.0075]}>
					<circleGeometry args={[0.018, 32]} />
				</mesh>
				{phase === 'error' && (
					<group ref={bug} position={[0, 0.14, 0.012]}>
						<mesh material={mats.bug} scale={[1, 1.25, 0.6]}>
							<sphereGeometry args={[0.018, 20, 20]} />
						</mesh>
						<mesh material={mats.bugDark} position={[0, 0.025, 0]}>
							<sphereGeometry args={[0.01, 16, 16]} />
						</mesh>
						{[-1, 1].map((s) =>
							[-0.01, 0.004, 0.018].map((y) => (
								<mesh key={`${s}${y}`} material={mats.bugDark} position={[0.022 * s, y - 0.004, 0]} rotation={[0, 0, (Math.PI / 2) * s + y * 20]}>
									<capsuleGeometry args={[0.002, 0.014, 4, 6]} />
								</mesh>
							))
						)}
					</group>
				)}
			</group>
		</group>
	)
}

function Desk({mats}) {
	return (
		<group>
			<RoundedBox args={[1.9, 0.05, 0.8]} radius={0.015} position={[0, 0.735, 0.18]} material={mats.wood} castShadow receiveShadow />
			{[
				[-0.88, -0.18],
				[0.88, -0.18],
				[-0.88, 0.54],
				[0.88, 0.54],
			].map(([x, z]) => (
				<Part key={`${x}${z}`} material={mats.metal} position={[x, 0.36, z]} geometry={<cylinderGeometry args={[0.018, 0.018, 0.72, 16]} />} />
			))}
		</group>
	)
}

function Plant({mats}) {
	const leaves = useRef()
	useFrame((state) => {
		leaves.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.2) * 0.04
	})
	return (
		<group position={[-0.68, 0.76, 0.12]}>
			<Part material={mats.pot} position={[0, 0.07, 0]} geometry={<cylinderGeometry args={[0.07, 0.055, 0.14, 32]} />} />
			<group ref={leaves} position={[0, 0.13, 0]}>
				{Array.from({length: 7}, (_, i) => {
					const a = (i / 7) * Math.PI * 2
					return <Part key={i} material={i % 2 ? mats.leaf : mats.leafDark} position={[Math.cos(a) * 0.035, 0.1, Math.sin(a) * 0.035]} rotation={[Math.sin(a) * 0.45, 0, -Math.cos(a) * 0.45]} scale={[0.35, 1, 0.12]} geometry={<sphereGeometry args={[0.1, 20, 20]} />} />
				})}
			</group>
		</group>
	)
}

function Duck({mats, phase}) {
	const duck = useRef()
	useFrame((state) => {
		const t = state.clock.elapsedTime
		duck.current.position.y = 0.76 + (phase === 'error' ? Math.abs(Math.sin(t * 8)) * 0.04 : 0)
	})
	return (
		<group ref={duck} position={[0.42, 0.76, 0.28]} rotation={[0, -0.6, 0]}>
			<Part material={mats.duck} position={[0, 0.04, 0]} scale={[1.2, 0.85, 1]} geometry={<sphereGeometry args={[0.05, 32, 32]} />} />
			<Part material={mats.duck} position={[0, 0.1, 0.02]} geometry={<sphereGeometry args={[0.033, 32, 32]} />} />
			<Part material={mats.beak} position={[0, 0.095, 0.055]} rotation={[Math.PI / 2, 0, 0]} scale={[1.3, 1, 0.5]} geometry={<coneGeometry args={[0.014, 0.03, 16]} />} />
			{[-1, 1].map((s) => (
				<mesh key={s} material={mats.pupil} position={[0.017 * s, 0.108, 0.045]}>
					<sphereGeometry args={[0.005, 10, 10]} />
				</mesh>
			))}
		</group>
	)
}

function Effects({phase, mats, reduceMotion}) {
	const bulb = useRef()
	const confetti = useRef([])
	const started = useRef(0)
	const pieces = useMemo(
		() =>
			Array.from({length: 36}, (_, i) => ({
				vx: (hash(i + 1) - 0.5) * 1.3,
				vy: 0.9 + hash(i + 7) * 0.9,
				vz: (hash(i + 13) - 0.5) * 0.6,
				spin: 4 + hash(i + 3) * 8,
				color: ['#ff6a3d', '#ffc56e', '#7dd3a8', '#f2efe8'][i % 4],
			})),
		[]
	)
	const confettiMats = useMemo(() => pieces.map(({color}) => new THREE.MeshBasicMaterial({color, side: THREE.DoubleSide})), [pieces])

	useEffect(() => {
		started.current = -1
	}, [phase])

	useFrame((state) => {
		const t = state.clock.elapsedTime
		if (started.current < 0) started.current = t
		if (bulb.current) {
			const age = Math.min(1, (t - started.current) * 3)
			bulb.current.scale.setScalar(THREE.MathUtils.smoothstep(age, 0, 1) * (1 + Math.sin(t * 5) * 0.04))
			bulb.current.position.y = 1.78 + Math.sin(t * 2) * 0.015
		}
		confetti.current.forEach((piece, i) => {
			if (!piece) return
			const p = pieces[i]
			const age = reduceMotion ? 0.5 : ((t - started.current) * 1 + (i % 3) * 0.12) % 1.4
			piece.position.set(p.vx * age, 1.6 + p.vy * age - 1.6 * age * age, -0.3 + p.vz * age)
			piece.rotation.set(age * p.spin, age * p.spin * 0.7, 0)
		})
	})

	return (
		<group>
			{phase === 'thinking' && (
				<group>
					<mesh material={mats.bubble} position={[-0.22, 1.66, -0.28]}>
						<sphereGeometry args={[0.014, 16, 16]} />
					</mesh>
					<mesh material={mats.bubble} position={[-0.28, 1.73, -0.28]}>
						<sphereGeometry args={[0.022, 16, 16]} />
					</mesh>
					<Html position={[-0.42, 1.84, -0.28]} center zIndexRange={[4, 0]}>
						<div className="thought-bubble">if (!user) ?</div>
					</Html>
				</group>
			)}
			{phase === 'fixing' && (
				<group ref={bulb} position={[0.3, 1.78, -0.36]}>
					<mesh material={mats.bulb}>
						<sphereGeometry args={[0.05, 32, 32]} />
					</mesh>
					<mesh material={mats.alu} position={[0, -0.058, 0]}>
						<cylinderGeometry args={[0.022, 0.02, 0.03, 16]} />
					</mesh>
					<pointLight color="#ffc56e" intensity={1.2} distance={1} />
				</group>
			)}
			{phase === 'success' &&
				pieces.map((piece, i) => (
					<mesh key={i} ref={(node) => (confetti.current[i] = node)} material={confettiMats[i]}>
						<planeGeometry args={[0.022, 0.034]} />
					</mesh>
				))}
		</group>
	)
}

function Scene({phase, reduceMotion}) {
	const mats = useMaterials()
	const screenLight = useRef()
	const {camera, scene, size} = useThree()
	const compact = size.width < 460
	const target = useMemo(() => new THREE.Color(), [])

	useEffect(() => {
		camera.position.set(compact ? 0.4 : 0.85, 1.62, compact ? 3.1 : 2.95)
		camera.lookAt(compact ? 0.02 : 0.44, compact ? 1.16 : 1.1, -0.12)
		if (import.meta.env.DEV) window.__dev3d.scene = scene
	}, [camera, scene, compact])

	useFrame((_, dt) => {
		target.set(PHASE_COLORS[phase])
		mats.glow.color.lerp(target, Math.min(1, dt * 4))
		screenLight.current.color.copy(mats.glow.color)
	})

	return (
		<>
			<ambientLight intensity={0.35} />
			<hemisphereLight args={['#ffeede', '#221812', 0.7]} />
			<directionalLight position={[2.2, 4, 3]} intensity={2.4} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004} shadow-camera-left={-1.5} shadow-camera-right={1.5} shadow-camera-top={2} shadow-camera-bottom={-0.5} />
			<directionalLight position={[-2.5, 2.4, -2.5]} intensity={1.5} color="#ff8a5c" />
			<directionalLight position={[-3, 1.2, 2]} intensity={0.5} color="#b9c8ff" />
			<pointLight ref={screenLight} position={[0, 1.3, -0.02]} intensity={0.5} distance={0.6} decay={2} />
			<Environment resolution={256}>
				<Lightformer intensity={2} position={[0, 3, 3]} scale={[5, 2, 1]} />
				<Lightformer intensity={1.2} position={[-3, 1, 1]} rotation-y={Math.PI / 2} scale={[4, 2, 1]} />
				<Lightformer intensity={2} color="#ff6a3d" position={[3, 1, -2]} rotation-y={-Math.PI / 2} scale={[3, 2, 1]} />
			</Environment>

			<Desk mats={mats} />
			<Laptop phase={phase} mats={mats} />
			<Character phase={phase} mats={mats} reduceMotion={reduceMotion} />
			<Mug mats={mats} position={[0.64, 0.815, 0.16]} rotation={[0, -0.6, 0]} visible={phase !== 'coffee'} />
			<Plant mats={mats} />
			<Duck mats={mats} phase={phase} />
			<Effects phase={phase} mats={mats} reduceMotion={reduceMotion} />
		</>
	)
}

export default function Dev3D({phase, active, reduceMotion}) {
	return (
		<Canvas className="dev-canvas" shadows dpr={[1, 2]} frameloop={active ? 'always' : 'never'} camera={{position: [0.85, 1.62, 2.95], fov: 30}} gl={{antialias: true, alpha: true}}>
			<Scene phase={phase} reduceMotion={reduceMotion} />
		</Canvas>
	)
}
