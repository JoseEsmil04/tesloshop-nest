import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { MessagesWsDto } from './dto/messages-ws.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/strategies/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  private server: Server;

  private logger = new Logger('SocketGateway')

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) {}

  async handleConnection(socket: Socket) {
    const token = socket.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(socket, payload.id);
    } catch (error) {
      socket.disconnect()
      return;
    }
    // console.log({ payload })
    
    this.logger.log(`Cliente Conectado: ${socket.id}`);

    this.server.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }
  
  handleDisconnect(socket: Socket) {
    this.logger.log(`Cliente Desconectado: ${socket.id}`);
    this.messagesWsService.removeClient(socket.id);

    this.server.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(
    @MessageBody() payload: MessagesWsDto,
    @ConnectedSocket() client: Socket
  ) {

    //! Emite solo al propio cliente
    // client.emit('message-server', {
    //   fullName: 'EsmilYO',
    //   message: payload.message || 'No Message!'
    // })

    //! Emitir a todos, menos el cliente inicial
    // client.broadcast.emit('message-server', {
    //   fullName: 'EsmilYO',
    //   message: payload.message || 'No Message!'
    // })

    //! a todos los clientes con WebSocketServer
    this.server.emit('message-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'No Message!'
    })
  }
}
