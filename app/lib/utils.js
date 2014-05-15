"use strict";
// if this use to compile,module will be assignment.
var utils = {};
if(module){
    module.exports = utils;
};
//trim
utils.rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
//toJson
utils.cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
//stringify
utils.escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

utils.class2type = {};

utils.core_toString = utils.class2type.toString;
utils.core_hasOwn = utils.class2type.hasOwnProperty;

utils.type = function(obj) {
    if (obj == null) {
        return String(obj);
    }
    return typeof obj === "object" || typeof obj === "function" ? utils.class2type[utils.core_toString
        .call(obj)]
        || "object"
        : typeof obj;
};

// See test/unit/core.js for details concerning isFunction.
// Since version 1.3, DOM methods and functions like alert
// aren't supported. They return false on IE (#2968).
utils.isFunction = function(obj) {
    return utils.type(obj) === "function";
};

utils.isArray = Array.isArray || function(obj) {
    return utils.type(obj) === "array";
};

utils.isWindow = function(obj) {
    return obj != null && obj == obj.window;
};

utils.isNumeric = function(obj) {
    return !isNaN(parseFloat(obj)) && isFinite(obj);
};

// utils.isDate = util.isDate;

utils.isArraylike = function(obj) {
    var length = obj.length, type = utils.type(obj);

    if (utils.isWindow(obj)) {
        return false;
    }

    if (obj.nodeType === 1 && length) {
        return true;
    }

    return type === "array"
        || type !== "function"
        && (length === 0 || typeof length === "number" && length > 0
            && (length - 1) in obj);
};

utils.isPlainObject = function(obj) {
    // Must be an Object.
    // Because of IE, we also have to check the presence of the constructor
    // property.
    // Make sure that DOM nodes and window objects don't pass through, as well
    if (!obj || utils.type(obj) !== "object" || obj.nodeType
        || utils.isWindow(obj)) {
        return false;
    }

    try {
        // Not own constructor property must be Object
        if (obj.constructor
            && !utils.core_hasOwn.call(obj, "constructor")
            && !utils.core_hasOwn.call(obj.constructor.prototype,
                "isPrototypeOf")) {
            return false;
        }
    } catch (e) {
        // IE8,9 Will throw exceptions on certain host objects #9897
        return false;
    }

    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.

    var key;
    for (key in obj) {
    }

    return key === undefined || utils.core_hasOwn.call(obj, key);
};

utils.isEmptyObject = function(obj) {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
};

utils.error = function(msg) {
    throw console.error(msg);
};

// Convert dashed to camelCase; used by the css and data modules
// Microsoft forgot to hump their vendor prefix (#9572)
utils.camelCase = function(string) {
    return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
};

// Otherwise use our own trimming functionality
utils.trim = function(text) {
    return text == null ? "" : (text + "").replace(utils.rtrim, "");
};

// results is for internal usage only
utils.makeArray = function(arr, results) {
    var ret = results || [];

    if (arr != null) {
        if (utils.isArraylike(Object(arr))) {
            utils.merge(ret, typeof arr === "string" ? [ arr ] : arr);
        } else {
            core_push.call(ret, arr);
        }
    }

    return ret;
};

utils.inArray = function(elem, arr, i) {
    var len;

    if (arr) {
        if (core_indexOf) {
            return core_indexOf.call(arr, elem, i);
        }

        len = arr.length;
        i = i ? i < 0 ? Math.max(0, len + i) : i : 0;

        for (; i < len; i++) {
            // Skip accessing in sparse arrays
            if (i in arr && arr[i] === elem) {
                return i;
            }
        }
    }

    return -1;
};

utils.merge = function(first, second) {
    var l = second.length, i = first.length, j = 0;

    if (typeof l === "number") {
        for (; j < l; j++) {
            first[i++] = second[j];
        }
    } else {
        while (second[j] !== undefined) {
            first[i++] = second[j++];
        }
    }

    first.length = i;

    return first;
};

utils.grep = function(elems, callback, inv) {
    var retVal, ret = [], i = 0, length = elems.length;
    inv = !!inv;

    // Go through the array, only saving the items
    // that pass the validator function
    for (; i < length; i++) {
        retVal = !!callback(elems[i], i);
        if (inv !== retVal) {
            ret.push(elems[i]);
        }
    }

    return ret;
};

