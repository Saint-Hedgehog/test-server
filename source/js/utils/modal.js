import {disableScrolling, enableScrolling} from './scroll-lock';

const openModal = (modal, callback, preventScrollLock) => {
  modal.classList.add('modal--active');

  if (callback) {
    callback();
  }

  if (!preventScrollLock) {
    disableScrolling();
  }
};

const closeModal = (modal, callback, preventScrollLock) => {
  const videos = document.querySelectorAll('#video');

  modal.classList.remove('modal--active');

  videos.forEach((video) => {
    video.setAttribute('src', ' ');
  });

  if (callback) {
    callback();
  }

  if (!preventScrollLock) {
    setTimeout(enableScrolling, 300);
  }

  const textContainer = document.querySelector('.event__text-container');
  textContainer.scrollTo(0, 0);
};

const onEscPress = (evt, modal, callback) => {
  const isEscKey = evt.key === 'Escape' || evt.key === 'Esc';

  if (isEscKey && modal.classList.contains('modal--active')) {
    evt.preventDefault();
    closeModal(modal, callback);
  }
};

const setModalListeners = (modal, closeCallback, preventScrollLock) => {
  const overlay = modal.querySelector('.modal__overlay');
  const closeBtn = modal.querySelectorAll('.modal__close-btn');

  closeBtn.forEach((item) => {
    item.addEventListener('click', () => {
      closeModal(modal, closeCallback, preventScrollLock);
    });
  });

  overlay.addEventListener('click', () => {
    closeModal(modal, closeCallback, preventScrollLock);
  });

  document.addEventListener('keydown', (evt) => {
    onEscPress(evt, modal, closeCallback, preventScrollLock);
  });
};

const setupModal = (modal, closeCallback, modalBtns, openCallback, noPrevDefault, preventScrollLock) => {
  if (modalBtns) {

    modalBtns.forEach((btn) => {
      btn.addEventListener('click', (evt) => {
        if (!noPrevDefault) {
          evt.preventDefault();
        }

        document.body.classList.add('modal-loader-on');

        openModal(modal, openCallback, preventScrollLock);
      });
    });
  }

  setModalListeners(modal, closeCallback, preventScrollLock);
};

export {setupModal, openModal, closeModal};
