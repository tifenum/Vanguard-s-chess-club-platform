//     import { Component, ViewChild,OnInit, AfterViewInit } from '@angular/core';
//     import { ChessService } from '../chess1.service';
//     import { NgxChessBoardModule } from 'ngx-chess-board';
//     import { WebsocketService } from '../websocket.service';
//     import { HttpClient } from '@angular/common/http';
//     import { CommonModule } from '@angular/common'; // Import CommonModule
//     import {
//         MoveChange,
//         NgxChessBoardComponent,
//         PieceIconInput
//     } from 'ngx-chess-board';
//     import {
//         ColorInput,
//         PieceTypeInput
//     } from 'ngx-chess-board';
//     import { FenComponent } from '../components/fen/fen.component';
// import { ClockComponent } from '../clock/clock.component';
// import { Chess } from 'chess.js';

//     @Component({
//     selector: 'app-playwithfriends',
//     standalone: true,
//     imports: [NgxChessBoardModule,ClockComponent,CommonModule],
//     templateUrl: './playwithfriends.component.html',
//     styleUrl: './playwithfriends.component.scss'
//     })

//     export class  PlaywithfriendsComponent implements OnInit,AfterViewInit{
//         public ssforces :string = ' 1/2-1/2';
//         public chess : Chess;
//         public gameOver : boolean = false;
//         constructor(private chessService: ChessService, private WebsocketService: WebsocketService,private http: HttpClient) {}
//         ngAfterViewInit(): void {
//             throw new Error('Method not implemented.');
//         }
//         ngOnInit(): void {
//             this.WebsocketService.getMessage().subscribe((moveData: any) => {
//                 console.log('Received move data:', moveData.move.fen);
//                 // Handle the received move data here
//                 this.chess = new Chess(moveData.move.fen);
//                 if(this.chess.isCheckmate() || this.chess.isDraw()){
//                     this.gameOver= true;
//                 }
//                 this.boardManager.setFEN(moveData.move.fen);
//                 this.TimeClock(moveData.move);
//               });
//           }
        

//         showPlayWithFriends: boolean = false;

//         togglePlayWithFriends() {
//             this.showPlayWithFriends = !this.showPlayWithFriends;
//         }
//         @ViewChild('board')
//         boardManager: NgxChessBoardComponent;

//         @ViewChild('fenManager') fenManager: FenComponent;
//         public fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
//         private currentStateIndex: number;
//         manualMove = 'd2d4';
//         icons: PieceIconInput = {
//             blackBishopUrl: '',
//             blackKingUrl: '',
//             blackKnightUrl: '',
//             blackPawnUrl: '',
//             blackQueenUrl: '',
//             blackRookUrl: '',
//             whiteBishopUrl: '',
//             whiteKingUrl: '',
//             whiteKnightUrl: '',
//             whitePawnUrl: '',
//             whiteQueenUrl: '',
//             whiteRookUrl: ''
//         };

//         public darkTileColor = '#484136'; // Dark brown color
//         public lightTileColor = '#f0d9b5'; // Light brown color
//         public size = 1000;
//         public dragDisabled = false;
//         public drawDisabled = false;
//         public lightDisabled = false;
//         public darkDisabled = false;
//         public freeMode = false;
//         public addPieceCoords: string = 'a4';
//         public selectedPiece = '1';
//         public selectedColor = '1';
//         public pgn: string = '';
//         public indexTime: number =0;
//         public messageTableMove : string ="";

//         public saveGame(Move: MoveChange): void {
//             const gameData = {
//                 move: Move, // Example value for fen
//             };
            
//             this.chessService.saveGame(gameData).subscribe(
//                 response => {
//                     console.log('Game saved successfully', response);
//                 },
//                 error => {
//                     console.error('Error saving game', error);
//                 }
//             );
//         }
//         public analyzeGame(): void {
//             // Add your logic here for analyzing the game
//             console.log(this.WebsocketService.getPGN());
            
//             this.http.post<any>('http://localhost:3000/api/pgn', { pgn: this.correctPGN(this.WebsocketService.getPGN())}).subscribe(
//               response => {
//                 console.log('PGN parsing response:', response);
//                 // Handle response from the server as needed
//                 window.location.href = 'http://localhost:4000';
    
//               },
//               error => {
//                 console.error('Error parsing PGN:', error);
//                 // Handle error
//               }
//             );
//         }
//         public correctPGN(pgn) {
//             // Remove the trailing '#' and replace it with a space
//             pgn = pgn.replace(/#$/, ' ');
        
//             // Append the desired string
//             pgn += this.ssforces;
        
//             return pgn;
//         }
//         public reset(): void {
//             alert('Resetting board');
//             this.boardManager.reset();
//             this.fen = this.boardManager.getFEN();
//             this.freeMode = false;
//         }

