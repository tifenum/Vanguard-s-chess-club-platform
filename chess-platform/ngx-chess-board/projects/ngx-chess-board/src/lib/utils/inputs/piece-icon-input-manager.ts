import { Bishop } from '../../models/pieces/bishop';
import { Color } from '../../models/pieces/color';
import { King } from '../../models/pieces/king';
import { Knight } from '../../models/pieces/knight';
import { Pawn } from '../../models/pieces/pawn';
import { Piece } from '../../models/pieces/piece';
import { Queen } from '../../models/pieces/queen';
import { Rook } from '../../models/pieces/rook';
import { PieceIconInput } from './piece-icon-input';

export class PieceIconInputManager {

    private _defaultIcons: boolean = false;
    private _pieceIconInput: PieceIconInput;

    get pieceIconInput(): PieceIconInput {
        this.loadDefaultData();
        return this._pieceIconInput;
    }

    set pieceIconInput(value: PieceIconInput) {
        this._pieceIconInput = value;
    }


    get defaultIcons(): boolean {
        return this._defaultIcons;
    }

    set defaultIcons(value: boolean) {
        this._defaultIcons = value;
    }

    isDefaultIcons(): boolean {
        return this.pieceIconInput === undefined || this.pieceIconInput === null;
    }

    getPieceIcon(piece: Piece): string {
        let isWhite = (piece.color === Color.WHITE);
        switch (piece.constructor) {
            case King:
                return isWhite ? this.pieceIconInput.whiteKingUrl : this.pieceIconInput.blackKingUrl;
            case Queen:
                return isWhite ? this.pieceIconInput.whiteQueenUrl : this.pieceIconInput.blackQueenUrl;
            case Rook:
                return isWhite ? this.pieceIconInput.whiteRookUrl : this.pieceIconInput.blackRookUrl;
            case Bishop:
                return isWhite ? this.pieceIconInput.whiteBishopUrl : this.pieceIconInput.blackBishopUrl;
            case Knight:
                return isWhite ? this.pieceIconInput.whiteKnightUrl : this.pieceIconInput.blackKnightUrl;
            case Pawn:
                return isWhite ? this.pieceIconInput.whitePawnUrl : this.pieceIconInput.blackPawnUrl;
        }
    }
    loadDefaultData(){
        this._pieceIconInput = {
            blackBishopUrl: '../assets/bb.png',
            blackKingUrl: '../assets/bk.png',
            blackKnightUrl: '../assets/bn.png',
            blackQueenUrl: '../assets/bq.png',
            blackRookUrl: '../assets/br.png',
            whiteBishopUrl: '../assets/wb.png',
            whiteKingUrl: '../assets/wk.png',
            whiteKnightUrl: '../assets/wn.png',
            whitePawnUrl: '../assets/wp.png',
            whiteQueenUrl: '../assets/wq.png',
            whiteRookUrl: '../assets/wr.png',
            blackPawnUrl: '../assets/bp.png'
        }
    }
   
}
