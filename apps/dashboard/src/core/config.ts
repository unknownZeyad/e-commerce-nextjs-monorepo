export const config = {
  imageBaseUrl: 'https://res.cloudinary.com/dhytmwcla/image/upload/v1234567890/nextjs-ecommerce-app-normal',
  cloudinaryDir: 'nextjs-ecommerce-app-normal',
  cloudinaryConfig: {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
  }
}

