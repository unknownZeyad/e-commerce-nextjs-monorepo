
import { cloneElement, createContext, Dispatch, memo, ReactElement, ReactNode, SetStateAction, useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useOutsideClick } from '../../hooks/use-outside-click'
import { cn } from '../../lib/utils'

const Context = createContext<{
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>,
  toggleRect?: DOMRect,
}>({
  isOpen: false,
  toggleRect: undefined,
  setIsOpen: () => {}
})

function useToggleMenu() {
  const context = useContext(Context);
  if (context === undefined)
    throw new Error('Dev Error: Cannot Use was ToggleMenu Components outside ToggleMenu wrapper');

  return context;
}


const ToggleMenu = memo(function ({ children }: {
  readonly children: ReactNode
}) {
  const [isOpen,setIsOpen] = useState<boolean>(false)
  const ref = useOutsideClick<HTMLDivElement>(() => setIsOpen(false))

  return (
    <div ref={ref} className="relative">
      <Context.Provider value={{ isOpen, setIsOpen, toggleRect: ref.current?.getBoundingClientRect() }}>
        { children }
      </Context.Provider>
    </div>
  )
})



function Toggle ({ children }: {
  readonly children: ReactElement<{ onClick?: (e: MouseEvent) => void }>
}) {
  const { setIsOpen } = useToggleMenu()


  return cloneElement(children, {
    onClick: (e) => {
      children.props?.onClick?.(e)
      setIsOpen((prev) => !prev)
    }
  })
}

function CloseMenu ({ children }: {
  readonly children: ReactElement<{ onClick?: (e: MouseEvent) => void }>
}) {
  const { setIsOpen } = useToggleMenu()

  return cloneElement(children, {
    onClick: (e) => {
      children.props?.onClick?.(e)
      setIsOpen((prev) => false)
    }
  })
}


function MenuContent({ children }: { readonly children: ReactNode }) {
  const { isOpen } = useToggleMenu();
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<'left' | 'right'>('left')

  useLayoutEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const viewportCenter = window.innerWidth / 2;
      setPlacement(centerX > viewportCenter ? 'right' : 'left'); 
    }
  },[isOpen])

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timeout = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute bottom-0 top-[calc(100%+5px)] transition-all duration-300 z-50",
        placement === 'left' ? 'left-0' : 'right-0'
      )}
      style={{
        opacity: isVisible && isOpen ? 1 : 0,
        scale: isVisible && isOpen ? 1 : 0.975,
      }}
    >
      {children}
    </div>
  );
}



export { 
  ToggleMenu, MenuContent, CloseMenu, Toggle
}
