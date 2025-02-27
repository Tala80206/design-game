document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 400;

    // Завантаження спрайтів
    const aborigineImg = new Image();
    aborigineImg.src = "aborigene.png";

    const klopunyaImg = new Image();
    klopunyaImg.src = "klopunya.png";

    const backgrounds = ["city.png", "park.png", "home.png"];
    let level = 0;
    let bgImg = new Image();
    bgImg.src = backgrounds[level];

    let aborigine = { x: 100, y: 200, width: 60, height: 80, speed: 5 };
    let klopunya = { x: 600, y: 200, width: 50, height: 70, dx: 3, dy: 3 };

    function drawCharacter(character, img) {
        ctx.drawImage(img, character.x, character.y, character.width, character.height);
    }

    function moveKlopunya() {
        klopunya.x += klopunya.dx;
        klopunya.y += klopunya.dy;

        if (klopunya.x <= 0 || klopunya.x + klopunya.width >= canvas.width) {
            klopunya.dx *= -1;
        }
        if (klopunya.y <= 0 || klopunya.y + klopunya.height >= canvas.height) {
            klopunya.dy *= -1;
        }
    }

    function checkCollision() {
        return aborigine.x < klopunya.x + klopunya.width &&
               aborigine.x + aborigine.width > klopunya.x &&
               aborigine.y < klopunya.y + klopunya.height &&
               aborigine.y + aborigine.height > klopunya.y;
    }

    let keys = {};
    window.addEventListener("keydown", (e) => keys[e.key] = true);
    window.addEventListener("keyup", (e) => keys[e.key] = false);

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

        if (keys["ArrowUp"] && aborigine.y > 0) aborigine.y -= aborigine.speed;
        if (keys["ArrowDown"] && aborigine.y + aborigine.height < canvas.height) aborigine.y += aborigine.speed;
        if (keys["ArrowLeft"] && aborigine.x > 0) aborigine.x -= aborigine.speed;
        if (keys["ArrowRight"] && aborigine.x + aborigine.width < canvas.width) aborigine.x += aborigine.speed;

        moveKlopunya();

        drawCharacter(aborigine, aborigineImg);
        drawCharacter(klopunya, klopunyaImg);

        if (checkCollision()) {
            level++;
            if (level < backgrounds.length) {
                bgImg.src = backgrounds[level];
                aborigine.x = 100;
                klopunya.x = 600;
            } else {
                alert("Абориген зловив Кльопуню! Кльопуня облизує йому ніс ❤️");
                document.location.reload();
            }
        }

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
