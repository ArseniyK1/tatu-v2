import { Injectable } from '@nestjs/common';
import { MinioService } from '../common/minio/minio.service';

export interface PortfolioItem {
  id: string;
  fileName: string;
  originalName: string;
  url: string;
  uploadedAt: Date;
  category?: string;
}

@Injectable()
export class PortfolioService {
  private portfolioItems: PortfolioItem[] = [];

  constructor(private readonly minioService: MinioService) {}

  async uploadPortfolioImage(
    fileName: string,
    fileBuffer: Buffer,
    contentType: string,
    category?: string,
  ): Promise<PortfolioItem> {
    // Загружаем файл в MinIO
    const objectName = await this.minioService.uploadFile(
      fileName,
      fileBuffer,
      contentType,
    );

    // Получаем URL для доступа к файлу
    const url = await this.minioService.getFileUrl(objectName);

    // Создаем запись в локальном хранилище
    const portfolioItem: PortfolioItem = {
      id: Date.now().toString(),
      fileName: objectName,
      originalName: fileName,
      url,
      uploadedAt: new Date(),
      category,
    };

    this.portfolioItems.push(portfolioItem);
    return portfolioItem;
  }

  async getPortfolioItems(category?: string): Promise<PortfolioItem[]> {
    if (category) {
      return this.portfolioItems.filter((item) => item.category === category);
    }
    return this.portfolioItems;
  }

  async getPortfolioItem(id: string): Promise<PortfolioItem | undefined> {
    return this.portfolioItems.find((item) => item.id === id);
  }

  async deletePortfolioItem(id: string): Promise<boolean> {
    const itemIndex = this.portfolioItems.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      return false;
    }

    const item = this.portfolioItems[itemIndex];

    // Удаляем файл из MinIO
    await this.minioService.deleteFile(item.fileName);

    // Удаляем запись из локального хранилища
    this.portfolioItems.splice(itemIndex, 1);

    return true;
  }

  getPortfolioMessage(): string {
    const itemCount = this.portfolioItems.length;
    if (itemCount === 0) {
      return 'Портфолио пока пустое. Скоро здесь появятся мои работы! 🎨';
    }

    return `В моем портфолио ${itemCount} работ. Выберите категорию для просмотра:`;
  }

  getCategories(): string[] {
    const categories = [
      ...new Set(
        this.portfolioItems.map((item) => item.category).filter(Boolean),
      ),
    ];
    return categories;
  }
}
