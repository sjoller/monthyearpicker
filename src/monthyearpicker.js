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

(function($) {
    "use strict";

    $.fn.monthYearPicker = function(options) {
        let counter = 1;

        let settings = $.extend({
            locale: 'en',
            startYear: null,
            endYear: null,
            type: 'month',
            itemBtnClass: 'btn btn-light',
            itemBtnActiveClass: 'btn btn-primary',
            navBtnClass: 'btn btn-light',
            template: '<div class="myp-wrapper">' +
                    '<div class="myp-header"></div>' +
                    '<div class="myp-items-wrapper">' +
                        '<ul class="myp-items"></ul>' +
                    '</div>' +
                '</div>'
        }, options);

        $(window).resize(function() {
            $('.myp').each(function() {
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
            let element = $(this);
            let popupId = 'myp-' + counter;

            element.on('focus', function () {
                if (element.hasClass('myp') === false) {
                    let date = moment(element.val()) || moment();
                    let tempPopup = _getTemplate(date, popupId);
                    let position = element.offset();

                    element.addClass('myp').data('myp-id', popupId);

                    $('body').append(tempPopup.html());

                    let DOMpopup = $('#' + popupId);

                    DOMpopup.css({
                        top: position.top + element.outerHeight() + 10,
                        left: position.left
                    });

                    // Close picker if user clicks anywhere outside of it or its target element.
                    $(document).off('mouseup').on('mouseup', function(e) {
                        if (!DOMpopup.is(e.target) && DOMpopup.has(e.target).length === 0 && !element.is(e.target)) {
                            element.removeClass('myp');
                            $('#' + popupId).remove();
                        }
                    });

                    $('.myp-items').on('click', 'button.myp-month-btn', function(e) {
                        let yearSelect = DOMpopup.find('.myp-year-select').val();
                        element.val(moment(yearSelect + '-' + $(this).data('value') + '-01').format('YYYY-MM')).removeClass('myp');
                        DOMpopup.remove();
                    }).on('click', 'button.myp-year-btn', function(e) {
                        element.val(moment($(this).data('value') + '-01-01').format('YYYY')).removeClass('myp');
                        DOMpopup.remove();
                    });

                    $('.myp-prev-btn').off('focus').on('click', function(e) {
                        let btn = $(this);
                        let start = parseInt(btn.data('start')) - 20;

                        DOMpopup.find('div.myp-header button').data('start', start);

                        _populateYearItems(DOMpopup, start, date.format('YYYY'));
                    });

                    $('.myp-next-btn').off('focus').on('click', function(e) {
                        let btn = $(this);
                        let start = parseInt(btn.data('start')) + 20;

                        DOMpopup.find('div.myp-header button').data('start', start);

                        _populateYearItems(DOMpopup, start, date.format('YYYY'));
                    });

                }
            });

            counter++;
        });

        return this;

        function _getTemplate(date, popupId) {
            let tempPopup = $('<temp>').append($.parseHTML(settings.template));
            let startYear = settings.startYear ? parseInt(moment(settings.startYear).format('YYYY')) : parseInt(date.format('YYYY')) - 20;
            let endYear = settings.endYear ? parseInt(moment(settings.endYear).format('YYYY')) : parseInt(date.format('YYYY')) + 20;

            tempPopup.find('.myp-wrapper').attr('id', popupId);

            let localeData = moment().locale(settings.locale).localeData();

            switch (settings.type) {
                case 'year':
                    let currentYear = parseInt(date.format('YYYY'));

                    startYear = Math.floor(currentYear / 20) * 20;

                    tempPopup.find('.myp-header').html('<div class="row"><div class="col-3"><button type="button" class="' + settings.navBtnClass + ' myp-prev-btn" data-start="' + startYear + '">&lt;</button></div><div class="col-6 myp-year-label">' + currentYear + '</div><div class="col-3"><button type="button" class="' + settings.navBtnClass + ' myp-next-btn" data-start="' + startYear + '">&gt;</button></div></div>');

                    _populateYearItems(tempPopup, startYear, date.format('YYYY'));
                break;
                default:
                case 'month':
                    let dropElements = '';
                    for (let i = startYear; i < endYear; i++) {
                        dropElements += '<option' + (i === parseInt(date.format('YYYY')) ? ' selected="selected"' : '') + ' value="' + i + '"><small>' + i + '</small></option>';
                    }

                    tempPopup.find('.myp-header').append($('<select>').addClass('myp-year-select').html(dropElements));

                    let monthElements = '';
                    for (let i = 1; i <= 12; i++) {
                        let color = parseInt(date.format('M')) === i ? settings.itemBtnActiveClass : settings.itemBtnClass;
                        monthElements += '<li><button class="btn ' + color + ' myp-month-btn" data-value="' + i.toString().padStart(2, '0') + '">' + localeData.monthsShort()[i - 1] + '</button></li>';
                    }

                    tempPopup.find('.myp-items').html(monthElements);

                break;
            }

            return tempPopup;
        }

        function _populateYearItems(popup, start, current) {
            let yearItems = '';
            let end = start + 20;
            for (let i = start; i < end; i++) {
                let color = parseInt(current) === i ? settings.itemBtnActiveClass : settings.itemBtnClass;
                yearItems += '<li><button class="' + color + ' myp-year-btn" data-value="' + i + '">' + i + '</button></li>';
            }

            popup.find('.myp-items').empty().html(yearItems);
        }
    };
}( jQuery ));
