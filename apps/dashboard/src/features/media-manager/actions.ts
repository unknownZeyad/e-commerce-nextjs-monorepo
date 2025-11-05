'use server'
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'
import { CloudinaryAssetsResponse, CloudinaryResourceType } from './types'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})


export async function uploadMediaFileAction({ fileName, file }: {
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
        folder: process.env.CLOUDINARY_PROJECT_DIR,
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
    url: result.secure_url as string,
    public_id: result.public_id as string,
  }
}


export async function deleteMediaFileAction(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return { result } 
  } catch (err) {
    return { error: 'Failed to delete file' }
  }
}


export async function getMediaFilesAction({ type, limit = 50, next_cursor }: {
  next_cursor?: string,
  limit?: number,
  type: CloudinaryResourceType
}) {
  return await cloudinary.api.resources({ 
    max_results: limit,
    resource_type: type,
    next_cursor,
    type: 'upload',
    prefix: `${process.env.CLOUDINARY_PROJECT_DIR}/`
  }) as CloudinaryAssetsResponse
}