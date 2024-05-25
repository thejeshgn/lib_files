"use strict";
(self["webpackChunkgristy"] = self["webpackChunkgristy"] || []).push([["app_client_lib_ACSelect_ts-app_client_lib_clipboardUtils_ts-app_client_lib_testState_ts-app_c-3562c2"],{

/***/ "./app/client/lib/ACIndex.ts":
/*!***********************************!*\
  !*** ./app/client/lib/ACIndex.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ACIndexImpl": () => (/* binding */ ACIndexImpl),
/* harmony export */   "buildHighlightedDom": () => (/* binding */ buildHighlightedDom),
/* harmony export */   "highlightNone": () => (/* binding */ highlightNone),
/* harmony export */   "normalizeText": () => (/* binding */ normalizeText)
/* harmony export */ });
/* harmony import */ var app_common_gutil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/common/gutil */ "./app/common/gutil.ts");

const escapeRegExp = __webpack_require__(/*! lodash/escapeRegExp */ "./node_modules/lodash/escapeRegExp.js");
const deburr = __webpack_require__(/*! lodash/deburr */ "./node_modules/lodash/deburr.js");
const split = __webpack_require__(/*! lodash/split */ "./node_modules/lodash/split.js");
function normalizeText(text) {
  return deburr(text).trim().toLowerCase();
}
const wordSepRegexp = /[\s!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+/;
const highlightNone = (text) => [text];
class ACIndexImpl {
  constructor(items, _maxResults = 50, _keepOrder = false) {
    this._maxResults = _maxResults;
    this._keepOrder = _keepOrder;
    this._allItems = items.slice(0);
    const allWords = [];
    for (let index = 0; index < this._allItems.length; index++) {
      const item = this._allItems[index];
      const words = item.cleanText.split(wordSepRegexp).filter((w) => w);
      for (let pos = 0; pos < words.length; pos++) {
        allWords.push({ word: words[pos], index, pos });
      }
    }
    allWords.sort((a, b) => (0,app_common_gutil__WEBPACK_IMPORTED_MODULE_0__.localeCompare)(a.word, b.word));
    this._words = allWords;
  }
  search(searchText) {
    const cleanedSearchText = normalizeText(searchText);
    const searchWords = cleanedSearchText.split(wordSepRegexp).filter((w) => w);
    const myMatches = /* @__PURE__ */ new Map();
    if (searchWords.length > 0) {
      for (let k = 0; k < searchWords.length; k++) {
        const searchWord = searchWords[k];
        for (const [itemIndex, score] of this._findOverlaps(searchWord, k)) {
          myMatches.set(itemIndex, (myMatches.get(itemIndex) || 0) + score);
        }
      }
      for (const [itemIndex, score] of myMatches) {
        if (this._allItems[itemIndex].cleanText.startsWith(cleanedSearchText)) {
          myMatches.set(itemIndex, score + 1);
        }
      }
    }
    const sortedMatches = Array.from(myMatches).sort((a, b) => (0,app_common_gutil__WEBPACK_IMPORTED_MODULE_0__.nativeCompare)(b[1], a[1]) || (0,app_common_gutil__WEBPACK_IMPORTED_MODULE_0__.nativeCompare)(a[0], b[0])).slice(0, this._maxResults);
    const itemIndices = sortedMatches.map(([index, score]) => index);
    for (let i = 0; i < this._allItems.length && itemIndices.length < this._maxResults; i++) {
      if (this._allItems[i].cleanText && !myMatches.has(i)) {
        itemIndices.push(i);
      }
    }
    if (this._keepOrder) {
      itemIndices.sort(app_common_gutil__WEBPACK_IMPORTED_MODULE_0__.nativeCompare);
    }
    const items = itemIndices.map((index) => this._allItems[index]);
    if (!cleanedSearchText) {
      return { items, highlightFunc: highlightNone, selectIndex: -1 };
    }
    const highlightFunc = highlightMatches.bind(null, searchWords);
    let selectIndex = sortedMatches.length > 0 ? itemIndices.indexOf(sortedMatches[0][0]) : -1;
    if (selectIndex >= 0 && !startsWithText(items[selectIndex], cleanedSearchText, searchWords)) {
      selectIndex = -1;
    }
    return { items, highlightFunc, selectIndex };
  }
  _findOverlaps(searchWord, searchWordPos) {
    const insertIndex = (0,app_common_gutil__WEBPACK_IMPORTED_MODULE_0__.sortedIndex)(this._words, { word: searchWord }, (a, b) => (0,app_common_gutil__WEBPACK_IMPORTED_MODULE_0__.localeCompare)(a.word, b.word));
    const scored = /* @__PURE__ */ new Map();
    for (const step of [1, -1]) {
      let prefix = searchWord;
      let index = insertIndex + (step > 0 ? 0 : -1);
      while (prefix && index >= 0 && index < this._words.length) {
        for (; index >= 0 && index < this._words.length; index += step) {
          const wordEntry = this._words[index];
          if (!wordEntry.word.startsWith(prefix)) {
            break;
          }
          const baseScore = prefix.length;
          const fullWordBonus = wordEntry.word === searchWord ? 1 : 0;
          const positionBonus = Math.pow(2, -(searchWordPos + wordEntry.pos));
          const itemScore = baseScore + fullWordBonus + positionBonus;
          if (itemScore >= (scored.get(wordEntry.index) || 0)) {
            scored.set(wordEntry.index, itemScore);
          }
        }
        prefix = prefix.slice(0, -1);
      }
    }
    return scored;
  }
}
function buildHighlightedDom(text, highlightFunc, highlight) {
  if (!text) {
    return text;
  }
  const parts = highlightFunc(text);
  return parts.map((part, k) => k % 2 ? highlight(part) : part);
}
const wordSepRegexpParen = new RegExp(`(${wordSepRegexp.source})`);
function highlightMatches(searchWords, text) {
  const textParts = text.split(wordSepRegexpParen);
  const outputs = [""];
  for (let i = 0; i < textParts.length; i += 2) {
    const word = textParts[i];
    const separator = textParts[i + 1] || "";
    const prefixLen = findLongestPrefixLen(deburr(word).toLowerCase(), searchWords);
    if (prefixLen === 0) {
      outputs[outputs.length - 1] += word + separator;
    } else {
      const chars = split(word, "");
      outputs.push(chars.slice(0, prefixLen).join(""), chars.slice(prefixLen).join("") + separator);
    }
  }
  return outputs;
}
function findLongestPrefixLen(text, choices) {
  return choices.reduce((max, choice) => Math.max(max, findCommonPrefixLength(text, choice)), 0);
}
function findCommonPrefixLength(text1, text2) {
  let i = 0;
  while (i < text1.length && text1[i] === text2[i]) {
    ++i;
  }
  return i;
}
function startsWithText(item, text, searchWords) {
  if (item.cleanText.startsWith(text)) {
    return true;
  }
  const regexp = new RegExp(searchWords.map((w) => `\\b` + escapeRegExp(w)).join(".*"));
  const cleanText = item.cleanText.split(wordSepRegexp).join(" ");
  return regexp.test(cleanText);
}


/***/ }),

