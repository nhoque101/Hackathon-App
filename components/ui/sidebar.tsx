"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

// Context for sidebar state
interface SidebarContextProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(undefined)

function useSidebarContext() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("Sidebar components must be used within a SidebarProvider")
  }
  return context
}

// Sidebar Provider
interface SidebarProviderProps {
  children: React.ReactNode
  defaultOpen?: boolean
}

export function SidebarProvider({ children, defaultOpen = true }: SidebarProviderProps) {
  const [open, setOpen] = React.useState(defaultOpen)

  return <SidebarContext.Provider value={{ open, setOpen }}>{children}</SidebarContext.Provider>
}

// Sidebar component
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Sidebar({ children, className, ...props }: SidebarProps) {
  const { open } = useSidebarContext()

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-white transition-transform",
        open ? "translate-x-0" : "-translate-x-full",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Sidebar Header
export function SidebarHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("border-b bg-white", className)} {...props}>
      {children}
    </div>
  )
}

// Sidebar Content
export function SidebarContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex-1 overflow-auto bg-white", className)} {...props}>
      {children}
    </div>
  )
}

// Sidebar Footer
export function SidebarFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("border-t bg-white", className)} {...props}>
      {children}
    </div>
  )
}

// Sidebar Menu
export function SidebarMenu({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-2 py-2", className)} {...props}>
      {children}
    </div>
  )
}

// Sidebar Menu Item
export function SidebarMenuItem({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-1", className)} {...props}>
      {children}
    </div>
  )
}

// Sidebar Menu Button
const sidebarMenuButtonVariants = cva(
  "flex w-full items-center rounded-md px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-black",
  {
    variants: {
      variant: {
        default: "",
        active: "bg-gray-100 font-medium text-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean
}

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : "button"
    const childProps = asChild ? props.children.props : props

    return (
      <Comp ref={ref} className={cn(sidebarMenuButtonVariants({ variant, className }))} {...childProps}>
        {props.children}
      </Comp>
    )
  },
)
SidebarMenuButton.displayName = "SidebarMenuButton"

// Sidebar Trigger
export function SidebarTrigger({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen } = useSidebarContext()

  return (
    <button
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:text-black",
        className,
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  )
}

// Sidebar Close
export function SidebarClose({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = useSidebarContext()

  return (
    <button
      className={cn(
        "absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-700 hover:text-black",
        className,
      )}
      onClick={() => setOpen(false)}
      {...props}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close Sidebar</span>
    </button>
  )
}

// Sidebar Inset (main content area)
export function SidebarInset({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { open } = useSidebarContext()

  return (
    <div className={cn("flex flex-1 flex-col overflow-hidden", open ? "md:ml-64" : "ml-0", className)} {...props}>
      {children}
    </div>
  )
}

