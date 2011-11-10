/* Modernizr 2.0.6 (Custom Build) | MIT & BSD
 * Build: http://www.modernizr.com/download/#-
 * CSS-Animation, CSS-Transitions detection
 */
;window.Modernizr=function(a,b,c){function w(a,b){return!!~(""+a).indexOf(b)}function v(a,b){return typeof a===b}function u(a,b){return t(prefixes.join(a+";")+(b||""))}function t(a){j.cssText=a}var d="2.0.6",e={},f=b.documentElement,g=b.head||b.getElementsByTagName("head")[0],h="modernizr",i=b.createElement(h),j=i.style,k,l=Object.prototype.toString,m={},n={},o={},p=[],q,r={}.hasOwnProperty,s;!v(r,c)&&!v(r.call,c)?s=function(a,b){return r.call(a,b)}:s=function(a,b){return b in a&&v(a.constructor.prototype[b],c)};for(var x in m)s(m,x)&&(q=x.toLowerCase(),e[q]=m[x](),p.push((e[q]?"":"no-")+q));t(""),i=k=null,e._version=d;return e}(this,this.document);

;(function ($) {
	var methods = {
		init: function (options) {
			var settings = {
				'items': '.RotatorItem',		// Селектор слайдов
				'visibleCount': 1,				// Количество видимых элементов
				'changeCount': 1,				// Количество меняющихся элементов
				'speed': 1000,					// Скорость прокрутки одного слайда
				'prev': null,					// Селектор кнопки "Назад"
				'next': null,					// Селектор кнопки "Вперед"
				'navigation': null,				// Селектор для навигационного бара
				'navDrawPageNumber': false,		// Рисовать ли на кнопках нав. бара номера страниц
				'navPageTemplate': '<a href="#"><span>$i</span></a>', // Шаблон для кнопки в навигаторе
				'useSwipeTouch': false,			// Прокрутка слайдов по тачпадовским жестам.
				'hashPrefix': false,			// Префикс на который ротатор будет отзываться, если не указан - на хэши ротатор не реагирует.
				'onMoveComplete': false, 		// Функция, вызываемая после завершения анимации шага
				'easing': "swing",				// Эффекты переходов кроме "linear" или "swing" (т.е. нестандартные) требуют для работы easing-плагин
				'keyboardNavigation': false,	// Переключение слайдов по стрелкам клавиатуры. Больше одного на страницу врядли стоит делать.
				'autoPlay': false,				// Режим слайдшоу
				'delay': 6000, 					// Задержка между переключениями слайдов в режиме слайдшоу (без учета speed)
				'pauseOnHover': false,			// Ставить ротатор на паузу, когда мышь над ним. На айпаде нет ховера!
				'lazyLoad': false				// Загружать только слайд на который переходим, работает только для 1 картинки на слайд
			};
			if (options) {
				$.extend(settings, options);
			}
			if (settings.changeCount > settings.visibleCount) {
				settings.changeCount = settings.visibleCount;
			}
			return this.each(function () {

				var wrapper = $(this);
				wrapper.settings = settings;

				wrapper.currentPage = 1;
				wrapper.timer = null;					// Таймер, автоматически переключает слайды
				wrapper.animating = false;				// Новый индикатор того, что ротатор в процессе анимации между слайдами
				wrapper.playing = false;				// Внутренний индикатор активности режима слайдшоу
				wrapper.$items = wrapper.children(wrapper.settings.items);
				wrapper.items_count = wrapper.$items.length;
				wrapper.containerName = "RotatorContainer";						// В контейнер с таким классом будут обёрнуты все слайды
				wrapper.containerSelector = "." + wrapper.containerName;		// Селектор для контейнера
				wrapper.after_animate_css = { 'margin-left': 0, 'left': 0 };	// Применяются к слайду по завершении анимации

				var buttons_array = [];
				if (wrapper.settings.prev) { buttons_array.push(wrapper.settings.prev); }
				if (wrapper.settings.next) { buttons_array.push(wrapper.settings.next); }
				wrapper.settings.buttons_selector = buttons_array.join(', ');									// объединили CSS-селекторы кнопок "вперед" и "назад" в единый селектор

				if (wrapper.settings.visibleCount > wrapper.items_count) { wrapper.settings.visibleCount = wrapper.items_count; }
				if (!$.isFunction( $.easing[wrapper.settings.easing] )) { wrapper.settings.easing = "swing"; }			// Проверяем есть ли указанная анимация

				wrapper.page_count = Math.ceil(wrapper.items_count / wrapper.settings.changeCount);				// кол-во страниц слайдера = кол-во слайдов / сколько менять за 1 переключение
				wrapper.block_count = Math.ceil(wrapper.items_count / wrapper.settings.visibleCount) + 1;		// кол-во блоков = кол-во слайдов / сколько влазит на страницу
				wrapper.container_width = 100 * wrapper.block_count;									// ширина контейнера = 100*кол-во блоков (переведено в проценты, без знака '%' )
				wrapper.items_width = 100 / (wrapper.block_count * wrapper.settings.visibleCount);				// ширина слайдов = 100 / (кол-во блоков*сколько влазит на страницу)

				wrapper.$items.css('width', wrapper.items_width + '%')									// устанавливаем ширину	слайдам
					.wrapAll('<div style="width: ' + wrapper.container_width + '%;' + '" class="' + wrapper.containerName + '" />')	// оборачиваем все слайды в контейнер
					.each(function (i) { $(this).data('index', i + 1); });								// в каждый слайд сохраняем его порядковый номер
				wrapper.$container = wrapper.children(wrapper.containerSelector);						// контейнер = обертка слайдов

				var title = document.title;					// Запоминаем заголовок страницы чтобы вернутся к нему после смены хэша (IE9 почему-то менял(ет) заголовок на хэш)

				wrapper.$el = $(this);
				wrapper.$el.data("rotator", wrapper);	// Сохраняем ссылку на ротатор в DOM
				if (wrapper.items_count <= wrapper.settings.visibleCount) {
					$(wrapper.settings.buttons_selector).hide();
					$(wrapper.settings.navigation).hide();
				} else {
					wrapper.rotator('buildNextPrevButtons');
					if (wrapper.settings.navigation && wrapper.page_count > 1) {
						wrapper.rotator('buildNavigation');
					}
					if (wrapper.settings.useSwipeTouch) {
						wrapper.rotator('addSwipeTouchListener');
					}
					if (wrapper.settings.keyboardNavigation) {
						wrapper.rotator('addKeyboardListener');
					}
					if (wrapper.settings.autoPlay) {
						wrapper.playing = true;
						//wrapper.rotator('buildAutoPlay');
						wrapper.rotator('startStop', wrapper.playing);
					}
					if (wrapper.settings.pauseOnHover) {
						wrapper.rotator('addOnHoverListener');
					}
					if (wrapper.settings.hashPrefix) {
						wrapper.rotator('addHashChangeListener', title);
						$(window).trigger('hashchange');	// проверка на наличие хэша при загрузке страницы
					}
				}
			});
		},
		/* Переход на страницу с указанным индексом + prev/next для пред/след страницы */
        gotoPage: function (end_index) {
			var wrapper = this;
			if (wrapper.animating) { return; }
            wrapper.animating = true;
			wrapper.rotator('clearTimer');	/*выключаем таймер слайдшоу */
			var rotator_container = wrapper.$container,
				current_rotator = rotator_container.children(wrapper.settings.items).filter(":visible").first(),
				start_index = current_rotator.data('index');
			if (end_index == 'prev' || end_index == 'next') {
				var step = wrapper.settings.changeCount,
                    is_prev = (end_index == 'prev');
				wrapper.currentPage = parseInt((is_prev) ? getPrevPageIndex(wrapper.currentPage, wrapper.items_count) : getNextPageIndex(wrapper.currentPage, wrapper.items_count), 10);
			} else {
				wrapper.currentPage = parseInt(end_index, 10);
				var step = Math.abs(start_index - end_index),
					step = (step > wrapper.items_count / 2) ? wrapper.items_count - step : step,
					value_right = (start_index + step) % wrapper.items_count,
					value_right = (value_right == 0) ? wrapper.items_count : value_right,
					is_prev = (value_right != end_index);
				if (step == wrapper.items_count / 2) {
					is_prev = true;
				}
				if (start_index == end_index) {
					wrapper.animating = false;
					return this;
				}
			}
			var move_by = step *100 / wrapper.settings.visibleCount,
                container_shift = ((is_prev) ? '+' : '-') + '=' + move_by + '%';

			if (is_prev) {
				// Движение слайдов влево. Предыдущие слайды.
				var next_rotators = current_rotator.prevAll(wrapper.settings.items).slice(0, step); // Запрос на нужное количество предыдущих слайдов
				if (next_rotators.length < step) {
					// Предыдущих слайдов меньше чем требуется, значит надо перенести из конца
					var need_rotators = step - next_rotators.length; // Количество слайдов для переноса из конца в начало
					$(rotator_container.children(wrapper.settings.items).slice(-need_rotators).get().reverse()).each(function () {
						next_rotators.add($(this).attr('is_clone', 'true').clone(true).prependTo(rotator_container).removeAttr('is_clone'));
					});
				}
				// Из-за того, что вперед были добавлены слайды, теперь надо вернуть начальную позицию ротатора обратным смещением
				rotator_container.css({ 'margin-left': -wrapper.items_width * step * wrapper.block_count + '%' });

				var prev_rotators = current_rotator.prevAll(wrapper.settings.items).slice(step - 1, step + wrapper.settings.visibleCount - 1);
				if (wrapper.settings.lazyLoad) {
					wrapper.rotator('loadSlideAndSiblings', prev_rotators);
				}
			} else {
				// Движение слайдов вправо. Следующие слайды.
				current_rotator.nextAll(wrapper.settings.items).filter(":hidden").show(); //Показать все следующие
				next_rotators = current_rotator.nextAll(wrapper.settings.items).slice(step - 1, step + wrapper.settings.visibleCount - 1); // Запрос на нужное количество следующих слайдов
				
				if (next_rotators.length < Math.max(wrapper.settings.visibleCount, step)) {
					//Следующих слайдов меньше чем требуется, значит надо перенести из начала
					var need_rotators = Math.max(wrapper.settings.visibleCount, step) - next_rotators.length;
					rotator_container.children(wrapper.settings.items).slice(0, need_rotators).each(function () {
						if ($(this).is(":visible")) {
							next_rotators.add($(this).attr('is_clone', 'true').clone(true).appendTo(rotator_container).removeAttr('is_clone'));
						} else {
							next_rotators.add($(this).detach().appendTo(rotator_container).show());
						}
					});
				}
				if (wrapper.settings.lazyLoad) {
					wrapper.rotator('loadSlideAndSiblings', next_rotators);
				}
			}
			if (next_rotators.length > 0) {
				next_rotators.show();
			} else {
				
			}
			wrapper.rotator('animateRotator', container_shift, start_index, step, is_prev);

			wrapper.rotator('startStop', wrapper.playing);
		},
		goPrevPage: function () {
			var wrapper = this;

			if (wrapper.settings.hashPrefix) {
				wrapper.rotator('updateHashUrl', getPrevPageIndex(wrapper.currentPage, wrapper.items_count));
			}
			wrapper.rotator('gotoPage', 'prev');
		},
		goNextPage: function () {
			var wrapper = this;

			if (wrapper.settings.hashPrefix) {
				wrapper.rotator('updateHashUrl', getNextPageIndex(wrapper.currentPage, wrapper.items_count));
			}
			wrapper.rotator('gotoPage', 'next');
		},

		/* Обработчик изменения хэша страницы */
		addHashChangeListener: function (title) {
			var wrapper = this;
			$(window).bind("hashchange", function(e) {
				var page = e.getState(wrapper.settings.hashPrefix, true) || 1;
				if (!wrapper.animating) {
					document.title = title;
					wrapper.rotator('gotoPage', '' + page);
				} else {
					//console.log("сменился хэш, в то время как ротатор анимируется, игнор");
				}
			});
		},
		addSwipeTouchListener: function () {
			var wrapper = this;
			$(this).bind({
				"swipeleft": function () {
					if (!wrapper.animating) {
						wrapper.rotator('goNextPage');
					}
				},
				"swiperight": function () {
					if (!wrapper.animating) {
						wrapper.rotator('goPrevPage');
					}
				}
			});
		},
		addKeyboardListener: function () {
			var wrapper = this;
			$(document).keydown(function(e) {
				if (wrapper.animating) { return false; }
				if (e.which == 37) {
					wrapper.rotator('goPrevPage');
				} else if (e.which == 39) {
					wrapper.rotator('goNextPage');
				}
			});
		},
		addOnHoverListener: function () {
			var wrapper = this;
			// + settings.next + settings.prev + settings.navigation
			var rotator_area = [];
			if (wrapper.settings.prev) { rotator_area.push(wrapper.settings.prev); }
			if (wrapper.settings.next) { rotator_area.push(wrapper.settings.next); }
			if (wrapper.settings.navigation) { rotator_area.push(wrapper.settings.navigation); }
			wrapper.hover(
				function() { wrapper.rotator('clearTimer'); },
				function() { wrapper.rotator('startStop', wrapper.playing); } );
			$(rotator_area.join(', ')).hover(
				function() { wrapper.rotator('clearTimer'); },
				function() { wrapper.rotator('startStop', wrapper.playing); } );
		},
		/* В будущем надо будет добавить кнопку play/pause */
		/*buildAutoPlay: function () {
			var wrapper = this;
		},*/
        /* Инициализация навигационной панели */
        buildNavigation: function () {
			var wrapper = this;
			var page_count = wrapper.page_count;	// выделил в отдельную переменную, чтобы в цикле не пересчитывалось
            for (var i = 0; i < page_count; i++) {
                var pages_in_page = [];
				var changeCount = wrapper.settings.changeCount;
                for (var j = i * changeCount + 1; j < ((i + 1) * changeCount + 1); j++) {
                    pages_in_page.push(j);
                }
                var nav_link = $(wrapper.settings.navPageTemplate.replace("$i", (i + 1))).data('page', i).data('items', pages_in_page).attr("title", "Нажмите для перехода на слайд "+(i+1));
                if (wrapper.settings.hashPrefix) { nav_link.attr("href", "#" + wrapper.settings.hashPrefix + "_" + (i + 1)); }	// как у jQuery.bbq плагина
                if (wrapper.settings.navDrawPageNumber) { nav_link.text(i + 1); }	// было html вместо text
                $(wrapper.settings.navigation).append(nav_link);
            }
			$(wrapper.settings.navigation).children('a').first().addClass('Active');
			$(wrapper.settings.navigation).delegate('a', 'click', function () {
				if (wrapper.animating || $(this).hasClass('Active')) {
					return false;
				}
				var target_page = $(this).data('items')[0];
				$(this).addClass('Active').siblings().removeClass('Active');
				if (wrapper.settings.hashPrefix) {
					wrapper.rotator('updateHashUrl', target_page);
				}
				wrapper.rotator('gotoPage', target_page);
				return false;
			});
		},

		/* Инициализация кнопок вперед/назад */
		buildNextPrevButtons: function () {
			var wrapper = this;
			if (wrapper.settings.hashPrefix) {
				wrapper.rotator("updateNextPrevLinks");
			}
			wrapper.parent().find(wrapper.settings.buttons_selector).click(function () {
				if(!wrapper.animating) {
					if ($(this).is(wrapper.settings.prev)) {
						wrapper.rotator('goPrevPage');
					} else {
						wrapper.rotator('goNextPage');
					}
				}
				return false;
			});
		},
		animateRotator: function (container_shift, start_index, step, is_prev) {
			var wrapper = this,
				$navlinks = $(wrapper.settings.navigation).children('a'),
				duration = wrapper.settings.speed,
				rotator_container = wrapper.$container;
			if (wrapper.settings.hardwareAccel && Modernizr.csstransitions) {	// Не протестировано
				rotator_container.css({"-webkit-transition" : duration / 1000 + "s all ease", left: container_shift});
			} else {
				// возможно использовать нестандартную анимацию перехода
				rotator_container.animate({ left: container_shift }, {
					duration: duration,
					easing: wrapper.settings.easing,
					step: function(now, fx) {
						var diff = -Math.floor(now / 100),
							page_index = (start_index + diff);
						if (page_index > wrapper.items_count) {
							page_index = page_index - wrapper.items_count;
						}
						else if (page_index < 1) {
							page_index = wrapper.items_count + page_index;
						}
						if (wrapper.settings.navigation) {
							$navlinks.removeClass('Passing').each(function () {
								if (jQuery.inArray(page_index, $(this).data('items')) > -1) {
									$(this).addClass('Passing');
								}
							});
						}
					},
					complete: function () {
						if (!is_prev) {
							rotator_container.children(wrapper.settings.items).filter(":visible").slice(0, step).hide(); //Если были показаны следующие слайды, то надо скрыть все, в настоящий момент предудущие
						}
						var current_page = wrapper.currentPage;
						if (wrapper.settings.navigation) {
							$navlinks.removeClass('Active').each(function () {
								if (jQuery.inArray(wrapper.currentPage, $(this).data('items')) > -1) {
									$(this).addClass('Active');
								}
							});
						}
						if (wrapper.settings.hashPrefix) {
							wrapper.rotator("updateNextPrevLinks");
						}
						rotator_container.children(wrapper.settings.items).filter("[is_clone=true]").detach();
						rotator_container.css(wrapper.after_animate_css);
						if (wrapper.settings.onMoveComplete && typeof(wrapper.settings.onMoveComplete) == 'function') {
							wrapper.settings.onMoveComplete(current_page);
						}
						wrapper.animating = false;
					}
				});
			}
		},
		/* startStop(false) - поставить на паузу, startStop(true) - запустить слайдшоу */
		startStop: function(playing) {
			var wrapper = this;
			if (playing !== true) { playing = false; }

			wrapper.playing = playing;

			if (playing){
				wrapper.rotator('clearTimer');
				wrapper.timer = window.setInterval(function() {
					if (!wrapper.animating) {
						wrapper.rotator('goNextPage');
					}
				}, wrapper.settings.delay + wrapper.settings.speed);
			} else {
				wrapper.rotator('clearTimer');
			}
		},
		clearTimer: function() {
			var wrapper = this;
			if (wrapper.timer) { window.clearInterval(wrapper.timer); }			// Обнуляем таймер, если он был установлен
		},

		/* Обновляет хэш в адресной строке: <хэш_префикс_ротатора>=<target_page> */
		updateHashUrl: function (target_page) {
			var state = {},
				wrapper = this;
			state[wrapper.settings.hashPrefix] = target_page;
			$.bbq.pushState(state);
		},
		/* Обновляет хэши у кнопок вперед/назад */
		updateNextPrevLinks: function () {
			var wrapper = this;

			var prev_index = getPrevPageIndex(wrapper.currentPage, wrapper.items_count),
				next_index = getNextPageIndex(wrapper.currentPage, wrapper.items_count);
			$(wrapper.settings.prev).attr("href", "#" + wrapper.settings.hashPrefix + "_" + prev_index);
			$(wrapper.settings.next).attr("href", "#" + wrapper.settings.hashPrefix + "_" + next_index);
		},
		/* загружаем слайд на который переходим и его соседей начиная с правого */
		loadSlideAndSiblings: function ($slide) {
			var wrapper = this;
			if ($slide.length > 0) {
				wrapper.rotator('loadSlide', $slide);
				wrapper.rotator('loadSlide', $slide.next());
				wrapper.rotator('loadSlide', $slide.prev());
			}
		},
		loadSlide: function ($slide) {
			//$(".ContentRotatorLoader").show();
			if ($slide) {
				var slide_src = $slide.attr('loadsrc');
				if (slide_src) {
					$("<img />").attr('src', slide_src)
						.load(function(response) {
							var img = $(response.currentTarget).attr('src');
							$slide.attr('src', slide_src);
						});
				}
				//$(".ContentRotatorLoader").hide();
			} else {
				return; // нет такого слайда
			}
		}
	};
	function getPrevPageIndex(cur_page_number, page_count) {
		return (cur_page_number > 1) ? (cur_page_number - 1) : page_count;
	}
	function getNextPageIndex(cur_page_number, page_count) {
		return (cur_page_number < page_count) ? (cur_page_number + 1) : 1;
	}

	$.fn.rotator = function (method, options) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.rotator');
		}
		if ((typeof(options)).match('object|undefined')){
			return this.each(function(i){
				(new $.rotator(this, options));
			});
		}
		
	};
})(jQuery);