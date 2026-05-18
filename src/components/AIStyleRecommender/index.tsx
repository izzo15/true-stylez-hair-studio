'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

type FaceShape = 'oval' | 'round' | 'square' | 'heart' | 'unknown'

const RECOMMENDATIONS: Record<FaceShape, { category: string; desc: string; service: string }> = {
  oval:   { category: 'Skin Fade',   desc: 'Your balanced face shape suits a Skin Fade — sharp, clean, and timeless.', service: 'Skin Fade' },
  round:  { category: 'Haircut',     desc: 'A textured top adds angles — perfect for rounding out your look.',      service: 'Haircut' },
  square: { category: 'High Top Fade', desc: 'A High Top Fade softens strong jawlines while keeping you fresh.',       service: 'Skin Fade' },
  heart:  { category: 'Line Up',     desc: 'Clean lines at the temples balance a lighter chin — keep it sharp.',    service: 'Line Up' },
  unknown: { category: 'Haircut',   desc: 'Look fresh with our signature Haircut — always a great choice.',         service: 'Haircut' },
}

/**
 * Estimate face shape from bounding-box proportions.
 *    oval   — height > width by ~1.2 – 1.5
 *    round  — height ≈ width   (ratio < 1.10)
 *    square — height > width but maxBoxWidth close to boxWidth
 *    heart  — wide eyes/upper face hint via cheek-keypoints spread
 */
function classifyFromBox(
  box: { topLeft: [number, number]; bottomRight: [number, number] },
  landmarks: { getCheeks: () => Array<[number, number]> },
): FaceShape {
  const [tlX, tlY] = box.topLeft
  const [brX, brY] = box.bottomRight
  const boxWidth  = brX - tlX
  const boxHeight = brY - tlY

  if (boxWidth < 20 || boxHeight < 20) return 'unknown'

  const ratio  = boxHeight / boxWidth
  const cheeks = landmarks.getCheeks?.() ?? []
  const cheekSpread = cheeks.length >= 2
    ? Math.abs(cheeks[1][0] - cheeks[0][0]) / boxWidth
    : 0.9

  if (cheekSpread < 0.72) return 'heart'
  if (ratio < 1.08)        return 'round'
  if (ratio > 1.20)        return 'oval'
  return 'square'
}

let loadPromise: Promise<void> | null = null

function ensureModelsLoaded(): Promise<void> {
  if (!loadPromise) {
    loadPromise = (async () => {
      const tf = (await import('@tensorflow/tfjs')).default as any
      await (tf as any).ready()
    })()
  }
  return loadPromise
}

