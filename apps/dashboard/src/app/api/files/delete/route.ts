import { config } from "@/core/config";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary'
cloudinary.config(config.cloudinaryConfig)

export async function POST(request: NextRequest) {
  const body = await request.json()
  if (body.id) {
    cloudinary.uploader.destroy(`${config.cloudinaryDir}/${body.id}`)
  }

  return NextResponse.json({
    message: 'Action Done'
  })
}