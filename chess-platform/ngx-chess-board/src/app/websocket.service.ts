// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { io, Socket } from 'socket.io-client';

// @Injectable({
//   providedIn: 'root'
// })
// export class WebsocketService {

//   private socket: Socket;
//   private url = 'http://localhost:3000'; // your server local path

//   constructor() {
//     this.socket = io(this.url, {transports: ['websocket', 'polling', 'flashsocket']});
//   }
//   sendMessage(data): void {
//     this.socket.emit('move', data);
//   }

//   getMessage(): Observable<any> {
//     return new Observable<{message: any}>(observer => {
//       this.socket.on('move', (data) => {
//         observer.next(data);
//       });

//       return () => {
//         this.socket.disconnect();
//       }
//     });
//   }

// }
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { io, Socket } from 'socket.io-client';
// import { Chess } from 'chess.js'
// @Injectable({
//   providedIn: 'root'
// })
// export class WebsocketService {

//   private socket: Socket;
//   private url = 'http://localhost:3000'; // your server local path
//   public Chess : Chess;

//   constructor() {
//     this.socket = io(this.url, {transports: ['websocket', 'polling', 'flashsocket']});
//     this.Chess = new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
//   }
//   sendMessage(data): void {
//     this.socket.emit('move', data);
//     this.Chess.move(data.move);
//   }

//   getMessage(): Observable<any> {
//     return new Observable<{message: any}>(observer => {
//       this.socket.on('move', (data) => {
//         observer.next(data);
//         this.Chess.move(data.move);
//       });
//   getpgn():String{
//     return this.Chess.pgn;
//   }
//       return () => {
//         this.socket.disconnect();
//       }
//     });
//   }

// }
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Chess } from 'chess.js';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket: Socket;
  private url = 'http://localhost:3000'; // your server local path
  public chess: Chess;
  public pgn: string;
  constructor() {
    this.socket = io(this.url, { transports: ['websocket', 'polling', 'flashsocket'] });
    this.chess = new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  }

  sendMessage(data): void {
    this.socket.emit('move', data);
    this.chess.move(data.move.move);
    let aa =this.chess.pgn();
    console.log(aa);
    if (this.chess.isCheckmate()) {
      this.pgn=this.chess.pgn();
    }
    if (this.chess.isStalemate()) {
      this.pgn=this.chess.pgn();
    }
  }

  getMessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('move', (data) => {
        observer.next(data);
        this.chess.move(data.move.move);
        if (this.chess.isCheckmate()) {
          this.pgn=this.chess.pgn();
        }
        if (this.chess.isStalemate()) {
          this.pgn=this.chess.pgn();
        }
      });
  
      // Provide logic for unsubscribing from the observable
      return () => {
        // Clean up socket event listeners if needed
      };
    });
  }
  

  getPGN(): string {
    return this.chess.pgn();
  }
}
