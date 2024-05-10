import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { move, aiMove } from 'js-chess-engine';
import { ChessService } from '../chess1.service';
import { NgxChessBoardModule } from 'ngx-chess-board';
import { PredictionsService } from '../predictions.service';
import { Chess } from 'chess.js'
import { CommonModule } from '@angular/common'; // Import CommonModule
import { UtilsService } from '../utils.service';
import { HttpClient } from '@angular/common/http';
import { GameoverComponent } from '../gameover/gameover.component';
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


@Component({
  selector: 'app-playwithbot',
  standalone: true,
  imports: [NgxChessBoardModule,FormsModule,CommonModule,GameoverComponent],
  templateUrl: './playwithbot.component.html',
  styleUrl: './playwithbot.component.scss'
})

export class PlaywithbotComponent {
    public moveSound: HTMLAudioElement;
    public endgameSound: HTMLAudioElement;
    public checksound: HTMLAudioElement;
    public capturesound: HTMLAudioElement;
    public castlesound: HTMLAudioElement;
    public promotionsound: HTMLAudioElement;
    public chess1: Chess;
    public gameOver: boolean = false;
    constructor(private chessService: ChessService,private utilsService: UtilsService,private http: HttpClient,private PredictionsService: PredictionsService) {
        this.moveSound = new Audio();
        this.moveSound.src = 'assets/move.mp3';
        this.endgameSound = new Audio();
        this.capturesound = new Audio();
        this.checksound = new Audio();
        this.castlesound = new Audio();
        this.promotionsound = new Audio();
        this.endgameSound.src = 'assets/game_end.mp3';
        this.capturesound.src = 'assets/capture.mp3';
        this.checksound.src = 'assets/check.mp3';
        this.castlesound.src = 'assets/castle.mp3';
        this.promotionsound.src = 'assets/promote.mp3';
        this.chess1 = new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    }
    
    difficultyLevel: string = ''; // Default difficulty level
    selectedDifficulty: boolean = false;

    difficulty : number = 0;

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
    public lightTileColor = '#f0d9b5';
    public size = 600;
    public dragDisabled = false;
    public drawDisabled = false;
    public lightDisabled = false;
    public darkDisabled = false;
    public freeMode = false;
    public addPieceCoords: string = 'a4';
    public selectedPiece = '1';
    public selectedColor = '1';
    public pgn: string = '';
    public ssforces :string = ' 1/2-1/2';
    public messageTableMove :string ='';

