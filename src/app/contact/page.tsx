'use client'

import { useState } from 'react'
import {
  MailIcon,
  PhoneIcon,
  LocationIcon,
  ClockIcon,
  SendIcon,
  CheckCircle2Icon,
} from '@/lib/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

const SUBJECTS = [
  'General Inquiry',
  'Order Support',
  'Returns/Exchange',
  'Custom Order',
  'Partnership',
  'Other',
]

const CONTACT_INFO = [
  {
    icon: MailIcon,
    label: 'email',
    value: 'hello@prostraps.in',
    href: 'mailto:hello@prostraps.in',
  },
  {
    icon: PhoneIcon,
    label: 'phone',
    value: '+91 98765 43210',
    href: 'tel:+919876543210',
  },
  {
    icon: LocationIcon,
    label: 'workshop',
    value: '301, Design Hub, Andheri West\nMumbai, Maharashtra 400053',
    href: null,
  },
  {
    icon: ClockIcon,
    label: 'business hours',
    value: 'Mon \u2013 Sat: 10:00 AM \u2013 7:00 PM IST\nSunday: Closed',
    href: null,
  },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error('please fill in all fields')
      return
    }
    setSubmitted(true)
    toast.success('message sent successfully!')
  }

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-dark dark:bg-[#111111] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight lowercase heading">
            get in touch
          </h1>
          <p className="mt-3 text-white/60 max-w-xl mx-auto text-sm sm:text-base">
            have a question, feedback, or just want to say hi? we&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left: Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight lowercase heading">
                contact info
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                reach out through any of the channels below, or use the form to send us a message directly.
              </p>
            </div>

            <div className="space-y-6">
              {CONTACT_INFO.map((item) => {
                if (item.href) {
                  return (
                    <a key={item.label} href={item.href} className="flex items-start gap-4 group">
                      <div className="flex items-center justify-center size-10 rounded-full bg-secondary shrink-0">
                        <item.icon className="size-4 text-foreground" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">
                          {item.label}
                        </p>
                        <p className="text-sm font-medium group-hover:text-lime-dark dark:group-hover:text-lime transition-colors">
                          {item.value}
                        </p>
                      </div>
                    </a>
                  )
                }
                return (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="flex items-center justify-center size-10 rounded-full bg-secondary shrink-0">
                      <item.icon className="size-4 text-foreground" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-sm font-medium whitespace-pre-line">{item.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Map placeholder */}
            <div className="bg-secondary rounded-2xl h-48 flex items-center justify-center">
              <div className="text-center">
                <LocationIcon className="size-8 mx-auto text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground font-medium lowercase">
                  visit our workshop
                </p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">
                  andheri west, mumbai
                </p>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="bg-secondary/50 rounded-2xl p-8 lg:p-12 flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                <CheckCircle2Icon className="size-16 text-lime-dark dark:text-lime" />
                <h3 className="text-2xl font-bold lowercase heading">message sent!</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  thank you for reaching out. we&apos;ll get back to you within 24 hours.
                </p>
                <Button
                  variant="outline"
                  className="rounded-full mt-4"
                  onClick={() => {
                    setSubmitted(false)
                    setForm({ name: '', email: '', subject: '', message: '' })
                  }}
                >
                  send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs uppercase tracking-wider">
                      name
                    </Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs uppercase tracking-wider">
                      email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-xs uppercase tracking-wider">
                    subject
                  </Label>
                  <Select value={form.subject} onValueChange={(v) => updateField('subject', v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-xs uppercase tracking-wider">
                    message
                  </Label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    placeholder="tell us how we can help..."
                    rows={6}
                    required
                    className="resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full sm:w-auto h-12 rounded-full px-8 bg-foreground text-background font-semibold hover:opacity-90 transition-opacity"
                >
                  <SendIcon className="mr-2 size-4" />
                  send message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}