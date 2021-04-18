const initScrollAnim = () => {
  // вверху объявляем наши константы (избегаем магических значений)
  const MOBILE_WIDTH = 1024;
  const SCROLL_STEP = 10;

  let wrapper = document.querySelector('.wrapper'); // вынесем поиск элемента из функции - он же всегда на странице (лишняя операция)

  // создаем наш обработчик скролла
  const onScrollToggleClass = () => {
    if (window.pageYOffset > SCROLL_STEP) {
      wrapper.classList.add('wrapper--active');
    } else {
      wrapper.classList.remove('wrapper--active');
    }
  };

  // делаем привязку к ширине экрана (добавляем/удаляем обработчики на скролл)
  window.addEventListener('resize', () => {
    if (window.innerWidth < MOBILE_WIDTH) {
      window.addEventListener('scroll', onScrollToggleClass);
    } else {
      window.removeEventListener('scroll', onScrollToggleClass);
    }
  });

  // при загрузке приложения делаем подписку
  window.addEventListener('load', onScrollToggleClass);
};

export {initScrollAnim};
