import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const CUBE_COUNT = 14

const CUBE_STYLES = [
  'from-cyan-300/50 to-cyan-400/30 border-cyan-300/40',
  'from-teal-300/50 to-teal-400/30 border-teal-300/40',
  'from-emerald-300/50 to-emerald-400/30 border-emerald-300/40',
  'from-sky-300/50 to-sky-400/30 border-sky-300/40',
]

type CubeState = {
  x: number
  y: number
  vx: number
  vy: number
  rotX: number
  rotY: number
  rotZ: number
  spinX: number
  spinY: number
  spinZ: number
  size: number
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

export function BouncingCubes() {
  const fieldRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const field = fieldRef.current
      if (!field) return

      const cubes = gsap.utils.toArray<HTMLElement>('.bounce-cube', field)
      const states: CubeState[] = cubes.map((cube) => {
        const size = Number(cube.dataset.size)
        const maxX = Math.max(field.offsetWidth - size, 0)
        const maxY = Math.max(field.offsetHeight - size, 0)

        return {
          x: randomBetween(0, maxX),
          y: randomBetween(0, maxY),
          vx: randomBetween(0.8, 2.2) * (Math.random() > 0.5 ? 1 : -1),
          vy: randomBetween(0.8, 2.2) * (Math.random() > 0.5 ? 1 : -1),
          rotX: randomBetween(0, 360),
          rotY: randomBetween(0, 360),
          rotZ: randomBetween(0, 360),
          spinX: randomBetween(-1.2, 1.2),
          spinY: randomBetween(-1.2, 1.2),
          spinZ: randomBetween(-0.8, 0.8),
          size,
        }
      })

      const tick = () => {
        const w = field.offsetWidth
        const h = field.offsetHeight

        cubes.forEach((cube, i) => {
          const s = states[i]

          s.x += s.vx
          s.y += s.vy
          s.rotX += s.spinX
          s.rotY += s.spinY
          s.rotZ += s.spinZ

          if (s.x <= 0) {
            s.x = 0
            s.vx *= -1
          }
          if (s.y <= 0) {
            s.y = 0
            s.vy *= -1
          }
          if (s.x >= w - s.size) {
            s.x = w - s.size
            s.vx *= -1
          }
          if (s.y >= h - s.size) {
            s.y = h - s.size
            s.vy *= -1
          }

          gsap.set(cube, {
            x: s.x,
            y: s.y,
            rotateX: s.rotX,
            rotateY: s.rotY,
            rotateZ: s.rotZ,
          })
        })
      }

      gsap.ticker.add(tick)

      return () => gsap.ticker.remove(tick)
    },
    { scope: fieldRef },
  )

  return (
    <div
      ref={fieldRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ perspective: '800px' }}
    >
      {Array.from({ length: CUBE_COUNT }).map((_, i) => {
        const size = 20 + (i % 5) * 8
        const style = CUBE_STYLES[i % CUBE_STYLES.length]

        return (
          <div
            key={i}
            data-size={size}
            className={`bounce-cube absolute bg-linear-to-br ${style} border shadow-sm shadow-teal-300/20`}
            style={{
              width: size,
              height: size,
              transformStyle: 'preserve-3d',
              borderRadius: size > 36 ? 6 : 4,
            }}
          />
        )
      })}
    </div>
  )
}
