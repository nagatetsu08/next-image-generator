export interface PlanItem {
    name: string
    icon?: React.ComponentType<{className?: string}>
    price: string
    description: string
    features?: string[]
    buttonText: string
    priceId: string
    recommend? :boolean
}