/***/ "./app/client/lib/ACSelect.ts":
/*!************************************!*\
  !*** ./app/client/lib/ACSelect.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "buildACSelect": () => (/* binding */ buildACSelect),
/* harmony export */   "cssSelectItem": () => (/* binding */ cssSelectItem)
/* harmony export */ });
/* harmony import */ var app_client_lib_ACIndex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/client/lib/ACIndex */ "./app/client/lib/ACIndex.ts");
/* harmony import */ var app_client_lib_autocomplete__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/client/lib/autocomplete */ "./app/client/lib/autocomplete.ts");
/* harmony import */ var app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/client/ui2018/cssVars */ "./app/client/ui2018/cssVars.ts");
/* harmony import */ var app_client_ui2018_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/client/ui2018/icons */ "./app/client/ui2018/icons.ts");
/* harmony import */ var app_client_ui2018_menus__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/client/ui2018/menus */ "./app/client/ui2018/menus.ts");
/* harmony import */ var grainjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! grainjs */ "./node_modules/grainjs/dist/esm/index.js");






function buildACSelect(owner, options, ...args) {
  const { acIndex, valueObs, save } = options;
  const acHolder = grainjs__WEBPACK_IMPORTED_MODULE_5__.Holder.create(owner);
  let textInput;
  const isOpen = () => !acHolder.isEmpty();
  const acOpen = () => acHolder.isEmpty() && app_client_lib_autocomplete__WEBPACK_IMPORTED_MODULE_1__.Autocomplete.create(acHolder, textInput, acOptions);
  const acClose = () => acHolder.clear();
  const finish = () => {
    acClose();
    textInput.blur();
  };
  const revert = () => {
    textInput.value = valueObs.get();
    finish();
  };
  const commitOrRevert = async () => {
    await commitIfValid() || revert();
  };
  const openOrCommit = () => {
    isOpen() ? commitOrRevert().catch(() => {
    }) : acOpen();
  };
  const commitIfValid = async () => {
    var _a;
    const item = (_a = acHolder.get()) == null ? void 0 : _a.getSelectedItem();
    if (item) {
      textInput.value = item.value;
    }
    textInput.disabled = true;
    try {
      await save(textInput.value, item);
      finish();
      return true;
    } catch (e) {
      return false;
    } finally {
      textInput.disabled = false;
    }
  };
  const onMouseDown = (ev) => {
    var _a;
    ev.preventDefault();
    if ((_a = options.disabled) == null ? void 0 : _a.get()) {
      return;
    }
    if (!isOpen()) {
      textInput.focus();
    }
    openOrCommit();
  };
  const acOptions = {
    menuCssClass: `${app_client_ui2018_menus__WEBPACK_IMPORTED_MODULE_4__.menuCssClass} test-acselect-dropdown`,
    search: async (term) => acIndex.search(term),
    renderItem: (item, highlightFunc) => cssSelectItem((0,app_client_lib_ACIndex__WEBPACK_IMPORTED_MODULE_0__.buildHighlightedDom)(item.label, highlightFunc, cssMatchText)),
    getItemText: (item) => item.value,
    onClick: commitIfValid
  };
  return cssSelectBtn(textInput = cssInput({ type: "text" }, grainjs__WEBPACK_IMPORTED_MODULE_5__.dom.prop("value", valueObs), grainjs__WEBPACK_IMPORTED_MODULE_5__.dom.on("focus", (ev, elem) => elem.select()), grainjs__WEBPACK_IMPORTED_MODULE_5__.dom.on("blur", commitOrRevert), grainjs__WEBPACK_IMPORTED_MODULE_5__.dom.prop("disabled", (use) => options.disabled ? use(options.disabled) : false), grainjs__WEBPACK_IMPORTED_MODULE_5__.dom.onKeyDown({
    Escape: revert,
    Enter: openOrCommit,
    ArrowDown: acOpen,
    Tab: commitIfValid
  }), grainjs__WEBPACK_IMPORTED_MODULE_5__.dom.on("input", acOpen)), grainjs__WEBPACK_IMPORTED_MODULE_5__.dom.on("mousedown", onMouseDown), cssIcon("Dropdown"), ...args);
}
const cssSelectBtn = (0,grainjs__WEBPACK_IMPORTED_MODULE_5__.styled)("div", `
  position: relative;
  width: 100%;
  height: 30px;
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_2__.theme.selectButtonFg};
  --icon-color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_2__.theme.selectButtonFg};
`);
const cssSelectItem = (0,grainjs__WEBPACK_IMPORTED_MODULE_5__.styled)("li", `
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_2__.theme.menuItemFg};
  display: block;
  white-space: pre;
  overflow: hidden;
  text-overflow: ellipsis;
  outline: none;
  padding: var(--weaseljs-menu-item-padding, 8px 24px);
  cursor: pointer;

  &.selected {
    background-color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_2__.theme.menuItemSelectedBg};
    color:            ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_2__.theme.menuItemSelectedFg};
  }
`);
const cssInput = (0,grainjs__WEBPACK_IMPORTED_MODULE_5__.styled)("input", `
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_2__.theme.inputFg};
  background-color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_2__.theme.inputBg};
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  height: 100%;
  width: 100%;
  padding: 0 6px;
  outline: none;
  border: 1px solid ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_2__.theme.inputBorder};
  border-radius: 3px;
  cursor: pointer;
  line-height: 16px;
  cursor: pointer;

  &:disabled {
    color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_2__.theme.inputDisabledFg};
    background-color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_2__.theme.inputDisabledBg};
  }
  &:focus {
    cursor: initial;
    outline: none;
    box-shadow: 0px 0px 2px 2px ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_2__.theme.inputFocus};
  }
  &::placeholder {
    color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_2__.theme.inputPlaceholderFg};
  }
`);
const cssIcon = (0,grainjs__WEBPACK_IMPORTED_MODULE_5__.styled)(app_client_ui2018_icons__WEBPACK_IMPORTED_MODULE_3__.icon, `
  position: absolute;
  right: 6px;
  top: calc(50% - 8px);
`);
const cssMatchText = (0,grainjs__WEBPACK_IMPORTED_MODULE_5__.styled)("span", `
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_2__.theme.autocompleteMatchText};
  .selected > & {
    color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_2__.theme.autocompleteSelectedMatchText};
  }
`);


