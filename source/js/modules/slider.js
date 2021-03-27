const initSlider = () => {
/* global Swiper */

  if (document.querySelector('.time-line')) {
    const slider = new Swiper('.slider', {
      slidesPerView: 'auto',
      // slidesPerView: 1,
      speed: 1000,
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

    const swiper = new Swiper('.event__slider', {
      slidesPerView: 1,
      loop: true,
      speed: 1000,
      watchSlidesVisibility: true,
      observer: true,
      observeParents: true,
      observeSlideChildren: true,
      nested: true,
      lazy: {
        loadPrevNext: true,
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });

    const popupSlider = new Swiper('.popup-slider', {
      slidesPerView: 1,
      speed: 1000,
      loop: true,
      watchSlidesVisibility: true,
      observer: true,
      observeParents: true,
      observeSlideChildren: true,
      lazy: {
        loadPrevNext: true,
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }
};

export {initSlider};
