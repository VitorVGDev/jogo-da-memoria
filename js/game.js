class MemoryGame {
  constructor(gridSelector, playerSelector, timerSelector, restartButtonSelector) {
    this.grid = document.querySelector(gridSelector);
    this.spanPlayer = document.querySelector(playerSelector);
    this.timer = document.querySelector(timerSelector);
    this.restartButton = document.getElementById(restartButtonSelector);

    this.characters = [
      'beth', 'jerry', 'jessica', 'morty',
      'pessoa-passaro', 'pickle-rick', 'rick',
      'summer', 'meeseeks', 'scroopy',
    ];

    this.firstCard = '';
    this.secondCard = '';
    this.loop = null;

    this.restartButton.addEventListener('click', () => this.restartGame());
  }

  showRestartButton() {
    this.restartButton.hidden = false;
  }

  hideRestartButton() {
    this.restartButton.hidden = true;
  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
  }

  checkEndGame() {
    const disabledCards = document.querySelectorAll('.disabled-card');

    if (disabledCards.length === 20) {
      clearInterval(this.loop);
      alert(`Parabéns, ${this.spanPlayer.innerHTML}! Seu tempo foi de: ${this.timer.innerHTML}`);
      this.showRestartButton();
    }
  }

  checkCards() {
    const firstCharacter = this.firstCard.getAttribute('data-character');
    const secondCharacter = this.secondCard.getAttribute('data-character');

    if (firstCharacter === secondCharacter) {
      this.firstCard.firstChild.classList.add('disabled-card');
      this.secondCard.firstChild.classList.add('disabled-card');
      this.firstCard = '';
      this.secondCard = '';
      this.checkEndGame();
    } else {
      setTimeout(() => {
        this.firstCard.classList.remove('reveal-card');
        this.secondCard.classList.remove('reveal-card');
        this.firstCard = '';
        this.secondCard = '';
      }, 500);
    }
  }

  revealCard({ target }) {
    if (target.parentNode.className.includes('reveal-card')) return;

    if (this.firstCard === '') {
      target.parentNode.classList.add('reveal-card');
      this.firstCard = target.parentNode;
    } else if (this.secondCard === '') {
      target.parentNode.classList.add('reveal-card');
      this.secondCard = target.parentNode;
      this.checkCards();
    }
  }

  createCard(character) {
    const card = this.createElement('div', 'card');
    const front = this.createElement('div', 'face front');
    const back = this.createElement('div', 'face back');

    front.style.backgroundImage = `url('../images/${character}.png')`;

    card.appendChild(front);
    card.appendChild(back);
    card.setAttribute('data-character', character);
    card.addEventListener('click', (e) => this.revealCard(e));

    return card;
  }

  loadGame() {
    this.grid.innerHTML = '';
    const duplicateCharacters = [...this.characters, ...this.characters];
    const shuffledArray = duplicateCharacters.sort(() => Math.random() - 0.5);

    shuffledArray.forEach((character) => {
      const card = this.createCard(character);
      this.grid.appendChild(card);
    });
  }

  startTimer() {
    this.timer.innerHTML = '0';
    this.loop = setInterval(() => {
      const currentTime = +this.timer.innerHTML;
      this.timer.innerHTML = currentTime + 1;
    }, 1000);
  }

  start() {
    this.spanPlayer.innerHTML = localStorage.getItem('player') || 'Player';
    this.startTimer();
    this.loadGame();
    this.hideRestartButton();
  }

  restartGame() {
    clearInterval(this.loop);
    this.firstCard = '';
    this.secondCard = '';
    this.start();
  }
}

// Instancia e inicia o jogo quando a página carregar
window.onload = () => {
  const game = new MemoryGame('.grid', '.player', '.timer', 'restartButton');
  game.start();
};
