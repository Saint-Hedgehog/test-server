const hidePreloader = () => {
  const preloader = document.querySelector('.preloader');
  const headerLink = document.querySelector('.header__link');
  const footer = document.querySelector('.footer');
  const timeLine = document.querySelector('.time-line--hidden');
  const header = document.querySelector('.wrapper header');

  if (preloader) {
    headerLink.addEventListener('click', () => {
      header.classList.add('header--hidden');
      timeLine.classList.add('time-line--hidden');
      footer.classList.add('footer--hidden');
      preloader.classList.remove('preloader--hidden');
    });

    const btn = preloader.querySelector('.preloader__button');

    btn.addEventListener('click', () => {
      header.classList.remove('header--hidden');
      timeLine.classList.remove('time-line--hidden');
      footer.classList.remove('footer--hidden');
      preloader.classList.add('preloader--hidden');
    });
  }

};

export {hidePreloader};
