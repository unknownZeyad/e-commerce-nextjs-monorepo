import {
  cloneElement,
  ComponentProps,
  createContext,
  Dispatch,
  memo,
  ReactElement,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useOutsideClick } from '../../hooks/use-outside-click';

const ImageViewerContext = createContext<{
  isOpen: boolean, 
  setIsOpen: Dispatch<SetStateAction<boolean>>, 
  src?:string | null, 
  alt:string
}>({
  isOpen:false, 
  setIsOpen:() => {}, 
  src:"", 
  alt:""
});


export function ImageViewer({ src , alt, children } : {
  src?:string | null, 
  alt:string, 
  readonly children: React.ReactNode,
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ImageViewerContext.Provider
      value={{
        isOpen,
        setIsOpen,
        src,
        alt,
      }}>
      {children}
    </ImageViewerContext.Provider>
  );
}





function Image({ fallBack, ...props }: ComponentProps<'img'> & {
  fallBack: ReactElement,
}) {
  const { src, alt } = useContext(ImageViewerContext);

  return src ? (
    <img {...props} src={src} alt={alt}/>
  ) : (
    fallBack
  );
}

function ToggleImageView({ children }: { children:React.ReactElement }) {
  const { isOpen, setIsOpen } = useContext(ImageViewerContext);

  const existingOnClick = children?.props?.onClick;

  return cloneElement(children, {
    onClick: (event:Event) => {
      if (existingOnClick) existingOnClick(event);
      setIsOpen(!isOpen);
    },
  });
}

function ImageThumbnail() {
  const [ isVisible, setIsVisible ] = useState<boolean>(false)
  const { isOpen, setIsOpen, src, alt } = useContext(ImageViewerContext);
  
  const close = useCallback(() => setIsOpen(false),[]);
  const ref = useOutsideClick<HTMLDivElement>({ handler: close });

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)  
    }else {
      const timeout = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  },[isOpen])

  if (!src || (!isVisible && !isOpen)) return null;

  return createPortal(
    <div
      style={{ opacity: isVisible && isOpen ? '1' : '0'}}
      className='fixed left-0 top-0 z-[1000] h-screen opacity-0 w-full bg-[rgba(20,20,20,0.61)] backdrop-blur-sm transition-[opacity] duration-300'
    >
      <div
        ref={ref}
        style={{ scale: isVisible && isOpen ? '1' :' 0.95', transformOrigin: "top left"}}
        className='h-clamp w-clamp fixed left-1/2 top-1/2 bg-white -translate-x-1/2 -translate-y-1/2 shadow-lg transition-[scale] duration-300'
      >
        <img src={src} alt={alt} className='max-w-[600px] max-h-[600px] object-contain' />
      </div>
    </div>,
    document.body
  );
}


ImageViewer.Image = memo(Image);
ImageViewer.ToggleImageView = memo(ToggleImageView);
ImageViewer.ImageThumbnail = memo(ImageThumbnail);