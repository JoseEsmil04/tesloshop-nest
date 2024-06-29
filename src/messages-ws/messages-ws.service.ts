import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/auth.entity';
import { Repository } from 'typeorm';

interface ConnectedClients {
  [id: string]: {
    socket: Socket,
    user: User
  }
}

@Injectable()
export class MessagesWsService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  private connectedClients: ConnectedClients = {}

  async registerClient(socket: Socket, userId: string) {

    const user = await this.userRepository.findOneBy({ id: userId });
    
    if(!user) throw new Error('User not Found!');
    if(!user.isActive) throw new Error('User not Active!');
        
    this.checkUserConnection(user);

    return this.connectedClients[socket.id] = {
      socket: socket,
      user: user
    };
  }

  removeClient(socketId: string) {
    delete this.connectedClients[socketId];
  }

  getConnectedClients(): string[] {
    return Object.keys(this.connectedClients);
  }

  getUserFullName(socketId: string) {
    return this.connectedClients[socketId].user.fullName;
  }

  private checkUserConnection(user: User) {

    for(const clientId of this.getConnectedClients()) {
      const connectedClient = this.connectedClients[clientId];

      if(connectedClient.user.id === user.id) {
        connectedClient.socket.disconnect()
        break;
      }
    }
  }
}
