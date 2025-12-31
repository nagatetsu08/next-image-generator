import React from 'react'

interface PageHeader {
    title: string;
    description?: string;
    children?: React.ReactNode
}

const PageHeader = ({title, description ,children}: PageHeader) => {
  return (
    <div className=''>
        <div className='space-y-1'>
            <h2 className='text-3xl font-bold tracking-tight'>{title}</h2>
            {description && <p className='text-muted-foreground'>{description}</p>}
        </div>
        {children}
    </div>
  )
}

export default PageHeader