export function AIStyleRecommender() {
  const [step, setStep] = useState(1)              // 1 = upload, 1.5 = analyzing, 2 = result
  const [faceShape, setFaceShape] = useState<FaceShape>('unknown')
  const [recommendedService, setRecommendedService] = useState<{ id: string; name: string; price: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

      // Preload TF.js on mount so there is no lag on first upload
    useEffect(() => {
      ensureModelsLoaded().catch(() => { /* silent */ })
    }, [])

    // Track when the style recommender is used (step 2)
    useEffect(() => {
      if (step === 2) {
        window.plausible?.('track', 'Style Recommender Used', {
          props: {
            faceShape: faceShape,
            recommendedService: recommendedService?.name,
          }
        });
      }
    }, [step, faceShape, recommendedService]);

  const detectFaceShape = async (imageSrc: string): Promise<FaceShape> => {
    await ensureModelsLoaded()

    let blazeface: any
    let tf: any

    try {
      const tfMod    = await import('@tensorflow/tfjs')
      const bfMod    = await import('@tensorflow-models/blazeface')
      tf             = (tfMod as any).default  ?? tfMod
      blazeface      = (bfMod as any).default   ?? bfMod
    } catch {
      return 'unknown'
    }

    const img = new Image()
    img.src  = imageSrc
    img.crossOrigin = 'anonymous'
    await new Promise<void>((resolve, reject) => {
      img.onload  = () => resolve()
      img.onerror = () => reject(new Error('image load failed'))
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const model: any = await blazeface.load()
    const predictions: any[] = await model.estimateFaces(img, false)

    if (!predictions?.length) return 'unknown'

    // take the largest (most prominent) face
    const pred = predictions.reduce((biggest: any, cur: any) =>
      (cur.topRight[0] - cur.topLeft[0]) > (biggest.topRight[0] - biggest.topLeft[0]) ? cur : biggest,
    )

    return classifyFromBox(pred, pred)
  }

  const runAnalysis = async (imageSrc: string) => {
    setStep(1.5)
    try {
      const shape = await detectFaceShape(imageSrc)
      setFaceShape(shape)
      const rec = RECOMMENDATIONS[shape] ?? RECOMMENDATIONS.unknown

      let service: { id: string; name: string; price: number } | null = null
      try {
        const res  = await fetch('/api/services')
        const all: any[] = await res.json()
        const match = all.find((s: any) => s.name === rec.service) ?? all[0]
        service = { id: match.id, name: match.name, price: match.price ?? 40 }
      } catch {
        service = { id: '1', name: rec.service, price: 30 }
      }

      setRecommendedService(service)
    } catch {
      setFaceShape('unknown')
      setRecommendedService({ id: '1', name: 'Haircut', price: 30 })
    } finally {
      setStep(2)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    runAnalysis(url).finally(() => URL.revokeObjectURL(url))
  }

  const handleSkip = () => {
    setFaceShape('unknown')
    setRecommendedService({ id: '1', name: 'Haircut', price: 30 })
    setStep(2)
  }

  const reset = () => {
    setStep(1)
    setFaceShape('unknown')
    setRecommendedService(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ---- RENDER ----

  if (step === 1.5) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">Analyzing your face shape…</h3>
        <div className="flex justify-center py-8">
          <div className="barber-pole w-1 h-16 rounded-full" />
        </div>
      </div>
    )
  }

  if (step === 2) {
    const rec = RECOMMENDATIONS[faceShape] ?? RECOMMENDATIONS.unknown
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-8 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-accent to-primary-800 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-3xl">✂️</span>
        </div>
        <h4 className="font-bold text-xl mb-2">
          {faceShape !== 'unknown'
            ? `${faceShape.charAt(0).toUpperCase() + faceShape.slice(1)} Face Shape`
            : 'Popular Pick'}
        </h4>
        <p className="text-gray-400 mb-6">{rec.desc}</p>
        {recommendedService && (
          <div className="glass rounded-xl p-5 inline-block mb-6 text-left w-full max-w-xs">
            <p className="text-xs text-accent font-medium mb-1">Recommended Style</p>
            <p className="font-bold text-lg">{recommendedService.name}</p>
            <p className="text-accent font-semibold">${recommendedService.price}</p>
            <button
              onClick={() => {
                document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })
                // Prefill the booking widget via custom event
                window.dispatchEvent(new CustomEvent('prefill-service', { 
                  detail: recommendedService?.id 
                }))
              }}
              className="mt-3 w-full px-6 py-2 bg-accent text-white rounded-full font-medium hover:bg-accent/80 transition-colors"
            >
              Book with this Style
            </button>
          </div>
        )}
        <button onClick={reset} className="block mx-auto text-sm text-gray-400 mt-4 underline">
          Try Again
        </button>
      </motion.div>
    )
  }

  return (
    <div className="glass rounded-2xl p-8 text-center">
      <h3 className="text-2xl font-bold mb-4">Find Your Perfect Style</h3>
      <p className="text-gray-400 mb-6">
        Upload a photo and our AI will recommend the perfect cut for your face shape.
      </p>
      <input
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        id="photo-upload"
        ref={fileInputRef}
        onChange={handleFileUpload}
      />
      <label
        htmlFor="photo-upload"
        className="inline-block px-6 py-3 bg-accent text-white rounded-full cursor-pointer hover:bg-accent/80 transition-colors"
      >
        Upload Photo
      </label>
      <button
        onClick={handleSkip}
        className="ml-3 px-6 py-3 border border-gray-600 rounded-full text-gray-400 hover:text-white hover:border-gray-400 transition-colors"
      >
        Skip – Show Popular Styles
      </button>
    </div>
  )
}
