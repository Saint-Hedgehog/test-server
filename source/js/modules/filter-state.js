const initFilterState = () => {
  const filterEventsBtns = document.querySelectorAll('.footer__filter--events .button');
  const filterEnterprisesBtns = document.querySelectorAll('.footer__filter--enterprises .button');

  if (filterEventsBtns) {
    filterEventsBtns.forEach((item) => {
      const toggleBackground = (evt) => {
        const btn = evt.target;
        btn.classList.toggle('button--active');
      };

      item.addEventListener('click', toggleBackground);
    });

    filterEnterprisesBtns.forEach((item) => {
      const toggleContent = () => {
        item.classList.toggle('button--active');
        item.firstElementChild.classList.toggle('visually-hidden');
        item.lastElementChild.classList.toggle('visually-hidden');
      };

      item.addEventListener('click', toggleContent);
    });
  }
};

export {initFilterState};
