const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const gamesPeriod = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
};

function padMonth(month: number) {

    let monthString = month.toString();
    return monthString.length > 1 ? monthString : "0" + monthString;
}

function updateGamesPeriod() {
    $("#game-select-period").html(`${padMonth(gamesPeriod.month)}/${gamesPeriod.year}`);
}

function getPlayersString(game: Game) {
    if (game.white.aiLevel) {
        return `AI level ${game.white.aiLevel} vs. ${game.black.username} (${game.black.rating})`;
    } else if (game.black.aiLevel) {
        return `${game.white.username} (${game.white.rating}) vs. AI level ${game.black.aiLevel}`;
    } else {
        return `${game.white.username} (${game.white.rating}) vs. ${game.black.username} (${game.black.rating})`;
    }
}

function generateGameListing(game: Game): JQuery<HTMLDivElement> {

    let listingContainer = $<HTMLDivElement>("<div>");
    listingContainer.addClass("game-listing");
    listingContainer.attr("data-pgn", game.pgn);
    listingContainer.on("click", () => {
        $("#pgn").val(listingContainer.attr("data-pgn") || "");
        closeModal();
        evaluate1(listingContainer.attr("data-pgn") || "");
    });

    let timeClass = $("<b>");
    timeClass.html(game.timeClass.replace(/^./, game.timeClass.charAt(0).toUpperCase()));

    let players = $("<span>");
    players.html(getPlayersString(game));

    listingContainer.append(timeClass);
    listingContainer.append(players);

    return listingContainer;

}

async function fetchChessComGames(username: string) {

    console.log("Fetching games for", username);
    try {
        const pgnResponse = await fetch("http://localhost:3000/api/chessusername", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        });
    
        if (!pgnResponse.ok) {
            throw new Error("Failed to fetch PGN data from the server.");
        }
    
        // Assign the response from the server's PGN to a variable called pgn
        username = await pgnResponse.json();
    } catch (error) {
        console.error("Error fetching username data:", error);
        return logAnalysisError("Failed to fetch username data from the server.");
    }
    console.log(username);

    try {
        let gamesResponse = await fetch(
            `https://api.chess.com/pub/player/${username}/games/${gamesPeriod.year}/${padMonth(gamesPeriod.month)}`, 
            { method: "GET" }
        );

        let games: any[] = (await gamesResponse.json()).games;
        console.log(games);
        $("#games-list").html(games.length == 0 ? "No games found." : "");

        for (let game of games.reverse()) {
            let gameListing = generateGameListing({
                white: {
                    username: game.white.username,
                    rating: game.white.rating.toString()
                },
                black: {
                    username: game.black.username,
                    rating: game.black.rating.toString()
                },
                timeClass: game["time_class"],
                pgn: game.pgn
            });

            $("#games-list").append(gameListing);
        }
    } catch {
        $("#games-list").html("No games found.");
    }

}

async function fetchLichessGames(username: string) {

    let monthBeginning = new Date(
        `${gamesPeriod.year}-${padMonth(gamesPeriod.month)}-01T00:00:00Z`
    ).getTime();
    
    let monthLength = monthLengths[gamesPeriod.month - 1];
    if (gamesPeriod.month - 1 == 2 && gamesPeriod.year % 4 == 0) {
      monthLength = 29;
    }
    
    let monthEnding = new Date(
      `${gamesPeriod.year}-${padMonth(gamesPeriod.month)}-${monthLength}T23:59:59Z`
    ).getTime();

    try {
        let gamesResponse = await fetch(
            `https://lichess.org/api/games/user/${username}?since=${monthBeginning}&until=${monthEnding}&pgnInJson=true`, 
            { 
                method: "GET",
                headers: {
                    "Accept": "application/x-ndjson"
                }
            }
        );

        let gamesNdJson = await gamesResponse.text();
        let games = gamesNdJson
            .split("\n")
            .filter(game => game.length > 0)
            .map(game => JSON.parse(game));

        $("#games-list").html(games.length == 0 ? "No games found." : "");

        for (let game of games) {
            let gameListing = generateGameListing({
                white: {
                    username: game.players.white.user?.name,
                    rating: game.players.white.rating,
                    aiLevel: game.players.white.aiLevel
                },
                black: {
                    username: game.players.black.user?.name,
                    rating: game.players.black.rating,
                    aiLevel: game.players.black.aiLevel
                },
                timeClass: game.speed,
                pgn: game.pgn
            });

            $("#games-list").append(gameListing);
        }
    } catch {
        $("#games-list").html("No games found.");
    }

}

