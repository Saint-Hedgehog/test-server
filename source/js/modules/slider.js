/* global Swiper*/

import {setupModal} from '../utils/modal';
import {gsap} from 'gsap';

const URL = 'https://tmk.stillbeta.app/api/cards/all';

const loadData = function () {
  return fetch(URL)
      .then((res) => res.json())
      .then(({cards, years, events, orgs}) => {
        const cards_by_years = {};
        if (cards && cards.length > 0) {
          cards.forEach((card) => {
            const {year} = card;
            if (!cards_by_years[year]) {
              cards_by_years[year] = [];
            }
            cards_by_years[year].push(card);
          });
        }
        return {cards: cards_by_years, years, events, orgs};
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
  const headerFilterBtn = document.querySelector('.header__filter');
  let videoSrc;

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
    on: {
      slideChangeTransitionEnd() {
        let videoSlide = popup.querySelector('.swiper-slide--video');

        if (videoSlide) {
          let video = videoSlide.querySelector('iframe');
          videoSrc = video.getAttribute('data-src');

          if (videoSlide.classList.contains('swiper-slide-active')) {
            video.setAttribute('src', videoSrc);
          } else {
            video.setAttribute('src', '');
          }
        }
      },
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
    // останавливаем видео с предыдущего слайда
    document.dispatchEvent(new CustomEvent('stopVideo'));

    currentCard = card;
    const {title, description, slides, org, events} = card;
    eventsSlider.removeAllSlides();
    eventsSlider.appendSlide(slides.map((slide) => `
      <div class="event__slide swiper-slide ${slide.video ? 'swiper-slide--video' : ''}">
        ${slide.video ? `
          <iframe class="loaded-element" id="video" frameborder="0" allowfullscreen"
          data-src="${slide.video}" src="${slide.video}">
          </iframe>
        ` : `
          <picture>
            <!-- 1х: 433px -->
            <source type="image/webp" srcset="${slide.image}">
            <!-- 1х: 433px -->
            <img class="loaded-element" src="${slide.image}" width="433" height="320" >
          </picture>
        `}
        </div>
    `));
    eventsSlider.slideTo(0);
    eventsSlider.updateSlides();
    descriptionH3.innerHTML = title;
    descriptionP.innerHTML = description;
    if (events.length) {
      eventsElement.textContent = `#${events[0].title}`;
    }
    orgElement.textContent = org.title;

    orgElement.classList.add(`button--${org.id}`);
    const arrClassName = orgElement.className.split(' ');
    if (arrClassName.length > 3) {
      const removedClassName = arrClassName.splice(-2, 1).join();
      orgElement.classList.remove(`${removedClassName}`);
    }

    popup.classList.add(`popup--${org.id}`);
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

    let loaded = document.querySelector('.loaded-element');
    loaded.addEventListener('load', () => {
      document.body.classList.remove('modal-loader-on');
    });
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
    // freeMode: true,
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    // slidesPerView: 'auto',
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    mousewheel: {
      sensitivity: 0.5,
    },
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

  const buildSlideItem = ({id, title, cover, events, org, short_description}) => {
    return `
      <article class="slider__card" data-id="${id}">
        <div class="slider__link-container">
          <a href="#" class="slider__link" data-modal="success" aria-label="" tabindex="-1">
            <div class="slider__img-container">
              <div class="slider__img-label slider__img-label--${org.id}"></div>
              <picture>
                <img src="${cover}" data-srcset="${cover}" width="433" height="320"/>
              </picture>
              <div class="swiper-lazy-preloader"></div>
            </div>
          </a>
          <span class="button button--events">${events.map((event) => `#${event.title}`)}</span>
          <span class="button button--timeline-enterprises button--${org.id}">${org.title}</span>
          <h3>${title}</h3>
          <p class="slider__text">${short_description}</p>
        </div>
      </article>
    `;
  };

  const buildSlide = (year) => {
    const cards = data.cards[year].filter((card) => {
      // eslint-disable-next-line max-nested-callbacks
      const hasEvents = !filter.events.length || card.events.some(({id}) => filter.events.some((event_id) => event_id === id));
      const hasOrg = !filter.org || filter.org === card.org.id;
      return hasEvents && hasOrg;
    });

    if (cards.length) {
      filteredYears.push(year);
    } else {
      return null;
    }
    const first_year = data.years[0];

    return `
      <div class="slider__slide swiper-slide" data-year="${year}">
        ${year === first_year ? '' : `
          <div class="slider__divider">
            <div class="slider__divider-line"></div>
            <span>
              ${year}
            </span>
          </div>
        `}
        ${cards.map(buildSlideItem).join('')}
    </div>`;
  };

  const appendSlides = (year) => {
    const slide = buildSlide(year);
    if (!slide) {
      return;
    }
    slider.appendSlide(slide);
  };

  const updateSlider = () => {
    slider.removeAllSlides();
    filteredYears = [];
    data.years.forEach(appendSlides);
  };

  slider.on('update resize', () => {
    if (window.innerWidth < 1024) {
      slider.mousewheel.disable();
    } else {
      slider.mousewheel.enable();
    }
  });

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
    const year = filteredYears[slider.realIndex].toString();
    let firstDigit = year[2];
    let secondDigit = year[3];
    currentNum1.textContent = year[2];
    currentNum2.textContent = filteredYears[0][3];

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
  const filterEnterprisesWraps = document.querySelectorAll('.enterprises-filter');
  filterEnterprisesWraps.forEach((filterEnterprisesWrap) => {
    filterEnterprisesWrap.innerHTML = data.orgs.map((org) => `
    <li class="enterprises-filter__item enterprises-filter__item--${org.id}">
      <button class="enterprises-filter__button button button--${org.id}" type="button" aria-label="" data-org-id="${org.id}">
        <span>${org.short_title}</span>
        <span>${org.title}</span>
      </button>
    </li>
  `).join('');

    const filterEnterprisesBtns = filterEnterprisesWrap.querySelectorAll('.enterprises-filter__button');

    filterEnterprisesBtns.forEach((btn) => {
      btn.addEventListener('click', () => filterEnterpr(btn));
    });

    const filterEnterpr = function (btn) {
      const orgId = parseInt(btn.dataset.orgId);
      if (filter.org === orgId) {
        filter.org = null;
        btn.classList.remove('button--active');
      } else {
        filter.org = orgId;
        const active = filterEnterprisesWrap.querySelector('.button--active');
        if (active) {
          active.classList.remove('button--active');
        }
        btn.classList.add('button--active');
      }

      if (btn.classList.contains('button--active')) {
        headerFilterBtn.classList.add('header__filter--active');
      } else {
        headerFilterBtn.classList.remove('header__filter--active');
      }

      updateSlider();
    };
  });

  const filterEventsWraps = document.querySelectorAll('.events-filter');
  filterEventsWraps.forEach((filterEventsWrap) => {
    filterEventsWrap.innerHTML = data.events.map((event) => `
    <li>
      <button class="events-filter__button button button--events" type="button" data-event-id="${event.id}" aria-label="">#${event.title}</button>
    </li>
  `).join('');
    const filterEventsBtns = filterEventsWrap.querySelectorAll('.events-filter__button');

    filterEventsBtns.forEach((btn) => {
      btn.addEventListener('click', () => filterEvents(btn));
    });

    const filterEvents = (btn) => {
      const eventId = parseInt(btn.dataset.eventId);
      if (!btn.classList.contains('button--active')) {
        filter.events.push(eventId);
      } else {
        filter.events.splice(filter.events.findIndex((value) => value === eventId), 1);
      }

      btn.classList.toggle('button--active');

      if (btn.classList.contains('button--active')) {
        headerFilterBtn.classList.add('header__filter--active');
      } else {
        headerFilterBtn.classList.remove('header__filter--active');
      }
      updateSlider();
    };
  });

  updateSlider();
};

const initSlider = () => {
  loadData().then(renderSlider);
};

export {initSlider};
