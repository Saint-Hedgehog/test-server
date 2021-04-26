const initFilter = () => {
  const filterOpenBtn = document.querySelector('.header__filter');
  const filterCloseBtn = document.querySelector('.filter__close-btn');
  const filter = document.querySelector('.filter');

  if (filter) {
    const openFilter = () => {
      if (!filter.classList.contains('filter--active')) {
        filter.classList.add('filter--active');
      }

      const closeFilter = () => {
        if (filter.classList.contains('filter--active')) {
          filter.classList.remove('filter--active');
        }

        filterCloseBtn.removeEventListener('click', closeFilter);

      };

      filterCloseBtn.addEventListener('click', closeFilter);
    };

    filterOpenBtn.addEventListener('click', openFilter);
  }
};

export {initFilter};