function fetchGames(username: string, loadType: string = "chesscom") {

    let selectedLoadType = $("#load-type-dropdown").val();

    if (loadType == "chesscom") {
        fetchChessComGames(username);
    } else if (selectedLoadType == "lichess") {
        fetchLichessGames(username);
    }

}

function closeModal() {

    $("#game-select-menu-container").css("display", "none");

    let today = new Date();
    gamesPeriod.year = today.getFullYear();
    gamesPeriod.month = today.getMonth() + 1;
    updateGamesPeriod();

}

function registerModalEvents() {

    $("#game-select-cancel-button").on("click", closeModal);

    $("#last-page-button").on("click", async () => {
        if (gamesPeriod.month == 12 && (gamesPeriod.year + 1) > new Date().getFullYear()) {
            return;
        }

        gamesPeriod.month++;
        if (gamesPeriod.month > 12) {
            gamesPeriod.month = 1;
            gamesPeriod.year++;
        }

        let username = '';
        try {
            const pgnResponse = await fetch("http://localhost:3000/api/chessusername", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            });
        
            if (!pgnResponse.ok) {
                throw new Error("Failed to fetch PGN data from the server.");
            }
        
            // Assign the response from the server's PGN to a variable called pgn
            username = await pgnResponse.json();
        } catch (error) {
            console.error("Error fetching username data:", error);
            return logAnalysisError("Failed to fetch username data from the server.");
        }
        fetchGames(username);
        updateGamesPeriod();
    });

    $("#next-page-button").on("click", () => {
        gamesPeriod.month--;
        if (gamesPeriod.month < 1) {
            gamesPeriod.month = 12;
            gamesPeriod.year--;
        }

        let username = $("#chess-site-username").val()!.toString();

        fetchGames(username);
        updateGamesPeriod();
    });

}

const loadTypeDropdown = $("#load-type-dropdown");
const usernameInput = $("#chess-site-username");

loadTypeDropdown.on("input", () => {
    const selectedLoadType = loadTypeDropdown.val();
    const savedUsernameChessCom = localStorage.getItem('chess-site-username-saved-chessCom');
    const savedUsernameLichess = localStorage.getItem('chess-site-username-saved-lichess');
    
    usernameInput.val((selectedLoadType === "chesscom" && savedUsernameChessCom) || 
                      (selectedLoadType === "lichess" && savedUsernameLichess) || '');

    const isLong = selectedLoadType === "pgn" || selectedLoadType === "json";
    $("#pgn").css("display", isLong ? "block" : "none");
    $("#chess-site-username, #fetch-account-games-button").css("display", isLong ? "none" : "block");

    $("#gameInputContainer").css("display", isLong ? "block" : "none");
    $("#gameInputContainer2").css("display", isLong ? "none" : "block");

    const placeholderText = (selectedLoadType === "json") ? "Enter JSON..." : "Enter PGN...";
    $("#pgn").attr("placeholder", placeholderText);
});

async function onFetchButtonClick() {
    $("#games-list").html("Fetching games...");
    $("#game-select-menu-container").css("display", "flex");

    updateGamesPeriod();
    
    // const username = usernameInput.val()!.toString();
    const selectedLoadType = "chesscom";
    
    let username = '';
    try {
        const pgnResponse = await fetch("http://localhost:3000/api/chessusername", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        });
    
        if (!pgnResponse.ok) {
            throw new Error("Failed to fetch PGN data from the server.");
        }
    
        // Assign the response from the server's PGN to a variable called pgn
        username = await pgnResponse.json();
    } catch (error) {
        console.error("Error fetching username data:", error);
        return logAnalysisError("Failed to fetch username data from the server.");
    }
    console.log(username);

    fetchGames(username);
}


$("#fetch-account-games-button").on("click", onFetchButtonClick);

$(window).on("keydown", event => {
    if (event.key == "Enter") {
        event.preventDefault();
        onFetchButtonClick();
    }
});

$("#game-select-menu-container").load("/static/pages/report/gameselect.html", registerModalEvents);
