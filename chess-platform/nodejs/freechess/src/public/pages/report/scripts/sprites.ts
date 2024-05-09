async function loadSprite(filename: string): Promise<HTMLImageElement> {
    return new Promise(res => {
        let image = new Image();
        image.src = "/static/media/" + filename;

        image.addEventListener("load", () => {
            res(image);
        });
    });
}

// Load piece assets
const pieceIds = {
    "wp": "P",
    "wn": "N",
    "wb": "B",
    "wr": "R",
    "wq": "Q",
    "wk": "K",
    "bp": "p",
    "bn": "n",
    "bb": "b",
    "br": "r",
    "bq": "q",
    "bk": "k"
};

let pieceImages: {[key: string]: HTMLImageElement} = {};
let pieceLoaders: Promise<HTMLImageElement>[] = [];

for (let [ pieceId, pieceFenCharacter ] of Object.entries(pieceIds)) {
    let pieceLoader = loadSprite(pieceId + ".png");

    pieceLoader.then(image => {
        pieceImages[pieceFenCharacter] = image;
    });

    pieceLoaders.push(pieceLoader);
}

// Load classification icon assets
const classificationIcons: {[key: string]: HTMLImageElement | null} = {
    "brilliant": null,
    "great": null,
    "best": null,
    "excellent": null,
    "good": null,
    "inaccuracy": null,
    "mistake": null,
    "blunder": null,
    "forced": null,
    "book": null
};

for (let classification in classificationIcons) {
    loadSprite(classification + ".png").then(image => {
        classificationIcons[classification] = image;
    });
}