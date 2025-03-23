import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class CommentService {
  private readonly client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'localhost', port: 4002 },
    });
  }

  create(createCommentDto: CreateCommentDto) {
    return this.client.send('createComment', createCommentDto);
  }

  findByPost(postId: string) {
    return this.client.send('comment.findByPost', postId);
  }

  remove(id: string) {
    return this.client.send('removeComment', id);
  }
}
