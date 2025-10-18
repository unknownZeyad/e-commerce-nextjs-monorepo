'use server'
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'
import { config } from '@/core/config'

cloudinary.config(config.cloudinaryConfig)


export async function uploadFileAction({ fileName, file }: {
  fileName: string,
  file: File
}) {
  if (!file) throw new Error('No file received')

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const stream = Readable.from(buffer)

   const result: any = await new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: config.cloudinaryDir,
        public_id: fileName || undefined,
        use_filename: true,           
        unique_filename: false,     
        overwrite: true,              
      },
      (err, res) => (err ? reject(err) : resolve(res))
    )
    stream.pipe(upload)
  })

  return {
    url: result.secure_url,
    public_id: result.public_id,
  }
}

export async function deleteFileAction(fileName: string) {
  try {
    const publicId = `${config.cloudinaryDir}/${fileName}`
    const result = await cloudinary.uploader.destroy(publicId)
    return { result } 
  } catch (err) {
    return { error: 'Failed to delete file' }
  }
}