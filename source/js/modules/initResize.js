const initResize = () => {
  const wrapper = document.querySelector('.wrapper');
  const resizeText = document.querySelector('.resize-text');

  const resize = function () {
    if (window.innerWidth < 1024) {
      wrapper.style.display = 'none';
      resizeText.classList.add('resize-text--show');
    }

    if (window.innerWidth >= 1024) {
      wrapper.style.display = 'block';
      resizeText.classList.remove('resize-text--show');
    }
  };

  if (window.innerWidth < 1024) {
    wrapper.style.display = 'none';
    resizeText.classList.add('resize-text--show');
  }

  if (window.innerWidth >= 1024) {
    wrapper.style.display = 'block';
    resizeText.classList.remove('resize-text--show');
  }

  window.addEventListener('resize', resize);
};

export {initResize};
