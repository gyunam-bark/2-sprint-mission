import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Resource, ResourceType } from './resource.entity';
import { User } from '../users/user.entity';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResourcesService {
  private bucket: string;

  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepo: Repository<Resource>,
    @Inject('S3_CLIENT') private readonly s3: S3Client,
    private readonly configService: ConfigService,
  ) {
    this.bucket = this.configService.get<string>('AWS_S3_BUCKET', 'nas-bucket');
  }

  async createFolder(name: string, parentId: number | null, owner: User) {
    const parent = parentId
      ? await this.resourceRepo.findOne({ where: { id: Number(parentId) } })
      : null;

    const folder = this.resourceRepo.create({
      type: ResourceType.FOLDER,
      name,
      parent,
      owner,
    });

    return this.resourceRepo.save(folder);
  }

  async getResource(id: number) {
    const resource = await this.resourceRepo.findOne({
      where: { id: Number(id) },
      relations: ['parent', 'owner'],
    });

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    return resource;
  }

  async getDownloadUrl(id: number) {
    const resource = await this.getResource(id);

    if (resource.type !== ResourceType.FILE) {
      throw new NotFoundException('Download available only for files');
    }

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: resource.s3Key,
    });

    const downloadUrl = await getSignedUrl(this.s3, command, {
      expiresIn: 3600,
    });

    return { downloadUrl };
  }
  async createAndUploadFile(
    name: string,
    parentId: number | null,
    file: Express.Multer.File,
    owner: User,
  ) {
    const parent = parentId
      ? await this.resourceRepo.findOne({ where: { id: Number(parentId) } })
      : null;

    const s3Key = `${Date.now()}-${name}`;

    const resource = this.resourceRepo.create({
      type: ResourceType.FILE,
      name,
      parent,
      s3Key,
      owner,
      size: file.size,
      mimeType: file.mimetype,
    });

    const savedFile = await this.resourceRepo.save(resource);

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return { success: true, resource: savedFile };
  }

  async moveToTrash(id: number, user: User) {
    const resource = await this.resourceRepo.findOne({
      where: { id: Number(id), deletedAt: IsNull() },
      relations: ['owner'],
    });
    if (!resource) {
      throw new NotFoundException('Resource not found');
    }
    if (resource.owner.id !== user.id) {
      throw new ForbiddenException();
    }

    resource.deletedAt = new Date();
    return this.resourceRepo.save(resource);
  }

  async getTrash(user: User) {
    return this.resourceRepo.find({
      where: {
        owner: { id: user.id },
        deletedAt: Not(IsNull()),
      },
      relations: ['owner', 'parent'],
      withDeleted: true,
    });
  }

  async restore(id: number, user: User) {
    const resource = await this.resourceRepo.findOne({
      where: { id: Number(id) },
      relations: ['owner'],
      withDeleted: true,
    });
    if (!resource) {
      throw new NotFoundException('Resource not found');
    }
    if (resource.owner.id !== user.id) {
      throw new ForbiddenException();
    }
    if (!resource.deletedAt) {
      throw new BadRequestException('Resource is not in trash');
    }

    resource.deletedAt = null;
    return this.resourceRepo.save(resource);
  }

  async permanentlyDelete(id: number, user: User) {
    const resource = await this.resourceRepo.findOne({
      where: { id: Number(id) },
      relations: ['owner'],
      withDeleted: true,
    });
    if (!resource) {
      throw new NotFoundException('Resource not found');
    }
    if (resource.owner.id !== user.id) {
      throw new ForbiddenException();
    }
    if (!resource.deletedAt) {
      throw new BadRequestException(
        'Resource must be in trash to delete permanently',
      );
    }

    if (resource.type === ResourceType.FILE && resource.s3Key) {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: resource.s3Key,
        }),
      );
    }

    await this.resourceRepo.remove(resource);
    return { success: true };
  }
}
