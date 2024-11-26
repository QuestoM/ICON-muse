"use client";

import * as React from "react";

interface TabsProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
}

const TabsContext = React.createContext<{
  value: string;
  onChange?: (value: string) => void;
} | null>(null);

export function Tabs({ defaultValue, className = "", children, onValueChange }: TabsProps) {
  const [value, setValue] = React.useState(defaultValue);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value, onChange: handleValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="relative">
      <div className={`flex space-x-2 relative z-10 ${className}`}>
        {children}
      </div>
      <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary/50 to-primary w-full -z-0" />
    </div>
  );
}

export function TabsTrigger({ 
  value, 
  children, 
  className = "",
  onChange
}: { 
  value: string; 
  children: React.ReactNode; 
  className?: string;
  onChange?: (value: string) => void;
}) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  const isActive = context.value === value;

  return (
    <button 
      className={`
        px-4 py-2 rounded-lg 
        transition-all duration-300 ease-out
        relative
        ${isActive 
          ? 'bg-primary text-white shadow-lg scale-105' 
          : 'text-gray-300 hover:text-white hover:bg-gray-800/70'
        } 
        before:absolute before:bottom-0 before:left-0 before:right-0 
        before:h-0.5 before:bg-primary
        before:transform before:scale-x-0 before:transition-transform
        before:duration-300 before:ease-out
        ${isActive ? 'before:scale-x-100' : ''}
        ${className}
      `}
      onClick={() => {
        context.onChange?.(value);
        onChange?.(value);
      }}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}

export function TabsContent({ 
  value, 
  children, 
  className = "" 
}: { 
  value: string; 
  children: React.ReactNode; 
  className?: string;
}) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');

  if (context.value !== value) return null;

  return (
    <div 
      className={`
        text-white animate-content-enter
        motion-reduce:animate-none
        ${className}
      `}
    >
      {children}
    </div>
  );
} 