export interface PlanItem {
    name: string
    iconName: string
    price: string
    description: string
    features?: string[]
    buttonText: string
    priceId: string
    recommend? :boolean
}