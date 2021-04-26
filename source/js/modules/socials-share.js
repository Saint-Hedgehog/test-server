const initShare = () => {
  const share = document.querySelector('.js-footer-social');

  const insertIcon = (id, link) => {
    const template = `
    <svg width="20" height="20">
      <use xlink:href="#${id}"></use>
    </svg>
    `;

    if (link) {
      link.insertAdjacentHTML('afterbegin', template);
    }
  };

  const addClasses = (container) => {
    const list = container.querySelector('.ya-share2__list');

    if (!list) {
      return;
    }

    const items = list.querySelectorAll('.ya-share2__item');
    const links = list.querySelectorAll('.ya-share2__link');

    list.classList.add('footer__social');
    items.forEach((item) => {
      item.classList.add('footer__social-item');
    });
    links.forEach((link) => {
      link.classList.add('footer__social-link');
    });
  };

  const addIcons = (container) => {
    const fbLink = container.querySelector('.ya-share2__item_service_facebook a');
    const tgLink = container.querySelector('.ya-share2__item_service_telegram a');
    const twLink = container.querySelector('.ya-share2__item_service_twitter a');

    insertIcon('icon-fb', fbLink);
    insertIcon('icon-tel', tgLink);
    insertIcon('icon-tw', twLink);
  };

  if (share) {
    const shareUrl = share.dataset.url;
    Ya.share2(share, {
      content: {
        url: shareUrl,
        title: 'Компании ТМК — 20 лет.',
        description: 'Узнайте, какой путь она прошла за эти годы, став одним из крупнейших производителем труб в мире.',
      },
      theme: {
        services: 'facebook,telegram,twitter',
        useLinks: true,
        bare: true,
      },
      hooks: {
        onready() {
          addIcons(share);
          addClasses(share);
        },
      },
    });
  }
};

export {initShare};
