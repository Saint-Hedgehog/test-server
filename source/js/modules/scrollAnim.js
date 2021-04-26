const initScrollAnim = () => {
  const MOBILE_WIDTH = 1024;
  const SCROLL_STEP = 10;
  const wrapper = document.querySelector('.wrapper');

  // создаем наш обработчик скролла
  const onScrollToggleClass = () => {
    if (wrapper.scrollTop > SCROLL_STEP) {
      wrapper.classList.add('wrapper--active'); // todo модифицируй header
    } else {
      wrapper.classList.remove('wrapper--active'); // todo сними модификацию header
    }
  };

  const onResize = () => {
    if (window.innerWidth < MOBILE_WIDTH) {
      wrapper.addEventListener('scroll', onScrollToggleClass);
    } else {
      wrapper.removeEventListener('scroll', onScrollToggleClass);
    }
  };

  // делаем привязку к ширине экрана (добавляем/удаляем обработчики на скролл)
  window.addEventListener('resize', onResize);

  // при загрузке приложения делаем подписку
  window.addEventListener('load', () =>{
    onResize();
    onScrollToggleClass();
  });

};

export {initScrollAnim};