//         public reverse(): void {
//             this.boardManager.reverse();
//         }

//         public undo(): void {
//             this.boardManager.undo();
//             this.fen = this.boardManager.getFEN();
//             this.pgn = this.boardManager.getPGN();
//         }

//         public setFen(): void {
//             if (this.fen) {
//                 this.boardManager.setFEN(this.fen);
//             }
//         }

//         public moveCallback(move: MoveChange): void {
//             this.fen = this.boardManager.getFEN();
//             this.pgn = this.boardManager.getPGN();
//             console.log(move);
//             this.chess = new Chess(move.fen);
//             if(this.chess.isCheckmate() || this.chess.isDraw()){
//                 this.gameOver= true;
//             }
//             this.WebsocketService.sendMessage({move});
//             this.saveGame(move);
//               //dali clock 
//            this.TimeClock(move);
//         }
        
//         public moveManual(): void {
//             this.boardManager.move(this.manualMove);
//         }

//         getFEN() {
//             let fen = this.boardManager.getFEN();
//             console.log(fen);
//             alert(fen);
//         }

//         showMoveHistory() {
//             alert(JSON.stringify(this.boardManager.getMoveHistory()));
//         }

//         switchDrag() {
//             this.dragDisabled = !this.dragDisabled;
//         }

//         switchDraw() {
//             this.drawDisabled = !this.drawDisabled;
//         }

//         switchDarkDisabled() {
//             this.darkDisabled = !this.darkDisabled;
//         }

//         switchLightDisabled() {
//             this.lightDisabled = !this.lightDisabled;
//         }

//         switchFreeMode() {
//             this.freeMode = !this.freeMode;
//         }

//         addPiece() {
//             let piece = this.resolveSelectedPiece();
//             let color = this.resolveSelectedColor();
//             this.boardManager.addPiece(piece, color, this.addPieceCoords);
//         }

//         private resolveSelectedPiece(): PieceTypeInput {
//             switch (this.selectedPiece) {
//                 case '1':
//                     return PieceTypeInput.QUEEN;
//                 case '2':
//                     return PieceTypeInput.KING;
//                 case '3':
//                     return PieceTypeInput.ROOK;
//                 case '4':
//                     return PieceTypeInput.BISHOP;
//                 case '5':
//                     return PieceTypeInput.KNIGHT;
//                 case '6':
//                     return PieceTypeInput.PAWN;
//             }
//         }

//         private resolveSelectedColor(): ColorInput {
//             switch (this.selectedColor) {
//                 case '1':
//                     return ColorInput.LIGHT;
//                 case '2':
//                     return ColorInput.DARK;
//             }
//         }

//         public setPgn() {
//             this.boardManager.setPGN(this.pgn);
//         }

//         loadDefaultPgn() {
//             this.pgn = '1. c4 b5 2. cxb5 c6 3. bxc6 Nxc6 4. Qa4 a6\n' +
//                 '5. Qxa6 Rb8 6. b3 d5 7. f4 e5 8. fxe5 f6\n' +
//                 '9. exf6 gxf6 10. Nf3 f5 11. Ne5 Bb7 12. Qxb7 Na7\n' +
//                 '13. Qxb8 Qxb8 14. Kf2 Kd8 15. Nc3 Be7 16. Nc4 Bf6\n' +
//                 '17. Nb6 Nb5 18. Nbxd5 f4 19. Ne4 Na7 20. Nexf6';
//             this.setPgn();
//         }

//         getPGN() {
//             alert(this.boardManager.getPGN());
//         }



// //dali clock 
//  clockOpenedPlay1: boolean = false;
//  clockOpenedPlay2: boolean = true;
// toggleClock(i :number ): void {
//     if (i===1){
//         this.clockOpenedPlay1 = !this.clockOpenedPlay1;
//         this.clockOpenedPlay2 = !this.clockOpenedPlay2;
//     }
//     else {
//         this.clockOpenedPlay2 = !this.clockOpenedPlay2;
//         this.clockOpenedPlay1 = !this.clockOpenedPlay1;
//     }
// }
// public TimeClock(move : any){
//     this.indexTime++;
//     if (this.indexTime%2==0){
//         this.toggleClock(1);
//     }
//     else {
//         this.toggleClock(1);
//     }
//     this.messageTableMove+=`    
//     <th scope="row">  ${this.indexTime}</th> 
//     <td>${move.move}</td>
//     <td>${move.piece}</td>

//   </tr>`
//   document.getElementById('tableMove').innerHTML = this.messageTableMove;
// }
// }
import { Component, ViewChild,OnInit, AfterViewInit } from '@angular/core';
import { ChessService } from '../chess1.service';
import { NgxChessBoardModule } from 'ngx-chess-board';
import { WebsocketService } from '../websocket.service';
import { ActivatedRoute } from '@angular/router';
import { InvitationService} from '../invitation.service' ;
import { UsersService } from '../users.service';
import { CommonModule } from '@angular/common'; // Import CommonModule