/***/ }),

/***/ "./app/client/lib/clipboardUtils.ts":
/*!******************************************!*\
  !*** ./app/client/lib/clipboardUtils.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "copyToClipboard": () => (/* binding */ copyToClipboard),
/* harmony export */   "readDataFromClipboard": () => (/* binding */ readDataFromClipboard),
/* harmony export */   "readTextFromClipboard": () => (/* binding */ readTextFromClipboard)
/* harmony export */ });
/* harmony import */ var app_client_lib_browserGlobals__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/client/lib/browserGlobals */ "./app/client/lib/browserGlobals.js");

const G = (0,app_client_lib_browserGlobals__WEBPACK_IMPORTED_MODULE_0__.get)("document", "window");
async function copyToClipboard(data) {
  if (typeof data === "string") {
    await copyTextToClipboard(data);
  } else {
    await copyDataToClipboard(data);
  }
}
async function copyTextToClipboard(txt) {
  if (G.window.navigator && G.window.navigator.clipboard && G.window.navigator.clipboard.writeText) {
    try {
      await G.window.navigator.clipboard.writeText(txt);
      return;
    } catch (e) {
    }
  }
  const stash = G.document.createElement("textarea");
  stash.value = txt;
  stash.setAttribute("readonly", "");
  stash.style.position = "absolute";
  stash.style.left = "-10000px";
  G.document.body.appendChild(stash);
  const selection = G.document.getSelection().rangeCount > 0 && G.document.getSelection().getRangeAt(0);
  stash.select();
  G.document.execCommand("copy");
  G.document.body.removeChild(stash);
  if (selection) {
    G.document.getSelection().removeAllRanges();
    G.document.getSelection().addRange(selection);
  }
}
async function copyDataToClipboard(data) {
  var _a, _b;
  if (!((_b = (_a = G.window.navigator) == null ? void 0 : _a.clipboard) == null ? void 0 : _b.write)) {
    throw new Error("navigator.clipboard.write is not supported on this browser");
  }
  await G.window.navigator.clipboard.write([data]);
}
function readTextFromClipboard() {
  var _a, _b;
  if (!((_b = (_a = G.window.navigator) == null ? void 0 : _a.clipboard) == null ? void 0 : _b.readText)) {
    throw new Error("navigator.clipboard.readText is not supported on this browser");
  }
  return G.window.navigator.clipboard.readText();
}
function readDataFromClipboard() {
  var _a, _b;
  if (!((_b = (_a = G.window.navigator) == null ? void 0 : _a.clipboard) == null ? void 0 : _b.read)) {
    throw new Error("navigator.clipboard.read is not supported on this browser");
  }
  return G.window.navigator.clipboard.read();
}


