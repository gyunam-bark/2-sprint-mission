import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Notice } from './notice.entity';

@Injectable()
export class NoticesService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepo: Repository<Notice>,
  ) {}

  async create(title: string, content: string) {
    const notice = this.noticeRepo.create({ title, content });
    return this.noticeRepo.save(notice);
  }

  async findAll() {
    return this.noticeRepo.find({
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: number) {
    const notice = await this.noticeRepo.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!notice) throw new NotFoundException('Notice not found');
    return notice;
  }

  async update(id: number, title: string, content: string) {
    const notice = await this.findById(id);
    notice.title = title;
    notice.content = content;
    return this.noticeRepo.save(notice);
  }

  async remove(id: number) {
    const notice = await this.findById(id);
    await this.noticeRepo.softRemove(notice);
    return { success: true };
  }
}
