/*! monthyearpicker 0.1
 * ©2020 Mads Jensen
 */

/**
 * @summary     Month/year picker
 * @description Month/year picker popup
 * @version     0.1
 * @file        monthyearpicker.js
 * @author      Mads Jensen
 * @contact     knoldesparker-myp@gmail.com
 * @copyright   Copyright 2020 Mads Jensen
 *
 * This source file is free software, available under the following license:
 *   MIT license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 */

/* jshint esversion: 6 */
/* globals jquery, moment */

(function ($) {
	"use strict";

	$.fn.monthyearpicker = function (options) {
		let pickerNo = Date.now();

		let settings = $.extend({
			locale: 'en',
			startYear: null,
			endYear: null,
			type: 'month',
			monthFormat: 'YYYY-MM',
			yearFormat: 'YYYY',
			yearPageLength: 20,
			yearSelectClass: 'form-control myp-year-select',
			itemType: '<li>',
			itemBtnClass: 'btn btn-light',
			itemBtnActiveClass: 'btn btn-primary',
			navBtnClass: 'btn btn-light',
			template: '<div class="myp-wrapper">' +
				'<div class="myp-header"></div>' +
				'<div class="myp-items-wrapper">' +
				'<ul class="myp-items"></ul>' +
				'</div>' +
				'</div>',
			onShow: null,
			onMonthSelect: null,
			onYearSelect: null,
			onNavigateBack: null,
			onNavigateForward: null,
			onHide: null,
		}, options);

		$(window).resize(function () {
			$('.myp').each(function () {
				let element = $(this);
				let popup = $('#' + element.data('myp-id'));
				let position = element.offset();

				popup.css({
					top: position.top + element.outerHeight() + 10,
					left: position.left
				});
			});
		});

		this.each(function () {
			let target = $(this);
			let popupId = 'myp-' + pickerNo;

			target.on('focus', function () {
				if (target.hasClass('myp') === false) {
					let tempPopup = _getTemplate(target, popupId);
					let position = target.offset();

					target.addClass('myp').attr('data-myp-id', popupId);

					$('body').append(tempPopup.html());

					let picker = $('#' + popupId);

					// Reposition picker after it is added to the DOM
					picker.css({
						top: position.top + target.outerHeight() + 10,
						left: position.left
					});

					if (typeof settings.onShow === 'function') {
						settings.onShow.call(this, picker, target);
					}

					$('.myp-items').on('click', 'button.myp-month-btn', function () {
						let selectedYear = picker.find('.myp-year-select').val();

						target.val(moment(selectedYear + '-' + $(this).data('value'), settings.yearFormat + '-MM').format(settings.monthFormat)).removeClass('myp');

						if (typeof settings.onHide === 'function') {
							settings.onHide.call(this, picker, target);
						}

						picker.remove();

						if (typeof settings.onMonthSelect === 'function') {
							settings.onMonthSelect.call(this, picker, target, selectedYear);
						}
					}).on('click', 'button.myp-year-btn', function () {
						target.val(moment($(this).data('value'), 'YYYY').format(settings.yearFormat)).removeClass('myp');

						if (typeof settings.onHide === 'function') {
							settings.onHide.call(this, picker, target);
						}

						picker.remove();

						if (typeof settings.onYearSelect === 'function') {
							settings.onYearSelect.call(this, picker, target);
						}
					});

					let date = moment();

					$('.myp-prev-btn').off('focus').on('click', function () {
						let start = parseInt(picker.find('.myp-year-label').attr('data-start')) - settings.yearPageLength;

						if (settings.startYear !== null && (start - settings.yearPageLength) <= settings.startYear) {
							start = settings.startYear;
						}

						_handleNavigation(picker, start);

						_populateYearItems(picker, date.format('YYYY'));

						if (typeof settings.onNavigateBack === 'function') {
							settings.onNavigateBack.call(this, picker, start);
						}
					});

					$('.myp-next-btn').off('focus').on('click', function () {
						let start = parseInt(picker.find('.myp-year-label').attr('data-start')) + settings.yearPageLength;

						if (settings.endYear !== null && (start + settings.yearPageLength) >= settings.endYear) {
							start = settings.endYear - settings.yearPageLength + 1;
						}

						_handleNavigation(picker, start);

						_populateYearItems(picker, date.format('YYYY'));

						if (typeof settings.onNavigateForward === 'function') {
							settings.onNavigateForward.call(this, picker, start);
						}
					});
				}
			});

			pickerNo = Date.now();
		});

		// Close picker if user clicks anywhere outside of it or its target element.
		$(document).off('mouseup').on('mouseup', _removePicker);

		return this;

		function _removePicker(event) {
			$('.myp-wrapper[id^="myp-"]').each(function () {
				let picker = $(this);
				let target = $('.myp[data-myp-id="' + picker.attr('id') + '"]');

				if (!picker.is(event.target) && picker.has(event.target).length === 0 && !target.is(event.target)) {
					if (typeof settings.onHide === 'function') {
						settings.onHide.call(this, picker, target);
					}
					target.removeClass('myp');
					picker.remove();
				}
			});
		}

		function _handleNavigation(picker, start) {
			picker.find('.myp-year-label').attr('data-start', start);
			picker.find('.myp-prev-btn').prop('disabled', settings.startYear !== null && start <= settings.startYear);
			picker.find('.myp-next-btn').prop('disabled', settings.endYear !== null && (start + settings.yearPageLength) > settings.endYear);
		}

		function _getTemplate(element, popupId) {
			let date = moment();
			let tempPopup = $('<temp>').append($.parseHTML(settings.template));
			let startYear;
			let endYear;

			tempPopup.find('.myp-wrapper').attr('id', popupId);

			switch (settings.type) {
				case 'year':
					date = moment(element.val(), settings.yearFormat) || moment();

					let currentYear = parseInt(date.format('YYYY'));

					startYear = Math.floor(currentYear / settings.yearPageLength) * settings.yearPageLength;

					let prevButton = $('<button>', {
						type: 'button',
						class: settings.navBtnClass + ' myp-prev-btn',
						html: '&lt;'
					});
					let nextButton = $('<button>', {
						type: 'button',
						class: settings.navBtnClass + ' myp-next-btn',
						html: '&gt;'
					});

					let row = $('<div>', {
						class: 'row'
					}).append($('<div>', {
						class: 'col-3'
					}).append(prevButton)).append($('<div>', {
						class: 'col-6 myp-year-label',
						'data-start': startYear,
						html: moment(currentYear, 'YYYY').format(settings.yearFormat)
					})).append($('<div>', {
						class: 'col-3'
					}).append(nextButton));

					tempPopup.find('.myp-header').append(row);

					// If currentYear is not within settings.startYear to settings.endYear interval, set start to currentYear
					if (settings.startYear !== null && startYear < settings.startYear) {
						startYear = settings.startYear;
					}
					if (settings.endYear !== null && startYear > settings.endYear) {
						startYear = settings.endYear - settings.yearPageLength + 1;
					}

					_handleNavigation(tempPopup, startYear);

					_populateYearItems(tempPopup, date.format('YYYY'));
					break;
				default:
				case 'month':
					date = moment(element.val(), settings.monthFormat) || moment();

					startYear = settings.startYear !== null ? parseInt(moment(settings.startYear, settings.yearFormat).format('YYYY')) : parseInt(date.format('YYYY')) - settings.yearPageLength;
					endYear = settings.endYear !== null ? parseInt(moment(settings.endYear, settings.yearFormat).format('YYYY')) : parseInt(date.format('YYYY')) + settings.yearPageLength;

					let container = $('<select>').addClass(settings.yearSelectClass);
					let option;
					for (let i = startYear; i < endYear; i++) {
						option = $('<option>', {
							selected: i === parseInt(date.format('YYYY')),
							value: i,
							html: moment(i, 'YYYY').format(settings.yearFormat)
						});
						container.append(option);
					}

					tempPopup.find('.myp-header').append(container);

					_populateMonthItems(tempPopup, date);

					break;
			}

			return tempPopup;
		}

		function _populateMonthItems(picker, date) {
			let container = picker.find('.myp-items');
			for (let i = 1; i <= 12; i++) {
				let localeData = moment.localeData(settings.locale);
				let color = parseInt(date.format('M')) === i ? settings.itemBtnActiveClass : settings.itemBtnClass;
				let item = $('<button>', {
					class: color + ' myp-month-btn',
					'data-value': i.toString().padStart(2, '0'),
					html: localeData.monthsShort()[i - 1]
				});
				container.append($(settings.itemType).append(item));
			}
		}

		function _populateYearItems(picker, current) {
			let container = picker.find('.myp-items');
			let start = parseInt(picker.find('.myp-year-label').attr('data-start'));
			let end = start + settings.yearPageLength - 1;
			if (settings.endYear !== null && end > settings.endYear) {
				end = settings.endYear;
			}

			container.empty();

			for (let i = start; i <= end; i++) {
				let color = parseInt(current) === i ? settings.itemBtnActiveClass : settings.itemBtnClass;
				let button = $('<button>', {
					class: color + ' myp-year-btn',
					'data-value': i,
					html: moment(i, 'YYYY').format(settings.yearFormat)
				});
				container.append($(settings.itemType).append(button));
			}
		}
	};
}(jQuery));
