/* global Swiper */

import data from '../../data/history.json';
import {setupModal} from '../utils/modal';
import {gsap} from 'gsap';

const initSlider = () => {


  if (document.querySelector('.time-line')) {
    /* Главный слайдер */
    const slider = new Swiper('.slider', {
      speed: 1000,
      grabCursor: true,
      freeMode: true,
      watchSlidesVisibility: true,
      // slidesPerView: 'auto',
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
                    <source type="image/webp" srcset="${cover.img}@1x.webp 1x, ${cover.img}@2x.webp 2x">
                    <!-- 1х: 433px; 2x: 866px -->
                    <img src="${cover.img}@1x.jpg" alt="${cover.alt}" width="433" height="320"
                      srcset="${cover.img}@1x.jpg 2x">
                  </picture>
                </div>
                <span class="button button--events">#${events[0].title}</span>
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
      const modalSuccessBtns = document.querySelectorAll('[data-modal="success"]');
      setupModal(modalSuccess, false, modalSuccessBtns);
    });

    let currentNum1 = document.querySelector('.time-line__text-container p:nth-child(2n + 1)');
    let currentNum2 = document.querySelector('.time-line__text-container p:nth-child(2n + 2)');

    slider.on('slideChange', () => {
      let index = slider.realIndex + 1;
      if (index >= 10) {
        currentNum2.classList.add('visually-hidden');

        gsap.to(currentNum1, 0.3, {
          force3D: true,
          y: -67,
          onComplete: () => {
            gsap.to(currentNum1, 0, {
              force3D: true,
              y: 67,
            });
            currentNum1.innerHTML = index;
          },
        });
        gsap.to(currentNum1, 0.3, {
          force3D: true,
          y: 0,
          delay: 0.3,
        });
      } else {
        if (currentNum2.classList.contains('visually-hidden')) {
          currentNum2.classList.remove('visually-hidden');
          currentNum1.innerHTML = '0';
        }
        gsap.to(currentNum2, 0.3, {
          force3D: true,
          y: -67,
          onComplete: () => {
            gsap.to(currentNum2, 0, {
              force3D: true,
              y: 67,
            });
            currentNum2.innerHTML = index;
          },
        });
        gsap.to(currentNum2, 0.3, {
          force3D: true,
          y: 0,
          delay: 0.3,
        });
      }
    });

    /* Главный слайдер модального окна */
    const popupSlider = new Swiper('.popup-slider', {
      slidesPerView: 1,
      speed: 0,
      watchSlidesVisibility: true,
      observer: true,
      observeParents: true,
      observeSlideChildren: true,
      simulateTouch: false,
      // virtual: {
      //   slides: data.years.map((year) => `
      //     <div class="popup-slider__slide swiper-slide" data-year="${year}">

      //       ${data.cards[year].map(({id, title, cover, events, org}) => `
      //       <article class="event" data-id="${id}">
      //       <div class="event__slider swiper-container">
      //         <div class="swiper-wrapper">
      //           <!-- Слайд 1 -->
      //           <div class="event__slide swiper-slide">
      //             <picture>
      //               <!-- 1х: 433px; 2x: 866px -->
      //               <source type="image/webp" srcset="img/slides/slides-photo-1@1x.webp 1x, img/slides/slides-photo-1@2x.webp 2x">
      //               <!-- 1х: 433px; 2x: 866px -->
      //               <img src="img/slides/slides-photo-1@1x.jpg" alt="photo-1" width="433" height="320"
      //                 srcset="img/slides/slides-photo-1@1x.jpg 2x" loading="lazy">
      //             </picture>
      //           </div>
      //           <!-- Слайд 2 -->
      //           <div class="event__slide swiper-slide">
      //             <picture>
      //               <!-- 1х: 433px; 2x: 866px -->
      //               <source type="image/webp" srcset="img/slides/slides-photo-2@1x.webp 1x, img/slides/slides-photo-2@2x.webp 2x">
      //               <!-- 1х: 433px; 2x: 866px -->
      //               <img src="img/slides/slides-photo-2@1x.jpg" alt="photo-1" width="433" height="320"
      //                 srcset="img/slides/slides-photo-2@1x.jpg 2x" loading="lazy">
      //             </picture>
      //           </div>
      //           <!-- Слайд 3 -->
      //           <div class="event__slide swiper-slide">
      //             <picture>
      //               <!-- 1х: 433px; 2x: 866px -->
      //               <source type="image/webp" srcset="img/slides/slides-photo-3@1x.webp 1x, img/slides/slides-photo-3@2x.webp 2x">
      //               <!-- 1х: 433px; 2x: 866px -->
      //               <img src="img/slides/slides-photo-3@1x.jpg" alt="photo-1" width="433" height="320"
      //                 srcset="img/slides/slides-photo-3@1x.jpg 2x" loading="lazy">
      //             </picture>
      //           </div>
      //         </div>
      //         <!-- Пагинация -->
      //         <div class="event__pagination swiper-pagination"></div>
      //         <!-- Кнопки навигации -->
      //         <button class="event__button-prev" type="button">
      //           <svg width="16" height="27">
      //             <use xlink:href="#icon-button-prev"></use>
      //           </svg>
      //         </button>
      //         <button class="event__button-next" type="button">
      //           <svg width="16" height="27">
      //             <use xlink:href="#icon-button-prev"></use>
      //           </svg>
      //         </button>
      //       </div>
      //       <!--  -->
      //       <div class="event__description">
      //         <p>В&nbsp;2001 году в&nbsp;форме закрытого акционерного общества создана Трубная Металлургическая Компания (ТМК). Также для совершения операций по&nbsp;продаже продукции и&nbsp;закупке сырья и основных материалов создан Торговый дом ТМК (ТД&nbsp;ТМК).</p>
      //         <span class="button button--events">${events[0].title}</span>
      //         <span class="button button--tmk-group">${org.title}</span>
      //       </div>
      //     </article>
      //       `).join('')}
      //       </div>`
      //   ),
      // },
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

    /* Галерея в модальном окне */
    const eventSlider = new Swiper('.event__slider', {
      slidesPerView: 1,
      speed: 1000,
      watchSlidesVisibility: true,
      observer: true,
      observeParents: true,
      observeSlideChildren: true,
      nested: true,
      simulateTouch: false,
      effect: 'fade',
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
  }
};

export {initSlider};
