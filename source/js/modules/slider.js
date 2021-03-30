/* global Swiper */

import data from '../../data/history.json';
import {setupModal} from '../utils/modal';
import {gsap} from 'gsap';

const initSlider = () => {
  if (document.querySelector('.time-line')) {
    /* Слайдер в модалке */
    const modalSuccess = document.querySelector('.modal--success');
    const descriptionElement = modalSuccess.querySelector('.event__description p');
    const eventsElement = modalSuccess.querySelector('.event__description .button--events');
    const orgElement = modalSuccess.querySelector('.event__description .button--tmk-group');
    const prevCardBtn = modalSuccess.querySelector('.popup-slider__button-prev');
    const nextCardBtn = modalSuccess.querySelector('.popup-slider__button-next');

    const eventsSlider = new Swiper('.event__slider', {
      slidesPerView: 1,
      speed: 1000,
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
        <source type="image/webp" srcset="${picture}@1x.webp 1x, ${picture}@2x.webp 2x">
        <!-- 1х: 433px; 2x: 866px -->
        <img src="${picture}@1x.jpg" alt="photo-1" width="433" height="320"
          srcset="${picture}@1x.jpg 2x" loading="lazy">
      </picture>
    </div>
  `));
      eventsSlider.slideTo(0);
      eventsSlider.updateSlides();
      descriptionElement.textContent = description;
      eventsElement.textContent = `#${events[0].title}`;
      orgElement.textContent = org.title;
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
      slidesPerView: 'auto', // нельзя совмещать с virtual
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
        const cards = data.cards[year].filter((card) => {
          if (eventId && !card.events.some((event) => String(event.id) === eventId)) {
            return false;
          }
          if (orgId && String(card.org.id) !== orgId) {
            return false;
          }
          return true;
        });
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

    // todo добавить data-event-id в кнопки https://prnt.sc/10zfua6
    // todo добавить data-org-id в кнопки https://prnt.sc/10zfuky
    // todo обнови данные в json, а то там у всех компаний одинаковые id
    document.querySelectorAll('.footer__filter--enterprises .button').forEach((btn) => {
      btn.addEventListener('click', () => {
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