/***/ }),

/***/ "./app/client/lib/testState.ts":
/*!*************************************!*\
  !*** ./app/client/lib/testState.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "setTestState": () => (/* binding */ setTestState)
/* harmony export */ });
/* harmony import */ var app_client_lib_browserGlobals__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/client/lib/browserGlobals */ "./app/client/lib/browserGlobals.js");

const G = (0,app_client_lib_browserGlobals__WEBPACK_IMPORTED_MODULE_0__.get)("window");
function setTestState(state) {
  if (!("testGrist" in G.window)) {
    G.window.testGrist = {};
  }
  Object.assign(G.window.testGrist, state);
}


/***/ }),

/***/ "./app/client/ui/inputs.ts":
/*!*********************************!*\
  !*** ./app/client/ui/inputs.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "cssInput": () => (/* binding */ cssInput),
/* harmony export */   "textInput": () => (/* binding */ textInput),
/* harmony export */   "textarea": () => (/* binding */ textarea)
/* harmony export */ });
/* harmony import */ var app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/client/ui2018/cssVars */ "./app/client/ui2018/cssVars.ts");
/* harmony import */ var grainjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! grainjs */ "./node_modules/grainjs/dist/esm/index.js");


const cssInput = (0,grainjs__WEBPACK_IMPORTED_MODULE_1__.styled)("input", `
  font-size: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.vars.mediumFontSize};
  height: 48px;
  line-height: 20px;
  width: 100%;
  padding: 14px;
  border: 1px solid ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.inputBorder};
  border-radius: 4px;
  outline: none;
  display: block;
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.inputFg};
  background-color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.inputBg};

  &::placeholder {
    color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.inputPlaceholderFg};
  }

  &[type=number] {
    -moz-appearance: textfield;
  }
  &[type=number]::-webkit-inner-spin-button,
  &[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &-invalid {
    border: 1px solid ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.inputInvalid};
  }

  &-valid {
    border: 1px solid ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.inputValid};
  }
`);
function textInput(obs, ...args) {
  return cssInput(grainjs__WEBPACK_IMPORTED_MODULE_1__.dom.prop("value", obs), grainjs__WEBPACK_IMPORTED_MODULE_1__.dom.on("input", (_e, elem) => obs.set(elem.value)), ...args);
}
function textarea(obs, options, ...args) {
  const isValid = options.isValid;
  function setValue(elem) {
    obs.set(elem.value);
    if (isValid) {
      isValid.set(elem.validity.valid);
    }
  }
  return (0,grainjs__WEBPACK_IMPORTED_MODULE_1__.dom)("textarea", ...args, grainjs__WEBPACK_IMPORTED_MODULE_1__.dom.prop("value", obs), isValid ? (elem) => grainjs__WEBPACK_IMPORTED_MODULE_1__.dom.autoDisposeElem(elem, (0,grainjs__WEBPACK_IMPORTED_MODULE_1__.subscribe)(obs, (use) => isValid.set(elem.checkValidity()))) : null, options.onInput ? grainjs__WEBPACK_IMPORTED_MODULE_1__.dom.on("input", (e, elem) => setValue(elem)) : null, grainjs__WEBPACK_IMPORTED_MODULE_1__.dom.on("change", (e, elem) => setValue(elem)));
}