// arg is for internal usage only
utils.map = function(elems, callback, arg) {
    var value, i = 0, length = elems.length, isArray = utils.isArraylike(elems), ret = [];

    // Go through the array, translating each of the items to their
    if (isArray) {
        for (; i < length; i++) {
            value = callback(elems[i], i, arg);

            if (value != null) {
                ret[ret.length] = value;
            }
        }

        // Go through every key on the object,
    } else {
        for (i in elems) {
            value = callback(elems[i], i, arg);

            if (value != null) {
                ret[ret.length] = value;
            }
        }
    }

    // Flatten any nested arrays
    return core_concat.apply([], ret);
};

// args is for internal usage only
utils.each = function(obj, callback, args) {
    var value, i = 0, length = obj.length, isArray = utils.isArraylike(obj);

    if (args) {
        if (isArray) {
            for (; i < length; i++) {
                value = callback.apply(obj[i], args);

                if (value === false) {
                    break;
                }
            }
        } else {
            for (i in obj) {
                value = callback.apply(obj[i], args);

                if (value === false) {
                    break;
                }
            }
        }

        // A special, fast, case for the most common use of each
    } else {
        if (isArray) {
            for (; i < length; i++) {
                value = callback.call(obj[i], i, obj[i]);

                if (value === false) {
                    break;
                }
            }
        } else {
            for (i in obj) {
                value = callback.call(obj[i], i, obj[i]);

                if (value === false) {
                    break;
                }
            }
        }
    }

    return obj;
};

utils.each("Boolean Number String Function Array Date RegExp Object Error"
    .split(" "), function(i, name) {
    utils.class2type["[object " + name + "]"] = name.toLowerCase();
});

