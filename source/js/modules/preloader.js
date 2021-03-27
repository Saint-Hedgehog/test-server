const hidePreloader = () => {
  const preloader = document.querySelector('.preloader');

  if (preloader) {
    const btn = preloader.querySelector('.preloader__button');

    btn.addEventListener('click', () => {
      preloader.classList.add('visually-hidden');
    });
  }

};

export {hidePreloader};
