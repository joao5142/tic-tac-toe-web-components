const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default class Game {
  public static turn: string = "";
  private static player1: string = "";

  private static gameBodyItems: NodeListOf<HTMLElement> = document.querySelectorAll("#game-play-body > *");
  private static gameBodyItemsArray: Array<HTMLElement> = Array.from(Game.gameBodyItems);

  private static turnImageX: HTMLImageElement | null = document.querySelector("[data-turn-image='x']");
  private static turnImageO: HTMLImageElement | null = document.querySelector("[data-turn-image='o']");

  private static modalRestart: HTMLElement | null = document.querySelector("[data-modal='restart']");
  private static modalWin: HTMLElement | null = document.querySelector("[data-modal='win']");

  private static buttonOpenModalRestart: HTMLElement | null = document.querySelector("[data-open-restart-modal]");
  private static buttonCancelRestart: HTMLElement | null = document.querySelector("[data-cancel-restart]");
  private static buttonRestart: HTMLElement | null = document.querySelector("[data-restart]");

  private static buttonQuitGame: HTMLElement | null = document.querySelector("[data-quit]");
  private static buttonNextRound: HTMLElement | null = document.querySelector("[data-next-round]");

  private static buttonPlayer1Points: HTMLElement | null = document.querySelector("[data-button-player1-points]");
  private static buttonPlayer2Points: HTMLElement | null = document.querySelector("[data-button-player2-points]");
  private static tiePointsEl: HTMLElement | null = document.querySelector("[data-tie-points]");
  private static player1PointsEl: HTMLElement | null = document.querySelector("[data-player1-points]");
  private static player2PointsEl: HTMLElement | null = document.querySelector("[data-player2-points]");

  private static tiePoints = 0;
  private static player1Points = 0;
  private static player2Points = 0;

  public static init(turn: string): void {
    Game.handleEventsItem();

    Game.handleClickRestart();
    Game.handleClickCancelRestart();

    Game.handleClickQuitGame();
    Game.handleClickNextRound();

    Game.handleClickButtonOpenRestartModal();

    Game.setInitialTurn(turn);

    Game.changeTurnImage();
  }

  public static handleClickRestart() {
    Game.buttonRestart?.addEventListener("click", () => {
      Game.resetGame();
      Game.modalRestart?.classList.add("d-none");
    });
  }
  public static handleClickCancelRestart() {
    Game.buttonCancelRestart?.addEventListener("click", () => {
      Game.modalRestart?.classList.add("d-none");
    });
  }
  public static handleClickQuitGame() {
    Game.buttonQuitGame?.addEventListener("click", () => {
      window.location.reload();
    });
  }
  public static handleClickNextRound() {
    Game.buttonNextRound?.addEventListener("click", () => {
      Game.clearItemsInPage();
      Game.modalWin?.classList.add("d-none");
    });
  }
  public static handleClickButtonOpenRestartModal() {
    Game.buttonOpenModalRestart?.addEventListener("click", () => {
      Game.modalRestart?.classList.remove("d-none");
    });
  }

  public static handleEventsItem(): void {
    Game.gameBodyItems.forEach((element) => {
      element.addEventListener("mouseover", () => {
        if (!element.dataset.fill) {
          element.style.backgroundImage = `url(/public/assets/images/svg/${Game.getMarkImageOutlineSource()})`;
          element.style.backgroundSize = "50%";
          element.style.backgroundPosition = "center";
          element.style.backgroundRepeat = "no-repeat";
        }
      });
      element.addEventListener("mouseleave", () => {
        if (!element.dataset.fill) {
          element.style.backgroundImage = ``;
        }
      });

      element.addEventListener("click", () => {
        let isItemFill = element.dataset.fill;
        if (!isItemFill) {
          element.style.backgroundImage = `url(/public/assets/images/svg/${Game.getMarkImageFillSource()})`;
          element.dataset.fill = "true";
          element.style.pointerEvents = "none";
          element.dataset.mark = Game.turn;

          (async () => {
            await Game.checkFinishGame();
            Game.changeTurn();
          })();
        }
      });
    });
  }

  public static setInitialTurn(initialTurn: string): void {
    Game.turn = initialTurn;

    let player1TextEl: HTMLElement | null = document.querySelector("[data-player1-mark]");
    let player2TextEl: HTMLElement | null = document.querySelector("[data-player2-mark]");

    let stringPlayer1 = initialTurn == "x" ? "X" : "O";
    let stringPlayer2 = stringPlayer1 == "X" ? "O" : "X";

    player1TextEl && (player1TextEl.innerText = stringPlayer1);
    player2TextEl && (player2TextEl.innerText = stringPlayer2);
    Game.player1 = initialTurn;

    if (Game.buttonPlayer1Points && Game.buttonPlayer2Points) {
      if (initialTurn == "x") {
        Game.buttonPlayer1Points.setAttribute("blue", "");
        Game.buttonPlayer2Points.setAttribute("yellow", "");
      } else {
        Game.buttonPlayer1Points.setAttribute("yellow", "");
        Game.buttonPlayer2Points.setAttribute("blue", "");
      }
    }
  }

  public static resetGame() {
    Game.clearItemsInPage();
    Game.player1Points = 0;
    Game.player2Points = 0;
    Game.tiePoints = 0;

    Game.player1PointsEl && (Game.player1PointsEl.innerText = "0");
    Game.player2PointsEl && (Game.player2PointsEl.innerText = "0");
    Game.tiePointsEl && (Game.tiePointsEl.innerText = "0");
  }
  public static clearItemsInPage() {
    Game.gameBodyItems.forEach((element) => {
      element.removeAttribute("data-fill");
      element.removeAttribute("data-mark");
      element.removeAttribute("style");
      element.style.pointerEvents = "normal";
      let img = element.querySelector("img");

      if (img) {
        img.src = "";
      }
    });
  }

  public static checkWinner(): boolean {
    let arrayOfMarkPositions: number[] = Game.gameBodyItemsArray
      .filter((mark) => {
        return mark.dataset.mark == Game.turn;
      })
      .map((mark) => Number(mark.dataset.value));

    let checkSubset = (parentArray: number[], subsetArray: number[]) => {
      return subsetArray.every((position) => {
        return parentArray.includes(position);
      });
    };

    let currentPlayWin = false;
    for (let combination of WINNING_COMBINATIONS) {
      let hasWinner = checkSubset(arrayOfMarkPositions, combination);
      if (hasWinner) {
        currentPlayWin = true;
        Game.fillItems(combination);
        break;
      }
    }

    return currentPlayWin;
  }
  public static fillItems(combination: number[]) {
    Game.gameBodyItemsArray
      .filter((mark) => {
        return mark.dataset.mark == Game.turn && combination.includes(Number(mark.dataset.value));
      })
      .forEach((mark) => {
        mark.setAttribute("blue", "true");
        setTimeout(() => {
          mark.setAttribute("blue", "false");
        }, 1000);
      });
  }

  public static checkTie(): boolean {
    let finish = Game.gameBodyItemsArray.every((item) => {
      return item.dataset.fill == "true";
    });
    return finish;
  }

  public static async checkFinishGame<T>(): Promise<T | void> {
    let hasWinner = Game.checkWinner();
    if (hasWinner) {
      Game.setItemsToDisabled();
      await new Promise((resolve, _) => {
        setTimeout(() => {
          Game.finishGame(false);
          resolve(true);
        }, 1000);
      });
      return;
    }

    let isTied = Game.checkTie();

    isTied && Game.finishGame(isTied);
  }
  public static setItemsToDisabled() {
    Game.gameBodyItems.forEach((item) => {
      item.style.pointerEvents = "none";
    });
  }

  public static finishGame(isTied: boolean): void {
    let divModal: HTMLElement | null = document.querySelector("[data-modal-win-content]");

    let imgModalEl: HTMLImageElement | null = divModal?.querySelector("img") || null;
    let h1ModalEl: HTMLElement | null = divModal?.querySelector("h1") || null;
    let h6ModalEl: HTMLElement | null = divModal?.querySelector("h6") || null;

    h6ModalEl?.classList.remove("d-none");
    imgModalEl?.classList.remove("d-none");

    if (isTied) {
      Game.setDataToModalWhenHasTie(h1ModalEl, h6ModalEl, imgModalEl);
    } else {
      Game.setDataToModalWhenHasWinner(h6ModalEl, imgModalEl);
    }

    Game.modalWin?.classList.remove("d-none");
  }
  public static setDataToModalWhenHasTie(
    h1ModalEl: HTMLElement | null,
    h6ModalEl: HTMLElement | null,
    imgModalEl: HTMLImageElement | null
  ): void {
    Game.tiePoints += 1;
    Game.tiePointsEl && (Game.tiePointsEl.innerText = Game.tiePoints.toString());

    if (h1ModalEl && h6ModalEl) {
      h1ModalEl.innerText = "ROUND TIED";
      h6ModalEl?.classList.add("d-none");
      imgModalEl?.classList.add("d-none");
    }
  }
  public static setDataToModalWhenHasWinner(h6ModalEl: HTMLElement | null, imgModalEl: HTMLImageElement | null): void {
    let stringUrl = `/public/assets/images/svg/icon-${Game.turn}.svg`;

    let stringPlayerWin = "";

    if (Game.turn == Game.player1) {
      stringPlayerWin = "PLAYER 1 WIN";
      Game.player1Points += 1;
      Game.player1PointsEl && (Game.player1PointsEl.innerText = Game.player1Points.toString());
    } else {
      stringPlayerWin = "PLAYER 2 WIN";
      Game.player2Points += 1;
      Game.player2PointsEl && (Game.player2PointsEl.innerText = Game.player2Points.toString());
    }

    h6ModalEl && (h6ModalEl.innerText = stringPlayerWin);
    imgModalEl && (imgModalEl.src = stringUrl);
  }

  public static changeTurn(): void {
    Game.turn == "x" ? (Game.turn = "o") : (Game.turn = "x");

    Game.changeTurnImage();
  }

  public static changeTurnImage(): void {
    if (Game.turn == "x") {
      Game.turnImageX?.classList.remove("d-none");
      Game.turnImageO?.classList.add("d-none");
    } else {
      Game.turnImageO?.classList.remove("d-none");
      Game.turnImageX?.classList.add("d-none");
    }
  }
  public static getMarkImageOutlineSource(): string {
    if (Game.turn == "x") {
      return "icon-x-outline.svg";
    } else {
      return "icon-o-outline.svg";
    }
  }
  public static getMarkImageFillSource(): string {
    if (Game.turn == "x") {
      return "icon-x.svg";
    } else {
      return "icon-o.svg";
    }
  }
}
