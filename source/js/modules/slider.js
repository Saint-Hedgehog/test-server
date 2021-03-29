/* global Swiper */
import data from '../../data/history.json';
import {setupModal} from '../utils/modal';


const initSlider = () => {
  if (document.querySelector('.time-line')) {
    const slider = new Swiper('.slider', {
      speed: 1000,
      grabCursor: true,
      freeMode: true,
      watchSlidesVisibility: true,
      virtual: {
        slides: data.years.map((year, index) => `
          <div class="slider__slide swiper-slide" data-year="${year}">
          ${index === 0 ? '' : `
            <div class="slider__divider">
              <div class="slider__divider-line"></div>
              <span>
                ${year}
              </span>
            </div>
          `}
            ${data.cards[year].map(({id, title, cover, events, org}) => `
            <article class="slider__card" data-id="${id}">
              <a href="#" class="slider__link" data-modal="success" aria-label="">
                <div class="slider__img-container">
                  <div class="slider__img-label slider__img-label--tmk-group"></div>
                  <picture>
                    <!-- 1х: 433px; 2x: 866px -->
                    <source type="image/webp" srcset="${cover}@1x.webp 1x, ${cover}@2x.webp 2x">
                    <!-- 1х: 433px; 2x: 866px -->
                    <img src="${cover}@1x.jpg" alt="photo-1" width="433" height="320"
                      srcset="${cover}@1x.jpg 2x">
                  </picture>
                </div>
                <span class="button button--events">${events.map((event) => `#${event.title}`)}</span>
                <span class="button button--tmk-group">${org.title}</span>
                <p>${title}</p>
              </a>
            </article>
            `).join('')}
            </div>`
        ),
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
          const year = data.years[index];
          return `<button class="${bulletClass}">${year}</button>`;
        },
      },
    });
    const modalSuccess = document.querySelector('.modal--success');
    slider.on('progress', () => {
      // inertNotVisible();
      const modalSuccessBtns = document.querySelectorAll('[data-modal="success"]');
      setupModal(modalSuccess, false, modalSuccessBtns);
    });

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

    // const popupSlider = new Swiper('.popup-slider', {
    //   slidesPerView: 1,
    //   speed: 0,
    //   watchSlidesVisibility: true,
    //   observer: true,
    //   observeParents: true,
    //   observeSlideChildren: true,
    //   simulateTouch: false,
    //   lazy: {
    //     loadPrevNext: true,
    //   },
    //   keyboard: {
    //     enabled: true,
    //     onlyInViewport: true,
    //   },
    //   navigation: {
    //     nextEl: '.popup-slider__button-next',
    //     prevEl: '.popup-slider__button-prev',
    //   },
    // });
    //
    // const eventSlider = new Swiper('.event__slider', {
    //   slidesPerView: 1,
    //   speed: 1000,
    //   watchSlidesVisibility: true,
    //   observer: true,
    //   observeParents: true,
    //   observeSlideChildren: true,
    //   nested: true,
    //   simulateTouch: false,
    //   effect: 'fade',
    //   lazy: {
    //     loadPrevNext: true,
    //   },
    //   keyboard: {
    //     enabled: true,
    //     onlyInViewport: true,
    //   },
    //   pagination: {
    //     el: '.event__pagination',
    //     clickable: true,
    //     bulletClass: 'event__pagination-item',
    //     bulletActiveClass: 'event__pagination-current-item',
    //   },
    //   navigation: {
    //     clickable: true,
    //     nextEl: '.event__button-next',
    //     prevEl: '.event__button-prev',
    //   },
    // });

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
