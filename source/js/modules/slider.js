/* global Swiper */

// import data from '../../data/history.json';
import {setupModal} from '../utils/modal';
import {gsap} from 'gsap';

const URL = './data/history.json';

const getData = () => {
  return fetch(URL)
      .then((response) => response.json())
      // eslint-disable-next-line no-unused-vars
      .catch((error) => {
      // что-то отрисовать вместо слайдера
      });
};

const renderSlider = (data) => {
  if (!document.querySelector('.time-line')) {
    return;
  }

  /* Слайдер в модалке */
  const modalSuccess = document.querySelector('.modal--success');
  const popup = modalSuccess.querySelector('.popup');
  const descriptionH3 = modalSuccess.querySelector('.event__description h3');
  const descriptionP = modalSuccess.querySelector('.event__description p');
  const eventsElement = modalSuccess.querySelector('.event__description .button--events');
  const orgElement = modalSuccess.querySelector('.event__description .button--enterprises');
  const prevCardBtn = modalSuccess.querySelector('.popup-slider__button-prev');
  const nextCardBtn = modalSuccess.querySelector('.popup-slider__button-next');

  const eventSlider = document.querySelector('.event');
  const eventBtnPrev = eventSlider.querySelector('.event__button-prev');
  const eventBtnNext = eventSlider.querySelector('.event__button-next');


  // слайдер в модальном
  const eventsSlider = new Swiper('.event__slider', {
    slidesPerView: 1,
    speed: 0,
    watchOverflow: true,
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    lazy: {
      loadOnTransitionStart: false,
      loadPrevNext: false,
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

  const openCard = (card) => {
    currentCard = card;
    const {title, description, pictures, org, events} = card;
    eventsSlider.removeAllSlides();
    eventsSlider.appendSlide(pictures.map((picture) => `
      <div class="event__slide swiper-slide">
        ${picture.video ? `
        <iframe
        src="https://youtu.be/NnpaIIHW824"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
        </iframe>
        ` : `
        <picture>
          <!-- 1х: 433px -->
          <source type="image/webp" srcset="${picture.img}.webp">
          <!-- 1х: 433px -->
          <img src="${picture.img}.jpg" alt="${picture.alt}" width="433" height="320" >
        </picture>
        `}
        </div>
    `));
    eventsSlider.slideTo(0);
    eventsSlider.updateSlides();
    descriptionH3.textContent = title;
    descriptionP.textContent = description;
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

    const cards = data.cards[currentYear];
    const currentCardIndex = cards.findIndex((cardItem) => cardItem === currentCard);
    if (currentCardIndex > 0) {
      prevCardBtn.classList.remove('popup-slider__button-prev--disabled');
    } else {
      prevCardBtn.classList.add('popup-slider__button-prev--disabled');
    }

    if (currentCardIndex < cards.length - 1) {
      nextCardBtn.classList.remove('popup-slider__button-next--disabled');
    } else {
      nextCardBtn.classList.add('popup-slider__button-next--disabled');
    }
  };

  prevCardBtn.addEventListener('click', () => {
    const cards = data.cards[currentYear];
    const currentCardIndex = cards.findIndex((card) => card === currentCard);
    if (currentCardIndex > 0) {
      openCard(cards[currentCardIndex - 1]);
    }
  });
  nextCardBtn.addEventListener('click', () => {
    const cards = data.cards[currentYear];
    const currentCardIndex = cards.findIndex((card) => card === currentCard);
    if (currentCardIndex < cards.length - 1) {
      openCard(cards[currentCardIndex + 1]);
    }
  });

  /* Главный слайдер */
  const slider = new Swiper('.slider', {
    preloadImages: false,
    speed: 1000,
    // grabCursor: true,
    // freeMode: true,
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    // slidesPerView: 'auto',
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    // mousewheel: {
    //   sensitivity: 0.5,
    // },
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 24,
        freeMode: false,
        autoHeight: true,
      },
      1024: {
        slidesPerView: 'auto',
        spaceBetween: 0,
        freeMode: true,
        allowTouchMove: false,
      },
    },
    navigation: {
      clickable: true,
      nextEl: '.time-line__button-next',
      prevEl: '.time-line__button-prev',
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
          ${cards.map(({id, title, cover, events, org, preview}) => `
          <article class="slider__card" data-id="${id}">
            <div class="slider__link-container">
              <a href="#" class="slider__link" data-modal="success" aria-label="" tabindex="-1">
                <div class="slider__img-container">
                  <div class="slider__img-label slider__img-label--${org.mod}"></div>
                  ${cover.video ? `
                  <video controls="controls">
                    <source src="${cover.video}.mp4" type='video/mp4'>
                    <source src="https://mooviehosted.000webhostapp.com/trailer.mp4" type='video/mp4'>
                  </video>
                  ` : `
                  <picture>
                    <!-- 1х: 433px -->
                    <source type="image/webp" data-srcset="${cover.img}.webp">
                    <!-- 1х: 433px -->
                    <img src="${cover.img}.jpg" data-srcset="${cover.img}.jpg" alt="${cover.alt}" width="433" height="320"/>
                  </picture>
                  <div class="swiper-lazy-preloader"></div>
                  `}
                </div>
              </a>
              <span class="button button--events">${events.map((event) => `#${event.title}`)}</span>
              <span class="button button--${org.mod}">${org.title}</span>
              <h3>${title}</h3>
              <p class="slider__text">${preview}</p>
            </div>
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
        currentYear = year;
        openCard(card);
      });
    });
  });

  let currentNum1 = document.querySelector('.time-line__first-number');
  let currentNum2 = document.querySelector('.time-line__second-number');

  // смена цифр
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

  slider.on('update slideChange', () => {
    const countPrev = document.querySelector('.time-line__count-prev');
    const countNext = document.querySelector('.time-line__count-next');

    if (countPrev && countNext) {
      const yearPrev = filteredYears[slider.realIndex - 1];
      const yearNext = filteredYears[slider.realIndex + 1];

      countPrev.textContent = yearPrev;
      countNext.textContent = yearNext;
    }
  });

  // фильтры
  const filterEnterprisesWrap = document.querySelector('.enterprises-filter');
  const filterEnterprisesBtns = filterEnterprisesWrap.querySelectorAll('.enterprises-filter__button');

  filterEnterprisesBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterEnterpr(btn);
    });
    const hasEnterprises = data.years.some((year) => {
      return data.cards[year].some((card) => btn.dataset.orgId === String(card.org.id));
    });
    if (!hasEnterprises) {
      btn.classList.add('button--disabled');
    }
  });


  let filterEnterpr = function (btn) {
    let activeBtn = filterEnterprisesWrap.querySelector('.button--active');
    if (activeBtn && activeBtn.dataset.orgId !== btn.dataset.orgId) {
      activeBtn.classList.remove('button--active');
    }

    if (btn.classList.contains('button--active')) {
      filter.org = '';
      btn.classList.remove('button--active');
    } else {
      filter.org = Number(btn.dataset.orgId);
      btn.classList.add('button--active');
    }

    updateSlider();
  };

  const filterEventsWrap = document.querySelector('.events-filter');
  const filterEventsBtns = filterEventsWrap.querySelectorAll('.events-filter__button');

  filterEventsBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterEvents(btn);
    });
    const hasEvents = data.years.some((year) => {
      // eslint-disable-next-line max-nested-callbacks
      return data.cards[year].some((card) => card.events.some((evt) => btn.dataset.eventId === String(evt.id)));
    });
    if (!hasEvents) {
      btn.classList.add('button--disabled');
    }
  });

  let filterEvents = function (btn) {
    const eventId = Number(btn.dataset.eventId);
    if (!btn.classList.contains('button--active')) {
      filter.events.push(eventId);
    } else {
      filter.events.splice(filter.events.findIndex((value) => value === eventId), 1);
    }

    btn.classList.toggle('button--active');
    updateSlider();
  };

  updateSlider();

};

const initSlider = () => {
  getData().then(renderSlider);
};

export {initSlider};
