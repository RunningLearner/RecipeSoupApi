import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostFree } from '../post-free/entities/post-free.entity';
import { User } from '../user/entities/user.entity';
import { CommentReturnDto } from './dto/comment-return.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDietDto } from './dto/update-comment.dto';
import { CommentFree } from './entities/comment-free.entity';

@Injectable()
export class CommentFreeService {
  constructor(
    @InjectRepository(CommentFree)
    private commentFreeRepository: Repository<CommentFree>,
    @InjectRepository(PostFree)
    private postFreeRepository: Repository<PostFree>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const newComment = new CommentFree();
    newComment.content = createCommentDto.content;

    const foundUser = await this.userRepository.findOne({
      where: { email: createCommentDto.userEmail },
    });

    newComment.user = foundUser;

    const foundPost = await this.postFreeRepository.findOne({
      where: { id: +createCommentDto.postId },
    });

    newComment.post = foundPost;

    await this.commentFreeRepository.save(newComment);

    return newComment;
  }

  async findAll() {
    const foundComments = await this.commentFreeRepository.find();
    return foundComments.map((foundComment) =>
      CommentReturnDto.fromEntity(foundComment),
    );
  }

  async findOne(id: number) {
    const foundComment = await this.commentFreeRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!foundComment) {
      throw new NotFoundException(`Comment with ID ${id} not found.`);
    }

    return CommentReturnDto.fromEntity(foundComment);
  }

  async update(id: number, updateCommentDto: UpdateCommentDietDto) {
    const foundComment = await this.commentFreeRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!foundComment) {
      throw new NotFoundException(`Comment with ID ${id} not found.`);
    }

    if (foundComment.user.email !== updateCommentDto.userEmail) {
      throw new UnauthorizedException('Unauthorized to edit this comment.');
    }

    foundComment.content = updateCommentDto.content;

    await this.commentFreeRepository.save(foundComment);

    return foundComment;
  }

  async remove(id: number) {
    const foundComment = await this.commentFreeRepository.findOne({
      where: { id },
    });

    if (!foundComment) {
      throw new NotFoundException(`Comment with ID ${id} not found.`);
    }

    await this.commentFreeRepository.remove(foundComment);

    return `Comment with ID ${id} has been deleted.`;
  }
}