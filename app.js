// Конфігурація туру Pannellum
const tourConfig = {
    default: {
        firstScene: "livingRoom",
        sceneFadeDuration: 1000,
        autoLoad: true,
        compass: false,
        showZoomCtrl: false,
        showFullscreenCtrl: false,
        // ВАЖЛИВО: Увімкни це під час розробки! 
        // При кліку по панорамі в консоль браузера будуть падати координати (pitch, yaw).
        // Це найкращий спосіб зрозуміти, куди ставити хот-споти:
        hotSpotDebug: true 
    },

    scenes: {
        livingRoom: {
            title: "Вітальня",
            type: "equirectangular",
            panorama: "img/liv360.webp", // Твій сферичний рендер вітальні
            hotSpots: [
                {
                    pitch: -4.798354423704253, // Вертикальна вісь (вгору/вниз)
                    yaw:23.415728568661475,  // Горизонтальна вісь (вліво/вправо)
                    type: "scene",
                    text: "Перейти у Прихожу",
                    sceneId: "hallway",
                    cssClass: "custom-hotspot"
                }
            ]
        },
        kitchen: {
            title: "Кухня",
            type: "equirectangular",
            panorama: "img/kitc360.webp",
            hotSpots: [
                {
                    pitch: -1.6776418313098145,
                    yaw: 178.3426878510704,
                    type: "scene",
                    text: "У прихожу",
                    sceneId: "hallway",
                    cssClass: "custom-hotspot"
                },
                                {
                    pitch: -7.629652125662676,
                    yaw: -74.86305052979,
                    type: "scene",
                    text: "У ванну",
                    sceneId: "bath",
                    cssClass: "custom-hotspot"
                }
            ]
        },
        bedroom: {
            title: "Спальна",
            type: "equirectangular",
            panorama: "img/360beddd.webp",
            hotSpots: [
                {
                    pitch:  -3.139683911323501,
                    yaw: -103.89391277095332,
                    type: "scene",
                    text: "У прихожу",
                    sceneId: "livingRoom",
                    cssClass: "custom-hotspot"
                }
            ]
        },
        hallway: {
            title: "Прихожа",
            type: "equirectangular",
            panorama: "img/hall360.webp",
            hotSpots: [
                {
                    pitch: 2.6886133544092354,
                    yaw: -143.8311379042976,
                    type: "scene",
                    text: "У вітальню",
                    sceneId: "livingRoom",
                    cssClass: "custom-hotspot"
                },
                {
                    pitch: -2.298239705522812,
                    yaw: -50.59031924092803,
                    type: "scene",
                    text: "У кухню",
                    sceneId: "kitchen",
                    cssClass: "custom-hotspot"
                },
                {
                    pitch: -1.5662296969765195,
                    yaw: 38.50662212303356,
                    type: "scene",
                    text: "У спальну",
                    sceneId: "bedroom",
                    cssClass: "custom-hotspot"
                }
            ]
        },
        bath: {
            title: "Ванна",
            type: "equirectangular",
            panorama: "img/bath360.webp",
            hotSpots: [
                {
                    pitch: -19.462335113158826,
                    yaw: -167.59539006286286,
                    type: "scene",
                    text: "У кухню",
                    sceneId: "kitchen",
                    cssClass: "custom-hotspot"
                }
            ]
        }
    }
};

// Ініціалізація Pannellum
let viewer = null;

// DOM Елементи
const planView = document.getElementById('plan-view');
const tourView = document.getElementById('tour-view');
const planHotspots = document.querySelectorAll('.plan-hotspot');
const btnBack = document.getElementById('btn-back');
const btnGallery = document.getElementById('btn-gallery');
const roomTitle = document.getElementById('current-room-title');

let currentRoomId = '';

// 1. Клік по точці на плані зверху
planHotspots.forEach(spot => {
    spot.addEventListener('click', () => {
        const roomId = spot.getAttribute('data-room');
        openTour(roomId);
    });
});

// 2. Кнопка "Назад на карту"
btnBack.addEventListener('click', () => {
    tourView.classList.remove('active');
    planView.classList.add('active');
});

// 3. Відкриття панорами
function openTour(sceneId) {
    currentRoomId = sceneId;
    
    // Перемикаємо екрани
    planView.classList.remove('active');
    tourView.classList.add('active');

    // Якщо viewer ще не створений – створюємо, інакше просто завантажуємо потрібну сцену
    if (!viewer) {
        tourConfig.default.firstScene = sceneId;
        viewer = pannellum.viewer('panorama', tourConfig);
        
        // Слухаємо подію зміни сцени в самому Pannellum, щоб оновлювати заголовок
        viewer.on('scenechange', function(newSceneId) {
            currentRoomId = newSceneId;
            updateUI(newSceneId);
        });
    } else {
        viewer.loadScene(sceneId);
    }
    
    updateUI(sceneId);
}

// 4. Оновлення інтерфейсу (Заголовок та Галерея)
function updateUI(sceneId) {
    const sceneData = tourConfig.scenes[sceneId];
    roomTitle.textContent = sceneData.title;
}

// 5. Кнопка "Фото кімнати" (Запуск Fancybox)
Fancybox.bind("[data-fancybox]", {
    // Налаштування преміум слайдера
    Toolbar: {
        display: {
            left: ["infobar"],
            middle: [],
            right: ["slideshow", "thumbs", "close"],
        },
    },
});

btnGallery.addEventListener('click', () => {
    // Шукаємо перше посилання галереї для поточної кімнати і імітуємо клік
    const firstImageLink = document.querySelector(`a[data-fancybox="gallery-${currentRoomId}"]`);
    if (firstImageLink) {
        firstImageLink.click();
    } else {
        alert('Для цієї кімнати ще не завантажені фотографії.');
    }
});