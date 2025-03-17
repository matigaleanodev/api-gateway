import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  private readonly client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'localhost', port: 4001 },
    });
  }

  create(createPostDto: CreatePostDto) {
    return this.client.send('createPost', createPostDto);
  }

  findAll() {
    return this.client.send('findAllPost', {});
  }

  findOne(id: string) {
    return this.client.send('findOnePost', id);
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return this.client.send('updatePost', { id, updatePostDto });
  }

  remove(id: string) {
    return this.client.send('removePost', id);
  }
}
