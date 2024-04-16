document.addEventListener('DOMContentLoaded', () => {

  //burger
  const burger = document.querySelector('.header__burger')
  const menu = document.querySelector('.menu')
  const menuLinks = document.querySelectorAll('.menu__link')
  const menuClose = document.querySelector('.menu__close')

  if(burger) {
    burger.addEventListener('click', () => {
      menu.classList.add('menu--active')
    })
    menuClose.addEventListener('click', () => {
      menu.classList.remove('menu--active')
    })
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('menu--active')
      })
    })
  }

  // tabs
  function tabs(buttonsSelector, buttonActiveClass, contentsSelector, contentActiveClass) {
    const buttons = document.querySelectorAll(buttonsSelector)
    const contents = document.querySelectorAll(contentsSelector)

    if(buttons.length) {
      buttons.forEach((btn, btnIndex)=> {
        btn.addEventListener('click', () => {

          buttons.forEach(btn1 => {
            btn1.classList.remove(buttonActiveClass)
          })
          contents.forEach(content => {
            content.classList.remove(contentActiveClass)
          })

          btn.classList.add(buttonActiveClass)
          contents[btnIndex].classList.add(contentActiveClass)

        })
      })
    }

  }

  tabs('.warranty__button', 'warranty__button--active', '.warranty__content', 'warranty__content--active')

// modal

  function calcScroll() {
    let div = document.createElement('div');

    div.style.width = '50px';
    div.style.height = '50px';
    div.style.overflowY = 'scroll';
    div.style.visibility = 'hidden';

    document.body.appendChild(div);
    let scarollWidth = div.offsetWidth - div.clientWidth;
    div.remove();

    return scarollWidth;
  }

  let scrollWidth = calcScroll();

  function modal(modal, modalActiveClass, triggers, modalClose) {
    const triggers_ = document.querySelectorAll(triggers),
      modal_ = document.querySelector(modal),
      modalClose_ = document.querySelector(modalClose);

    if (triggers_.length > 0) {
      triggers_.forEach(item => {
        item.addEventListener('click', () => {
          modal_.classList.add(modalActiveClass);
          document.body.style.overflow = 'hidden';
          document.body.style.marginRight = `${scrollWidth}px`;
        });
      });

      modalClose_.addEventListener('click', () => {
        modal_.classList.remove(modalActiveClass);
        document.body.style.overflow = '';
        document.body.style.marginRight = '0px';
      });

      modal_.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal__container')) {
          modal_.classList.remove(modalActiveClass);
          document.body.style.overflow = '';
          document.body.style.marginRight = '0px';
        }
      });
    }
  }

  modal('.modal-main', 'modal--active', '[data-modal]', '.modal-main__close');

  // map
  initMap();

  async function initMap() {
    // Промис `ymaps3.ready` будет зарезолвлен, когда загрузятся все компоненты основного модуля API
    await ymaps3.ready;

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls} = ymaps3;

    // Import the package to add a default marker
    const {YMapDefaultMarker} = await ymaps3.import('@yandex/ymaps3-markers@0.0.1');
    const {YMapZoomControl} = await ymaps3.import('@yandex/ymaps3-controls@0.0.1');

    // Иницилиазируем карту
    const map = new YMap(
      // Передаём ссылку на HTMLElement контейнера
      document.getElementById('map'),

      // Передаём параметры инициализации карты
      {
        location: {
          // Координаты центра карты
          center: [38.981844, 45.044355],

          // Уровень масштабирования
          zoom: 16
        }
      }
    );

    // Добавляем слой для отображения схематической карты
    map.addChild(new YMapDefaultSchemeLayer());
    map.addChild(new YMapDefaultFeaturesLayer());

    map.addChild(
      new YMapDefaultMarker({
        coordinates: [38.981844, 45.044355],
        title: 'ДТС-Логистик',
        color: 'blue'
      })
    );

    const controls = new YMapControls({position: 'top right'});

    map.addChild(
      // Using YMapControls you can change the position of the control
      controls
        // Add the zoom control to the map
        .addChild(new YMapZoomControl({}))
    );

  }

  // оптимизированный ресайз
  (function () {
    var throttle = function (type, name, obj) {
      obj = obj || window;
      var running = false;
      var func = function () {
        if (running) {
          return;
        }
        running = true;
        requestAnimationFrame(function () {
          obj.dispatchEvent(new CustomEvent(name));
          running = false;
        });
      };
      obj.addEventListener(type, func);
    };

    /* init - you can init any event */
    throttle("resize", "optimizedResize");
  })();

  const resizeFunctions = []

