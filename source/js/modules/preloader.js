const hidePreloader = () => {
  const preloader = document.querySelector('.preloader');
  const wrapper = document.querySelector('.wrapper');

  if (preloader) {
    const btn = preloader.querySelector('.preloader__button');

    btn.addEventListener('click', () => {
      preloader.classList.add('visually-hidden');
      if (wrapper.classList.contains('wrapper--no-scrollbar')) {
        wrapper.classList.remove('wrapper--no-scrollbar');
      }
    });
  }

};

export {hidePreloader};
