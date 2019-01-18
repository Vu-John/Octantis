module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 25);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target, parent) {
  if (parent){
    return parent.querySelector(target);
  }
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target, parent) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target, parent);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(24);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertAt.before, target);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	if(options.attrs.nonce === undefined) {
		var nonce = getNonce();
		if (nonce) {
			options.attrs.nonce = nonce;
		}
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function getNonce() {
	if (false) {
		return null;
	}

	return __webpack_require__.nc;
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("prop-types");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});var _react=__webpack_require__(3);var _react2=_interopRequireDefault(_react);var _polaris=__webpack_require__(5);var _propTypes=__webpack_require__(2);var _propTypes2=_interopRequireDefault(_propTypes);var _styles=__webpack_require__(19);var _styles2=_interopRequireDefault(_styles);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var shopifyIcon=function shopifyIcon(source,onClick){return _react2.default.createElement('span',{onClick:onClick},_react2.default.createElement(_polaris.Icon,{source:source}));};var fontAwesomeIcon=function fontAwesomeIcon(source,onClick){return _react2.default.createElement('span',{className:source+' '+_styles2.default.customClass,onClick:onClick});};var Icon=function Icon(props){var type=props.type,source=props.source,onClick=props.onClick;return type==='fa'?fontAwesomeIcon(source,onClick):shopifyIcon(source,onClick);};Icon.propTypes={type:_propTypes2.default.string,source:_propTypes2.default.string,onClick:_propTypes2.default.func};exports.default=Icon;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("@shopify/polaris");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(3);var _react2=_interopRequireDefault(_react);var _propTypes=__webpack_require__(2);var _propTypes2=_interopRequireDefault(_propTypes);var _polaris=__webpack_require__(5);var _lodash=__webpack_require__(27);var _=_interopRequireWildcard(_lodash);var _styles=__webpack_require__(18);var styles=_interopRequireWildcard(_styles);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}else{var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key];}}newObj.default=obj;return newObj;}}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var FfDataTable=function(_React$PureComponent){_inherits(FfDataTable,_React$PureComponent);function FfDataTable(props){_classCallCheck(this,FfDataTable);var _this=_possibleConstructorReturn(this,(FfDataTable.__proto__||Object.getPrototypeOf(FfDataTable)).call(this,props));_this.renderRows=function(rowData,rowIndex){var _this$props=_this.props,trackSelectionBy=_this$props.trackSelectionBy,selectedRows=_this$props.selectedRows,columns=_this$props.columns,onSelectionChange=_this$props.onSelectionChange;var formattedRow=[];if(onSelectionChange){var isSelected=_.find(selectedRows,function(rowId){return rowData[trackSelectionBy]===rowId||rowIndex===rowId;});formattedRow.push(_react2.default.createElement('div',{className:styles.cellElement},_react2.default.createElement(_polaris.Checkbox,{checked:isSelected,onChange:function onChange(){return _this.onSelectRow(rowData[trackSelectionBy]||rowIndex);}})));}_.forEach(columns,function(column){if(column===trackSelectionBy){return;}else{formattedRow.push(_react2.default.createElement('div',{className:styles.cellElement,key:column.field,onClick:function onClick(event){return _this.props.onRowClick(event,rowData);}},rowData[column.field]));}});return formattedRow;};_this.onColumnSort=function(index,direction){var columns=_this.props.columns;// index - 1 is done to ignore the header checkbox
var column=columns[index-1].field;_this.props.onSortChange(column,direction);};_this.onSelectRow=function(rowId){var selectedRows=_this.props.selectedRows;var newlySelectedRows;if(rowId==='all'){newlySelectedRows=rowId;}else{// xor will toggle the rowId in selected row array
newlySelectedRows=_.xor(selectedRows,[rowId]);}_this.props.onSelectionChange(newlySelectedRows);};_this.tableRef=_react2.default.createRef();return _this;}_createClass(FfDataTable,[{key:'componentDidMount',value:function componentDidMount(){var _this2=this;setTimeout(function(){_this2.configureObserver();},0);}},{key:'componentDidUpdate',value:function componentDidUpdate(prevProps){if(!_.isEqual(prevProps.rows&&prevProps.rows.length,this.props.rows.length)){this.configureObserver();}}},{key:'configureObserver',value:function configureObserver(){var _props=this.props,loadMoreRecords=_props.loadMoreRecords,observerRowIndex=_props.observerRowIndex,loadingRecords=_props.loadingRecords;if(!loadMoreRecords||loadingRecords){return;}var rows=this.tableRef.current.getElementsByTagName('tr')||[];if(!rows[rows.length-observerRowIndex]){return;}if('IntersectionObserver'in window){var onChange=function onChange(changes,observer){_.forEach(changes,function(change){if(change.intersectionRatio>0){loadMoreRecords();observer.unobserve(change.target);}});};// IntersectionObserver Supported
var config={root:null,rootMargin:'0px',threshold:0.5};var observer=new IntersectionObserver(onChange,config);observer.observe(rows[rows.length-observerRowIndex]);}else{// IntersectionObserver NOT Supported
loadMoreRecords();}}},{key:'render',value:function render(){var _this3=this;var _props2=this.props,rows=_props2.rows,columns=_props2.columns,sortBy=_props2.sortBy,selectAllStatus=_props2.selectAllStatus,onSelectionChange=_props2.onSelectionChange,loading=_props2.loading;// Prepare props for polaris table
var columnContentTypes=[],columnHeadings=[],columnSortable=[],formattedRows=[];var sortedColumnIndex=_.findIndex(columns,function(col){return col.field===sortBy.field;});var sortDirection=sortBy.order;if(onSelectionChange){columnContentTypes.push('string');columnSortable.push(false);columnHeadings.push(_react2.default.createElement(_polaris.Checkbox,{checked:selectAllStatus,onChange:function onChange(){return _this3.onSelectRow('all');}}));}_.each(columns,function(column){columnContentTypes.push(column.type);columnHeadings.push(column.displayName);columnSortable.push(column.sortable);});_.forEach(rows,function(row,index){formattedRows.push(_this3.renderRows(row,index));});return _react2.default.createElement(_polaris.AppProvider,null,_react2.default.createElement(_polaris.Card,null,_react2.default.createElement('div',{ref:this.tableRef},_react2.default.createElement(_polaris.DataTable,{columnContentTypes:columnContentTypes,headings:columnHeadings,rows:formattedRows,onSort:this.onColumnSort,defaultSortDirection:sortDirection||"none",initialSortColumnIndex:sortedColumnIndex}),!rows.length&&loading?_react2.default.createElement('div',{className:styles.noRecords},_react2.default.createElement(_polaris.Spinner,null)):null,!rows.length&&!loading?_react2.default.createElement('div',{className:styles.noRecords},'No Records found'):null)));}}]);return FfDataTable;}(_react2.default.PureComponent);FfDataTable.defaultProps={trackSelectionBy:'id',observerRowIndex:10};FfDataTable.propTypes={loading:_propTypes2.default.bool,columns:_propTypes2.default.arrayOf(_propTypes2.default.shape({displayName:_propTypes2.default.string,field:_propTypes2.default.string,sortable:_propTypes2.default.bool,type:_propTypes2.default.string})),onSortChange:_propTypes2.default.func,rows:_propTypes2.default.arrayOf(_propTypes2.default.object),selectedRows:_propTypes2.default.arrayOf(_propTypes2.default.oneOfType([_propTypes2.default.number,_propTypes2.default.string])),onSelectionChange:_propTypes2.default.func,onRowClick:_propTypes2.default.func,/**
   * variable which will handle the row selection
   * usualy it will be the unique id
   */trackSelectionBy:_propTypes2.default.string,sortBy:_propTypes2.default.shape({field:_propTypes2.default.string,order:_propTypes2.default.oneOf(['ascending','descending'])}),selectAllStatus:_propTypes2.default.oneOf(['indeterminate',true,false]),/**
   * Index of row (from last) which will act as threshold
   * to trigger loadMoreRecords
   */observerRowIndex:_propTypes2.default.number,/**
   * This method will be triggerd when the
   * threshold row is visible in viewport
   */loadMoreRecords:_propTypes2.default.func,loadingRecords:_propTypes2.default.bool};exports.default=FfDataTable;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});var _react=__webpack_require__(3);var _react2=_interopRequireDefault(_react);var _propTypes=__webpack_require__(2);var _propTypes2=_interopRequireDefault(_propTypes);var _index=__webpack_require__(11);var _index2=_interopRequireDefault(_index);var _styles=__webpack_require__(21);var styles=_interopRequireWildcard(_styles);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}else{var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key];}}newObj.default=obj;return newObj;}}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var Navigation=function Navigation(props){var actionItems=props.actionItems;return _react2.default.createElement('div',{className:styles.wrapper},actionItems&&actionItems.map(function(itemList,index){return _react2.default.createElement(_index2.default,{key:index,itemsList:itemList});}));};Navigation.propTypes={actionItems:_propTypes2.default.arrayOf(_propTypes2.default.object)};exports.default=Navigation;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});var _react=__webpack_require__(3);var _react2=_interopRequireDefault(_react);var _propTypes=__webpack_require__(2);var _propTypes2=_interopRequireDefault(_propTypes);var _index=__webpack_require__(4);var _index2=_interopRequireDefault(_index);var _styles=__webpack_require__(22);var styles=_interopRequireWildcard(_styles);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}else{var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key];}}newObj.default=obj;return newObj;}}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var ListItem=function ListItem(_ref){var item=_ref.item;var containerClasses=[styles.container];if(item.onAction){containerClasses.push(styles.clickable);}return _react2.default.createElement('div',{className:containerClasses.join(' '),onClick:item.onAction},_react2.default.createElement(_index2.default,{source:item.icon,type:item.iconType}),_react2.default.createElement('span',null,item.content),item.onAction?_react2.default.createElement(_index2.default,{source:'chevronRight',type:'shopify'}):null);};var SimpleResourceList=function SimpleResourceList(_ref2){var items=_ref2.items;return _react2.default.createElement('div',{className:styles.wrapper},items.map(function(item,index){return _react2.default.createElement(ListItem,{key:index,item:item});}));};SimpleResourceList.propTypes={items:_propTypes2.default.arrayOf(_propTypes2.default.shape({icon:_propTypes2.default.string,iconType:_propTypes2.default.string,content:_propTypes2.default.oneOfType([_propTypes2.default.string,_propTypes2.default.node]),onAction:_propTypes2.default.func}))};exports.default=SimpleResourceList;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});var _react=__webpack_require__(3);var _react2=_interopRequireDefault(_react);var _propTypes=__webpack_require__(2);var _propTypes2=_interopRequireDefault(_propTypes);var _Hidden=__webpack_require__(26);var _Hidden2=_interopRequireDefault(_Hidden);var _styles=__webpack_require__(23);var _styles2=_interopRequireDefault(_styles);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var TopNav=function TopNav(props){var logo=props.logo,content=props.content,onIconClick=props.onIconClick;return _react2.default.createElement('div',{className:_styles2.default.container},_react2.default.createElement('div',{className:_styles2.default.iconWrapper,onClick:onIconClick},_react2.default.createElement('i',{className:'fa fa-bars'})),_react2.default.createElement('div',{className:_styles2.default.logoWrapper},_react2.default.createElement('img',{src:logo})),_react2.default.createElement('div',{className:_styles2.default.content},content));};TopNav.propTypes={logo:_propTypes2.default.string,content:_propTypes2.default.node,onIconClick:_propTypes2.default.func};exports.default=TopNav;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("@shopify/polaris/styles.css");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});var _react=__webpack_require__(3);var _react2=_interopRequireDefault(_react);var _propTypes=__webpack_require__(2);var _propTypes2=_interopRequireDefault(_propTypes);var _polaris=__webpack_require__(5);var _reactRouterDom=__webpack_require__(28);var _index=__webpack_require__(4);var _index2=_interopRequireDefault(_index);var _styles=__webpack_require__(20);var styles=_interopRequireWildcard(_styles);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}else{var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key];}}newObj.default=obj;return newObj;}}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var Item=function Item(_ref){var item=_ref.item;var suffixMarkup=item.count?_react2.default.createElement('span',{className:styles.count},item.count):_react2.default.createElement(SecondaryIcon,{item:item});return _react2.default.createElement(_reactRouterDom.NavLink,{to:item.route,className:styles.content,activeClassName:styles.contentActive},_react2.default.createElement(_index2.default,{source:item.icon,type:item.iconType}),_react2.default.createElement('span',null,item.content),suffixMarkup);};var ChildItems=function ChildItems(_ref2){var item=_ref2.item;return _react2.default.createElement(_polaris.Collapsible,{open:item.active,id:item.content},item.children.map(function(childItem){return _react2.default.createElement(_reactRouterDom.NavLink,{to:childItem.route,key:childItem.content,className:styles.childContent,activeClassName:styles.childContentActive},_react2.default.createElement('span',null,childItem.content));}));};var SecondaryIcon=function SecondaryIcon(_ref3){var item=_ref3.item;var _onClick=function _onClick(event){event.stopPropagation();item.secondaryAction();};return item.secondaryIcon?_react2.default.createElement(_index2.default,{type:itemsList.iconType,source:item.secondaryIcon,onClick:_onClick}):null;};var ItemList=function ItemList(props){var itemsList=props.itemsList;var NavmenuItems=itemsList.items;var titleMarkup=itemsList.title?_react2.default.createElement('div',{className:styles.title},_react2.default.createElement('div',null,itemsList.title),itemsList.icon?_react2.default.createElement(_index2.default,{type:itemsList.iconType,source:itemsList.icon,onClick:itemsList.onIconClick}):null):null;var contentMarkup=NavmenuItems.map(function(item){return _react2.default.createElement('div',{key:item.content},_react2.default.createElement(Item,{item:item}),item.children&&item.children.length?_react2.default.createElement(ChildItems,{item:item}):null);});return _react2.default.createElement('div',{className:itemsList.bottom?styles.bottomContent:styles.navContent},titleMarkup,contentMarkup);};ItemList.propTypes={itemsList:_propTypes2.default.object};exports.default=ItemList;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "tbody tr:hover th {\n  box-shadow: inset 2px 0 0 0 #007ace;\n  cursor: pointer;\n}\n\ntd {\n  cursor: pointer;\n}\n\nth, th button {\n  font-weight: bold !important;\n}\n\nlabel {\n  cursor: pointer;\n}\n\n._2e8lLKZYdIXqmoRaU0jh-m {\n  text-align: center;\n  margin: 40px 0px;\n}\n\n.Ih9LIH4NyKIzNvLi2xyFK {\n  padding: 1.6rem;\n}", ""]);

