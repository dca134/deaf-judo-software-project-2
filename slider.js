const sliderIndexes = {};

function getSliderParts(sliderId) {
    const sliderContainer = document.getElementById(sliderId);
    if (!sliderContainer) {
        return null;
    }

    const slider = sliderContainer.querySelector('.slider');
    const slides = sliderContainer.querySelectorAll('.slider img');
    const prevButton = sliderContainer.querySelector('.prev');
    const nextButton = sliderContainer.querySelector('.next');

    return { sliderContainer, slider, slides, prevButton, nextButton };
}

function updateSlider(sliderId) {
    const parts = getSliderParts(sliderId);
    if (!parts || !parts.slider || parts.slides.length === 0) {
        return;
    }

    const maxIndex = parts.slides.length - 1;
    sliderIndexes[sliderId] = Math.max(0, Math.min(sliderIndexes[sliderId] || 0, maxIndex));
    parts.slider.style.transform = `translateX(${-sliderIndexes[sliderId] * 100}%)`;

    if (parts.prevButton) {
        parts.prevButton.disabled = sliderIndexes[sliderId] === 0;
    }

    if (parts.nextButton) {
        parts.nextButton.disabled = sliderIndexes[sliderId] === maxIndex;
    }
}

function nextSlide(sliderId) {
    const parts = getSliderParts(sliderId);
    if (!parts || parts.slides.length === 0) {
        return;
    }

    sliderIndexes[sliderId] = Math.min((sliderIndexes[sliderId] || 0) + 1, parts.slides.length - 1);
    updateSlider(sliderId);
}

function prevSlide(sliderId) {
    const parts = getSliderParts(sliderId);
    if (!parts || parts.slides.length === 0) {
        return;
    }

    sliderIndexes[sliderId] = Math.max((sliderIndexes[sliderId] || 0) - 1, 0);
    updateSlider(sliderId);
}

function initSlider(sliderId) {
    const parts = getSliderParts(sliderId);
    if (!parts || parts.slides.length === 0) {
        return;
    }

    sliderIndexes[sliderId] = 0;
    updateSlider(sliderId);

    parts.sliderContainer.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            prevSlide(sliderId);
        }

        if (event.key === 'ArrowRight') {
            event.preventDefault();
            nextSlide(sliderId);
        }
    });

    let touchStartX = 0;

    parts.sliderContainer.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });

    parts.sliderContainer.addEventListener('touchend', (event) => {
        const touchEndX = event.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartX;

        if (Math.abs(deltaX) < 48) {
            return;
        }

        if (deltaX > 0) {
            prevSlide(sliderId);
        } else {
            nextSlide(sliderId);
        }
    }, { passive: true });
}

window.addEventListener('load', () => {
    document.querySelectorAll('.slider-container[id]').forEach((sliderContainer) => {
        initSlider(sliderContainer.id);
    });
});
