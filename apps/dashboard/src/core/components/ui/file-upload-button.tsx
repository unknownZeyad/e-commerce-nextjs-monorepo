'use client'

import { cloneElement, JSX, useRef } from "react"

export default function FileUploadButton ({ uploadImage, children }: {
  uploadImage: (file: File) => void,
  readonly children: JSX.Element,
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    uploadImage(file!)
  }

  return (
    <>
      {cloneElement(children, {
        onClick: () => fileInputRef.current?.click()
      })}
      <input 
        onChange={handleFileChange}
        ref={fileInputRef}
        type="file" 
        className="hidden" 
      />
    </>
  )
}