    onDifficultyChange(name: string): void {
        this.selectedDifficulty = true;

        // You can implement logic here based on the selected difficulty level
        switch (name) {
            case "Hbib's Dumb AI":
                this.difficulty=0;
                break;
            case 'Advanced':
                this.difficulty=4;
                break;
          case 'easy':
            this.difficulty  = 1;

            // Set the bot to easy mode
            // Example: this.boardManager.setBotDifficulty('easy');
            break;
          case 'medium':
            this.difficulty  = 2;

            // Set the bot to medium mode
            // Example: this.boardManager.setBotDifficulty('medium');
            break;
          case 'difficult':
            this.difficulty  = 3;

            // Set the bot to difficult mode
            // Example: this.boardManager.setBotDifficulty('difficult');
            break;
          default:
            // Handle unexpected cases
            break;
        }
        console.log(this.difficulty);
      }
      public toggleGameOver(): void {
        this.gameOver = !this.gameOver;
        console.log(this.gameOver);
    }
    
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
    public analyzeGame(): void {
        // Add your logic here for analyzing the game
        console.log(this.chess1.pgn());
        
        this.http.post<any>('http://localhost:3000/api/pgn', { pgn: this.correctPGN(this.chess1.pgn())}).subscribe(
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
    // public moveCallback(move: MoveChange): void {
    //     this.fen = this.boardManager.getFEN();
    //     this.pgn = this.boardManager.getPGN();
    //     console.log(move);
    //     this.PredictionsService.sendFen(move.fen).subscribe(
    //         response => {
    //             const chess = new Chess(this.fen);
    //             chess.move(response.bestMove);
    //             this.boardManager.setFEN(chess.fen());
    //             console.log('Best move:', this.manualMove);
    //             this.moveManual();
    //         },
    //         error => {
    //             console.error('Error getting prediction:', error);
    //         }
    //     );
    // }
    public getChessPieceName(pieceAbbreviation) {
        switch (pieceAbbreviation.toLowerCase()) {
            case 'k':
                return "King";
            case 'q':
                return "Queen";
            case 'r':
                return "Rook";
            case 'b':
                return "Bishop";
            case 'n':
                return "Knight";
            case 'p':
                return "Pawn";
            default:
                return "<td>Unknown Piece</td>";
        }
    }
    public async moveCallback(move: MoveChange): Promise<void> {
        this.fen = this.boardManager.getFEN();
        this.pgn = this.boardManager.getPGN();
        console.log(move);
        this.messageTableMove+=`    
        <th scope="row">  </th> 
        <td>${move.move}</td>
        <td>${move.piece}</td>
        
        </tr>`
        document.getElementById('tableMove').innerHTML = this.messageTableMove;
        const chess = new Chess(this.fen);
        let move1 =this.chess1.move(move.move);
        if(move1.captured){
            this.capturesound.play();
        }
        if(move1.promotion){
            this.promotionsound.play();
        }
        if(chess.isCheck()){
            this.checksound.play();
        }

        if(chess.isCheckmate()){
            this.checksound.play();
            console.log("game over");
            this.chess1.turn()==='w'?this.ssforces='0-1':this.ssforces='1-0';
            this.gameOver = true;
console.log(this.gameOver);
            return;
        }
        if(chess.isStalemate()){
            this.checksound.play();
            console.log("game over");
            this.gameOver = true;
console.log(this.gameOver);
            return;
        }
        else{
            this.moveSound.play();
        }
        if (chess.turn() === 'b') { // if it's black's turn
            if(this.difficulty==0){
                this.PredictionsService.sendFen(move.fen).subscribe(
                    async response => {
                        await this.utilsService.sleep(500); // Sleep for 1000 milliseconds (1 second)
                        this.messageTableMove+=`    
                        <th scope="row">  </th> 
                        <td>${response.bestMove}</td>
                        <td>${this.getChessPieceName(chess.move(response.bestMove).piece)
                        }</td>
                        </tr>`
                        document.getElementById('tableMove').innerHTML = this.messageTableMove;
            
                        if(chess.isCheckmate()){
                            this.checksound.play();
                            console.log("game over");
                            this.chess1.turn()==='w'?this.ssforces='0-1':this.ssforces='1-0';
                            this.boardManager.setFEN(chess.fen());
                            this.gameOver=true;
console.log(this.gameOver);
                            return;
                        }
                        if(chess.isStalemate()){
                            this.checksound.play();
                            console.log("game over");
                            this.boardManager.setFEN(chess.fen());
                            this.gameOver = true;
console.log(this.gameOver);
                            return;
                        }
                        let move1 =this.chess1.move(response.bestMove);
                        if(move1.captured){
                            this.capturesound.play();
                        }
                        if(move1.promotion){
                            this.promotionsound.play();
                        }
                        if(chess.isCheck()){
                            this.checksound.play();
                        }
                        else{
                            this.moveSound.play();
                        }
                        this.boardManager.setFEN(chess.fen());
                    console.log('Best move:', this.manualMove);
                },
                error => {
                    console.error('Error getting prediction:', error);
                }
            );         
        }

        else{
            const originalString = aiMove(this.fen, this.difficulty);
            console.log(originalString);
            const key = Object.keys(originalString)[0]; // Extract the key from the object
            const value = originalString[key];
            const finaly = key + value;
            const lowercaseString = finaly.toLowerCase();
            console.log('',lowercaseString);
            await this.utilsService.sleep(500); // Sleep for 1000 milliseconds (1 second)
            chess.move(lowercaseString);
            if(chess.isCheckmate()){
                this.endgameSound.play();
                console.log("game over");
                this.gameOver = true;
                console.log(this.gameOver);
                this.boardManager.setFEN(chess.fen());
console.log(this.gameOver);
                return;
            }
            if(chess.isStalemate()){
                this.checksound.play();
                console.log("game over");
                this.gameOver = true;
                this.boardManager.setFEN(chess.fen());
console.log(this.gameOver);
                return;
            }
            let move1 =this.chess1.move(lowercaseString);
            if(move1.captured){
                this.capturesound.play();
            }
            if(move1.promotion){
                this.promotionsound.play();
            }
            if(chess.isCheck()){
                this.checksound.play();
            }
            else{
                this.moveSound.play();
            }
            this.boardManager.setFEN(chess.fen());



            this.messageTableMove+=`    
            <th scope="row">  </th> 
            <td>${lowercaseString}</td>
            <td>${this.getChessPieceName(move1.piece)}</td>
            
            </tr>`
            document.getElementById('tableMove').innerHTML = this.messageTableMove;
        }
  
        }
        console.log(this.chess1.pgn())
        



    }
    // public async moveCallback(move: MoveChange): Promise<void> {
    //     this.fen = this.boardManager.getFEN();
    //     this.pgn = this.boardManager.getPGN();
    //     console.log(move);
    //     const chess = new Chess(this.fen);
    //     if (chess.turn() === 'b') { // if it's black's turn
    //         if(this.difficulty==0){
    //             this.PredictionsService.sendFen(move.fen).subscribe(
    //                 response => {
    //                     chess.move(response.bestMove);
    //                     this.boardManager.setFEN(chess.fen());
    //                 console.log('Best move:', this.manualMove);
    //             },
    //             error => {
    //                 console.error('Error getting prediction:', error);
    //             }
    //         );
    //     }

    //     else{
    //         const originalString = aiMove(this.fen, this.difficulty);
    //         console.log(originalString);
    //         const key = Object.keys(originalString)[0]; // Extract the key from the object
    //         const value = originalString[key];
    //         const finaly = key + value;
    //         const lowercaseString = finaly.toLowerCase();
    //         console.log(lowercaseString);
    //         if(this.difficulty>2){
    //             await this.utilsService.sleep(1000); // Sleep for 1000 milliseconds (1 second)
    //         }
    //         chess.move(lowercaseString);
    //         this.boardManager.setFEN(chess.fen());
    //     }
    //     }
    // }
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
}
