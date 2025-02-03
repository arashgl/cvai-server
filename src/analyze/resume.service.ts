import { CrudService, Resume } from '@lib/shared';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ResumeService extends CrudService<Resume> {
  constructor(
    @InjectRepository(Resume)
    repository: Repository<Resume>,
  ) {
    super(repository);
  }
}
