/*
* jQuery UI Checkable v1.1.0
* Copyright (c) 2011, Gregory Waxman. All rights reserved.
*
* Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
*	1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
*	2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
*	3. The names of its contributors may not be used to endorse or promote products derived from this software without specific prior written permission.
*	4. All private modifications should be offered to the author at https://github.com/Akkuma/jquery-ui-checkable
*	5. All public forks must notify the author of their existence. Using github to directly fork the project will be considered sufficient notification and will fulfill this obligation.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
(function ($) {
    var NAMESPACE = 'checkable';
    var DELEGATE_CLASS = NAMESPACE + '-del';

    function check($element, options, useDefaultBehavior) {
        var element = $element[0];

        if ((useDefaultBehavior && !element.disabled) || !useDefaultBehavior) {
            var classNames = options ? options.classNames : $.data(element, NAMESPACE).options.classNames;
            var $parent = $element.parent();

            if (element.type === 'radio') {
                $('input[name="' + element.name + '"]').parent().removeClass(classNames.checked);               
            }

            element.checked = true;
            $parent.addClass(classNames.checked);
        }
    }

    function uncheck($element, options, useDefaultBehavior) {
        var element = $element[0];

        if ((useDefaultBehavior && !element.disabled) || !useDefaultBehavior) {
            element.checked = false;

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
                    .wrap('<div class="' + [classNames.input, DELEGATE_CLASS, (isDisabled ? classNames.disabled : '')].join(' ') + '">');
                var $parent = $element.parent();

                if (element.checked) {
                    $parent.addClass(options.classNames.checked);
                }

                $label = $('label[for=' + element.id + ']');
                $label.addClass([options.classNames.label, DELEGATE_CLASS, classNames.labelType, (isDisabled ? classNames.disabled : '')].join(' '));
                this._label = $label;
            }
            else {
                //jQuery UI's Widgets does not offer developers the flexibility to pass in an arbitrary set of elements.
                //It does a bunch of internal setup for your widget in _createWidget
                $.Widget.prototype.destroy.apply(this, arguments)
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
            return this.element[0].checked;
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

        refresh: function () {
            if (this.element[0].checked) {
                check(this.element, this.options);
            }
            else {
                uncheck(this.element, this.options);
            }
        },

        destroy: function () {
            $.Widget.prototype.destroy.apply(this, arguments); // default destroy
            // now do other stuff particular to this widget
            var classNames = this.options.classNames;
            var $element = this.element;
            var $label = this._label;

            $element.unwrap();
            $element.removeClass([classNames.hide, DELEGATE_CLASS].join(' '));

            if($label) {
                $label.removeClass([DELEGATE_CLASS, classNames.label, classNames.labelCheckbox, classNames.labelRadio, classNames.disabled].join(' '));
            }
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