// exports
exports.locals = {
	"noRecords": "_2e8lLKZYdIXqmoRaU0jh-m",
	"cellElement": "Ih9LIH4NyKIzNvLi2xyFK"
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "._2qJT5YWB8TdvOhqn5Vjzig {\n  width: 100%;\n  margin-bottom: 30px;\n}\n\n._3CSesZyqaEVBeNBtH2qJgu {\n  width: 100%;\n  font-size: 1.2rem;\n  font-weight: 700;\n  text-transform: uppercase;\n  color: #637381;\n  display: flex;\n  margin: 8px 0px;\n}\n\n._3CSesZyqaEVBeNBtH2qJgu > span:first-child {\n  flex: auto;\n}\n\n._3CSesZyqaEVBeNBtH2qJgu > span:last-child {\n  height: 16px;\n  width: 16px;\n  fill: #919eab;\n  cursor: pointer;\n  font-size: 1.6rem;\n}\n\n._3i_OL-grAvcY-l-Cp6tmQh {\n  display: flex;\n  flex-direction: row;\n  color: #212b36;\n  fill: #919eab;\n  cursor: pointer;\n  margin: 5px 0px;\n  text-decoration: none;\n}\n\n._3i_OL-grAvcY-l-Cp6tmQh:hover {\n  color: #000;\n  fill: #637381;\n}\n\n._3i_OL-grAvcY-l-Cp6tmQh > span:first-child {\n  color: #919eab;\n}\n\n._3i_OL-grAvcY-l-Cp6tmQh:hover > span:first-child {\n  color: #637381;\n}\n\n._3i_OL-grAvcY-l-Cp6tmQh > span:first-child, ._1YmNtyQCd4G-FVecosYLmn > span:first-child  {\n  width: 20px;\n  height: 20px;\n  font-size: 1.8rem;\n}\n\n._3i_OL-grAvcY-l-Cp6tmQh > span:nth-child(2), ._1YmNtyQCd4G-FVecosYLmn > span:nth-child(2), ._2UDly8K7fUJZ-5C1fy5fUI > span:nth-child(2)  {\n  flex: auto;\n  margin-left: 10px;\n}\n\n._3i_OL-grAvcY-l-Cp6tmQh > span:last-child, ._1YmNtyQCd4G-FVecosYLmn > span:last-child, ._2UDly8K7fUJZ-5C1fy5fUI > span:last-child {\n  width: 14px;\n  height: 14px;\n}\n\n._1YmNtyQCd4G-FVecosYLmn {\n  display: flex;\n  flex-direction: row;\n  color: #007ace;\n  fill: #007ace;\n  cursor: pointer;\n  margin: 10px 0px;\n}\n\n._1XFphsD-R8aZBQ4lqjwp00 {\n  background-color: #47c1bf;\n  height: unset !important;\n  width: unset !important;\n  color: #fff;\n  padding: 0rem 0.5rem;\n  border-radius: 0.8rem;\n  text-align: left;\n  font-size: 1.2rem !important;\n  margin-bottom: 3px;\n  line-height: 1.6rem;\n  padding-top: 0.1rem;\n}\n\n._3Hvwi9KQ3NHMS-w_2FGuHS {\n  font-size: 1.4rem;\n  color: #637381;\n  width: 100%;\n  margin: 3px 0px 6px 30px;\n  cursor: pointer;\n}\n\n._3Hvwi9KQ3NHMS-w_2FGuHS:hover {\n  color: #007ace;\n}\n\n._2xZl_5v0k1UfWGSFNpm8dV {\n  font-size: 1.4rem;\n  color: #007ace;\n  width: 100%;\n  margin: 3px 0px 6px 30px;\n  cursor: pointer;\n}\n\n._2UDly8K7fUJZ-5C1fy5fUI {\n  display: flex;\n  cursor: pointer;\n}\n\n._2UDly8K7fUJZ-5C1fy5fUI > span:first-child {\n  fill: #007ace;\n  color: #007ace;\n  width: 20px;\n  height: 20px;\n  font-size: 1.8rem;\n}\n\n.CSK8Yxdi_dG2Oa_GYF76v {\n  position: absolute;\n  bottom: 10vh;\n  width: 85%;\n}\n", ""]);

