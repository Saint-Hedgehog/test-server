/* global Swiper */

import data from '../../data/history.json';
import {setupModal} from '../utils/modal';
import {gsap} from 'gsap';

const initSlider = () => {
  if (document.querySelector('.time-line')) {
    /* Слайдер в модалке */
    const modalSuccess = document.querySelector('.modal--success');
    const popup = modalSuccess.querySelector('.popup');
    const descriptionElement = modalSuccess.querySelector('.event__description p');
    const eventsElement = modalSuccess.querySelector('.event__description .button--events');
    const orgElement = modalSuccess.querySelector('.event__description .button--enterprises');
    const prevCardBtn = modalSuccess.querySelector('.popup-slider__button-prev');
    const nextCardBtn = modalSuccess.querySelector('.popup-slider__button-next');

    const eventsSlider = new Swiper('.event__slider', {
      slidesPerView: 1,
      speed: 1000,
      effect: 'fade',
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

    let currentYear;
    let currentCard;

    const openCard = (year, card) => {
      currentYear = year;
      currentCard = card;
      const {description, pictures, org, events} = card;
      eventsSlider.removeAllSlides();
      eventsSlider.appendSlide(pictures.map((picture) => `
    <div class="event__slide swiper-slide">
      <picture>
        <!-- 1х: 433px; 2x: 866px -->
        <source type="image/webp" srcset="${picture.img}@1x.webp 1x, ${picture.img}@2x.webp 2x">
        <!-- 1х: 433px; 2x: 866px -->
        <img src="${picture.img}@1x.jpg" alt="${picture.alt}" width="433" height="320"
          srcset="${picture.img}@1x.jpg 2x" loading="lazy">
      </picture>
    </div>
  `));
      eventsSlider.slideTo(0);
      eventsSlider.updateSlides();
      descriptionElement.textContent = description;
      eventsElement.textContent = `#${events[0].title}`;
      orgElement.textContent = org.title;

      orgElement.classList.add(`button--${org.mod}`);
      const arrClassName = orgElement.className.split(' ');
      if (arrClassName.length > 3) {
        const removedClassName = arrClassName.splice(-2, 1).join();
        orgElement.classList.remove(`${removedClassName}`);
      }

      popup.classList.add(`popup--${org.mod}`);
      const arr1ClassName = popup.className.split(' ');
      if (arr1ClassName.length > 2) {
        const removedClassName = arr1ClassName.splice(-2, 1).join();
        popup.classList.remove(`${removedClassName}`);
      }
    };

    prevCardBtn.addEventListener('click', () => {
      const currentYearIndex = data.years.findIndex((year) => year === currentYear);
      const currentCardIndex = data.cards[currentYear].findIndex((card) => card === currentCard);
      if (currentCardIndex > 0) {
        openCard(currentYear, data.cards[currentYear][currentCardIndex - 1]);
      } else if (currentYearIndex > 0) {
        const prevYear = data.years[currentYearIndex - 1];
        const cardsCount = data.cards[prevYear].length;
        openCard(prevYear, data.cards[prevYear][cardsCount - 1]);
      } else {
        const lastYear = data.years[data.years.length - 1];
        const cardsCount = data.cards[lastYear].length;
        openCard(lastYear, data.cards[lastYear][cardsCount - 1]);
      }
    });
    nextCardBtn.addEventListener('click', () => {
      const currentYearIndex = data.years.findIndex((year) => year === currentYear);
      const currentCardIndex = data.cards[currentYear].findIndex((card) => card === currentCard);
      const cardsCount = data.cards[currentYear].length;
      const yearsCount = data.years.length;
      if (currentCardIndex < cardsCount - 1) {
        openCard(currentYear, data.cards[currentYear][currentCardIndex + 1]);
      } else if (currentYearIndex < yearsCount - 1) {
        const nextYear = data.years[currentYearIndex + 1];
        openCard(nextYear, data.cards[nextYear][0]);
      } else {
        const firstYear = data.years[0];
        openCard(firstYear, data.cards[firstYear][0]);
      }
    });

    /* Главный слайдер */
    const slider = new Swiper('.slider', {
      speed: 1000,
      grabCursor: true,
      freeMode: true,
      watchSlidesVisibility: true,
      // slidesPerView: 'auto', // нельзя совмещать с virtual
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
    const updateSlider = ({eventId, orgId} = {}) => {
      slider.removeAllSlides();
      slider.appendSlide(data.years.map((year, index) => {
        // const filter = {
        //   org: [],
        //   event: []
        //   }
        const cards = data.cards[year].filter((card) => {
          if (eventId && !card.events.some((event) => String(event.id) === eventId)) {
            return false;
          }
          if (orgId && String(card.org.id) !== orgId) {
            return false;
          }
          return true;
        });

        // console.log(data.cards[year].events);
        return `
          <div class="slider__slide swiper-slide" data-year="${year}">
          ${index === 0 ? '' : `
            <div class="slider__divider">
              <div class="slider__divider-line"></div>
              <span>
                ${year}
              </span>
            </div>
          `}
            ${cards.map(({id, title, cover, events, org}) => `
            <article class="slider__card" data-id="${id}">
              <a href="#" class="slider__link" data-modal="success" aria-label="">
                <div class="slider__img-container">
                  <div class="slider__img-label slider__img-label--${org.mod}"></div>
                  <picture>
                    <!-- 1х: 433px; 2x: 866px -->
                    <source type="image/webp" srcset="${cover.img}@1x.webp 1x, ${cover.img}@2x.webp 2x">
                    <!-- 1х: 433px; 2x: 866px -->
                    <img src="${cover.img}@1x.jpg" alt="${cover.alt}" width="433" height="320"
                      srcset="${cover.img}@1x.jpg 2x">
                  </picture>
                </div>
                <span class="button button--events">#${events[0].title}</span>
                <span class="button button--${org.mod}">${org.title}</span>
                <p>${title}</p>
              </a>
            </article>
            `).join('')}
            </div>`;
      }));
    };

    slider.on('progress', () => {
      const modalSuccessBtns = document.querySelectorAll('.swiper-slide-visible .slider__link[data-modal="success"]');
      modalSuccessBtns.forEach((btn) => {
        const year = btn.closest('.slider__slide').dataset.year;
        const cardId = btn.closest('.slider__card').dataset.id;
        const card = data.cards[year].find((c) => String(c.id) === cardId);
        setupModal(modalSuccess, null, [btn], () => {
          openCard(year, card);
        });
      });
    });

    updateSlider();

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

    document.querySelectorAll('.footer__filter--enterprises .button').forEach((btn) => {
      btn.addEventListener('click', () => {
        // if (btn.classList.contains('button--active')) {
        //   updateSlider({orgId: btn.dataset.orgId});
        // } else {
        //   // slider.removeAllSlides();
        //   // updateSlider();
        // }
        updateSlider({orgId: btn.dataset.orgId});
      });
    });
    document.querySelectorAll('.footer__filter--events .button').forEach((btn) => {
      btn.addEventListener('click', () => {
        updateSlider({eventId: btn.dataset.eventId});
      });
    });
  }
};

export {initSlider};
