class Gallina {
  constructor(element) {
    this.element = element;
    this.jumpHeight = 100;
    this.jumpSpeed = 5;
    this.isJumping = false;
    this.setupElement();
  }

  setupElement() {
    this.element.classList.add("gallina");
  }

  moveRight() {
    const currentPosition = parseInt(
      window.getComputedStyle(this.element).left
    );
    this.element.style.left = currentPosition + 10 + "px";
  }

  moveLeft() {
    const currentPosition = parseInt(
      window.getComputedStyle(this.element).left
    );
    this.element.style.left = currentPosition - 10 + "px";
  }

  jump() {
    if (!this.isJumping) {
      this.isJumping = true;

      const startJump = Date.now();
      function jumpFrame() {
        const elapsed = Date.now() - startJump;
        const jumpProgress = elapsed / this.jumpSpeed;

        if (jumpProgress < 1) {
          const jumpHeightProgress =
            this.jumpHeight * Math.sin(jumpProgress * Math.PI);
          this.element.style.bottom = jumpHeightProgress + "px";
          requestAnimationFrame(jumpFrame);
        } else {
          this.element.style.bottom = "0";
          this.isJumping = false;
        }
      }

      requestAnimationFrame(jumpFrame.bind(this));
    }
  }
}

export { Gallina };
