import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private minioClient: Minio.Client;
  private bucketName = 'portfolio';

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT', 'localhost'),
      port: this.configService.get<number>('MINIO_PORT', 9000),
      useSSL: false,
      accessKey: this.configService.get<string>(
        'MINIO_ACCESS_KEY',
        'minioadmin',
      ),
      secretKey: this.configService.get<string>(
        'MINIO_SECRET_KEY',
        'minioadmin',
      ),
    });

    await this.ensureBucketExists();
  }

  private async ensureBucketExists(): Promise<void> {
    const exists = await this.minioClient.bucketExists(this.bucketName);
    if (!exists) {
      await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
      console.log(`Bucket ${this.bucketName} created successfully`);
    }
  }

  async uploadFile(
    fileName: string,
    fileBuffer: Buffer,
    contentType: string,
  ): Promise<string> {
    const objectName = `portfolio/${Date.now()}-${fileName}`;

    await this.minioClient.putObject(
      this.bucketName,
      objectName,
      fileBuffer,
      fileBuffer.length,
      { 'Content-Type': contentType },
    );

    return objectName;
  }

  async getFileUrl(
    objectName: string,
    expiry: number = 7 * 24 * 60 * 60,
  ): Promise<string> {
    return await this.minioClient.presignedGetObject(
      this.bucketName,
      objectName,
      expiry,
    );
  }

  async deleteFile(objectName: string): Promise<void> {
    await this.minioClient.removeObject(this.bucketName, objectName);
  }

  async listFiles(): Promise<string[]> {
    const objectsList: string[] = [];
    const stream = this.minioClient.listObjects(
      this.bucketName,
      'portfolio/',
      true,
    );

    return new Promise((resolve, reject) => {
      stream.on('data', (obj) => {
        objectsList.push(obj.name);
      });

      stream.on('error', reject);
      stream.on('end', () => resolve(objectsList));
    });
  }
}
