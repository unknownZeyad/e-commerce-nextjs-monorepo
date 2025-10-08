import { useEffect, useRef } from 'react';

export function useOutsideClick<T extends Node>(handler: () => void, listenCapturing = true) {
  const ref = useRef<T>(null);

  useEffect(
    function () {
      function handleClick(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node|null)) {
          handler();
        }
      }
      document.addEventListener('click', handleClick, listenCapturing);

      return () =>
        document.removeEventListener('click', handleClick, listenCapturing);
    },
    [handler, listenCapturing],
  );

  return ref;
}