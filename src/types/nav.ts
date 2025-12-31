export interface NavItem {
    title: string
    href: string
    // こうかくとclassNameをpropsで受け取れるコンポーネントであれば定義できることを指す。
    icon?: React.ComponentType<{className?: string}>
}