/***/ }),

/***/ "./app/client/ui/shadowScroll.ts":
/*!***************************************!*\
  !*** ./app/client/ui/shadowScroll.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shadowScroll": () => (/* binding */ shadowScroll)
/* harmony export */ });
/* harmony import */ var grainjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! grainjs */ "./node_modules/grainjs/dist/esm/index.js");

const SHADOW_TOP = "inset 0 4px 6px 0 rgba(217,217,217,0.4)";
const SHADOW_BTM = "inset 0 -4px 6px 0 rgba(217,217,217,0.4)";
function shadowScroll(...args) {
  const scrollTop = grainjs__WEBPACK_IMPORTED_MODULE_0__.Observable.create(null, true);
  const scrollBtm = grainjs__WEBPACK_IMPORTED_MODULE_0__.Observable.create(null, true);
  return cssScrollMenu(grainjs__WEBPACK_IMPORTED_MODULE_0__.dom.autoDispose(scrollTop), grainjs__WEBPACK_IMPORTED_MODULE_0__.dom.autoDispose(scrollBtm), (elem) => {
    setTimeout(() => scrollBtm.set(isAtScrollBtm(elem)), 0);
  }, grainjs__WEBPACK_IMPORTED_MODULE_0__.dom.on("scroll", (_, elem) => {
    scrollTop.set(isAtScrollTop(elem));
    scrollBtm.set(isAtScrollBtm(elem));
  }), grainjs__WEBPACK_IMPORTED_MODULE_0__.dom.style("box-shadow", (use) => {
    const shadows = [use(scrollTop) ? null : SHADOW_TOP, use(scrollBtm) ? null : SHADOW_BTM];
    return shadows.filter((css) => css).join(", ");
  }), ...args);
}
function isAtScrollTop(elem) {
  return elem.scrollTop === 0;
}
function isAtScrollBtm(elem) {
  return elem.scrollTop >= elem.scrollHeight - elem.offsetHeight;
}
const cssScrollMenu = (0,grainjs__WEBPACK_IMPORTED_MODULE_0__.styled)("div", `
  flex: 1 1 0;
  width: 100%;
  overflow-y: auto;
`);


/***/ })

}]);
//# sourceMappingURL=app_client_lib_ACSelect_ts-app_client_lib_clipboardUtils_ts-app_client_lib_testState_ts-app_c-3562c2.bundle.js.map