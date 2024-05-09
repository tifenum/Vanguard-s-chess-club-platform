import { Component,ViewChild,OnInit,Input } from '@angular/core';

import { Router } from '@angular/router';
import { Chess } from 'chess.js';
import { CommonModule } from '@angular/common';
import { NgxChessBoardModule } from 'ngx-chess-board';
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
import { PuzzlesService } from '../puzzles.service';
import { ModalComponent } from '../modal/modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-puzzles',
  standalone: true,
  imports: [NgxChessBoardModule,CommonModule,ModalComponent,FormsModule],
  templateUrl: './puzzles.component.html',
  styleUrl: './puzzles.component.scss'
})
export class PuzzlesComponent implements OnInit{

    public chess: Chess;
    public index :number=0;
    public rate :number =2000;
    public popularity : number=95;
    public theme : string= "Arabian mate";
    public datapuzz :any={};
    public nexteMoveBool :boolean=false;
    public bool:boolean=false;
    public successMessage:string='';
    public lasteMoveMessage:string='';
    public modalOpen: boolean =false ;
    public player: string ="";
    public playerbool: boolean =true;
    public lastMove : boolean =false ;
    public getPuzzles:boolean=true;

  constructor(private router: Router,private service:PuzzlesService) {
  }
  ngOnInit(): void {
      
  }
 
  @ViewChild('board')
  boardManager: NgxChessBoardComponent;

  @ViewChild('fenManager') fenManager: FenComponent;
  public fen = '6r1/8/R2bpk2/2p1p2p/1pP1P2P/1P1N1P2/4K3/8 b - - 2 49    ';
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
  public lightDisabled = false   ;
  public darkDisabled = false;
  public freeMode = false;
  public addPieceCoords: string = 'a4';
  public selectedPiece = '1';
  public selectedColor = '1';
  public pgn: string = '';



// puuuuuuuuuuuuuuuuuzzzzzzzzzzzzzzles
// public getPuzzlesByFilter(){
//     this.service.getPuzzles( this.rate,this.popularity).subscribe(
//         (res:any)=>{
//             console.log(res);
//             this.datapuzz=res;
//             this.exicuterPuzzels(this.datapuzz[0]);
//             this.getPuzzles=false;
//         }
//     )
// }
public getPuzzlesByFilter() {
    this.service.getRandomPuzzle().subscribe(
      (res: any) => {
        // console.log(res);
        // console.log('Random puzzle:', res);
        // Handle the retrieved random puzzle data
        this.datapuzz=res;
        this.getPuzzles=false;
        
        console.log(this.datapuzz.Themes);
        this.exicuterPuzzels(this.datapuzz);
      },
      (error) => {
        console.error('Error fetching random puzzle:', error);
      }
    );
  }
public playerr = true;
public  i:number=0;
async exicuterPuzzels(datapuzz:any ){
    this.player=this.boardManager.getFEN().split(' ')[1];
    if (this.player  ==='w'){
        if(this.playerbool){
            this.boardManager.reverse();
        } }
    this.fen=datapuzz.FEN;
     this.setFen();
    
    const movesArray = datapuzz.Moves.split(' ');
    console.log(movesArray);
    
 
    this.service.delay(5000); 
    this.i=0;
    console.log('i=',this.i,'movesArray[i]=',movesArray[this.i])
    this.boardManager.move(movesArray[0]);
    this.lasteMoveMessage=`<div class="alert alert-warning w-50 mx-auto text-center mt-3" role="alert ">
    Last Move : ${movesArray[0]}
    </div>`;
    document.getElementById('lasteMoveMessage').innerHTML = this.lasteMoveMessage;
    if(this.boardManager.getFEN()[1]=='w'){
        this.playerr=true
    }
    else{
        this.playerr=false;
    }
    this.i++;
//    this.bool=true;
}
nextPuzzles(){
    this.service.getRandomPuzzle().subscribe(
          (res: any) => {

            this.datapuzz=res;
    this.lastMove=false;
    this.index= this.index+1;
    this.fen=this.datapuzz.FEN;
    this.exicuterPuzzels(this.datapuzz);
    this.successMessage="";
    document.getElementById('messageContainer').innerHTML = this.successMessage;
    this.nexteMoveBool=false;
    this.playerbool=true;
},
(error) => {
  console.error('Error fetching random puzzle:', error);
}
);

}
// puuuuuuuuuuuuuuuuuzzzzzzzzzzzzzzlzs
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


   public validateAndDisplayMessage(movep: string,movel:string,lasteMove: boolean): void {
    
    
    if (movep===movel) {
            this.successMessage += `<div class="alert alert-success mt-3" role="alert ">
        ${movep} is correct !
        </div>`;
        document.getElementById('messageContainer').innerHTML = this.successMessage;
        if (lasteMove){
            if (this.player  ==='w'){
                if(this.playerbool){
                    this.boardManager.reverse();
                } }
            this.nexteMoveBool=true;
            this.openModal();
        }
    } else {
      this.bool=true;
      if (lasteMove)
      {
          if (this.player  ==='w'){
            if(this.playerbool){
                this.boardManager.reverse();
            } }
        }

      }
  }
    public openModal(): void {
        this.modalOpen = true;
    }
    public reload(){
        if (this.lastMove)
        {
        
            this.i=this.i-1;
        this.bool=false;
        this.boardManager.undo();
        // if (this.player  ==='w'){
        //     if(this.playerbool){
        //         console.log("3assssssssba ")
        //         this.boardManager.reverse();
        //     } }

        }
        else 
        {
            
            this.i=this.i-2;
            this.bool=false;
            this.boardManager.undo();
            // if (this.player  ==='w'){
            //     if(this.playerbool){
            //         console.log("3assssssssba ")
            //         this.boardManager.reverse();
            //     } }
        }

    }
  public moveCallback(move: MoveChange): void {
      this.fen = this.boardManager.getFEN();
      this.pgn = this.boardManager.getPGN();
      const movesArray = this.datapuzz.Moves.split(' ');
      const movesArrayLength = movesArray.length;
      if (this.i!=0){
           
        if(this.i%2==0 && movesArrayLength!=this.i){
            console.log(this.fen);
            this.chess=new Chess(this.fen);
            this.chess.move(movesArray[this.i]);
            this.boardManager.setFEN(this.chess.fen());
            this.fen=this.boardManager.getFEN();
            this.i++;
          }
          if(this.i<movesArrayLength){
            this.validateAndDisplayMessage(movesArray[this.i-2],move.move,false);
          }else 
          {
              this.lastMove=true;
           this.validateAndDisplayMessage(movesArray[movesArrayLength-1],move.move,true);
          }  
      }
      if (this.player  ==='w'){
        if(this.playerbool){
            this.boardManager.reverse();
        } }

    this.i++;
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

}
