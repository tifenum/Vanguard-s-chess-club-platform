import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class Websocket2Service {

  private socket: Socket;
  private url = 'http://localhost:3000';
  private subject: Subject<any>;

  constructor() { 
    this.socket = io(this.url, { transports: ['websocket', 'polling', 'flashsocket'] });
    // this.socket = new WebSocket('ws://localhost:3000');// URL de votre serveur WebSocket
    // this.subject = new Subject<any>();

    // this.socket.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   this.subject.next(data);
    // };
  }
  sendMessage(data): void {
    this.socket.emit('invitation', data);
    console.log("websocket2", data);

  }
  getMessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('invitation', (data) => {
        observer.next(data);
        console.log("websocket2 recive:",data);
        
      });
      return () => {
      };
    });
}
}