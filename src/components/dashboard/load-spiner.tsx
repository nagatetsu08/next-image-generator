import { Loader2 } from 'lucide-react'
import React from 'react'

const LoadingSpiner = () => {
  return (
    <div className='flex items-center'>
        <Loader2 className='animate-spin mr-2' />
        <span>生成中...</span>
    </div>
  )
}

export default LoadingSpiner