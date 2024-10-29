const catGif = document.getElementById('cat-gif');
const catImage = document.getElementById('cat-image');
const hand = document.getElementById('hand');
let isDragging = false;
let lastX = 0;
let petCount = 0;
let movements = [];
let animationFrame;

// Preload the GIF
const preloadGif = () => {
    const img = new Image();
    img.src = catGif.src;
};

function setInitialHandPosition() {
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;
    updateHandPosition(x, y);
}

function updateHandPosition(x, y) {
    // Ensure coordinates stay within viewport bounds
    x = Math.max(0, Math.min(x, window.innerWidth));
    y = Math.max(0, Math.min(y, window.innerHeight));
    
    hand.style.left = `${x}px`;
    hand.style.top = `${y}px`;
    hand.style.transform = 'translate(-50%, -50%)';
}

function startGif() {
    // Ensure elements exist before manipulating
    if (catGif && catImage) {
        catGif.style.display = 'block';
        catImage.style.display = 'none';
        
        // Force browser to recognize the change
        catGif.offsetHeight;
    }
}

function stopGif() {
    if (catGif && catImage) {
        catGif.style.display = 'none';
        catImage.style.display = 'block';
        
        // Force browser to recognize the change
        catImage.offsetHeight;
    }
}

function detectPettingMotion(currentX) {
    movements.push(currentX);
    if (movements.length > 5) {
        movements.shift();
    }

    if (movements.length >= 3) {
        let hasLeftMove = false;
        let hasRightMove = false;
        let threshold = 5; // Reduced threshold for more sensitive detection
        
        for (let i = 1; i < movements.length; i++) {
            const diff = movements[i] - movements[i-1];
            if (diff > threshold) hasRightMove = true;
            if (diff < -threshold) hasLeftMove = true;
        }
        
        return hasLeftMove && hasRightMove;
    }
    return false;
}

function handleStart(e) {
    isDragging = true;
    const point = e.touches ? e.touches[0] : e;
    lastX = point.clientX;
    movements = [lastX];
    hand.style.transform = 'translate(-50%, -50%) scale(1.1)';
    
    // Ensure we're showing the placeholder initially
    catGif.style.display = 'none';
    catImage.style.display = 'block';
}

function handleMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    const point = e.touches ? e.touches[0] : e;
    const currentX = point.clientX;
    const currentY = point.clientY;
    
    // Cancel any existing animation frame
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
    
    // Use requestAnimationFrame for smooth updates
    animationFrame = requestAnimationFrame(() => {
        updateHandPosition(currentX, currentY);
        
        // Check if hand is in pet zone
        const handRect = hand.getBoundingClientRect();
        const petZone = document.querySelector('.pet-zone').getBoundingClientRect();
        
        if (handRect.top >= petZone.top && handRect.bottom <= petZone.bottom) {
            if (detectPettingMotion(currentX)) {
                petCount++;
                if (petCount > 1) {
                    startGif();
                }
            }
        } else {
            petCount = 0;
            stopGif();
        }
        
        lastX = currentX;
    });
}

function handleEnd() {
    isDragging = false;
    hand.style.transform = 'translate(-50%, -50%)';
    stopGif();
    
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
    
    setTimeout(() => {
        petCount = 0;
        movements = [];
    }, 300);
}

// Clean up event listeners on body and document
function setupEventListeners() {
    // Mouse events
    hand.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);

    // Touch events with passive: false for better mobile handling
    hand.addEventListener('touchstart', handleStart, { passive: false });
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    document.addEventListener('touchcancel', handleEnd);

    // Prevent default drag behavior
    hand.addEventListener('dragstart', (e) => e.preventDefault());

    // Handle window resize
    window.addEventListener('resize', setInitialHandPosition);
}

// Initialize everything when the page loads
window.addEventListener('load', () => {
    preloadGif();
    setInitialHandPosition();
    setupEventListeners();
    
    // Prevent unwanted mobile behaviors
    document.body.addEventListener('touchstart', (e) => {
        if (e.target === hand) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Disable page scrolling while dragging
    document.body.addEventListener('touchmove', (e) => {
        if (isDragging) {
            e.preventDefault();
        }
    }, { passive: false });
});