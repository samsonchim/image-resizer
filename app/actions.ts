'use server'

import { ImageResponse } from 'next/server'
import sharp from 'sharp'

export async function resizeImage(formData: FormData): Promise<{ success: boolean; data?: string; error?: string }> {
  try {
    const file = formData.get('image') as File
    const width = parseInt(formData.get('width') as string)
    const height = parseInt(formData.get('height') as string)

    if (!file || !width || !height) {
      console.error('Missing required fields:', { file: !!file, width, height })
      return { success: false, error: 'Missing required fields' }
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    
    const resizedImageBuffer = await sharp(buffer)
      .resize(width, height, { fit: 'cover' })
      .toBuffer()

    const imageResponse = new ImageResponse(resizedImageBuffer, {
      width,
      height,
    })

    const blob = await imageResponse.blob()
    const base64Image = await blobToBase64(blob)

    return { success: true, data: base64Image }
  } catch (error) {
    console.error('Error resizing image:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' }
  }
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

