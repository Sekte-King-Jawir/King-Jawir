/**
 * MinIO Object Storage Integration
 *
 * @description Provides file upload, deletion, and URL generation for MinIO S3-compatible storage.
 * Supports avatar uploads, product images, and custom folder organization.
 *
 * @module lib/minio
 * @requires minio
 * @requires ./logger
 *
 * @example
 * // Initialize MinIO bucket
 * await initMinIO()
 *
 * @example
 * // Upload avatar
 * const avatarUrl = await uploadAvatar(file, userId)
 *
 * @example
 * // Delete file
 * await deleteFromMinIO(fileUrl)
 */

import * as Minio from 'minio'
import { logger } from './logger'

const MINIO_ENDPOINT = process.env['MINIO_ENDPOINT'] || 'localhost'
const MINIO_PORT = parseInt(process.env['MINIO_PORT'] || '9000', 10)
const MINIO_ACCESS_KEY = process.env['MINIO_ACCESS_KEY'] || ''
const MINIO_SECRET_KEY = process.env['MINIO_SECRET_KEY'] || ''
const MINIO_USE_SSL = process.env['MINIO_SECURE'] === 'true'
const MINIO_BUCKET_NAME = process.env['MINIO_BUCKET_NAME'] || 'api'
const MINIO_REGION = process.env['MINIO_REGION'] || 'us-east-1'
const MINIO_PUBLIC_URL = process.env['MINIO_PUBLIC_URL'] || 'http://localhost:9000'
const MINIO_AVATAR_PREFIX = process.env['MINIO_AVATAR_PREFIX'] || 'avatars'

/**
 * Parses MinIO endpoint URL to extract host and port
 *
 * @param endpoint - Endpoint URL (with or without protocol)
 * @returns Object containing host and optional port
 *
 * @example
 * parseEndpoint('http://localhost:9000') // { host: 'localhost', port: 9000 }
 * parseEndpoint('minio.example.com') // { host: 'minio.example.com' }
 */
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

export const minioClient = new Minio.Client({
  endPoint: minioHost,
  port: minioPort || MINIO_PORT,
  useSSL: MINIO_USE_SSL,
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
  region: MINIO_REGION,
})

/**
 * Initializes MinIO bucket with public read policy
 *
 * @description Creates bucket if it doesn't exist and sets policy to allow public read access
 * for image serving. Should be called on application startup.
 *
 * @throws {Error} If bucket creation or policy setting fails
 *
 * @example
 * // In your app initialization
 * await initMinIO()
 */
export async function initMinIO(): Promise<void> {
  try {
    const bucketExists = await minioClient.bucketExists(MINIO_BUCKET_NAME)

    if (!bucketExists) {
      await minioClient.makeBucket(MINIO_BUCKET_NAME, MINIO_REGION)
      logger.info(`✅ MinIO bucket created: ${MINIO_BUCKET_NAME}`)

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
 * Uploads file to MinIO with unique filename generation
 *
 * @param file - File object from Elysia request (contains arrayBuffer, name, type)
 * @param folder - Folder prefix for organizing files (default: 'uploads')
 * @returns Public URL of the uploaded file
 *
 * @throws {Error} If upload fails
 *
 * @example
 * const url = await uploadToMinIO(file, 'avatars/user123')
 * // Returns: 'http://localhost:9000/api/avatars/user123/1234567890-abc123.jpg'
 */
export async function uploadToMinIO(file: File, folder: string = 'uploads'): Promise<string> {
  try {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 10)
    const extension = file.name.split('.').pop() || 'jpg'
    const filename = `${timestamp}-${randomString}.${extension}`
    const objectName = `${folder}/${filename}`

    const buffer = Buffer.from(await file.arrayBuffer())

    await minioClient.putObject(MINIO_BUCKET_NAME, objectName, buffer, buffer.length, {
      'Content-Type': file.type || 'application/octet-stream',
    })

    const publicUrl = `${MINIO_PUBLIC_URL}/${MINIO_BUCKET_NAME}/${objectName}`
    logger.info(`✅ File uploaded to MinIO: ${publicUrl}`)

    return publicUrl
  } catch (error) {
    logger.error({ err: error }, '❌ Failed to upload to MinIO')
    throw new Error('Failed to upload file')
  }
}

/**
 * Uploads user avatar to dedicated folder
 *
 * @param file - Avatar image file
 * @param userId - User ID for folder organization
 * @returns Public URL of uploaded avatar
 *
 * @example
 * const avatarUrl = await uploadAvatar(file, 'user-uuid-123')
 * // Uploads to: avatars/user-uuid-123/{timestamp}-{random}.{ext}
 */
export async function uploadAvatar(file: File, userId: string): Promise<string> {
  const folder = `${MINIO_AVATAR_PREFIX}/${userId}`
  return uploadToMinIO(file, folder)
}

/**
 * Uploads product image to store-specific folder
 *
 * @param file - Product image file
 * @param storeId - Store ID for folder organization
 * @returns Public URL of uploaded product image
 *
 * @example
 * const imageUrl = await uploadProductImage(file, 'store-123')
 * // Uploads to: products/store-123/{timestamp}-{random}.{ext}
 */
export async function uploadProductImage(file: File, storeId: string): Promise<string> {
  const folder = `products/${storeId}`
  return uploadToMinIO(file, folder)
}

/**
 * Deletes file from MinIO by parsing URL to extract object name
 *
 * @param objectUrl - Full public URL of the object to delete
 * @returns True if deletion succeeds, false if URL is invalid or deletion fails
 *
 * @example
 * const deleted = await deleteFromMinIO('http://localhost:9000/api/avatars/user123/file.jpg')
 * // Extracts 'avatars/user123/file.jpg' and deletes it
 */
export async function deleteFromMinIO(objectUrl: string): Promise<boolean> {
  try {
    const urlPattern = new RegExp(`${MINIO_PUBLIC_URL}/${MINIO_BUCKET_NAME}/(.+)`)
    const match = objectUrl.match(urlPattern)

    if (!match || !match[1]) {
      logger.warn(`⚠️ Invalid MinIO URL format: ${objectUrl}`)
      return false
    }

    const objectName = match[1]

    await minioClient.removeObject(MINIO_BUCKET_NAME, objectName)
    logger.info(`✅ File deleted from MinIO: ${objectName}`)

    return true
  } catch (error) {
    logger.error({ err: error }, '❌ Failed to delete from MinIO')
    return false
  }
}

/**
 * Generates presigned URL for temporary file access
 *
 * @param objectName - Object path within bucket (e.g., 'avatars/user123/file.jpg')
 * @param expirySeconds - URL expiration time in seconds (default: 604800 = 7 days)
 * @returns Presigned URL with temporary access token
 *
 * @throws {Error} If URL generation fails
 *
 * @example
 * const url = await getPresignedUrl('avatars/user123/file.jpg', 3600) // 1 hour
 */
export async function getPresignedUrl(
  objectName: string,
  expirySeconds: number = 7 * 24 * 60 * 60
): Promise<string> {
  try {
    return await minioClient.presignedGetObject(MINIO_BUCKET_NAME, objectName, expirySeconds)
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
