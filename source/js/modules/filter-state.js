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

    // const removeActive = () => {
    //   filterEnterprisesBtns.forEach((item) => {
    //     if (item.classList.contains('button--active')) {
    //       item.classList.remove('button--active');
    //     }
    //   });
    // };

    // filterEnterprisesBtns.forEach((item) => {
    //   const toggleBackground = (evt) => {
    //     const btn = evt.currentTarget;
    //     removeActive();
    //     btn.classList.toggle('button--active');//почему тогл не работает
    //   };

    //   item.addEventListener('click', toggleBackground);

    // });
  }
};

export {initFilterState};
