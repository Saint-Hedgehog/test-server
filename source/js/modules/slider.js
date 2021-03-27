const initSlider = () => {
/* global Swiper */

  if (document.querySelector('.time-line')) {
    const slider = new Swiper('.slider', {
      slidesPerView: 'auto',
      // slidesPerView: 1,
      speed: 1000,
      freeMode: true,
      watchSlidesVisibility: true,
      lazy: {
        loadPrevNext: true,
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      pagination: {
        el: '.pagination',
        clickable: true,
        bulletClass: 'pagination__item',
        bulletActiveClass: 'pagination__current-item',
        renderBullet(index, bulletClass) {
          return '<button class="' + bulletClass + '"type="button">' + (index + 2001) + '</button>';
        },
      },
    });

    // slider.on('progress', () => {
    //   inertNotVisible();
    // });

    // const inertNotVisible = () => {
    //   slider.slides.forEach((slide) => {
    //     if (!slide.classList.contains('swiper-slide-visible')) {
    //       slide.childNodes[1].setAttribute('tabindex', '-1');
    //     } else {
    //       slide.childNodes[1].setAttribute('tabindex', '0');
    //     }
    //   });

    //   slider.pagination.bullets.forEach((bullet) => {
    //     if (bullet.classList.contains('pagination__current-item')) {
    //       bullet.setAttribute('tabIndex', '-1');
    //     } else {
    //       bullet.setAttribute('tabIndex', '0');
    //     }
    //   });
    // };

    // setTimeout(inertNotVisible, 0);

    const popupSlider = new Swiper('.popup-slider', {
      slidesPerView: 1,
      speed: 0,
      watchSlidesVisibility: true,
      observer: true,
      observeParents: true,
      observeSlideChildren: true,
      simulateTouch: false,
      lazy: {
        loadPrevNext: true,
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      navigation: {
        nextEl: '.popup-slider__button-next',
        prevEl: '.popup-slider__button-prev',
      },
    });

    const eventSlider = new Swiper('.event__slider', {
      slidesPerView: 1,
      speed: 1000,
      watchSlidesVisibility: true,
      observer: true,
      observeParents: true,
      observeSlideChildren: true,
      nested: true,
      simulateTouch: false,
      spaceBetween: 20,
      lazy: {
        loadPrevNext: true,
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      pagination: {
        el: '.event__pagination',
        clickable: true,
        bulletClass: 'event__pagination-item',
        bulletActiveClass: 'event__pagination-current-item',
      },
      navigation: {
        clickable: true,
        nextEl: '.event__button-next',
        prevEl: '.event__button-prev',
      },
    });

    // eventSlider.on('progress', () => {
    //   inertNotVisible();
    // });

    // const inertNotVisible = () => {
    //   eventSlider.slides.forEach((slide) => {
    //     if (!slide.classList.contains('swiper-slide-visible')) {
    //       slide.childNodes[1].setAttribute('tabindex', '-1');
    //     } else {
    //       slide.childNodes[1].setAttribute('tabindex', '0');
    //     }
    //   });

    //   eventSlider.pagination.bullets.forEach((bullet) => {
    //     if (bullet.classList.contains('event__pagination-item')) {
    //       bullet.setAttribute('tabIndex', '-1');
    //     } else {
    //       bullet.setAttribute('tabIndex', '0');
    //     }
    //   });
    // };

    // setTimeout(inertNotVisible, 0);

    // eventSlider.controller.control = slider;
  }
};

export {initSlider};
