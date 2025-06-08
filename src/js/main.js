(() => {
  // trapFocus, setFocusOne from utils.js

  // ---------------------------------------------------- //
  //                  DOMContentLoaded                    //
  // ---------------------------------------------------- //

  document.addEventListener('DOMContentLoaded', () => {

    // ------------------- forms ------------------------ //

    // это предотвращает перезагрузку страницы
    const aboutForm = document.querySelector('.about__form');
    aboutForm.addEventListener('submit', (e) => {
      e.preventDefault();
    });

    // это предотвращает перезагрузку страницы
    const contactsForm = document.querySelector('.contacts__form');
    contactsForm.addEventListener('submit', (e) => {
      e.preventDefault();
    });

    // это предотвращает перезагрузку страницы
    const boxInputs = document.querySelectorAll('.input-box__input');
    for (const boxInput of boxInputs) {
      boxInput.onkeydown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
        }
      }
    }

    // ------------------- blindBody --------------------- //

    const blindBody = document.querySelector('.body-blind');

    function addScrollbarPadding() {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      if (scrollbarWidth > 0) {
          document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    function removeScrollbarPadding() {
        document.body.style.paddingRight = '';
    }

    function openBlind() {
      addScrollbarPadding();

      blindBody.classList.add('body-blind--active');
      document.body.classList.add('stop-scroll');
    }

    function closeBlind() {
      removeScrollbarPadding();

      blindBody.classList.remove('body-blind--active');
      document.body.classList.remove('stop-scroll');
    }

    // ------------------- burger ------------------------ //

    const burgerBtnOpen = document.querySelector('.header__burger-open-btn');
    const burgerBox = document.querySelector('.header__burger-box');
    const burgerBtnClose = document.querySelector('.header__burger-close-btn');
    const menuLinks = document.querySelectorAll('.nav__link');
    const burgerTelLink = document.querySelector('.header__burger-tel-link');

    function closeBurger() {
      burgerBox.classList.remove('header__burger-box--active');
      burgerBtnOpen.classList.remove('header__burger-open-btn--hidden');

      closeBlind();
      blindBody.removeEventListener('click', closeBurger);
    }

    function openBurger() {
      openBlind();
      blindBody.addEventListener('click', closeBurger);

      burgerBox.classList.add('header__burger-box--active');
      burgerBtnOpen.classList.add('header__burger-open-btn--hidden');
    }

    // --- //

    burgerBtnOpen.addEventListener('click', function() {
      openBurger();
    });

    burgerBtnClose.addEventListener('click', function() {
      closeBurger();
    });

    menuLinks.forEach((el) => {
      el.addEventListener('click', function() {
        if (burgerBox.classList.contains('header__burger-box--active')) {
          closeBurger();
        }
      });
    });

    burgerTelLink.addEventListener('click', function() {
      closeBurger();
    });

    // ------------------- window-search ----------------- //

    const searchBtnOpen = document.querySelector('.header__search-btn');
    const windowSearch = document.querySelector('.header__window-search');
    const searchBtnClose = document.querySelector('.header__search-btn-close');
    const inputSearch = document.querySelector('.header__input-search');

    // это предотвращает перезагрузку страницы
    windowSearch.addEventListener('submit', (e) => {
      e.preventDefault();
    });

    // это предотвращает перезагрузку страницы
    inputSearch.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    }

    trapFocus(windowSearch);

    function closeWindowSearch() {
      closeBlind();
      blindBody.removeEventListener('click', closeWindowSearch);

      windowSearch.classList.remove('header__window-search--active');
      searchBtnOpen.classList.remove('header__search-btn--hidden');

      setFocusOne(searchBtnOpen);
    }

    function openWindowSearch() {
      openBlind();
      blindBody.addEventListener('click', closeWindowSearch);

      windowSearch.classList.add('header__window-search--active');
      searchBtnOpen.classList.add('header__search-btn--hidden');

      // trapFocus(windowSearch);
      // setFocusOne(searchBtnClose);
      setFocusOne(inputSearch);
    }

    // --- //

    searchBtnOpen.addEventListener('click', function() {
      openWindowSearch();
    });

    searchBtnClose.addEventListener('click', function() {
      closeWindowSearch();
    });

  });
    // end DOMContentLoaded
}) ();
