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
  public turn: string = "";
  private player1: string = "";

  private gameBodyItems: NodeListOf<HTMLElement> = document.querySelectorAll(
    "#game-play-body > *"
  );

  private gameBodyItemsArray: Array<HTMLElement> = Array.from(
    this.gameBodyItems
  );

  private turnImageX: HTMLImageElement | null = document.querySelector(
    "[data-turn-image='x']"
  );

  private turnImageO: HTMLImageElement | null = document.querySelector(
    "[data-turn-image='o']"
  );

  private modalRestart: HTMLElement | null = document.querySelector(
    "[data-modal='restart']"
  );

  private modalWin: HTMLElement | null =
    document.querySelector("[data-modal='win']");

  private buttonOpenModalRestart: HTMLElement | null = document.querySelector(
    "[data-open-restart-modal]"
  );

  private buttonCancelRestart: HTMLElement | null = document.querySelector(
    "[data-cancel-restart]"
  );

  private buttonRestart: HTMLElement | null =
    document.querySelector("[data-restart]");

  private buttonQuitGame: HTMLElement | null =
    document.querySelector("[data-quit]");

  private buttonNextRound: HTMLElement | null =
    document.querySelector("[data-next-round]");

  private buttonPlayer1Points: HTMLElement | null = document.querySelector(
    "[data-button-player1-points]"
  );

  private buttonPlayer2Points: HTMLElement | null = document.querySelector(
    "[data-button-player2-points]"
  );

  private tiePointsEl: HTMLElement | null =
    document.querySelector("[data-tie-points]");

  private player1PointsEl: HTMLElement | null = document.querySelector(
    "[data-player1-points]"
  );

  private player2PointsEl: HTMLElement | null = document.querySelector(
    "[data-player2-points]"
  );

  private tiePoints = 0;
  private player1Points = 0;
  private player2Points = 0;

  public init(turn: string): void {
    this.handleEventsItem();

    this.handleClickRestart();
    this.handleClickCancelRestart();

    this.handleClickQuitGame();
    this.handleClickNextRound();

    this.handleClickButtonOpenRestartModal();

    this.setInitialTurn(turn);

    this.changeTurnImage();
  }

  public handleClickRestart() {
    this.buttonRestart?.addEventListener("click", () => {
      this.resetGame();
      this.modalRestart?.classList.add("d-none");
    });
  }

  public handleClickCancelRestart() {
    this.buttonCancelRestart?.addEventListener("click", () => {
      this.modalRestart?.classList.add("d-none");
    });
  }

  public handleClickQuitGame() {
    this.buttonQuitGame?.addEventListener("click", () => {
      window.location.reload();
    });
  }

  public handleClickNextRound() {
    this.buttonNextRound?.addEventListener("click", () => {
      this.clearItemsInPage();
      this.modalWin?.classList.add("d-none");
    });
  }

  public handleClickButtonOpenRestartModal() {
    this.buttonOpenModalRestart?.addEventListener("click", () => {
      this.modalRestart?.classList.remove("d-none");
    });
  }

  public handleEventsItem(): void {
    this.gameBodyItems.forEach((element) => {
      element.addEventListener("mouseover", () => {
        if (!element.dataset.fill) {
          element.style.backgroundImage = `url(/assets/images/svg/${this.getMarkImageOutlineSource()})`;
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
          element.style.backgroundImage = `url(/assets/images/svg/${this.getMarkImageFillSource()})`;
          element.dataset.fill = "true";
          element.style.pointerEvents = "none";
          element.dataset.mark = this.turn;

          (async () => {
            await this.checkFinishGame();
            this.changeTurn();
          })();
        }
      });
    });
  }

  public setInitialTurn(initialTurn: string): void {
    this.turn = initialTurn;

    let player1TextEl: HTMLElement | null = document.querySelector(
      "[data-player1-mark]"
    );
    let player2TextEl: HTMLElement | null = document.querySelector(
      "[data-player2-mark]"
    );

    let stringPlayer1 = initialTurn == "x" ? "X" : "O";
    let stringPlayer2 = stringPlayer1 == "X" ? "O" : "X";

    player1TextEl && (player1TextEl.innerText = stringPlayer1);
    player2TextEl && (player2TextEl.innerText = stringPlayer2);
    this.player1 = initialTurn;

    if (this.buttonPlayer1Points && this.buttonPlayer2Points) {
      if (initialTurn == "x") {
        this.buttonPlayer1Points.setAttribute("blue", "");
        this.buttonPlayer2Points.setAttribute("yellow", "");
      } else {
        this.buttonPlayer1Points.setAttribute("yellow", "");
        this.buttonPlayer2Points.setAttribute("blue", "");
      }
    }
  }

  public resetGame() {
    this.clearItemsInPage();
    this.player1Points = 0;
    this.player2Points = 0;
    this.tiePoints = 0;

    this.player1PointsEl && (this.player1PointsEl.innerText = "0");
    this.player2PointsEl && (this.player2PointsEl.innerText = "0");
    this.tiePointsEl && (this.tiePointsEl.innerText = "0");
  }

  public clearItemsInPage() {
    this.gameBodyItems.forEach((element) => {
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

  public checkWinner(): boolean {
    let arrayOfMarkPositions: number[] = this.gameBodyItemsArray
      .filter((mark) => {
        return mark.dataset.mark == this.turn;
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
        this.fillItems(combination);
        break;
      }
    }

    return currentPlayWin;
  }
  public fillItems(combination: number[]) {
    this.gameBodyItemsArray
      .filter((mark) => {
        return (
          mark.dataset.mark == this.turn &&
          combination.includes(Number(mark.dataset.value))
        );
      })
      .forEach((mark) => {
        mark.setAttribute("blue", "true");
        setTimeout(() => {
          mark.setAttribute("blue", "false");
        }, 1000);
      });
  }

  public checkTie(): boolean {
    let finish = this.gameBodyItemsArray.every((item) => {
      return item.dataset.fill == "true";
    });
    return finish;
  }

  public async checkFinishGame<T>(): Promise<T | void> {
    let hasWinner = this.checkWinner();
    if (hasWinner) {
      this.setItemsToDisabled();
      await new Promise((resolve, _) => {
        setTimeout(() => {
          this.finishGame(false);
          resolve(true);
        }, 1000);
      });
      return;
    } else {
      let isTied = this.checkTie();

      isTied && this.finishGame(isTied);
    }
  }

  public setItemsToDisabled() {
    this.gameBodyItems.forEach((item) => {
      item.style.pointerEvents = "none";
    });
  }

  public finishGame(isTied: boolean): void {
    let divModal: HTMLElement | null = document.querySelector(
      "[data-modal-win-content]"
    );

    let imgModalEl: HTMLImageElement | null =
      divModal?.querySelector("img") || null;
    let h1ModalEl: HTMLElement | null = divModal?.querySelector("h1") || null;
    let h6ModalEl: HTMLElement | null = divModal?.querySelector("h6") || null;

    h6ModalEl?.classList.remove("d-none");
    imgModalEl?.classList.remove("d-none");

    if (isTied) {
      this.setDataToModalWhenHasTie(h1ModalEl, h6ModalEl, imgModalEl);
    } else {
      this.setDataToModalWhenHasWinner(h6ModalEl, h1ModalEl, imgModalEl);
    }

    this.modalWin?.classList.remove("d-none");
  }

  public setDataToModalWhenHasTie(
    h1ModalEl: HTMLElement | null,
    h6ModalEl: HTMLElement | null,
    imgModalEl: HTMLImageElement | null
  ): void {
    this.tiePoints += 1;
    this.tiePointsEl &&
      (this.tiePointsEl.innerText = this.tiePoints.toString());

    if (h1ModalEl && h6ModalEl) {
      h1ModalEl.innerText = "ROUND TIED";
      h6ModalEl?.classList.add("d-none");
      imgModalEl?.classList.add("d-none");
    }
  }

  public setDataToModalWhenHasWinner(
    h6ModalEl: HTMLElement | null,
    h1ModalEl: HTMLElement | null,
    imgModalEl: HTMLImageElement | null
  ): void {
    let stringUrl = `/assets/images/svg/icon-${this.turn}.svg`;

    let stringPlayerWin = "";

    if (this.turn == this.player1) {
      stringPlayerWin = "PLAYER 1 WIN";
      this.player1Points += 1;
      this.player1PointsEl &&
        (this.player1PointsEl.innerText = this.player1Points.toString());
    } else {
      stringPlayerWin = "PLAYER 2 WIN";
      this.player2Points += 1;
      this.player2PointsEl &&
        (this.player2PointsEl.innerText = this.player2Points.toString());
    }

    h6ModalEl && (h6ModalEl.innerText = stringPlayerWin);
    h1ModalEl && (h1ModalEl.innerText = "TAKES THE ROUND");
    imgModalEl && (imgModalEl.src = stringUrl);
  }

  public changeTurn(): void {
    this.turn == "x" ? (this.turn = "o") : (this.turn = "x");

    this.changeTurnImage();
  }

  public changeTurnImage(): void {
    if (this.turn == "x") {
      this.turnImageX && (this.turnImageX.style.display = "block");
      this.turnImageO && (this.turnImageO.style.display = "none");
    } else {
      this.turnImageX && (this.turnImageX.style.display = "none");
      this.turnImageO && (this.turnImageO.style.display = "block");
    }
  }

  public getMarkImageOutlineSource(): string {
    if (this.turn == "x") {
      return "icon-x-outline.svg";
    } else {
      return "icon-o-outline.svg";
    }
  }

  public getMarkImageFillSource(): string {
    if (this.turn == "x") {
      return "icon-x.svg";
    } else {
      return "icon-o.svg";
    }
  }
}
