/**
* Will put in a permanent open license, but until then no permission is given to use this code
*/
(function ($) {
    var NAMESPACE = 'checkable';
    var DELEGATE_CLASS = NAMESPACE + '-del';

    function check($element, options, useDefaultBehavior) {
        var element = $element[0];

        if ((useDefaultBehavior && !element.disabled) || !useDefaultBehavior) {
            if (element.type === 'radio') {
                $('input[name="' + element.name + '"]').removeAttr('checked');
            }

            element.checked = 'checked';

            var classNames = options ? options.classNames : $.data(element, NAMESPACE).options.classNames;
            $element.parent().addClass(classNames.checked);
        }
    }

    function uncheck($element, options, useDefaultBehavior) {
        var element = $element[0];

        if ((useDefaultBehavior && !element.disabled) || !useDefaultBehavior) {
            $element.removeAttr('checked');

            var classNames = options ? options.classNames : $.data(element, NAMESPACE).options.classNames;
            $element.parent().removeClass(classNames.checked);
        }
    }

    function click($element, options, useDefaultBehavior) {
        var element = $element[0];
        var func;
        if (element.type === 'radio') {
            func = check;
        }
        else {
            if (element.checked) {
                func = uncheck;
            }
            else {
                func = check;
            }
        }

        func($element, options, useDefaultBehavior);
    }

    $.widget("ui.checkable", {
        // default options
        options: {
            classNames: {
                checkbox: NAMESPACE + '-checkbox',
                radio: NAMESPACE + '-radio',
                checked: NAMESPACE + '-checked',
                hide: NAMESPACE + '-hide',
                hover: NAMESPACE + '-hover',
                label: NAMESPACE + '-label',
                labelCheckbox: NAMESPACE + '-label-checkbox',
                labelRadio: NAMESPACE + '-label-radio',
                disabled: NAMESPACE + '-disabled'
            }
        },

        _create: function () {
            var $element = this.element;
            var element = $element[0];
            var type = element.type;

            if ((type === 'radio' || type === 'checkbox')) {
                var classNames;
                var options = this.options;
                var isDisabled = !!element.disabled;

                if (type === 'checkbox') {
                    classNames = {
                        input: options.classNames.checkbox,
                        labelType: options.classNames.labelCheckbox
                    };
                }
                else {
                    classNames = {
                        input: options.classNames.radio,
                        labelType: options.classNames.labelRadio
                    };
                }

                classNames.disabled = options.classNames.disabled;

                $element.addClass([options.classNames.hide, DELEGATE_CLASS].join(' '))
                    .wrap('<div class="' +
                        classNames.input + ' ' +
                        DELEGATE_CLASS + (isDisabled ? ' ' + classNames.disabled : '') + '">');
                var $parent = $element.parent();

                if (element.checked) {
                    $parent.addClass(options.classNames.checked);
                }

                $('label[for=' + element.id + ']').addClass([options.classNames.label, DELEGATE_CLASS, classNames.labelType, (isDisabled ? classNames.disabled : '')].join(' '));
            }
        },

        _setOptions: function (options) {
            if ($.isPlainObject(options)) {
                $.extend(true, this.options, options);
            }
            else {
                this._super('_setOptions', options)
            }
        },

        isChecked: function () {
            return !!this.element[0].checked;
        },

        check: function () {
            check(this.element, this.options);
        },

        uncheck: function () {
            uncheck(this.element, this.options);
        },

        click: function (useDefaultBehavior) {
            click(this.element, this.options, useDefaultBehavior);
        },

        enable: function () {
            this.element.removeAttr('disabled');
            this.element.parent().removeClass(this.options.classNames.disabled);
        },

        disable: function () {
            this.element[0].disabled = 'disabled';
            this.element.parent().addClass(this.options.classNames.disabled);
        },

        destroy: function () {
            $.Widget.prototype.destroy.apply(this, arguments); // default destroy
            // now do other stuff particular to this widget
            var classNames = this.options.classNames;
            var $element = this.element;
            $element.unwrap();
            $element.removeClass([classNames.hide, DELEGATE_CLASS].join(' '));
            $('label[for=' + $element[0].id + ']').removeClass([DELEGATE_CLASS, classNames.label, classNames.labelCheckbox, classNames.labelRadio, classNames.disabled].join(' '));
        }
    });

    $(function () {
        $(document.body).delegate('input.' + DELEGATE_CLASS, 'click', function ($e) {
            var $this = $(this);
            var options = $.data(this, NAMESPACE).options;
            var func;

            if (this.checked) {
                func = check;
            }
            else {
                func = uncheck;
            }

            func($this, options, true);
        }).delegate('div.' + DELEGATE_CLASS, 'hover', function () {
            var $this = $(this);

            $this.toggleClass($.data($this.children()[0], NAMESPACE).options.classNames.hover);
        }).delegate('label.' + DELEGATE_CLASS, 'hover', function () {
            var $input = $('#' + this.htmlFor);
            var $divWrapper = $input.parent();

            $divWrapper.toggleClass($.data($input[0], NAMESPACE).options.classNames.hover);
        });
    });
}(jQuery));