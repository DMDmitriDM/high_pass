function trapFocus(element) {
  const focusElements = [
	'a[href]:not([disabled])',
	'button:not([disabled])',
	'textarea:not([disabled])',
	'input[type="text"]:not([disabled])',
	'input[type="radio"]:not([disabled])',
	'input[type="checkbox"]:not([disabled])',
	'select:not([disabled])'
  ];

  const focusableEls = element.querySelectorAll(focusElements);
  const firstFocusableEl = focusableEls[0];
  const lastFocusableEl = focusableEls[focusableEls.length - 1];
  const KEYCODE_TAB = 9;

  element.addEventListener('keydown', function(e) {
    const isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

    if (!isTabPressed) {
      return;
    }

    /* shift + tab */
    if ( e.shiftKey ) {
      if (document.activeElement === firstFocusableEl) {
        lastFocusableEl.focus();
        e.preventDefault();
      }
    /* tab */
    } else  {
      if (document.activeElement === lastFocusableEl) {
        firstFocusableEl.focus();
        e.preventDefault();
      }
    }
  });
}

function setFocusOne(element) {
  setTimeout(() => {
    element.focus();
  }, 100);
}
