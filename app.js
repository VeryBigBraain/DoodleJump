const start = document.querySelector('.start-btn');
const changeClothes = document.querySelector('.change-character__btn');
const changeBackground = document.querySelector('.change-background__btn');
const origBackgroundUrl = '../images/orig-back.png';
const moonBackgroundUrl = '../images/moon-back.png';
const moonPersUrl = '../images/ninja.png';
const origPersUrl = '../images/doodler-guy.png';
let persPic = `url("${moonPersUrl}")`;

let backPic = document.querySelector('.grid');

backPic.style.backgroundImage = `url("${moonBackgroundUrl}")`;

// Change clothes
changeClothes.addEventListener('click', () => {
    persPic = persPic === `url("${moonPersUrl}")`   
        ? `url("${origPersUrl}")` 
        : `url("${moonPersUrl}")`;
})

// Change back
changeBackground.addEventListener('click', () => {
    backPic.style.backgroundImage = backPic.style.backgroundImage === `url("${moonBackgroundUrl}")`   
        ? `url("${origBackgroundUrl}")` 
        : `url("${moonBackgroundUrl}")`;
})

start.addEventListener('click', () => {
    const grid = document.querySelector('.grid');
    const doodler = document.createElement('div');
    let doodlerLeftSpace;
    let startPoint = 150;
    let doodlerBottomSpace = startPoint;
    let isGameOver = false; 
    let platformCount = 5;
    let platforms = [];
    let upTimerId;
    let downTimerId;
    let isJumping = true;
    let isGoingLeft = false;
    let isGoingRight = false;
    let leftTimerId;
    let rightTimerId;
    let score = 0;

    grid.innerHTML = '';

    const createDoodler = () => {
        grid.appendChild(doodler);
        doodler.classList.add('doodler');
        doodlerLeftSpace = platforms[0].left;
        doodler.style.left = doodlerLeftSpace + 'px';
        doodler.style.bottom = doodlerBottomSpace + 'px';
        doodler.style.backgroundImage = persPic;
    }

    // Create new platform
    class Platform {
        constructor(newPlatBottom) {
            this.bottom = newPlatBottom;
            this.left = Math.random() * 300;
            this.visual = document.createElement('div');

            const visual = this.visual;
            visual.classList.add('platform');
            visual.style.left = this.left + 'px';
            visual.style.bottom = this.bottom + 'px';
            grid.appendChild(visual);
        }
    }
    
    const createPlatforms = () => {
        for (let i = 0; i < platformCount; i++) {
            let platformGap = 600 / platformCount;
            let newPlatBottom = 100 + i * platformGap;
            let newPlatform = new Platform(newPlatBottom);
            platforms.push(newPlatform);
        }
    }

    const movePlatform = () => {
        // Moving platforms down till doodler alive
        if (doodlerBottomSpace > 50) {
            platforms.forEach(platform => {
                platform.bottom -=5;
                let visual = platform.visual;
                visual.style.bottom = platform.bottom + 'px';
                // Remove bottom platform
                if (platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual;
                    firstPlatform.classList.remove('platform');
                    platforms.shift();
                    ++score;
                    // Add new top platform
                    let newPlatform = new Platform(600);
                    platforms.push(newPlatform);
                }
            })
        }
    }

    const gameOver = () => {
        isGameOver = true;
        // Clear grid
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild);
        }
        grid.innerHTML = score;
        // Clear intervals
        clearInterval(downTimerId);
        clearInterval(rightTimerId);
        clearInterval(leftTimerId);
    }

    const fall = () => {
        isJumping = false;
        clearInterval(upTimerId);

        downTimerId = setInterval(() => {
            doodlerBottomSpace -= 8;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if (doodlerBottomSpace <= 0) {
                gameOver();
            }
            // Check landing at the platform
            platforms.forEach(platform => {
                if (
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= platform.bottom + 15) && 
                    ((doodlerLeftSpace + 74) >= platform.left) &&
                    (doodlerLeftSpace <= platform.left + 85) &&
                    (!isJumping)
                ) {
                    startPoint = doodlerBottomSpace;
                    jump();
                }
            })

        }, 30);
    }

    const jump = () => {
        isJumping = true;
        upTimerId = setInterval(() => {
            clearInterval(downTimerId);

            doodlerBottomSpace += 20;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if (doodlerBottomSpace > startPoint + 200) {
                fall();
            }
        }, 30);
    }
    // Moving func
    const moveRight = () => {
        // Stop moving left
        if (isGoingLeft) {
            isGoingLeft = false;
            clearInterval(leftTimerId);
        }
        // Start moving right
        isGoingRight = true;
        // Clear prevent right Interval
        clearInterval(rightTimerId);
        rightTimerId = setInterval(() => {
            // Check border
            if (doodlerLeftSpace <= 326) {
                doodlerLeftSpace +=1;
                doodler.style.left = doodlerLeftSpace + 'px';
            } else moveLeft();
        }, 1)
    }

    const moveLeft = () => {
        // Stop moving right
        if (isGoingRight) {
            isGoingRight = false;
            clearInterval(rightTimerId);
        }
        // Start moving left
        isGoingLeft = true;
        // Clear prevent left Interval
        clearInterval(leftTimerId);
        leftTimerId = setInterval(() => {
            // Check border
            if (doodlerLeftSpace >= 0) {
                doodlerLeftSpace -=1;
                doodler.style.left = doodlerLeftSpace + 'px';
            } else moveRight();
        }, 1)
    }
    
    const moveStraight = () => {
        isGoingRight = false;
        isGoingLeft = false;
        clearInterval(rightTimerId);
        clearInterval(leftTimerId);
    };
    // Control the Doodle
    const control = (e) => {
        if (e.key === 'ArrowLeft') {
            moveLeft();
        } else if (e.key === 'ArrowRight') {
            moveRight();
        } else if (e.key === 'ArrowUp') {
            moveStraight();
        }
    }
    // Starting the game
    const start = () => {
        if (!isGameOver) {
            createPlatforms();
            createDoodler();
            setInterval(movePlatform, 30);
            jump();
            document.addEventListener('keydown', control);
        }
    }
    // attach to button
    start();
})