import {
    MoveChange,
    NgxChessBoardComponent,
    PieceIconInput
} from 'ngx-chess-board';
import {
    ColorInput,
    PieceTypeInput
} from 'ngx-chess-board';
import { FenComponent } from '../components/fen/fen.component';
import { ClockComponent } from '../clock/clock.component';
import { HttpClient } from '@angular/common/http';
import { Chess } from 'chess.js';

@Component({
selector: 'app-playwithfriends',
standalone: true,
imports: [NgxChessBoardModule,ClockComponent,CommonModule],
templateUrl: './playwithfriends.component.html',
styleUrl: './playwithfriends.component.scss'
})

export class  PlaywithfriendsComponent implements OnInit{
    public pgn: string = '';
    public ssforces :string = ' 1/2-1/2';
    public chess : Chess;
    public gameOver : boolean = false;
    constructor(private route: ActivatedRoute ,private http :HttpClient, private chessService: ChessService, private WebsocketService: WebsocketService , private invitationService: InvitationService, private userService: UsersService) {}
    ngAfterViewInit(): void {
        throw new Error('Method not implemented.');
    }

    public idinv:string;
    public idplayer:string
    public invetation: any[]
    public user
    ngOnInit(): void {
        this.userService.getUserData().subscribe(
            (userData: any) => {
              this.user = userData;
              console.log("user",userData)
            },
            (error) => {
              console.error('Error fetching user data:', error);
            }
          );
        this.route.queryParams.subscribe(params => {
            this.idinv = params['idinv'];
            this.idplayer=params['idplayer']
         
            // Faire des opérations avec l'ID reçue
          });
          this.getInvitationsbyid();
        
        this.WebsocketService.getMessage().subscribe((moveData: any) => {
            console.log('Received move data:', moveData.move.fen);

            this.boardManager.setFEN(moveData.move.fen);
            const parts =moveData.move.fen.split(' ');
            this.chess = new Chess(moveData.move.fen);
            if(this.chess.isCheckmate() || this.chess.isDraw()){
                this.gameOver= true;
            }
            this.boardManager.setFEN(moveData.move.fen);
            console.log("playersssssssssssssssssss",parts[1])
            if (parts[1]==='b'){
                this.boardManager.reverse()
            }
            this.TimeClock(moveData.move);
          });


      
      }
    

