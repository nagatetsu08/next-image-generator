import { Loader2 } from "lucide-react"


interface loadingOverlayProps {
  title?: string
  message?: string
}

const LoadingOverlay = ({title = "処理中", message = "そのまま少々お待ちください..."}: loadingOverlayProps) => {
  return (
  <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
    <div className="bg-card p-8 rounded-2xl shadow-2xl flex flex-col items-center border animate-in fade-in zoom-in duration-200">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-xl font-bold">{title}</p>
      <p className="text-sm text-muted-foreground mt-2">{message}</p>
    </div>
  </div>
  )
}

export default LoadingOverlay