// exports
exports.locals = {
	"navContent": "_2qJT5YWB8TdvOhqn5Vjzig",
	"title": "_3CSesZyqaEVBeNBtH2qJgu",
	"content": "_3i_OL-grAvcY-l-Cp6tmQh",
	"contentActive": "_1YmNtyQCd4G-FVecosYLmn",
	"contentChildActive": "_2UDly8K7fUJZ-5C1fy5fUI",
	"count": "_1XFphsD-R8aZBQ4lqjwp00",
	"childContent": "_3Hvwi9KQ3NHMS-w_2FGuHS",
	"childContentActive": "_2xZl_5v0k1UfWGSFNpm8dV",
	"bottomContent": "CSK8Yxdi_dG2Oa_GYF76v"
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "._2ilajPemcpThZlMha-z_f7 {\n  width: 240px;\n  background-color: #f4f6f8;\n  height: 100vh;\n  padding: 10px 20px;\n  border-right: 1px solid #dfe3e8;\n  position: fixed;\n}", ""]);

// exports
exports.locals = {
	"wrapper": "_2ilajPemcpThZlMha-z_f7"
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".t_4h8wF-8QSEgesJFg7e_ {\n  background-color: #fff;\n  box-shadow: 0 0 0 1px rgba(63,63,68,.05), 0 1px 3px 0 rgba(63,63,68,.15);\n}\n\n._3csRksVkKaTbebq8gH-q2b {\n  margin: 0px 1.6rem;\n  padding: 1.6rem 0rem;\n  display: flex;\n  color: #212b36;\n  font-size: 1.4rem;\n}\n\n._3csRksVkKaTbebq8gH-q2b > span:first-child {\n  width: 60px;\n  color: #007ace;\n  fill: #007ace;\n  font-size: 2rem;\n}\n\n._3csRksVkKaTbebq8gH-q2b > span:first-child > span {\n  margin: unset;\n}\n\n._3csRksVkKaTbebq8gH-q2b > span:nth-child(2) {\n  flex: auto;\n}\n\n._3csRksVkKaTbebq8gH-q2b > span:last-child {\n  fill: #c4cdd5;\n}\n\n._3csRksVkKaTbebq8gH-q2b:not(:last-child) {\n  border-bottom: 1px solid #dfdfdf;\n}\n\n._2MEJH8onsF-ow824vvcHr2 {\n  cursor: pointer;\n}", ""]);

