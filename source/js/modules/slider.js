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
    const eventSlider = document.querySelector('.event');
    const eventBtnPrev = eventSlider.querySelector('.event__button-prev');
    const eventBtnNext = eventSlider.querySelector('.event__button-next');
    const preloaderBtn = document.querySelector('.preloader__button');
    const timeLine = document.querySelector('.time-line');

    const eventsSlider = new Swiper('.event__slider', {
      slidesPerView: 1,
      speed: 0,
      watchOverflow: true,
      autoHeight: true,
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      mousewheel: {
        sensitivity: 1,
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

    let currentYear;
    let currentCard;
    const filter = {
      org: null,
      events: [],
    };
    let filteredYears = [];

    const openCard = (year, card) => {
      currentYear = year;
      currentCard = card;
      const {description, pictures, org, events} = card;
      eventsSlider.removeAllSlides();
      eventsSlider.appendSlide(pictures.map((picture) => `
        <div class="event__slide swiper-slide">
          ${picture.video ? `
          <video id="video" class="event__video" width="100%" height="100%" poster="">
            <source src="https://mooviehosted.000webhostapp.com/trailer.mp4" type='video/mp4'>
            <source src="${picture.video}.mp4" type='video/mp4'>
          </video>
          <div><button id="play" class="event__video-play" type="button" aria-label="Вопспроизвести видео"></button></div>
          ` : `
          <picture>
            <!-- 1х: 433px -->
            <source type="image/webp" srcset="${picture.img}.webp">
            <!-- 1х: 433px -->
            <img src="${picture.img}.jpg" alt="${picture.alt}" width="433" height="320" loading="lazy">
          </picture>
          `}
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

      if (eventBtnPrev.classList.contains('swiper-button-lock') && eventBtnNext.classList.contains('swiper-button-lock')) {
        eventBtnPrev.classList.add('visually-hidden');
        eventBtnNext.classList.add('visually-hidden');
      } else {
        eventBtnPrev.classList.remove('visually-hidden');
        eventBtnNext.classList.remove('visually-hidden');
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
      preloadImages: false,
      lazy: {
        loadOnTransitionStart: false,
        loadPrevNext: false,
      },
      speed: 1000,
      grabCursor: true,
      freeMode: true,
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
      slidesPerView: 'auto',
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      mousewheel: {
        sensitivity: 1,
      },
      pagination: {
        el: '.pagination',
        clickable: true,
        bulletClass: 'pagination__item',
        bulletActiveClass: 'pagination__current-item',
        renderBullet(index, bulletClass) {
          const year = filteredYears[index];
          if (year) {
            return `<button class="${bulletClass}" type="button">${year}</button>`;
          } else {
            return `<button class="visually-hidden" type="button">${year}</button>`;
          }
        },
      },
    });
    const updateSlider = () => {
      slider.removeAllSlides();
      filteredYears = [];
      const filteredSlides = data.years.map((year, index) => {
        const cards = data.cards[year].filter((card) => {
          // eslint-disable-next-line max-nested-callbacks
          const hasEvents = !filter.events.length || card.events.some(({id}) => filter.events.some((evt) => evt === id));
          const hasOrg = !filter.org || filter.org === card.org.id;
          return hasEvents && hasOrg;
        });

        if (cards.length) {
          filteredYears.push(year);
        } else {
          return null;
        }

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
                  ${cover.video ? `
                  <video controls="controls" id="video">
                    <source src="${cover.video}.mp4" type='video/mp4'>
                    <source src="https://mooviehosted.000webhostapp.com/trailer.mp4" type='video/mp4'>
                  </video>
                  ` : `
                  <picture>
                    <!-- 1х: 433px -->
                    <source type="image/webp" data-srcset="${cover.img}.webp">
                    <!-- 1х: 433px -->
                    <img data-src="${cover.img}.jpg" data-srcset="${cover.img}.jpg" class="swiper-lazy" alt="${cover.alt}" width="433" height="320"/>
                   </picture>
                   <div class="swiper-lazy-preloader"></div>
                  `}
                </div>
                <span class="button button--events">${events.map((event) => `#${event.title}`)}</span>
                <span class="button button--${org.mod}">${org.title}</span>
                <p>${title}</p>
              </a>
            </article>
            `).join('')}
            </div>`;
      }).filter((markup) => !!markup);
      slider.appendSlide(filteredSlides);
      slider.update();
      if (filteredYears[0]) {
        currentNum1.textContent = filteredYears[0][2];
        currentNum2.textContent = filteredYears[0][3];
      }
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

    let currentNum1 = document.querySelector('.time-line__text-container p:nth-child(2n + 1)');
    let currentNum2 = document.querySelector('.time-line__text-container p:nth-child(2n + 2)');

    slider.on('slideChange', () => {
      const year = filteredYears[slider.realIndex];
      let firstDigit = year[2];
      let secondDigit = year[3];

      gsap.to(currentNum1, 0.3, {
        force3D: true,
        y: -67,
        onComplete: () => {
          gsap.to(currentNum1, 0, {
            force3D: true,
            y: 67,
          });
          currentNum1.innerHTML = firstDigit;
        },
      });
      gsap.to(currentNum1, 0.3, {
        force3D: true,
        y: 0,
        delay: 0.3,
      });
      gsap.to(currentNum2, 0.3, {
        force3D: true,
        y: -67,
        onComplete: () => {
          gsap.to(currentNum2, 0, {
            force3D: true,
            y: 67,
          });
          currentNum2.innerHTML = secondDigit;
        },
      });
      gsap.to(currentNum2, 0.3, {
        force3D: true,
        y: 0,
        delay: 0.3,
      });
    });

    const removeActive = () => {
      document.querySelectorAll('.footer__filter--enterprises .button').forEach((item) => {
        if (item.classList.contains('button--active')) {
          item.classList.remove('button--active');
        }
      });
    };
    document.querySelectorAll('.footer__filter--enterprises .button').forEach((btn) => {

      btn.addEventListener('click', () => {
        filter.org = Number(btn.dataset.orgId);
        removeActive();
        btn.classList.toggle('button--active');
        updateSlider();
      });
    });
    document.querySelectorAll('.footer__filter--events .button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const eventId = Number(btn.dataset.eventId);
        if (btn.classList.contains('button--active')) {
          filter.events.push(eventId);
        } else {
          filter.events.splice(filter.events.findIndex((value) => value === eventId), 1);
        }
        updateSlider();
      });
    });

    preloaderBtn.addEventListener('click', () => {
      if (!timeLine.classList.contains('time-line--hidden')) {
        updateSlider();
      }
    });

    updateSlider();
  }
};

export {initSlider};
