import * as Minio from 'minio'
import { logger } from './logger'

// MinIO configuration from environment variables
const MINIO_ENDPOINT = process.env['MINIO_ENDPOINT'] || 'localhost'
const MINIO_PORT = parseInt(process.env['MINIO_PORT'] || '9000', 10)
const MINIO_ACCESS_KEY = process.env['MINIO_ACCESS_KEY'] || ''
const MINIO_SECRET_KEY = process.env['MINIO_SECRET_KEY'] || ''
const MINIO_USE_SSL = process.env['MINIO_SECURE'] === 'true'
const MINIO_BUCKET_NAME = process.env['MINIO_BUCKET_NAME'] || 'api'
const MINIO_REGION = process.env['MINIO_REGION'] || 'us-east-1'
const MINIO_PUBLIC_URL = process.env['MINIO_PUBLIC_URL'] || 'http://localhost:9000'
const MINIO_AVATAR_PREFIX = process.env['MINIO_AVATAR_PREFIX'] || 'avatars'

// Parse endpoint to remove protocol if present
const parseEndpoint = (endpoint: string): { host: string; port?: number } => {
  const urlPattern = /^(https?:\/\/)?([^:\/\s]+)(:(\d+))?/
  const match = endpoint.match(urlPattern)
  
  if (match && match[2]) {
    const host = match[2]
    const port = match[4] ? parseInt(match[4], 10) : undefined
    return port !== undefined ? { host, port } : { host }
  }
  
  return { host: endpoint }
}

const { host: minioHost, port: minioPort } = parseEndpoint(MINIO_ENDPOINT)

// Initialize MinIO client
export const minioClient = new Minio.Client({
  endPoint: minioHost,
  port: minioPort || MINIO_PORT,
  useSSL: MINIO_USE_SSL,
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
  region: MINIO_REGION,
})

/**
 * Initialize MinIO bucket if it doesn't exist
 */
export async function initMinIO(): Promise<void> {
  try {
    const bucketExists = await minioClient.bucketExists(MINIO_BUCKET_NAME)
    
    if (!bucketExists) {
      await minioClient.makeBucket(MINIO_BUCKET_NAME, MINIO_REGION)
      logger.info(`✅ MinIO bucket created: ${MINIO_BUCKET_NAME}`)
      
      // Set bucket policy to public read for images
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${MINIO_BUCKET_NAME}/*`],
          },
        ],
      }
      
      await minioClient.setBucketPolicy(MINIO_BUCKET_NAME, JSON.stringify(policy))
      logger.info(`✅ MinIO bucket policy set to public read`)
    } else {
      logger.info(`✅ MinIO bucket already exists: ${MINIO_BUCKET_NAME}`)
    }
  } catch (error) {
    logger.error({ err: error }, '❌ Failed to initialize MinIO')
    throw error
  }
}

/**
 * Upload file to MinIO
 * @param file - File object from Elysia
 * @param folder - Folder prefix (e.g., 'avatars', 'products')
 * @returns Public URL of uploaded file
 */
export async function uploadToMinIO(
  file: File,
  folder: string = 'uploads'
): Promise<string> {
  try {
    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 10)
    const extension = file.name.split('.').pop() || 'jpg'
    const filename = `${timestamp}-${randomString}.${extension}`
    const objectName = `${folder}/${filename}`
    
    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Upload to MinIO
    await minioClient.putObject(
      MINIO_BUCKET_NAME,
      objectName,
      buffer,
      buffer.length,
      {
        'Content-Type': file.type || 'application/octet-stream',
      }
    )
    
    // Return public URL
    const publicUrl = `${MINIO_PUBLIC_URL}/${MINIO_BUCKET_NAME}/${objectName}`
    logger.info(`✅ File uploaded to MinIO: ${publicUrl}`)
    
    return publicUrl
  } catch (error) {
    logger.error({ err: error }, '❌ Failed to upload to MinIO')
    throw new Error('Failed to upload file')
  }
}

/**
 * Upload avatar to MinIO
 * @param file - Avatar file
 * @param userId - User ID for organizing files
 * @returns Public URL of uploaded avatar
 */
export async function uploadAvatar(file: File, userId: string): Promise<string> {
  const folder = `${MINIO_AVATAR_PREFIX}/${userId}`
  return uploadToMinIO(file, folder)
}

/**
 * Upload product image to MinIO
 * @param file - Product image file
 * @param storeId - Store ID for organizing files
 * @returns Public URL of uploaded image
 */
export async function uploadProductImage(file: File, storeId: string): Promise<string> {
  const folder = `products/${storeId}`
  return uploadToMinIO(file, folder)
}

/**
 * Delete file from MinIO
 * @param objectUrl - Full URL of the object to delete
 * @returns True if deleted successfully
 */
export async function deleteFromMinIO(objectUrl: string): Promise<boolean> {
  try {
    // Extract object name from URL
    const urlPattern = new RegExp(`${MINIO_PUBLIC_URL}/${MINIO_BUCKET_NAME}/(.+)`)
    const match = objectUrl.match(urlPattern)
    
    if (!match || !match[1]) {
      logger.warn(`⚠️ Invalid MinIO URL format: ${objectUrl}`)
      return false
    }
    
    const objectName = match[1]
    
    // Delete from MinIO
    await minioClient.removeObject(MINIO_BUCKET_NAME, objectName)
    logger.info(`✅ File deleted from MinIO: ${objectName}`)
    
    return true
  } catch (error) {
    logger.error({ err: error }, '❌ Failed to delete from MinIO')
    return false
  }
}

/**
 * Get presigned URL for temporary access
 * @param objectName - Object name in bucket
 * @param expirySeconds - Expiry time in seconds (default: 7 days)
 * @returns Presigned URL
 */
export async function getPresignedUrl(
  objectName: string,
  expirySeconds: number = 7 * 24 * 60 * 60
): Promise<string> {
  try {
    return await minioClient.presignedGetObject(
      MINIO_BUCKET_NAME,
      objectName,
      expirySeconds
    )
  } catch (error) {
    logger.error({ err: error }, '❌ Failed to generate presigned URL')
    throw new Error('Failed to generate presigned URL')
  }
}

export const minioConfig = {
  endpoint: minioHost,
  port: minioPort || MINIO_PORT,
  useSSL: MINIO_USE_SSL,
  bucketName: MINIO_BUCKET_NAME,
  publicUrl: MINIO_PUBLIC_URL,
  avatarPrefix: MINIO_AVATAR_PREFIX,
}