    showPlayWithFriends: boolean = false;
    public analyzeGame(): void {
        // Add your logic here for analyzing the game
        console.log(this.WebsocketService.getPGN());
        
        this.http.post<any>('http://localhost:3000/api/pgn', { pgn: this.correctPGN(this.WebsocketService.getPGN())}).subscribe(
          response => {
            console.log('PGN parsing response:', response);
            // Handle response from the server as needed
            window.location.href = 'http://localhost:4000';

          },
          error => {
            console.error('Error parsing PGN:', error);
            // Handle error
          }
        );
    }
    public correctPGN(pgn) {
        // Remove the trailing '#' and replace it with a space
        pgn = pgn.replace(/#$/, ' ');
    
        // Append the desired string
        pgn += this.ssforces;
    
        return pgn;
    }
    togglePlayWithFriends() {
        this.showPlayWithFriends = !this.showPlayWithFriends;
    }
    @ViewChild('board')
    boardManager: NgxChessBoardComponent;

    @ViewChild('fenManager') fenManager: FenComponent;
    public fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    private currentStateIndex: number;
    manualMove = 'd2d4';
    icons: PieceIconInput = {
        blackBishopUrl: '',
        blackKingUrl: '',
        blackKnightUrl: '',
        blackPawnUrl: '',
        blackQueenUrl: '',
        blackRookUrl: '',
        whiteBishopUrl: '',
        whiteKingUrl: '',
        whiteKnightUrl: '',
        whitePawnUrl: '',
        whiteQueenUrl: '',
        whiteRookUrl: ''
    };

    public darkTileColor = '#484136'; // Dark brown color
    public lightTileColor = '#f0d9b5'; // Light brown color
    public size = 600;
    public dragDisabled = false;
    public drawDisabled = false;
    public lightDisabled = false;
    public darkDisabled = false;
    public freeMode = false;
    public addPieceCoords: string = 'a4';
    public selectedPiece = '1';
    public selectedColor = '1';
    public indexTime: number =0;
    public messageTableMove : string ="";

    public saveGame(Move: MoveChange): void {
        const gameData = {
            move: Move, // Example value for fen
        };
        
        this.chessService.saveGame(gameData).subscribe(
            response => {
                console.log('Game saved successfully', response);
            },
            error => {
                console.error('Error saving game', error);
            }
        );
    }
    

    public reset(): void {
        alert('Resetting board');
        this.boardManager.reset();
        this.fen = this.boardManager.getFEN();
        this.freeMode = false;
    }

    public reverse(): void {
        this.boardManager.reverse();
    }

    public undo(): void {
        this.boardManager.undo();
        this.fen = this.boardManager.getFEN();
        this.pgn = this.boardManager.getPGN();
    }

    public setFen(): void {
        if (this.fen) {
            
        
            this.boardManager.setFEN(this.fen);
         
        }
    }

    public moveCallback(move: MoveChange): void {
        this.fen = this.boardManager.getFEN();
        this.pgn = this.boardManager.getPGN();
        console.log(move);
        this.WebsocketService.sendMessage({move});
        this.chess = new Chess(move.fen);
        if(this.chess.isCheckmate() || this.chess.isDraw()){
            this.gameOver= true;
        }
          //dali clock 
       this.TimeClock(move);
    }
    
    public moveManual(): void {
        this.boardManager.move(this.manualMove);
    }

    getFEN() {
        let fen = this.boardManager.getFEN();
        console.log(fen);
        alert(fen);
    }

    showMoveHistory() {
        alert(JSON.stringify(this.boardManager.getMoveHistory()));
    }

    switchDrag() {
        this.dragDisabled = !this.dragDisabled;
    }

    switchDraw() {
        this.drawDisabled = !this.drawDisabled;
    }

    switchDarkDisabled() {
        this.darkDisabled = !this.darkDisabled;
    }

    switchLightDisabled() {
        this.lightDisabled = !this.lightDisabled;
    }

    switchFreeMode() {
        this.freeMode = !this.freeMode;
    }

    addPiece() {
        let piece = this.resolveSelectedPiece();
        let color = this.resolveSelectedColor();
        this.boardManager.addPiece(piece, color, this.addPieceCoords);
    }

    private resolveSelectedPiece(): PieceTypeInput {
        switch (this.selectedPiece) {
            case '1':
                return PieceTypeInput.QUEEN;
            case '2':
                return PieceTypeInput.KING;
            case '3':
                return PieceTypeInput.ROOK;
            case '4':
                return PieceTypeInput.BISHOP;
            case '5':
                return PieceTypeInput.KNIGHT;
            case '6':
                return PieceTypeInput.PAWN;
        }
    }

    private resolveSelectedColor(): ColorInput {
        switch (this.selectedColor) {
            case '1':
                return ColorInput.LIGHT;
            case '2':
                return ColorInput.DARK;
        }
    }

    public setPgn() {
        this.boardManager.setPGN(this.pgn);
    }

    loadDefaultPgn() {
        this.pgn = '1. c4 b5 2. cxb5 c6 3. bxc6 Nxc6 4. Qa4 a6\n' +
            '5. Qxa6 Rb8 6. b3 d5 7. f4 e5 8. fxe5 f6\n' +
            '9. exf6 gxf6 10. Nf3 f5 11. Ne5 Bb7 12. Qxb7 Na7\n' +
            '13. Qxb8 Qxb8 14. Kf2 Kd8 15. Nc3 Be7 16. Nc4 Bf6\n' +
            '17. Nb6 Nb5 18. Nbxd5 f4 19. Ne4 Na7 20. Nexf6';
        this.setPgn();
    }

    getPGN() {
        alert(this.boardManager.getPGN());
    }



//dali clock 
clockOpenedPlay1: boolean = false;
clockOpenedPlay2: boolean = true;
toggleClock(i :number ): void {
if (i===1){
    this.clockOpenedPlay1 = !this.clockOpenedPlay1;
    this.clockOpenedPlay2 = !this.clockOpenedPlay2;
}
else {
    this.clockOpenedPlay2 = !this.clockOpenedPlay2;
    this.clockOpenedPlay1 = !this.clockOpenedPlay1;
}
}
public TimeClock(move : any){
this.indexTime++;
if (this.indexTime%2==0){
    this.toggleClock(1);
}
else {
    this.toggleClock(1);
}
this.messageTableMove+=`    
<th scope="row">  ${this.indexTime}</th> 
<td>${move.move}</td>
<td>${move.piece}</td>

</tr>`
document.getElementById('tableMove').innerHTML = this.messageTableMove;
}

getInvitationsbyid() {
this.invitationService.getInvitationsByid(this.idinv).subscribe(
  (data) => {
    this.invetation = data;
    console.log('Invitations récupérées :', this.invetation);
    if (this.invetation[0].from===this.idplayer ){
        this.darkDisabled=true;
    }else {
        this.lightDisabled=true;
        this.boardManager.reverse()
    }
  },
  (error) => {
    console.error('Erreur lors de la récupération des invitations :', error);
  }
);
}

}
