'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ShoppingBagIcon, CheckIcon, ArrowLeftIcon } from '@/lib/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import Link from 'next/link'

// ─── Data ──────────────────────────────────────────────────────────

const MATERIALS = [
  { value: 'italian-leather', label: 'Italian Leather', extra: 500 },
  { value: 'saffiano-leather', label: 'Saffiano Leather', extra: 400 },
  { value: 'calfskin', label: 'Calfskin', extra: 200 },
  { value: 'silicone', label: 'Silicone', extra: 0 },
  { value: 'fkm-rubber', label: 'FKM Rubber', extra: 0 },
  { value: 'nylon', label: 'Nylon', extra: 0 },
]

const LEATHER_MATERIALS = new Set(['italian-leather', 'saffiano-leather', 'calfskin'])

const STRAP_COLORS = [
  { value: '#0A0A0A', label: 'Black' },
  { value: '#5C3A21', label: 'Brown' },
  { value: '#D2B48C', label: 'Tan' },
  { value: '#1B2A4A', label: 'Navy' },
  { value: '#722F37', label: 'Burgundy' },
  { value: '#556B2F', label: 'Olive' },
  { value: '#808080', label: 'Grey' },
  { value: '#FFFFFF', label: 'White' },
  { value: '#FFFDD0', label: 'Cream' },
  { value: '#DC2626', label: 'Red' },
  { value: '#2563EB', label: 'Blue' },
  { value: '#16A34A', label: 'Green' },
]

const STITCHING_COLORS = [
  { value: '#FFFFFF', label: 'White' },
  { value: '#0A0A0A', label: 'Black' },
  { value: '#5C3A21', label: 'Brown' },
  { value: '#D2B48C', label: 'Tan' },
  { value: '#808080', label: 'Grey' },
  { value: '#1B2A4A', label: 'Navy' },
  { value: '#DC2626', label: 'Red' },
  { value: '#CCFF00', label: 'Lime' },
  { value: '#EAB308', label: 'Yellow' },
]

const WIDTHS = ['18mm', '20mm', '22mm', '24mm']
const LENGTHS = ['Standard (115/75mm)', 'Long (125/80mm)', 'Extra Long (135/85mm)']
const BUCKLE_STYLES = [
  { value: 'pin', label: 'Pin Buckle', extra: 0 },
  { value: 'deployant', label: 'Deployant Clasp', extra: 499 },
  { value: 'butterfly', label: 'Butterfly Clasp', extra: 799 },
]

const BUCKLE_FINISHES = [
  { value: '#C0C0C0', label: 'Silver' },
  { value: '#FFD700', label: 'Gold' },
  { value: '#B76E79', label: 'Rose Gold' },
  { value: '#1a1a1a', label: 'Black' },
  { value: '#545454', label: 'Gunmetal' },
]

const TEXTURES = ['Smooth', 'Grain', 'Pebble', 'Crocodile', 'Alligator']

type ProductOption = { id: string; name: string; slug: string; basePrice: number; strapType: string | null }

// ─── Component ─────────────────────────────────────────────────────