utils.extend = function() {
    var src, copyIsArray, copy, name, options, clone, target = arguments[0]
        || {}, i = 1, length = arguments.length, deep = false;

    // Handle a deep copy situation
    if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        // skip the boolean and the target
        i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== "object" && !utils.isFunction(target)) {
        target = {};
    }

    // extend jQuery itself if only one argument is passed
    if (length === i) {
        target = this;
        --i;
    }

    for (; i < length; i++) {
        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null) {
            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];

                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if (deep
                    && copy
                    && (utils.isPlainObject(copy) || (copyIsArray = utils
                        .isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && utils.isArray(src) ? src : [];

                    } else {
                        clone = src && utils.isPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[name] = utils.extend(deep, clone, copy);

                    // Don't bring in undefined values
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};

utils.extend(utils, {
    defOptions : function(options, def) {
        if (!options) {
            return def;
        }
        return this.extend({}, def, options);
    },
    quote : function (string) {

        // If the string contains no control characters, no quote characters,
        // and no
        // backslash characters, then we can safely slap some quotes around it.
        // Otherwise we must also replace the offending characters with safe
        // escape
        // sequences.

        utils.escapable.lastIndex = 0;
        return utils.escapable.test(string) ? '"'
            + string.replace(escapable,
                function(a) {
                    var c = meta[a];
                    return typeof c === 'string' ? c : '\\u'
                        + ('0000' + a.charCodeAt(0).toString(16))
                            .slice(-4);
                }) + '"' : '"' + string + '"';
    },
    str : function (key, holder) {

        // Produce a string from holder[key].

        var i, // The loop counter.
            k, // The member key.
            v, // The member value.
            length, mind = gap, partial, value = holder[key];

        // If the value has a toJSON method, call it to obtain a replacement
        // value.

        if (value && typeof value === 'object'
            && typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

        // If we were called with a replacer function, then call the replacer to
        // obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

        // What happens next depends on the value's type.

        switch (typeof value) {
            case 'string':
                return utils.quote(value);

            case 'number':

                // JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':

                // If the value is a boolean or null, convert it to a string. Note:
                // typeof null does not produce 'null'. The case is included here in
                // the remote chance that this gets fixed someday.

                return String(value);

            // If the type is 'object', we might be dealing with an object or an
            // array or
            // null.

            case 'object':

                // Due to a specification blunder in ECMAScript, typeof null is
                // 'object',
                // so watch out for that case.

                if (!value) {
                    return 'null';
                }

                // Make an array to hold the partial results of stringifying this
                // object value.

                gap += indent;
                partial = [];

                // Is the value an array?

                if (Object.prototype.toString.apply(value) === '[object Array]') {

                    // The value is an array. Stringify every element. Use null as a
                    // placeholder
                    // for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

                    // Join all of the elements together, separated with commas, and
                    // wrap them in
                    // brackets.

                    v = partial.length === 0 ? '[]' : gap ? '[\n' + gap
                        + partial.join(',\n' + gap) + '\n' + mind + ']' : '['
                        + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

                // If the replacer is an array, use it to select the members to be
                // stringified.

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === 'string') {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

                    // Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = utils.str(k, value);
                            if (v) {
                                partial.push(utils.quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.

                v = partial.length === 0 ? '{}' : gap ? '{\n' + gap
                    + partial.join(',\n' + gap) + '\n' + mind + '}' : '{'
                    + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    },
    stringify : function(value, replacer, space) {
        // The stringify method takes a value and an optional replacer, and
        // an optional
        // space parameter, and returns a JSON text. The replacer can be a
        // function
        // that can replace values, or an array of strings that will select
        // the keys.
        // A default replacer method can be provided. Use of the space
        // parameter can
        // produce text that is more easily readable.

        var i;
        gap = '';
        indent = '';

        // If the space parameter is a number, make an indent string
        // containing that
        // many spaces.

        if (typeof space === 'number') {
            for (i = 0; i < space; i += 1) {
                indent += ' ';
            }

            // If the space parameter is a string, it will be used as the
            // indent string.

        } else if (typeof space === 'string') {
            indent = space;
        }

        // If there is a replacer, it must be a function or an array.
        // Otherwise, throw an error.

        rep = replacer;
        if (replacer
            && typeof replacer !== 'function'
            && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
            throw new Error('JSON.stringify');
        }

        // Make a fake root object containing our value under the key of ''.
        // Return the result of stringifying the value.

        return utils.str('', {
            '' : value
        });
    },
    toJson : function(text, reviver) {

        // The parse method takes a text and an optional reviver function,
        // and returns
        // a JavaScript value if the text is a valid JSON text.

        var j;

        function walk(holder, key) {

            // The walk method is used to recursively walk the resulting
            // structure so
            // that modifications can be made.

            var k, v, value = holder[key];
            if (value && typeof value === 'object') {
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = walk(value, k);
                        if (v !== undefined) {
                            value[k] = v;
                        } else {
                            delete value[k];
                        }
                    }
                }
            }
            return reviver.call(holder, key, value);
        }

        // Parsing happens in four stages. In the first stage, we replace
        // certain
        // Unicode characters with escape sequences. JavaScript handles many
        // characters
        // incorrectly, either silently deleting them, or treating them as
        // line endings.

        text = String(text);
        utils.cx.lastIndex = 0;
        if (utils.cx.test(text)) {
            text = text.replace(cx,
                function(a) {
                    return '\\u'
                        + ('0000' + a.charCodeAt(0).toString(16))
                            .slice(-4);
                });
        }

        // In the second stage, we run the text against regular expressions
        // that look
        // for non-JSON patterns. We are especially concerned with '()' and
        // 'new'
        // because they can cause invocation, and '=' because it can cause
        // mutation.
        // But just to be safe, we want to reject all unexpected forms.

        // We split the second stage into 4 regexp operations in order to
        // work around
        // crippling inefficiencies in IE's and Safari's regexp engines.
        // First we
        // replace the JSON backslash pairs with '@' (a non-JSON character).
        // Second, we
        // replace all simple value tokens with ']' characters. Third, we
        // delete all
        // open brackets that follow a colon or comma or that begin the
        // text. Finally,
        // we look to see that the remaining characters are only whitespace
        // or ']' or
        // ',' or ':' or '{' or '}'. If that is so, then the text is safe
        // for eval.

        if (/^[\],:{}\s]*$/
            .test(text
                .replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                .replace(
                /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

            // In the third stage we use the eval function to compile the
            // text into a
            // JavaScript structure. The '{' operator is subject to a
            // syntactic ambiguity
            // in JavaScript: it can begin a block or an object literal. We
            // wrap the text
            // in parens to eliminate the ambiguity.

            j = eval('(' + text + ')');

            // In the optional fourth stage, we recursively walk the new
            // structure, passing
            // each name/value pair to a reviver function for possible
            // transformation.

            return typeof reviver === 'function' ? walk({
                '' : j
            }, '') : j;
        }

        // If the text is not JSON parseable, then a SyntaxError is thrown.

        throw new SyntaxError('JSON.parse');
    }
});