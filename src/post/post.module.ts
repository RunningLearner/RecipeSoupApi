import { Module } from '@nestjs/common';
import { PostDietService } from './post-diet.service';
import { PostController } from './post.controller';
import { PostServiceFactory } from './post-service.factory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { PostDiet } from './entities/post-diet.entity';
import { User } from '../user/entities/user.entity';
import { CommentDiet } from '../comment/entities/comment-diet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostDiet, Menu, User, CommentDiet])],
  controllers: [PostController],
  providers: [PostServiceFactory, PostDietService],
})
export class PostModule {}
