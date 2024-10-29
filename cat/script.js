const catGif = document.getElementById('cat-gif');
const catimage = document.getElementById('cat-image');
const hand = document.getElementById('hand');
let isDragging = false;
let lastX = 0;
let petCount = 0;
let isPetting = false;
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

// Start GIF and hide the placeholder
function startGif() {
    catGif.style.display = 'block';
    catimage.style.display = 'none';
    isPetting = true;
}

// Stop GIF and show the placeholder (only when dragging ends)
function stopGif() {
    catGif.style.display = 'none';
    catimage.style.display = 'block';
    isPetting = false;
}

// Improved motion detection
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

// Handle both mouse and touch events
function handleStart(e) {
    isDragging = true;
    const point = e.touches ? e.touches[0] : e;
    lastX = point.clientX;
    movements = [lastX];
    hand.style.transform = 'translate(-50%, -50%) scale(1.1)';
    catimage.style.display = 'none'; // Hide placeholder when dragging starts
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
                startGif();
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
        stopGif(); // Only stop GIF when dragging ends
        setTimeout(() => {
            petCount = 0;
            movements = [];
        }, 300);
    }
}

// Mouse events
hand.addEventListener('mousedown', handleStart);
document.addEventListener('mousemove', handleMove);
document.addEventListener('mouseup', handleEnd);

// Touch events
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
    
    // Prevent default touch behaviors
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
