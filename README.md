# monthyearpicker

A set of lightweight month and year pickers for use with Bootstrap 4.

## Getting started

The picker uses Bootstrap 4 styling classes out of the box. It should be possible to use it without Bootstrap, though.

### Requirements

The picker requires jQuery and moment.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js" integrity="sha512-3P8rXCuGJdNZOnUx/03c1jOTnMn3rP63nBip5gOP2qmUh5YAdVAvFZ1E+QLZZbC1rtMrQb+mah3AfYW11RUrWA==" crossorigin="anonymous"></script>
```
The (month) picker supports moment locales, so to use it, make sure to include the moment with locales

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.26.0/moment-with-locales.js" integrity="sha512-mIWWTYlNvs7KAF9rtmx0NWhJ/aT2XY6KgUjECzR+81osUdirJY6SvVyukL7Nv35Z+zRYoqShprDi6LtMMgkFbw==" crossorigin="anonymous"></script>
```
 
... or just include moment and any number of locales:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.26.0/moment.min.js" integrity="sha512-QkuqGuFAgaPp3RTyTyJZnB1IuwbVAqpVGN58UJ93pwZel7NZ8wJOGmpO1zPxZGehX+0pc9/dpNG9QdL52aI4Cg==" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.26.0/locale/da.js" integrity="sha512-22YurY/WjtgvkvOit1sR34nJroPzm0WdkOtPah/bv0TKqajxMVS2SLKxeSwwbBp+NlsUOItFS2Bks5tWWdGzhQ==" crossorigin="anonymous"></script>
```

And finally, include the plugin js and css:

```html
<link href="/asset/monthyearpicker/dist/css/monthyearpicker.min.css" rel="stylesheet" type="text/css">
<script type="text/javascript" src="/asset/monthyearpicker/dist/js/monthyearpicker.min.js"></script>
```

Attach it to an input element like so:

```javascript
$('#my-picker').monthyearpicker();
```
... or with options:

```javascript
$('#my-year-picker').monthyearpicker({
    locale: 'da',
    type: 'year',
    startYear: '1900',
    endYear: moment().format('YYYY')
});
```

Currently the picker will always show below and left aligned with the target element. Likewise the picker box arrow always points up.

The picker will reposition itself on screen resize. It should be usable on mobile devises, but limited testing has been done on this. It is not really "responsive" out of the box, in that it will not scale, based on screen size - width, set in CSS, will be used for all screen sizes, however with a width of 250 px, it will likely fit most devises.

The CSS is based on Bootstrap 4, so most of it will use sizes adhearing to Bootstrap 4 sizing scheme. 

## Options

| Option | Type | Default | Description |
|:--- |:---:|:---:|:--- |
| locale | string | 'en' | Moment locale to use |
| startYear | string or null | current year - 20 years | Start year for the year drop down in the month picker and the lower limit for navigation in the year picker. Set to null to disable the limit in both types of pickers |
| endYear | number or null | current year + 20 years | End year for the year drop down in the month picker and the upper limit for navigation in the year picker. Set to null to disable the limit in both types of picker |
| type | number | 'month' | Two options - 'month' or 'year' |
| monthFormat | string | 'YYYY-MM' | Moment format string |
| yearFormat | string | 'YYYY' | Moment format string |
| yearPageLength | number | 20 | Number of year items shown in the year picker (and number of years to jump back or forwards, using the navigation buttons) |
| yearSelectClass | string | 'form-control myp-year-select' | Class(es) added to year dropdown element |
| itemType | string | '<li>' | Wrapper element for item buttons |
| itemBtnClass | string | 'btn btn-light' | Classes added to item buttons in both types of pickers |
| itemBtnActiveClass | string | 'btn btn-primary' | Classes added to current item button in both types of pickers |
| navBtnClass | string | 'btn btn-light' | Classes added to the navigation buttons in the year picker |
| template | string | [See below](#template) | A html template |

## Methods
| Name | parameters | Description |
|:--- |:---:|:--- |
| onShow | picker, target | Called after picker is added and positioned | 
| onMonthSelect | picker, target, selectedYear | Called after target is updated and the picker is removed |
| onYearSelect | picker, target | Called after target is updated and the picker is removed |
| onNavigateBack | picker, start | Called when the year pickers previous button is clicked, after the picker content is updated |
| onNavigateForward | picker, start | Called when the year pickers next button is clicked, after the picker content is updated |
| onHide | picker, target | Called before picker is removed | 

### <a name="template"></a>Template

The default template looks like this:

```html
<div class="myp-wrapper">
	<div class="myp-header"></div>
	<div class="myp-items-wrapper">
		<ul class="myp-items"></ul>
	</div>
</div>
```

The template can be changed to your hearts desire, but it must contain elements with these classes:
* `myp-wrapper` - should be placed on the outer most element
* `myp-header` - top row, used for year dropdown or year navigation
* `myp-items` - the container for items. Those items are either year or month buttons

## License

Copyright 2020 Mads Jensen

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
