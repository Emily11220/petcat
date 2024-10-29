const catVideo = document.getElementById('cat-video');
const catImage = document.getElementById('cat-image');
const hand = document.getElementById('hand');
let isDragging = false;
let lastX = 0;
let petCount = 0;
let movements = [];

// Initial hand position
function setInitialHandPosition() {
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;
    updateHandPosition(x, y);
}

function updateHandPosition(x, y) {
    hand.style.left = `${x}px`;
    hand.style.top = `${y}px`;
    hand.style.transform = 'translate(-50%, -50%)';
}

// Start and pause video
function startVideo() {
    catImage.style.display = 'none'; // Hide the cat image
    catVideo.style.display = 'block'; // Show the video
    catVideo.play(); // Play the video
}

function stopVideo() {
    catVideo.pause(); // Pause the video
    catVideo.style.display = 'none'; // Hide the video
    catImage.style.display = 'block'; // Show the cat image again
}

// Detect left-right petting motion
function detectPettingMotion(currentX) {
    movements.push(currentX);
    if (movements.length > 5) {
        movements.shift();
    }

    if (movements.length >= 3) {
        let hasLeftMove = false;
        let hasRightMove = false;
        
        for (let i = 1; i < movements.length; i++) {
            const diff = movements[i] - movements[i-1];
            if (diff > 10) hasRightMove = true;
            if (diff < -10) hasLeftMove = true;
        }
        
        return hasLeftMove && hasRightMove;
    }
    return false;
}

// Handle start, move, and end of dragging
function handleStart(e) {
    isDragging = true;
    const point = e.touches ? e.touches[0] : e;
    lastX = point.clientX;
    movements = [lastX];
    hand.style.transform = 'translate(-50%, -50%) scale(1.1)';
}

function handleMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    const point = e.touches ? e.touches[0] : e;
    const currentX = point.clientX;
    
    updateHandPosition(currentX, point.clientY);
    
    // Check if hand is in pet zone
    const handRect = hand.getBoundingClientRect();
    const petZone = document.querySelector('.pet-zone').getBoundingClientRect();
    
    if (handRect.top >= petZone.top && handRect.bottom <= petZone.bottom) {
        if (detectPettingMotion(currentX)) {
            petCount++;
            if (petCount > 1) { // Reduced threshold for easier triggering on mobile
                startVideo();
            }
        }
    } else {
        petCount = 0;
    }
    
    lastX = currentX;
}

function handleEnd() {
    if (isDragging) {
        isDragging = false;
        hand.style.transform = 'translate(-50%, -50%)';
        stopVideo(); // Only stop video when dragging ends
        setTimeout(() => {
            petCount = 0;
            movements = [];
        }, 300);
    }
}

// Mouse and touch events
hand.addEventListener('mousedown', handleStart);
document.addEventListener('mousemove', handleMove);
document.addEventListener('mouseup', handleEnd);

hand.addEventListener('touchstart', handleStart, { passive: false });
document.addEventListener('touchmove', handleMove, { passive: false });
document.addEventListener('touchend', handleEnd);
document.addEventListener('touchcancel', handleEnd);

// Prevent default drag behavior
hand.addEventListener('dragstart', (e) => e.preventDefault());

// Handle window resize
window.addEventListener('resize', setInitialHandPosition);

// Initial setup
window.addEventListener('load', () => {
    setInitialHandPosition();
    
    document.body.addEventListener('touchstart', (e) => {
        if (e.target === hand) {
            e.preventDefault();
        }
    }, { passive: false });
});

// Prevent scrolling while dragging on mobile
document.body.addEventListener('touchmove', (e) => {
    if (isDragging) {
        e.preventDefault();
    }
}, { passive: false });
