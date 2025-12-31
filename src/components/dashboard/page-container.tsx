import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer = ({children}: PageContainerProps) => {
  return (
    <div className="p-8 pt-6 space-y-4">
        {children}
    </div>
  );
}

export default PageContainer;