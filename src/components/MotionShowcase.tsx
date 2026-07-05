import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { BouncingCubes } from './BouncingCubes'

const TITLE = 'MOTION'
const SUBTITLE = 'GSAP · React · Tailwind'

const CARDS = [
  {
    label: 'Timeline',
    value: '∞',
    gradient: 'from-cyan-300 to-teal-400',
    glow: 'shadow-[0_0_60px_rgba(103,232,249,0.45)]',
  },
  {
    label: 'Stagger',
    value: '0.08s',
    gradient: 'from-teal-300 to-emerald-400',
    glow: 'shadow-[0_0_60px_rgba(94,234,212,0.45)]',
  },
  {
    label: 'Ease',
    value: 'power4',
    gradient: 'from-sky-300 to-cyan-400',
    glow: 'shadow-[0_0_60px_rgba(110,231,183,0.4)]',
  },
]

const ORBS = [
  { className: 'orb-1 size-[240px] -left-16 -top-16 bg-cyan-200/50 sm:size-[420px] sm:-left-32 sm:-top-24' },
  { className: 'orb-2 size-[200px] -right-10 top-1/4 bg-teal-200/45 sm:size-[360px] sm:-right-20' },
  { className: 'orb-3 size-[180px] left-1/4 -bottom-10 bg-emerald-200/40 sm:size-[280px] sm:left-1/3 sm:-bottom-20' },
  { className: 'orb-4 size-[140px] right-1/4 bottom-1/4 bg-sky-200/35 sm:size-[200px]' },
]

const PILLS = ['useGSAP', 'timeline', 'stagger', 'yoyo', 'repeat']

