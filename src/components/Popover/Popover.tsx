import { useFloating, FloatingPortal, autoUpdate, FloatingArrow, arrow } from '@floating-ui/react'
import { useEffect, useId, useRef, useState, type ElementType } from 'react'
import { AnimatePresence, motion } from 'motion/react'

interface Props {
  children: React.ReactNode
  renderPopover: React.ReactNode
  className?: string
  as?: ElementType
  initialOpen?: boolean
}

export default function Popover({ children, renderPopover, className, as: Element = 'div', initialOpen }: Props) {
  const [isOpen, setIsOpen] = useState(initialOpen || false)
  // Gọi arrRef để lấy arrow trong fl-ui.
  const arrowRef = useRef<SVGSVGElement>(null)
  // Lấy ra id.
  const id = useId()

  // Sử dụng floating ui.
  const { x, y, refs, strategy, elements, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      // eslint-disable-next-line react-hooks/refs
      arrow({
        element: arrowRef
      })
    ]
  })

  // Show popover
  const showPopover = () => {
    setIsOpen(true)
  }

  // Hidden popover
  const hiddenPopover = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    if (!elements.floating) return
  }, [refs, elements.floating])
  return (
    <Element
      className={className}
      // eslint-disable-next-line react-hooks/refs
      ref={refs.setReference}
      onMouseEnter={showPopover}
      onMouseLeave={hiddenPopover}
    >
      {children}
      <FloatingPortal id={id}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key='floating-menu'
              // eslint-disable-next-line react-hooks/refs
              ref={refs.setFloating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
                transformOrigin: 'top center',
                zIndex: 50
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FloatingArrow
                ref={arrowRef}
                context={context}
                fill='white'
                strokeWidth={1}
                style={{ transform: 'translateY(-1px) translateX(-20px)', zIndex: 1}}
              />
              {renderPopover}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </Element>
  )
}
