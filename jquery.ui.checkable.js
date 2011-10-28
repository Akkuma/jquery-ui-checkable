/*
* jQuery UI Checkable v1.2.0
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

    function check(useDefaultBehavior) {
        var element = this.element[0];

        if ((useDefaultBehavior && !element.disabled) || !useDefaultBehavior) {
            var classNames = this.options.classNames
            ,   $parent = this.parent
            ,   $label = this._label;

            if (element.type === 'radio') {
                $('input[name="' + element.name + '"]').parent().removeClass(classNames.checked);               
            }

            element.checked = true;
            $parent.addClass(classNames.checked);

            $label && $label.addClass(classNames.checked);
        }
    }

    function uncheck(useDefaultBehavior) {
        var element = this.element[0];

        if ((useDefaultBehavior && !element.disabled) || !useDefaultBehavior) {
            var classNames = this.options.classNames
            ,   $parent = this.parent
            ,   $label = this._label;
                        
            element.checked = false;
            $parent.removeClass(classNames.checked);

            $label && $label.removeClass(classNames.checked);
        }
    }

    function disable($element, options) {
        var element = this.element[0]
        ,   $parent = this.parent
        ,   $label  = this._label
        ,   classNames = this.options.classNames;

        element.disabled = true;
        $parent.addClass(classNames.disabled);
        
        $label && $label.addClass(classNames.disabled);
    }

    function enable() {
        var element = this.element[0]
        ,   $parent = this.parent
        ,   $label  = this._label
        ,   classNames = this.options.classNames;

        element.disabled = false;        
        $parent.removeClass(classNames.disabled);

        $label && $label.removeClass(classNames.disabled);
    }

    function click(useDefaultBehavior) {
        var element = this.element[0];
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

        func.call(this, useDefaultBehavior);
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
                    .wrap('<div class="' + [classNames.input, DELEGATE_CLASS, (isDisabled ? classNames.disabled : ''), (element.checked ? options.classNames.checked : '')].join(' ') + '">');

                this.parent = $element.parent();

                var inputId = element.id;                
                if (inputId) {
                    var $label = $('label[for=' + inputId + ']');
                    $label.addClass([options.classNames.label, DELEGATE_CLASS, classNames.labelType, (isDisabled ? classNames.disabled : '')].join(' '));
                    this._label = $label;
                }
            }
            else {
                //jQuery UI's Widgets does not offer developers the flexibility to pass in an arbitrary set of elements.
                //It does a bunch of internal setup for your widget in _createWidget
                $.Widget.prototype.destroy.apply(this, arguments)
            }
        },

        _setOption: function (key, value) {
            if (key === "classNames") {
                value = $.extend({}, this.options.classNames, value);
                this._setClassNames(value);
            }
        },

        _setClassNames: function (value) {
            var $element = this.element
            ,   element = $element[0]
            ,   $parent = this.parent
            ,   originalTypeClassNames
            ,   type = element.type
            ,   classNames = this.options.classNames
            ,   isDisabled = !!element.disabled
            ,   newClassNames = value
            ,   newTypeClassNames = {};

            if (type === 'checkbox') {
                originalTypeClassNames = {
                    input: classNames.checkbox,
                    labelType: classNames.labelCheckbox
                };
                
                newTypeClassNames = {
                    input: newClassNames.checkbox,
                    labelType: newClassNames.labelCheckbox
                };
            }
            else {
                originalTypeClassNames = {
                    input: classNames.radio,
                    labelType: classNames.labelRadio
                };
                
                newTypeClassNames = {
                    input: newClassNames.radio,
                    labelType: newClassNames.labelRadio
                };
            }

            if (classNames.hide !== newClassNames.hide) {
                $element.removeClass(classNames.hide).addClass(newClassNames.hide);
            }

            $parent.removeClass([originalTypeClassNames.input, (isDisabled ? classNames.disabled : ''), (element.checked ? classNames.checked : '')].join(' '))
                .addClass([newTypeClassNames.input, (isDisabled ? newClassNames.disabled : ''), (element.checked ? newClassNames.checked : '')].join(' '));
                
            if (this._label) {
                this._label.removeClass([classNames.label, originalTypeClassNames.labelType, (isDisabled ? classNames.disabled : '')].join(' '))
                    .addClass([newClassNames.label, newTypeClassNames.labelType, (isDisabled ? newTypeClassNames.disabled : '')].join(' '));
            }

            this.options.classNames = newClassNames;
        },

        isChecked: function () {
            return this.element[0].checked;
        },

        check: function () {
            check.call(this);
        },

        uncheck: function () {
            uncheck.call(this);
        },

        click: function (useDefaultBehavior) {
            click.call(this, useDefaultBehavior);
        },

        enable: function () {
            enable.call(this);
        },

        disable: function () {
            disable.call(this);
        },

        refresh: function () {
            var type = this.element[0].type;

            if (type === 'radio' || type === 'checkbox') {
                if (this.element[0].checked) {
                    check.call(this);
                } 
                else {
                    uncheck.call(this);
                }

                if(this.element[0].disabled) {
                    disable.call(this);
                } 
                else {
                    enable.call(this);
                }
            }
        },

        destroy: function () {
            $.Widget.prototype.destroy.apply(this, arguments); // default destroy
            // now do other stuff particular to this widget
            var classNames = this.options.classNames
            , $element = this.element
            , $label = this._label;

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
            var $data = $.data(this, NAMESPACE);
            var func;

            if (this.checked) {
                func = check;
            }
            else {
                func = uncheck;
            }

            func.call($data, true);
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