export function MotionShowcase() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.set('.char', { y: 120, rotateX: -90, opacity: 0, transformOrigin: '50% 100%' })
      gsap.set('.subtitle', { y: 30, opacity: 0 })
      gsap.set('.card', { y: 80, opacity: 0, scale: 0.85, rotateY: -25 })
      gsap.set('.pill', { scale: 0, opacity: 0 })
      gsap.set('.badge', { scale: 0, opacity: 0 })
      gsap.set('.grid-line', { scaleX: 0, opacity: 0 })

      const ambient = gsap.timeline({ repeat: -1, yoyo: true })
      ambient
        .to('.orb-1', { x: 60, y: 40, duration: 6, ease: 'sine.inOut' }, 0)
        .to('.orb-2', { x: -50, y: 30, duration: 7, ease: 'sine.inOut' }, 0)
        .to('.orb-3', { x: 40, y: -35, duration: 5.5, ease: 'sine.inOut' }, 0)
        .to('.orb-4', { x: -30, y: -20, duration: 4.5, ease: 'sine.inOut' }, 0)

      const master = gsap.timeline({ repeat: -1, repeatDelay: 0.8, defaults: { ease: 'power4.out' } })

      master
        .to('.grid-line', { scaleX: 1, opacity: 0.15, duration: 1.2, stagger: 0.06 }, 0)
        .to(
          '.char',
          {
            y: 0,
            rotateX: 0,
            opacity: 1,
            duration: 1,
            stagger: { each: 0.07, from: 'center' },
          },
          0.2,
        )
        .to('.subtitle', { y: 0, opacity: 1, duration: 0.8 }, 0.9)
        .to('.badge', { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)' }, 1.1)
        .to(
          '.card',
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotateY: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'back.out(1.4)',
          },
          1.2,
        )
        .to(
          '.pill',
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: 'back.out(3)',
          },
          1.8,
        )
        .to('.char', { color: '#0891b2', duration: 0.4, stagger: 0.04 }, 2.8)
        .to('.char', { color: '#0d9488', duration: 0.4, stagger: 0.04 }, 3.3)
        .to('.char', { color: '#059669', duration: 0.4, stagger: 0.04 }, 3.8)
        .to('.char', { color: '#134e4a', duration: 0.5 }, 4.3)
        .to(
          '.card',
          {
            y: -12,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.inOut',
            yoyo: true,
            repeat: 1,
          },
          4.5,
        )
        .to('.subtitle', { letterSpacing: '0.35em', duration: 0.8, ease: 'power2.inOut' }, 5.2)
        .to('.subtitle', { letterSpacing: '0.2em', duration: 0.6 }, 6.2)
        .to(
          ['.char', '.subtitle', '.card', '.pill', '.badge'],
          {
            opacity: 0,
            y: -40,
            duration: 0.7,
            stagger: 0.03,
            ease: 'power3.in',
          },
          7,
        )
        .set(
          ['.char', '.subtitle', '.card', '.pill', '.badge'],
          { clearProps: 'color,letterSpacing' },
          7.8,
        )

      return () => {
        ambient.kill()
        master.kill()
      }
    },
    { scope: root },
  )

  return (
    <div
      ref={root}
      className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-linear-to-br from-cyan-50 via-teal-50 to-emerald-100 py-8 sm:py-0"
    >
      <BouncingCubes />

      <div className="pointer-events-none absolute inset-0 z-[1]">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="grid-line absolute h-px w-full origin-left bg-linear-to-r from-transparent via-teal-300/20 to-transparent"
            style={{ top: `${8 + i * 8}%` }}
          />
        ))}
      </div>

      {ORBS.map((orb) => (
        <div
          key={orb.className}
          className={`${orb.className} absolute z-[1] rounded-full blur-3xl`}
        />
      ))}

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center px-4 sm:px-8">
        <div className="badge mb-4 flex items-center gap-2 rounded-full border border-teal-300/40 bg-white/60 px-3 py-1 text-[10px] font-medium tracking-widest text-teal-700/70 uppercase shadow-sm backdrop-blur-md sm:mb-6 sm:px-4 sm:py-1.5 sm:text-xs">
          <span className="size-2 animate-pulse rounded-full bg-teal-500" />
          Live demo
        </div>

        <h1
          className="mb-3 flex w-full max-w-full justify-center gap-0.5 font-[family-name:var(--font-display)] text-[clamp(2rem,10vw,9rem)] leading-[0.9] font-extrabold tracking-tighter text-teal-900 sm:mb-4 sm:gap-1"
          style={{ perspective: '600px' }}
        >
          {TITLE.split('').map((char, i) => (
            <span key={i} className="char inline-block">
              {char}
            </span>
          ))}
        </h1>

        <p className="subtitle mb-8 max-w-full text-center text-[10px] tracking-[0.12em] text-teal-700/55 uppercase sm:mb-14 sm:text-sm sm:tracking-[0.2em] md:text-base">
          {SUBTITLE}
        </p>

        <div className="mb-8 grid w-full max-w-sm grid-cols-1 gap-3 sm:mb-12 sm:max-w-none sm:grid-cols-3 sm:gap-5">
          {CARDS.map((card) => (
            <div
              key={card.label}
              className={`card group relative overflow-hidden rounded-xl border border-white/70 bg-white/55 p-4 shadow-lg shadow-teal-200/30 backdrop-blur-xl sm:rounded-2xl sm:p-6 ${card.glow}`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${card.gradient} opacity-20 transition-opacity group-hover:opacity-30`}
              />
              <p className="relative text-xs tracking-widest text-teal-600/50 uppercase">
                {card.label}
              </p>
              <p
                className={`relative mt-1 bg-linear-to-r sm:mt-2 ${card.gradient} bg-clip-text font-[family-name:var(--font-display)] text-3xl font-bold text-transparent sm:text-4xl`}
              >
                {card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex max-w-xs flex-wrap items-center justify-center gap-2 sm:max-w-none sm:gap-3">
          {PILLS.map((pill) => (
            <span
              key={pill}
              className="pill rounded-full border border-teal-200/80 bg-white/60 px-3 py-1.5 text-[10px] text-teal-700/75 shadow-sm backdrop-blur-sm sm:px-4 sm:py-2 sm:text-xs"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 w-full max-w-[90vw] -translate-x-1/2 text-center text-[8px] tracking-[0.15em] text-teal-600/35 uppercase sm:bottom-6 sm:max-w-none sm:text-[10px] sm:tracking-[0.3em]">
        @gsap/react · tailwind v4
      </div>
    </div>
  )
}