// handle event
  window.addEventListener("optimizedResize", function () {
    resizeFunctions.forEach(fn => {
      fn()
    })
  })

  // функция для анимации
  function animate({timing, draw, duration, elem, currentPosition, endPosition, inEnd}) {

    let start = performance.now();

    requestAnimationFrame(function animate(time) {
      // timeFraction изменяется от 0 до 1
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;

      // вычисление текущего состояния анимации
      let progress = timing(timeFraction);

      draw(elem, progress, currentPosition, endPosition); // отрисовать её

      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      } else {
        if(inEnd) inEnd()
      }

    });
  }

  // Функция расчёта времени
  function linear(timeFraction) {
    return timeFraction;
  }

  function draw(elem, progress, currentPosition, endPosition) {
    if(endPosition === 0) {
      elem.style.transform = `translateX(${currentPosition - progress * currentPosition}px)`
    } else {
      elem.style.transform = `translateX(${currentPosition + progress * (endPosition - currentPosition)}px)`
    }
  }

  //slider
  function slider(settings) {
    const window_ = document.querySelector(settings.windowSelector),
      field_ = document.querySelector(settings.fieldSelector),
      cards_ = document.querySelectorAll(settings.cardSelector),
      arrowPrev_ = document.querySelector(settings.buttonPrevSelector),
      arrowNext_ = document.querySelector(settings.buttonNextSelector),
      progress_ = document.querySelector(settings.progressSelector),
      dotsWrap_ = document.querySelector(settings.dotsWrapSelector),
      progressNumCurrent = document.querySelector(settings.progressNumCurrentSelector),
      progressNumAll = document.querySelector(settings.progressNumAllSelector);

    let startPoint,
      swipeAction,
      endPoint,
      sliderCounter = 0,
      dots_ = [],
      mouseMoveFlag = false,
      moveLastCardFlag = false,
      auto,
      transformValue = 0;

    if (window_) {

      function clear() {
        startPoint = null
        swipeAction = null
        endPoint = null
        sliderCounter = 0
        mouseMoveFlag = false
        moveLastCardFlag = false
        field_.style.transform = ''
        transformValue = 0
        if (dotsWrap_) {
          dots_.forEach((item, index)=> {
            item.classList.remove(settings.dotActiveClass);
          });
          dots_[0].classList.add(settings.dotActiveClass);
        }
        if (arrowNext_) arrowNext_.classList.remove(settings.buttonActiveClass);
        if (arrowPrev_) arrowPrev_.classList.add(settings.buttonActiveClass);
      }

      if (settings.disabledPoint) {
        function disable() {
          if (document.documentElement.clientWidth > settings.disabledPoint) {
            clear()
          }
        }

        arr.push(disable)
      }

      resizeFunctions.push(clear)

      // считаем расстояние между карточками
      // общая длина всех карточек + расстояния между ними
      const lengthCardAndBetweenCards = cards_[cards_.length - 1].getBoundingClientRect().right - cards_[0].getBoundingClientRect().left;
      // расстояние между карточками
      const betweenCards = (lengthCardAndBetweenCards - (cards_[0].clientWidth * cards_.length)) / (cards_.length -1);

      // считаем количество карточек, помещающихся в окне
      function numberIntegerVisibleCards() {
        return Math.floor((window_.clientWidth + betweenCards) / (cards_[0].clientWidth + betweenCards))
      }
      // считаем на какая часть карточки не помещается
      function partCard() {
        return (window_.clientWidth + betweenCards) / (cards_[0].clientWidth + betweenCards) - Math.trunc((window_.clientWidth + betweenCards) / (cards_[0].clientWidth + betweenCards))
      }
      // проверяем, показывается ли последняя карточка
      function lastCard() {
        if (numberIntegerVisibleCards() === cards_.length) {
          return true
        }
        if ( (sliderCounter + numberIntegerVisibleCards()) === cards_.length) {
          return true
        }
        if ( (sliderCounter + numberIntegerVisibleCards()) > cards_.length) {
          sliderCounter = cards_.length - numberIntegerVisibleCards() - 1
          return true
        }
        return false
      }

      // проверяем, больше ли у нас карточек, чем может поместиться в видимой части слайдера
      function checkNumCards() {
        if (cards_.length > numberIntegerVisibleCards()) {
          return true
        }
        field_.style.transform = '';
        return false
      }

      field_.style.transition = '0s'


      // управление неактивного класса на стрелках
      function checkButtonActiveClass() {
        if (arrowNext_) {
          arrowNext_.classList.remove(settings.buttonActiveClass)
          if(lastCard()) {
            arrowNext_.classList.add(settings.buttonActiveClass)
          }
        }

        if (arrowPrev_) {
          arrowPrev_.classList.remove(settings.buttonActiveClass)
          if(sliderCounter <= 0) arrowPrev_.classList.add(settings.buttonActiveClass)
        }
      }

      checkButtonActiveClass()

      resizeFunctions.push(checkButtonActiveClass)

      //Общее количество слайдов
      if (progressNumAll) progressNumAll.textContent = cards_.length

      //Устанавливаем ширину бегунка прогресс-бара
      if (progress_) {
        progress_.style.width = 100 / cards_.length + '%'
      }

      // Слайд следующий
      function slideNext(dots = false) {
        if (!checkNumCards()) {
          return
        }
        if(!dots) sliderCounter++;
        if (arrowNext_) arrowNext_.classList.remove(settings.buttonActiveClass);
        if (arrowPrev_) arrowPrev_.classList.remove(settings.buttonActiveClass);
        if (sliderCounter >= cards_.length) {
          if (settings.infinite) {
            sliderCounter = 0
          } else {
            sliderCounter = cards_.length - 1;
          }
        }
        if(progressNumCurrent) progressNumCurrent.textContent =  sliderCounter + 1
        if ((sliderCounter + 1) === cards_.length && !settings.infinite) {
          arrowNext_.classList.add(settings.buttonActiveClass);
        }
        if (progress_) progress_.style.left = (100 / cards_.length) * sliderCounter + '%'
        if (dotsWrap_) dots_.forEach(item => item.classList.remove(settings.dotActiveClass))
        if (!settings.infinite && lastCard()) {
          arrowNext_.classList.add(settings.buttonActiveClass);
          const currentTransformValue = transformValue
          transformValue = -(field_.scrollWidth - window_.clientWidth)
          animate({
            timing: linear,
            draw: draw,
            duration: 300,
            elem: field_,
            currentPosition: currentTransformValue,
            endPosition: transformValue
          })
          sliderCounter = Math.ceil(cards_.length - numberIntegerVisibleCards() - partCard())
          if (dotsWrap_) dots_[dots_.length - 1].classList.add(settings.dotActiveClass)
          return
        }
        if (dotsWrap_) dots_[sliderCounter].classList.add(settings.dotActiveClass)

        if(settings.infinite) {
          const currentTransformValue = transformValue
          transformValue = -(cards_[0].scrollWidth + betweenCards)
          animate({
            timing: linear,
            draw: draw,
            duration: 300,
            elem: field_,
            currentPosition: currentTransformValue,
            endPosition: transformValue,
            inEnd: function() {
              const card = document.querySelectorAll(settings.cardSelector)[0]
              card.remove()
              field_.append(card)
              field_.style.transform = ''
              transformValue = 0
            }
          })
          return
        }
        const currentTransformValue = transformValue
        transformValue = -((cards_[0].scrollWidth + betweenCards) * sliderCounter)
        animate({
          timing: linear,
          draw: draw,
          duration: 300,
          elem: field_,
          currentPosition: currentTransformValue,
          endPosition: transformValue
        })
      }

      // Слайд предыдущий

      function slidePrev(dots = false) {
        if (!checkNumCards()) {
          return
        }
        sliderCounter = Math.floor(sliderCounter)
        if(!dots) sliderCounter--;
        if (arrowNext_) arrowNext_.classList.remove(settings.buttonActiveClass);
        if (arrowPrev_) arrowPrev_.classList.remove(settings.buttonActiveClass);
        if (sliderCounter < 0) {
          if(settings.infinite) {
            sliderCounter = cards_.length - 1
          } else {
            sliderCounter = 0;
          }
        }
        if(progressNumCurrent) progressNumCurrent.textContent =  sliderCounter + 1
        if (!settings.infinite && sliderCounter === 0 && arrowPrev_) {
          arrowPrev_.classList.add(settings.buttonActiveClass);
        }
        if (dotsWrap_) {
          dots_.forEach((item, index)=> {
            item.classList.remove(settings.dotActiveClass);
          });
          dots_[sliderCounter].classList.add(settings.dotActiveClass);
        }

        if (progress_) {
          progress_.style.left = (100 / cards_.length) * sliderCounter + '%'
        }
        if(settings.infinite) {
          const card = document.querySelectorAll(settings.cardSelector)[cards_.length - 1]
          const offset = -(cards_[0].scrollWidth + betweenCards)
          const currentTransformValue = transformValue + offset
          transformValue = 0
          card.remove()
          field_.prepend(card)
          field_.style.transform = `translateX(-${currentTransformValue}px)`
          animate({
            timing: linear,
            draw: draw,
            duration: 300,
            elem: field_,
            currentPosition: currentTransformValue,
            endPosition: transformValue
          })
          return
        }
        const currentTransformValue = transformValue
        transformValue = -(cards_[0].scrollWidth + betweenCards) * sliderCounter
        animate({
          timing: linear,
          draw: draw,
          duration: 300,
          elem: field_,
          currentPosition: currentTransformValue,
          endPosition: transformValue
        })
      }

      // Рендер точек

      if (dotsWrap_) {

        cards_.forEach(() => {
          const dot = document.createElement('div');
          dot.classList.add(settings.dotClass);
          dotsWrap_.appendChild(dot);
          dots_.push(dot);
        });
        dots_[0].classList.add(settings.dotActiveClass);
        dots_.forEach((item, index) => {
          item.addEventListener('click', () => {
            if (!checkNumCards()) {
              return
            }
            if (index > sliderCounter) {
              sliderCounter = index;
              slideNext(true)
              return
            }
            if (index < sliderCounter) {
              sliderCounter = index;
              slidePrev(true)
            }
          });
        });
      }

      // Переключение на стрелки
      if (arrowPrev_) {
        arrowPrev_.addEventListener('click', () => {
          if (settings.auto) clearInterval(auto)
          slidePrev();
          if(settings.auto) auto = setInterval(slideNext, 4000)
        });
      }

      if (arrowNext_) {
        arrowNext_.addEventListener('click', () => {
          if (settings.auto) clearInterval(auto)
          slideNext();
          if(settings.auto) auto = setInterval(slideNext, 4000)
        });
      }

      //Автоматическое переключение
      if(settings.auto) {
        auto = setInterval(slideNext, 4000)
      }

      // Свайп слайдов тач-событиями

      window_.addEventListener('touchstart', (e) => {
        swipeAction = 0
        if (settings.auto) clearInterval(auto)
        if(settings.disabledPoint && document.documentElement.clientWidth > settings.disabledPoint) {
          return
        }
        startPoint = e.changedTouches[0].pageX;
        if (!settings.infinite && lastCard() && numberIntegerVisibleCards() < cards_.length) moveLastCardFlag = true

      });

      window_.addEventListener('touchmove', (e) => {
        if(settings.disabledPoint && document.documentElement.clientWidth > settings.disabledPoint) {
          return
        }
        swipeAction = e.changedTouches[0].pageX - startPoint;
        if (moveLastCardFlag && !settings.infinite) {
          field_.style.transform = `translateX(${swipeAction + -(field_.clientWidth - window_.clientWidth)}px)`;
        } else {
          field_.style.transform = `translateX(${swipeAction + transformValue}px)`;
        }
      });

      window_.addEventListener('touchend', (e) => {
        if(settings.disabledPoint && document.documentElement.clientWidth > settings.disabledPoint) {
          return
        }
        transformValue += swipeAction
        moveLastCardFlag = false
        endPoint = e.changedTouches[0].pageX;
        if (Math.abs(startPoint - endPoint) > 40 && checkNumCards()) {
          if (arrowNext_) arrowNext_.classList.remove(settings.buttonActiveClass);
          if (arrowPrev_) arrowPrev_.classList.remove(settings.buttonActiveClass);
          if (endPoint < startPoint) {
            slideNext();
          } else {
            slidePrev();
          }
        } else {
          const currentTransformValue = transformValue
          transformValue -= swipeAction
          animate({
            timing: linear,
            draw: draw,
            duration: 300,
            elem: field_,
            currentPosition: currentTransformValue,
            endPosition: transformValue
          })
        }
        if(settings.auto) auto = setInterval(slideNext, 4000)
      });

      // Свайп слайдов маус-событиями
      window_.addEventListener('mousedown', (e) => {
        if (settings.auto) clearInterval(auto)
        if(settings.disabledPoint && document.documentElement.clientWidth > settings.disabledPoint) {
          return
        }
        e.preventDefault();
        startPoint = e.pageX;
        mouseMoveFlag = true;
        if (!settings.infinite && lastCard()) moveLastCardFlag = true
      });
      window_.addEventListener('mousemove', (e) => {
        if(settings.disabledPoint && document.documentElement.clientWidth > settings.disabledPoint) {
          return
        }
        if (mouseMoveFlag) {
          e.preventDefault();
          swipeAction = e.pageX - startPoint;

          if (moveLastCardFlag) {
            field_.style.transform = `translateX(${swipeAction + -(field_.clientWidth - window_.clientWidth)}px)`;
          } else {
            field_.style.transform = `translateX(${swipeAction + transformValue}px)`;
          }
        }
      });
      window_.addEventListener('mouseup', (e) => {
        if(settings.disabledPoint && document.documentElement.clientWidth > settings.disabledPoint) {
          return
        }
        transformValue += swipeAction
        moveLastCardFlag = false
        mouseMoveFlag = false
        endPoint = e.pageX;
        if (Math.abs(startPoint - endPoint) > 40 && checkNumCards()) {
          if (arrowNext_) arrowNext_.classList.remove(settings.buttonActiveClass);
          if (arrowPrev_) arrowPrev_.classList.remove(settings.buttonActiveClass);
          if (endPoint < startPoint) {
            slideNext();
          } else {
            slidePrev();
          }
        } else if(Math.abs(startPoint - endPoint) === 0) {
          return
        }
        else {
          const currentTransformValue = transformValue
          transformValue -= swipeAction
          animate({
            timing: linear,
            draw: draw,
            duration: 300,
            elem: field_,
            currentPosition: currentTransformValue,
            endPosition: transformValue
          })
        }
        if(settings.auto) auto = setInterval(slideNext, 4000)
      })
      window_.addEventListener('mouseleave', () => {
        if(settings.disabledPoint && document.documentElement.clientWidth > settings.disabledPoint) {
          return
        }
        if (mouseMoveFlag) {
          const currentTransformValue = transformValue + swipeAction
          animate({
            timing: linear,
            draw: draw,
            duration: 300,
            elem: field_,
            currentPosition: currentTransformValue,
            endPosition: transformValue
          })
          // field_.style.transform = `translateX(-${(cards_[0].scrollWidth + betweenCards) * sliderCounter}px)`;
          if(settings.auto) auto = setInterval(slideNext, 4000)
        }
        mouseMoveFlag = false
        moveLastCardFlag = false
      })
    }
  }


  slider({
    windowSelector: '.team__window',
    fieldSelector: '.team__field',
    cardSelector: '.team__card',
    buttonPrevSelector: '.team__arrow--prev',
    buttonNextSelector: '.team__arrow--next',
    buttonActiveClass: 'team__arrow--inactive',
  });


})