// exports
exports.locals = {
	"wrapper": "t_4h8wF-8QSEgesJFg7e_",
	"container": "_3csRksVkKaTbebq8gH-q2b",
	"clickable": "_2MEJH8onsF-ow824vvcHr2"
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "._1CZWaJNlV95VSpoiCmOPpm {\n    height: 64px;\n    background-color: #1e3d58;\n    z-index: 100;\n    width: 100%;\n    position: sticky;\n    top: 0\n}\n\n._1CZWaJNlV95VSpoiCmOPpm img {\n    height: 35px;\n}\n\n._1fufIXwe2_WL6Nkcds8LXw {\n    width: 240px;\n    background-color: #183046;\n    padding: 13px 20px;\n    display: block;\n    height: 64px;\n}\n\n._2YBq73quU2iTiSA-L82X5L {\n    display: none;\n    padding: 20px 15px;\n    color: #f4f6f8;\n    width: 60px;\n    font-size: 20px;\n    cursor: pointer;\n}\n\n@media (max-width: 992px) {\n    ._2YBq73quU2iTiSA-L82X5L {\n        display: block;\n    }\n\n    ._1fufIXwe2_WL6Nkcds8LXw {\n        display: none;\n    }\n}", ""]);

// exports
exports.locals = {
	"container": "_1CZWaJNlV95VSpoiCmOPpm",
	"logoWrapper": "_1fufIXwe2_WL6Nkcds8LXw",
	"iconWrapper": "_2YBq73quU2iTiSA-L82X5L"
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(12);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../../node_modules/css-loader/index.js??ref--1-1!./styles.css", function() {
		var newContent = require("!!../../../node_modules/css-loader/index.js??ref--1-1!./styles.css");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(13);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../node_modules/css-loader/index.js??ref--1-1!./styles.css", function() {
		var newContent = require("!!../../node_modules/css-loader/index.js??ref--1-1!./styles.css");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(14);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../node_modules/css-loader/index.js??ref--1-1!./styles.css", function() {
		var newContent = require("!!../../node_modules/css-loader/index.js??ref--1-1!./styles.css");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(15);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../node_modules/css-loader/index.js??ref--1-1!./styles.css", function() {
		var newContent = require("!!../../node_modules/css-loader/index.js??ref--1-1!./styles.css");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(16);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../node_modules/css-loader/index.js??ref--1-1!./styles.css", function() {
		var newContent = require("!!../../node_modules/css-loader/index.js??ref--1-1!./styles.css");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(17);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../node_modules/css-loader/index.js??ref--1-1!./styles.css", function() {
		var newContent = require("!!../../node_modules/css-loader/index.js??ref--1-1!./styles.css");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 24 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shopify_polaris_styles_css__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shopify_polaris_styles_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__shopify_polaris_styles_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__navigation_index_jsx__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__navigation_index_jsx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__navigation_index_jsx__);
