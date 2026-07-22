import { ShieldIcon, HandIcon, RulerIcon, RefreshCwIcon } from "@/lib/icons"

const features = [
  {
    icon: ShieldIcon,
    title: 'premium materials',
    description:
      'Sourced from the finest leathers, silicones, and metals worldwide for lasting comfort and style.',
  },
  {
    icon: HandIcon,
    title: 'handcrafted quality',
    description:
      'Every strap is carefully inspected and finished by skilled artisans who take pride in their work.',
  },
  {
    icon: RulerIcon,
    title: 'perfect fit guarantee',
    description:
      'Precision-cut to match your exact watch model with a satisfaction guarantee on every order.',
  },
  {
    icon: RefreshCwIcon,
    title: 'free easy returns',
    description:
      'Not the right fit? Return within 30 days for a full refund, no questions asked.',
  },
]

export function FeaturesSection() {
  return (
    <section className="w-full">
      <h2 className="text-2xl lg:text-3xl font-bold tracking-tight lowercase text-foreground mb-8">
        why pro straps
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <div
              key={feature.title}
              className="flex flex-col items-start gap-4 p-5 rounded-2xl border border-transparent hover:border-border/50 transition-colors"
            >
              <div className="flex items-center justify-center size-12 rounded-full bg-lime/15">
                <Icon size={20} className="text-lime" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-sm text-card-foreground lowercase tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}