export default function CustomizerPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [products, setProducts] = useState<ProductOption[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedProduct, setSelectedProduct] = useState<string>('')
  const [material, setMaterialRaw] = useState('italian-leather')
  const setMaterial = (val: string) => {
    setMaterialRaw(val)
    if (!LEATHER_MATERIALS.has(val)) {
      setTexture('Smooth')
    }
  }
  const [strapColor, setStrapColor] = useState('#0A0A0A')
  const [stitchColor, setStitchColor] = useState('#FFFFFF')
  const [width, setWidth] = useState('20mm')
  const [length, setLength] = useState('Standard (115/75mm)')
  const [buckleStyle, setBuckleStyle] = useState('pin')
  const [buckleFinish, setBuckleFinish] = useState('#C0C0C0')
  const [engraving, setEngraving] = useState('')
  const [texture, setTexture] = useState('Smooth')

  // Fetch products
  useEffect(() => {
    fetch('/api/products?status=ACTIVE')
      .then((r) => r.json())
      .then((data: ProductOption[]) => {
        setProducts(data)
        if (data.length > 0) setSelectedProduct(data[0].id)
      })
      .catch(() => toast.error('failed to load products'))
      .finally(() => setLoading(false))
  }, [])

  // Price calculation
  const baseProduct = products.find((p) => p.id === selectedProduct)
  const basePrice = baseProduct?.basePrice ?? 1499

  const materialExtra = MATERIALS.find((m) => m.value === material)?.extra ?? 0
  const buckleExtra = BUCKLE_STYLES.find((b) => b.value === buckleStyle)?.extra ?? 0
  const engravingExtra = engraving.trim().length > 0 ? 299 : 0
  const totalPrice = basePrice + materialExtra + buckleExtra + engravingExtra

  const isLeather = LEATHER_MATERIALS.has(material)

  // ─── Canvas Drawing ───────────────────────────────────────────

  const drawStrap = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height
    ctx.clearRect(0, 0, W, H)

    // Width mapping
    const widthPx = (parseInt(width) / 24) * 120 + 60 // 18mm→135, 24mm→180
    const cx = W / 2

    // Length ratio based on length option
    const lengthRatio = length.includes('Extra') ? 1.15 : length.includes('Long') ? 1.08 : 1
    const topStrapH = 210 * lengthRatio
    const bottomStrapH = 150 * lengthRatio
    const buckleH = 36

    // Positions
    const topY = 30
    const buckleY = topY + topStrapH
    const bottomY = buckleY + buckleH

    // ─── Draw strap pieces ────────────────────────────────────

    function drawStrapPiece(
      x: number,
      y: number,
      w: number,
      h: number,
      hasHoles: boolean
    ) {
      if (!ctx) return
      const r = 8 // corner radius

      // Shadow
      ctx.save()
      ctx.shadowColor = 'rgba(0,0,0,0.15)'
      ctx.shadowBlur = 12
      ctx.shadowOffsetY = 4

      // Main shape with rounded ends
      ctx.beginPath()
      ctx.roundRect(x, y, w, h, [r, r, r, r])
      ctx.fillStyle = strapColor
      ctx.fill()
      ctx.restore()

      // Texture overlay
      if (isLeather && texture !== 'Smooth') {
        ctx.save()
        ctx.globalAlpha = 0.08
        ctx.beginPath()
        ctx.roundRect(x, y, w, h, [r, r, r, r])
        ctx.clip()

        if (texture === 'Grain') {
          for (let i = 0; i < h; i += 3) {
            ctx.beginPath()
            ctx.moveTo(x, y + i)
            ctx.lineTo(x + w, y + i + 1)
            ctx.strokeStyle = '#000000'
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        } else if (texture === 'Pebble') {
          for (let py = y; py < y + h; py += 6) {
            for (let px = x; px < x + w; px += 6) {
              ctx.beginPath()
              ctx.arc(px + 3, py + 3, 1.5, 0, Math.PI * 2)
              ctx.fillStyle = '#000000'
              ctx.fill()
            }
          }
        } else if (texture === 'Crocodile' || texture === 'Alligator') {
          const scale = texture === 'Alligator' ? 14 : 10
          const isAllig = texture === 'Alligator'
          for (let py = y; py < y + h; py += scale) {
            for (let px = x; px < x + w; px += scale) {
              const row = Math.floor((py - y) / scale)
              const offset = row % 2 === 0 ? 0 : scale / 2
              const bx = px + offset
              const by = py
              ctx.beginPath()
              if (isAllig) {
                ctx.roundRect(bx, by, scale, scale * 0.7, 3)
              } else {
                ctx.ellipse(bx + scale / 2, by + scale / 2, scale / 2.2, scale / 3, 0, 0, Math.PI * 2)
              }
              ctx.strokeStyle = '#000000'
              ctx.lineWidth = 0.6
              ctx.stroke()
            }
          }
        }
        ctx.restore()
      }

      // Edge outline
      ctx.beginPath()
      ctx.roundRect(x, y, w, h, [r, r, r, r])
      ctx.strokeStyle = 'rgba(0,0,0,0.2)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Stitching lines (offset 6px from edge)
      const stitchInset = 6
      ctx.save()
      ctx.setLineDash([4, 4])
      ctx.strokeStyle = stitchColor
      ctx.lineWidth = 0.8
      ctx.beginPath()
      ctx.roundRect(x + stitchInset, y + stitchInset, w - stitchInset * 2, h - stitchInset * 2, [r - 2, r - 2, r - 2, r - 2])
      ctx.stroke()
      ctx.setLineDash([])
      ctx.restore()

      // Holes for bottom strap
      if (hasHoles) {
        const holeStartY = y + 25
        const holeSpacing = 22
        const numHoles = Math.min(6, Math.floor((h - 50) / holeSpacing))
        for (let i = 0; i < numHoles; i++) {
          ctx.beginPath()
          ctx.ellipse(cx, holeStartY + i * holeSpacing, 4, 3, 0, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(0,0,0,0.25)'
          ctx.fill()
          ctx.strokeStyle = 'rgba(0,0,0,0.15)'
          ctx.lineWidth = 0.5
          ctx.stroke()
        }

        // Keeper loop (the little loop that holds the strap end)
        const keeperY = y + h - 30
        const keeperW = w + 8
        ctx.beginPath()
        ctx.roundRect(cx - keeperW / 2, keeperY, keeperW, 12, 4)
        ctx.strokeStyle = 'rgba(0,0,0,0.25)'
        ctx.lineWidth = 2.5
        ctx.stroke()
        ctx.beginPath()
        ctx.roundRect(cx - keeperW / 2, keeperY, keeperW, 12, 4)
        ctx.fillStyle = 'rgba(0,0,0,0.03)'
        ctx.fill()
      }

      // Engraving text
      if (hasHoles && engraving.trim().length > 0) {
        ctx.save()
        ctx.font = '10px var(--font-baloo), sans-serif'
        ctx.fillStyle = stitchColor
        ctx.globalAlpha = 0.7
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const engravingY = y + 15
        ctx.fillText(engraving.trim(), cx, engravingY)
        ctx.restore()
      }
    }

    // Top strap piece (longer, no holes)
    drawStrapPiece(cx - widthPx / 2, topY, widthPx, topStrapH, false)

    // Buckle
    const buckleW = widthPx + 10
    const buckleX = cx - buckleW / 2

    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.12)'
    ctx.shadowBlur = 8
    ctx.shadowOffsetY = 2
    ctx.beginPath()
    ctx.roundRect(buckleX, buckleY, buckleW, buckleH, 4)
    ctx.fillStyle = buckleFinish
    ctx.fill()
    ctx.restore()

    // Buckle details
    ctx.beginPath()
    ctx.roundRect(buckleX, buckleY, buckleW, buckleH, 4)
    ctx.strokeStyle = 'rgba(0,0,0,0.15)'
    ctx.lineWidth = 1
    ctx.stroke()

    // Center bar of buckle
    ctx.beginPath()
    ctx.moveTo(cx - buckleW / 2 + 8, buckleY + buckleH / 2)
    ctx.lineTo(cx + buckleW / 2 - 8, buckleY + buckleH / 2)
    ctx.strokeStyle = 'rgba(0,0,0,0.2)'
    ctx.lineWidth = 2
    ctx.stroke()

    // Pin/loop on buckle
    if (buckleStyle === 'pin') {
      ctx.beginPath()
      ctx.arc(cx, buckleY + buckleH / 2, 4, 0, Math.PI * 2)
      ctx.fillStyle = buckleFinish
      ctx.fill()
      ctx.strokeStyle = 'rgba(0,0,0,0.15)'
      ctx.lineWidth = 1
      ctx.stroke()
    } else if (buckleStyle === 'deployant') {
      // Two side buttons
      ctx.beginPath()
      ctx.arc(buckleX + 8, buckleY + buckleH / 2, 3, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0,0,0,0.15)'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(buckleX + buckleW - 8, buckleY + buckleH / 2, 3, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0,0,0,0.15)'
      ctx.fill()
    } else if (buckleStyle === 'butterfly') {
      // Two butterfly wings
      ctx.beginPath()
      ctx.roundRect(buckleX + 2, buckleY + 4, buckleW / 2 - 4, buckleH - 8, 3)
      ctx.strokeStyle = 'rgba(0,0,0,0.12)'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.beginPath()
      ctx.roundRect(cx + 2, buckleY + 4, buckleW / 2 - 4, buckleH - 8, 3)
      ctx.stroke()
    }

    // Bottom strap piece (shorter, with holes)
    drawStrapPiece(cx - widthPx / 2, bottomY, widthPx, bottomStrapH, true)

    // Buckle label
    ctx.save()
    ctx.font = '9px var(--font-baloo), sans-serif'
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.textAlign = 'center'
    ctx.fillText(
      buckleStyle === 'pin' ? 'PIN BUCKLE' : buckleStyle === 'deployant' ? 'DEPLOYANT' : 'BUTTERFLY',
      cx,
      bottomY + bottomStrapH + 20
    )
    ctx.fillText(
      `${width} • ${length.split(' (')[0]}`,
      cx,
      bottomY + bottomStrapH + 34
    )
    ctx.restore()
  }, [strapColor, stitchColor, width, length, buckleStyle, buckleFinish, engraving, texture, isLeather])

  useEffect(() => {
    drawStrap()
  }, [drawStrap])



  const handleAddToCart = () => {
    if (!selectedProduct) {
      toast.error('please select a base product')
      return
    }
    toast.success('custom strap added to cart!')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground text-sm">loading customizer...</div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Back link */}
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeftIcon className="size-4" />
        back to shop
      </Link>

      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight lowercase heading mb-2">
        strap customizer
      </h1>
      <p className="text-muted-foreground text-sm mb-8">
        design your perfect strap — every detail, your way
      </p>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* ─── Left Panel: Options ──────────────────────────────── */}
        <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 scrollbar-hide">
          {/* Base Product */}
          <Section title="base product">
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} — ₹{p.basePrice.toLocaleString('en-IN')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Section>

          {/* Strap Material */}
          <Section title="strap material">
            <RadioGroup value={material} onValueChange={setMaterial} className="grid-cols-2 sm:grid-cols-3">
              {MATERIALS.map((m) => (
                <label
                  key={m.value}
                  className={`
                    flex items-center gap-2 rounded-lg border px-3 py-2.5 cursor-pointer transition-all
                    ${material === m.value
                      ? 'border-foreground bg-foreground/5'
                      : 'border-border hover:border-foreground/30'
                    }
                  `}
                >
                  <RadioGroupItem value={m.value} />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium leading-tight">{m.label}</span>
                    {m.extra > 0 && (
                      <span className="text-[10px] text-muted-foreground">+₹{m.extra}</span>
                    )}
                  </div>
                </label>
              ))}
            </RadioGroup>
          </Section>

          {/* Strap Color */}
          <Section title="strap color">
            <div className="flex flex-wrap gap-2">
              {STRAP_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setStrapColor(c.value)}
                  title={c.label}
                  className={`
                    size-8 rounded-full border-2 transition-all hover:scale-110
                    ${strapColor === c.value
                      ? 'border-lime ring-2 ring-lime/30'
                      : c.value === '#FFFFFF' || c.value === '#FFFDD0'
                        ? 'border-border'
                        : 'border-transparent'
                    }
                  `}
                  style={{ backgroundColor: c.value }}
                >
                  {strapColor === c.value && (
                    <span className="sr-only">{c.label} selected</span>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {STRAP_COLORS.find((c) => c.value === strapColor)?.label}
            </p>
          </Section>

          {/* Stitching Color */}
          <Section title="stitching color">
            <div className="flex flex-wrap gap-2">
              {STITCHING_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setStitchColor(c.value)}
                  title={c.label}
                  className={`
                    size-8 rounded-full border-2 transition-all hover:scale-110
                    ${stitchColor === c.value
                      ? 'border-lime ring-2 ring-lime/30'
                      : c.value === '#FFFFFF'
                        ? 'border-border'
                        : 'border-transparent'
                    }
                  `}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {STITCHING_COLORS.find((c) => c.value === stitchColor)?.label}
            </p>
          </Section>

          {/* Strap Width */}
          <Section title="strap width">
            <RadioGroup value={width} onValueChange={setWidth} className="grid-cols-4">
              {WIDTHS.map((w) => (
                <label
                  key={w}
                  className={`
                    flex items-center justify-center rounded-lg border px-3 py-2.5 cursor-pointer transition-all text-xs font-medium
                    ${width === w
                      ? 'border-foreground bg-foreground/5'
                      : 'border-border hover:border-foreground/30'
                    }
                  `}
                >
                  <RadioGroupItem value={w} className="sr-only" />
                  {w}
                </label>
              ))}
            </RadioGroup>
          </Section>

          {/* Strap Length */}
          <Section title="strap length">
            <RadioGroup value={length} onValueChange={setLength} className="grid-cols-1 sm:grid-cols-3">
              {LENGTHS.map((l) => (
                <label
                  key={l}
                  className={`
                    flex items-center gap-2 rounded-lg border px-3 py-2.5 cursor-pointer transition-all text-xs
                    ${length === l
                      ? 'border-foreground bg-foreground/5'
                      : 'border-border hover:border-foreground/30'
                    }
                  `}
                >
                  <RadioGroupItem value={l} />
                  {l}
                </label>
              ))}
            </RadioGroup>
          </Section>

          {/* Buckle Style */}
          <Section title="buckle style">
            <RadioGroup value={buckleStyle} onValueChange={setBuckleStyle} className="grid-cols-1 sm:grid-cols-3">
              {BUCKLE_STYLES.map((b) => (
                <label
                  key={b.value}
                  className={`
                    flex items-center gap-2 rounded-lg border px-3 py-2.5 cursor-pointer transition-all
                    ${buckleStyle === b.value
                      ? 'border-foreground bg-foreground/5'
                      : 'border-border hover:border-foreground/30'
                    }
                  `}
                >
                  <RadioGroupItem value={b.value} />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium leading-tight">{b.label}</span>
                    {b.extra > 0 && (
                      <span className="text-[10px] text-muted-foreground">+₹{b.extra}</span>
                    )}
                  </div>
                </label>
              ))}
            </RadioGroup>
          </Section>

          {/* Buckle Finish */}
          <Section title="buckle finish">
            <div className="flex flex-wrap gap-2">
              {BUCKLE_FINISHES.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setBuckleFinish(f.value)}
                  title={f.label}
                  className={`
                    size-8 rounded-full border-2 transition-all hover:scale-110
                    ${buckleFinish === f.value
                      ? 'border-lime ring-2 ring-lime/30'
                      : 'border-transparent'
                    }
                  `}
                  style={{ backgroundColor: f.value }}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {BUCKLE_FINISHES.find((f) => f.value === buckleFinish)?.label}
            </p>
          </Section>

          {/* Engraving */}
          <Section title="engraving (optional)" subtitle="+₹299">
            <Input
              value={engraving}
              onChange={(e) => setEngraving(e.target.value.slice(0, 30))}
              placeholder="max 30 characters"
              maxLength={30}
              className="max-w-xs"
            />
            <p className="text-xs text-muted-foreground mt-1">{engraving.length}/30</p>
          </Section>

          {/* Texture (leather only) */}
          {isLeather && (
            <Section title="texture">
              <RadioGroup value={texture} onValueChange={setTexture} className="grid-cols-2 sm:grid-cols-3">
                {TEXTURES.map((t) => (
                  <label
                    key={t}
                    className={`
                      flex items-center gap-2 rounded-lg border px-3 py-2.5 cursor-pointer transition-all text-xs font-medium
                      ${texture === t
                        ? 'border-foreground bg-foreground/5'
                        : 'border-border hover:border-foreground/30'
                      }
                    `}
                  >
                    <RadioGroupItem value={t} />
                    {t}
                  </label>
                ))}
              </RadioGroup>
            </Section>
          )}
        </div>

        {/* ─── Right Panel: Canvas Preview + Price ─────────────── */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="bg-secondary/50 rounded-2xl p-6 lg:p-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              live preview
            </h3>

            <div className="flex justify-center bg-white dark:bg-dark-card rounded-xl p-4 mb-6">
              <canvas
                ref={canvasRef}
                width={400}
                height={600}
                className="w-full max-w-[400px] h-auto"
              />
            </div>

            {/* Price Breakdown */}
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">base price</span>
                <span>₹{basePrice.toLocaleString('en-IN')}</span>
              </div>
              {materialExtra > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">material upgrade</span>
                  <span>+₹{materialExtra}</span>
                </div>
              )}
              {buckleExtra > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">buckle upgrade</span>
                  <span>+₹{buckleExtra}</span>
                </div>
              )}
              {engravingExtra > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">engraving</span>
                  <span>+₹{engravingExtra}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>total</span>
                <span className="text-lime-dark dark:text-lime">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              className="w-full mt-6 h-12 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition-opacity"
              size="lg"
            >
              <ShoppingBagIcon className="mr-2 size-5" />
              add custom strap to cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Section helper ─────────────────────────────────────────────

function Section({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
          {title}
        </h3>
        {subtitle && (
          <span className="text-xs text-lime-dark dark:text-lime font-medium">{subtitle}</span>
        )}
      </div>
      {children}
    </div>
  )
}