// import { Component, OnInit } from '@angular/core';
// import { Socket } from 'ngx-socket-io';

// @Component({
//     selector: 'app-game',
//     templateUrl: './game.component.html',
//     styleUrls: ['./game.component.css']
// })
// export class GameComponent implements OnInit {
//     constructor(private socket: Socket) { }

//     ngOnInit(): void {
//         this.socket.on('move', (moveData) => {
//             // Update the game board based on the move received from the opponent
//         });
//     }
// }



// import { Component, ViewChild } from '@angular/core';
// import { Chess } from 'chess.js';
// import {
//     MoveChange,
//     NgxChessBoardComponent,
//     PieceIconInput
// } from 'ngx-chess-board';
// import {
//     ColorInput,
//     PieceTypeInput
// } from 'ngx-chess-board';
// import { FenComponent } from './components/fen/fen.component';

// @Component({
//     selector: 'app-root',
//     templateUrl: './app.component.html',
//     styleUrls: ['./app.component.scss'],
// })

// export class AppComponent {
    // chess: Chess;
    // constructor() {}
    // // private chessService: ChessService
    // showPlayWithFriends: boolean = false;
    // togglePlayWithFriends() {
    //     this.showPlayWithFriends = !this.showPlayWithFriends;
    // }
    // @ViewChild('board')
    // boardManager: NgxChessBoardComponent;

    // @ViewChild('fenManager') fenManager: FenComponent;
    // public fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    // private currentStateIndex: number;
    // manualMove = 'd2d4';
    // icons: PieceIconInput = {
    //     blackBishopUrl: '',
    //     blackKingUrl: '',
    //     blackKnightUrl: '',
    //     blackPawnUrl: '',
    //     blackQueenUrl: '',
    //     blackRookUrl: '',
    //     whiteBishopUrl: '',
    //     whiteKingUrl: '',
    //     whiteKnightUrl: '',
    //     whitePawnUrl: '',
    //     whiteQueenUrl: '',
    //     whiteRookUrl: ''
    // };

    // public darkTileColor = '#769557';
    // public lightTileColor = '#ebedd1';
    // public size = 400;
    // public dragDisabled = false;
    // public drawDisabled = false;
    // public lightDisabled = false;
    // public darkDisabled = false;
    // public freeMode = false;
    // public addPieceCoords: string = 'a4';
    // public selectedPiece = '1';
    // public selectedColor = '1';
    // public pgn: string = '';
    // // public saveGame(Move: MoveChange): void {
    // //     const gameData = {
    // //         move: Move, // Example value for fen
    // //     };
    
    // //     this.chessService.saveGame(gameData).subscribe(
    // //         response => {
    // //             console.log('Game saved successfully', response);
    // //         },
    // //         error => {
    // //             console.error('Error saving game', error);
    // //         }
    // //     );
    // // }
    
    // public reset(): void {
    //     alert('Resetting board');
    //     this.boardManager.reset();
    //     this.fen = this.boardManager.getFEN();
    //     this.freeMode = false;
    // }

    // public reverse(): void {
    //     this.boardManager.reverse();
    // }

    // public undo(): void {
    //     this.boardManager.undo();
    //     this.fen = this.boardManager.getFEN();
    //     this.pgn = this.boardManager.getPGN();
    // }

    // public setFen(): void {
    //     if (this.fen) {
    //         this.boardManager.setFEN(this.fen);
    //     }
    // }

    // public moveCallback(move: MoveChange): void {
    //     this.fen = this.boardManager.getFEN();
    //     this.pgn = this.boardManager.getPGN();
    //     this.chess=new Chess(move.fen);
    //     const legalMoves = this.chess.moves();
    //     console.log(legalMoves);
    //     console.log(move);
    // }

    // public moveManual(): void {
    //     this.boardManager.move(this.manualMove);
    // }

    // getFEN() {
    //     let fen = this.boardManager.getFEN();
    //     console.log(fen);
    //     alert(fen);
    // }

    // showMoveHistory() {
    //     alert(JSON.stringify(this.boardManager.getMoveHistory()));
    // }

    // switchDrag() {
    //     this.dragDisabled = !this.dragDisabled;
    // }

    // switchDraw() {
    //     this.drawDisabled = !this.drawDisabled;
    // }

    // switchDarkDisabled() {
    //     this.darkDisabled = !this.darkDisabled;
    // }

    // switchLightDisabled() {
    //     this.lightDisabled = !this.lightDisabled;
    // }

    // switchFreeMode() {
    //     this.freeMode = !this.freeMode;
    // }

    // addPiece() {
    //     let piece = this.resolveSelectedPiece();
    //     let color = this.resolveSelectedColor();
    //     this.boardManager.addPiece(piece, color, this.addPieceCoords);
    // }

    // private resolveSelectedPiece(): PieceTypeInput {
    //     switch (this.selectedPiece) {
    //         case '1':
    //             return PieceTypeInput.QUEEN;
    //         case '2':
    //             return PieceTypeInput.KING;
    //         case '3':
    //             return PieceTypeInput.ROOK;
    //         case '4':
    //             return PieceTypeInput.BISHOP;
    //         case '5':
    //             return PieceTypeInput.KNIGHT;
    //         case '6':
    //             return PieceTypeInput.PAWN;
    //     }
    // }

    // private resolveSelectedColor(): ColorInput {
    //     switch (this.selectedColor) {
    //         case '1':
    //             return ColorInput.LIGHT;
    //         case '2':
    //             return ColorInput.DARK;
    //     }
    // }

    // public setPgn() {
    //     this.boardManager.setPGN(this.pgn);
    // }

    // loadDefaultPgn() {
    //     this.pgn = '1. c4 b5 2. cxb5 c6 3. bxc6 Nxc6 4. Qa4 a6\n' +
    //         '5. Qxa6 Rb8 6. b3 d5 7. f4 e5 8. fxe5 f6\n' +
    //         '9. exf6 gxf6 10. Nf3 f5 11. Ne5 Bb7 12. Qxb7 Na7\n' +
    //         '13. Qxb8 Qxb8 14. Kf2 Kd8 15. Nc3 Be7 16. Nc4 Bf6\n' +
    //         '17. Nb6 Nb5 18. Nbxd5 f4 19. Ne4 Na7 20. Nexf6';
    //     this.setPgn();
    // }

    // getPGN() {
    //     alert(this.boardManager.getPGN());
    // }
    import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppModule } from './app.module';
import { HeaderComponent } from './header/header.component';

    @Component({
        selector: 'app-root',
        // standalone: true,
        // imports :[HeaderComponent,AppModule],
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss'],
    })
    
    export class AppComponent {

}
