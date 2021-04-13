const initIE11 = () => {
  if (Object.hasOwnProperty.call(window, 'ActiveXObject') && !window.ActiveXObject) {
    const wrapper = document.querySelector('.wrapper');
    const IE11 = document.querySelector('.IE11');

    wrapper.style.display = 'none';

    IE11.classList.add('IE11--show');
  }
};

export {initIE11};