/* harmony reexport (default from non-hamory) */ __webpack_require__.d(__webpack_exports__, "Navigation", function() { return __WEBPACK_IMPORTED_MODULE_1__navigation_index_jsx___default.a; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__simpleresourselist_index_jsx__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__simpleresourselist_index_jsx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__simpleresourselist_index_jsx__);
/* harmony reexport (default from non-hamory) */ __webpack_require__.d(__webpack_exports__, "SimpleResourceList", function() { return __WEBPACK_IMPORTED_MODULE_2__simpleresourselist_index_jsx___default.a; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__datatable_table_index_jsx__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__datatable_table_index_jsx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__datatable_table_index_jsx__);
/* harmony reexport (default from non-hamory) */ __webpack_require__.d(__webpack_exports__, "DataTable", function() { return __WEBPACK_IMPORTED_MODULE_3__datatable_table_index_jsx___default.a; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__topnav_index_jsx__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__topnav_index_jsx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__topnav_index_jsx__);
/* harmony reexport (default from non-hamory) */ __webpack_require__.d(__webpack_exports__, "TopNav", function() { return __WEBPACK_IMPORTED_MODULE_4__topnav_index_jsx___default.a; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__icon_index_jsx__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__icon_index_jsx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__icon_index_jsx__);
/* harmony reexport (default from non-hamory) */ __webpack_require__.d(__webpack_exports__, "Icon", function() { return __WEBPACK_IMPORTED_MODULE_5__icon_index_jsx___default.a; });










/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("@material-ui/core/Hidden");

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = require("react-router-dom");

/***/ })
/******/ ]);