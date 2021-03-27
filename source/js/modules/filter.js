const initFilter = () => {
  const filterEventsBtns = document.querySelectorAll('.footer__filter--events .button');
  const stzBtn = document.querySelector('.button--stz');

  filterEventsBtns.forEach((item) => {
    const toggleBackground = (evt) => {
      const btn = evt.target;
      btn.classList.toggle('button--grey');
    };

    item.addEventListener('click', toggleBackground);
  });

  const toggleContent = () => {
    if (stzBtn.textContent === 'СТЗ') {
      stzBtn.textContent = 'Северский трубный завод';
    } else {
      stzBtn.textContent = 'СТЗ';
    }
  };

  stzBtn.addEventListener('click', toggleContent);
};

export {initFilter};
