"use strict";
(self["webpackChunkgristy"] = self["webpackChunkgristy"] || []).push([["app_client_ui2018_search_ts"],{

/***/ "./app/client/models/SearchModel.ts":
/*!******************************************!*\
  !*** ./app/client/models/SearchModel.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SearchModelImpl": () => (/* binding */ SearchModelImpl)
/* harmony export */ });
/* harmony import */ var app_client_models_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/client/models/errors */ "./app/client/models/errors.ts");
/* harmony import */ var app_common_delay__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/common/delay */ "./app/common/delay.ts");
/* harmony import */ var app_common_gutil__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/common/gutil */ "./app/common/gutil.ts");
/* harmony import */ var app_client_lib_localization__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/client/lib/localization */ "./app/client/lib/localization.ts");
/* harmony import */ var grainjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! grainjs */ "./node_modules/grainjs/dist/esm/index.js");





const debounce = __webpack_require__(/*! lodash/debounce */ "./node_modules/lodash/debounce.js");
const t = (0,app_client_lib_localization__WEBPACK_IMPORTED_MODULE_3__.makeT)("SearchModel");
class Stepper {
  constructor() {
    this.array = [];
    this.index = 0;
  }
  inRange() {
    return this.index >= 0 && this.index < this.array.length;
  }
  next(step, nextArrayFunc) {
    this.index += step;
    if (!this.inRange()) {
      const p = nextArrayFunc();
      if (p) {
        return p.then(() => this.setStart(step));
      } else {
        this.setStart(step);
      }
    }
  }
  setStart(step) {
    this.index = step > 0 ? 0 : this.array.length - 1;
  }
  get value() {
    return this.array[this.index];
  }
}
class RawSectionWrapper {
  constructor(_section) {
    this._section = _section;
  }
  viewSections() {
    return [this._section];
  }
  activeSectionId() {
    return this._section.id.peek();
  }
  getViewId() {
    return "data";
  }
  async openPage() {
    var _a;
    this._section.view.peek().activeSectionId(this._section.getRowId());
    await (0,app_common_gutil__WEBPACK_IMPORTED_MODULE_2__.waitObs)(this._section.viewInstance);
    await ((_a = this._section.viewInstance.peek()) == null ? void 0 : _a.getLoadingDonePromise());
  }
}
class PageRecWrapper {
  constructor(_page, _opener) {
    this._page = _page;
    this._opener = _opener;
  }
  viewSections() {
    const sections = this._page.view.peek().viewSections.peek().peek();
    const collapsed = new Set(this._page.view.peek().activeCollapsedSections.peek());
    const activeSectionId = this._page.view.peek().activeSectionId.peek();
    const inPopup = collapsed.has(activeSectionId);
    if (inPopup) {
      return sections.filter((s) => s.getRowId() === activeSectionId);
    }
    return sections.filter((s) => !collapsed.has(s.getRowId()));
  }
  activeSectionId() {
    return this._page.view.peek().activeSectionId.peek();
  }
  getViewId() {
    return this._page.view.peek().getRowId();
  }
  openPage() {
    return this._opener(this.getViewId());
  }
}
class FinderImpl {
  constructor(_gristDoc, value, _openDocPageCB, multiPage) {
    this._gristDoc = _gristDoc;
    this._openDocPageCB = _openDocPageCB;
    this.multiPage = multiPage;
    this.matchFound = false;
    this._pageStepper = new Stepper();
    this._sectionStepper = new Stepper();
    this._rowStepper = new Stepper();
    this._fieldStepper = new Stepper();
    this._pagesSwitched = 0;
    this._aborted = false;
    this._searchRegexp = makeRegexp(value);
  }
  abort() {
    this._aborted = true;
    if (this._clearCursorHighlight) {
      this._clearCursorHighlight();
    }
  }
  getCurrentPosition() {
    return {
      pageIndex: this._pageStepper.index,
      sectionIndex: this._sectionStepper.index,
      rowIndex: this._rowStepper.index,
      fieldIndex: this._fieldStepper.index
    };
  }
  async init() {
    if (this._gristDoc.activeViewId.get() === "data") {
      const rawSections = this._gristDoc.docModel.visibleTables.peek().sort((a, b) => (0,app_common_gutil__WEBPACK_IMPORTED_MODULE_2__.nativeCompare)(a.tableNameDef.peek(), b.tableNameDef.peek())).map((table) => table.rawViewSection.peek()).filter((s) => Boolean(s.id.peek()));
      this._pageStepper.array = rawSections.map((r) => new RawSectionWrapper(r));
      this._pageStepper.index = rawSections.findIndex((s) => s.getRowId() === this._gristDoc.viewModel.activeSectionId.peek());
      if (this._pageStepper.index < 0) {
        this._pageStepper.index = 0;
        await this._pageStepper.value.openPage();
      }
    } else {
      const pages = this._gristDoc.docModel.visibleDocPages.peek();
      this._pageStepper.array = pages.map((p) => new PageRecWrapper(p, this._openDocPageCB));
      this._pageStepper.index = pages.findIndex((page) => page.viewRef.peek() === this._gristDoc.activeViewId.get());
      if (this._pageStepper.index < 0) {
        return false;
      }
    }
    const sections = this._pageStepper.value.viewSections();
    this._sectionStepper.array = sections;
    this._sectionStepper.index = sections.findIndex((s) => s.getRowId() === this._pageStepper.value.activeSectionId());
    if (this._sectionStepper.index < 0) {
      return false;
    }
    this._initNewSectionShown();
    const viewInstance = this._sectionStepper.value.viewInstance.peek();
    const pos = viewInstance.cursor.getCursorPos();
    this._rowStepper.index = pos.rowIndex;
    this._fieldStepper.index = pos.fieldIndex;
    return true;
  }
  async matchNext(step) {
    let count = 0;
    let lastBreak = Date.now();
    this._pagesSwitched = 0;
    while (!this._matches() || await this._loadSection(step) && !this._matches()) {
      if (this._aborted) {
        return;
      }
      if (++count % 100 === 0 && Date.now() >= lastBreak + 20) {
        await (0,app_common_delay__WEBPACK_IMPORTED_MODULE_1__.delay)(5);
        lastBreak = Date.now();
      }
      const p = this.nextField(step);
      if (p) {
        await p;
      }
      if (this._isCurrentPosition(this.startPosition) && !this._matches()) {
        console.log("SearchBar: reached start position without finding anything");
        this.matchFound = false;
        return;
      }
      if (this._pagesSwitched > this._pageStepper.array.length) {
        console.log("SearchBar: aborting search due to too many page switches");
        this.matchFound = false;
        return;
      }
    }
    console.log("SearchBar: found a match at %s", JSON.stringify(this.getCurrentPosition()));
    this.matchFound = true;
    await this._highlight();
  }
  nextField(step) {
    return this._fieldStepper.next(step, () => this._nextRow(step));
  }
  _nextRow(step) {
    return this._rowStepper.next(step, () => this._nextSection(step));
  }
  async _nextSection(step) {
    await this._sectionStepper.next(step, () => this._nextPage(step));
    await this._initNewSectionAny();
  }
  _initNewSectionCommon() {
    const section = this._sectionStepper.value;
    const tableModel = this._gristDoc.getTableModel(section.table.peek().tableId.peek());
    this._sectionTableData = tableModel.tableData;
    this._fieldStepper.array = section.viewFields().peek();
    this._initFormatters();
    return tableModel;
  }
  _initNewSectionShown() {
    this._initNewSectionCommon();
    const viewInstance = this._sectionStepper.value.viewInstance.peek();
    const skip = ["chart"].includes(this._sectionStepper.value.parentKey.peek());
    this._rowStepper.array = skip ? [] : viewInstance.sortedRows.getKoArray().peek();
  }
  async _initNewSectionAny() {
    const tableModel = this._initNewSectionCommon();
    const viewInstance = this._sectionStepper.value.viewInstance.peek();
    const skip = ["chart"].includes(this._sectionStepper.value.parentKey.peek());
    if (skip) {
      this._rowStepper.array = [];
    } else if (viewInstance) {
      this._rowStepper.array = viewInstance.sortedRows.getKoArray().peek();
    } else {
      await tableModel.fetch();
      this._rowStepper.array = this._sectionTableData.getRowIds();
    }
  }
  async _nextPage(step) {
    if (!this.multiPage.get()) {
      return;
    }
    await this._pageStepper.next(step, () => void 0);
    this._pagesSwitched++;
    const view = this._pageStepper.value;
    this._sectionStepper.array = view.viewSections();
  }
  _initFormatters() {
    this._fieldFormatters = this._fieldStepper.array.map((f) => [f, f.formatter.peek()]);
  }
  _matches() {
    if (this._pageStepper.index < 0 || this._sectionStepper.index < 0 || this._rowStepper.index < 0 || this._fieldStepper.index < 0) {
      console.warn("match outside");
      return false;
    }
    const field = this._fieldStepper.value;
    let formatter = this._fieldFormatters[this._fieldStepper.index];
    if (!formatter || formatter[0] !== field) {
      this._initFormatters();
      formatter = this._fieldFormatters[this._fieldStepper.index];
    }
    const rowId = this._rowStepper.value;
    const displayCol = field.displayColModel.peek();
    const value = this._sectionTableData.getValue(rowId, displayCol.colId.peek());
    const text = formatter[1].formatAny(value);
    return this._searchRegexp.test(text);
  }
  async _loadSection(step) {
    const section = this._sectionStepper.value;
    if (!section.viewInstance.peek()) {
      const view = this._pageStepper.value;
      if (this._aborted) {
        return false;
      }
      await view.openPage();
      console.log("SearchBar: loading view %s section %s", view.getViewId(), section.getRowId());
      const viewInstance = await (0,app_common_gutil__WEBPACK_IMPORTED_MODULE_2__.waitObs)(section.viewInstance);
      await viewInstance.getLoadingDonePromise();
      this._initNewSectionShown();
      this._rowStepper.setStart(step);
      this._fieldStepper.setStart(step);
      console.log("SearchBar: loaded view %s section %s", view.getViewId(), section.getRowId());
      return true;
    }
    return false;
  }
  async _highlight() {
    if (this._aborted) {
      return;
    }
    const section = this._sectionStepper.value;
    const sectionId = section.getRowId();
    const cursorPos = {
      sectionId,
      rowId: this._rowStepper.value,
      fieldIndex: this._fieldStepper.index
    };
    await this._gristDoc.recursiveMoveToCursorPos(cursorPos, true).catch(app_client_models_errors__WEBPACK_IMPORTED_MODULE_0__.reportError);
    if (this._aborted) {
      return;
    }
    await (0,app_common_delay__WEBPACK_IMPORTED_MODULE_1__.delay)(0);
    const viewInstance = await (0,app_common_gutil__WEBPACK_IMPORTED_MODULE_2__.waitObs)(section.viewInstance);
    await viewInstance.getLoadingDonePromise();
    if (this._aborted) {
      return;
    }
    viewInstance.scrollToCursor(true).catch(app_client_models_errors__WEBPACK_IMPORTED_MODULE_0__.reportError);
    const cursor = viewInstance.viewPane.querySelector(".selected_cursor");
    if (cursor) {
      cursor.classList.add("search-match");
      this._clearCursorHighlight = () => {
        cursor.classList.remove("search-match");
        clearTimeout(timeout);
        this._clearCursorHighlight = void 0;
      };
      const timeout = setTimeout(this._clearCursorHighlight, 20);
    }
  }
  _isCurrentPosition(pos) {
    return this._pageStepper.index === pos.pageIndex && this._sectionStepper.index === pos.sectionIndex && this._rowStepper.index === pos.rowIndex && this._fieldStepper.index === pos.fieldIndex;
  }
}
class SearchModelImpl extends grainjs__WEBPACK_IMPORTED_MODULE_4__.Disposable {
  constructor(_gristDoc) {
    super();
    this._gristDoc = _gristDoc;
    this.value = grainjs__WEBPACK_IMPORTED_MODULE_4__.Observable.create(this, "");
    this.isOpen = grainjs__WEBPACK_IMPORTED_MODULE_4__.Observable.create(this, false);
    this.isRunning = grainjs__WEBPACK_IMPORTED_MODULE_4__.Observable.create(this, false);
    this.noMatch = grainjs__WEBPACK_IMPORTED_MODULE_4__.Observable.create(this, true);
    this.isEmpty = grainjs__WEBPACK_IMPORTED_MODULE_4__.Observable.create(this, true);
    this.multiPage = grainjs__WEBPACK_IMPORTED_MODULE_4__.Observable.create(this, false);
    this._isRestartNeeded = false;
    this._finder = null;
    const findFirst = debounce((_value) => this._findFirst(_value), 100);
    this.autoDispose(this.value.addListener((v) => {
      this.isRunning.set(true);
      void findFirst(v);
    }));
    this.autoDispose(this.multiPage.addListener((v) => {
      if (v) {
        this.noMatch.set(false);
      }
    }));
    this.allLabel = grainjs__WEBPACK_IMPORTED_MODULE_4__.Computed.create(this, (use) => use(this._gristDoc.activeViewId) === "data" ? t("Search all tables") : t("Search all pages"));
    this.autoDispose(this._gristDoc.activeViewId.addListener(() => {
      if (!this.multiPage.get()) {
        this.noMatch.set(false);
      }
      this._isRestartNeeded = true;
    }));
    this.autoDispose(this._gristDoc.viewModel.activeSectionId.subscribe((sectionId) => {
      if (this._gristDoc.activeViewId.get() === "data" && sectionId === 0) {
        this._isRestartNeeded = true;
        this.noMatch.set(false);
      }
    }));
  }
  async findNext() {
    if (this.isRunning.get() || this.noMatch.get()) {
      return;
    }
    if (this._isRestartNeeded) {
      return this._findFirst(this.value.get());
    }
    await this._run(async (finder) => {
      await finder.nextField(1);
      await finder.matchNext(1);
    });
  }
  async findPrev() {
    if (this.isRunning.get() || this.noMatch.get()) {
      return;
    }
    if (this._isRestartNeeded) {
      return this._findFirst(this.value.get());
    }
    await this._run(async (finder) => {
      await finder.nextField(-1);
      await finder.matchNext(-1);
    });
  }
  async _findFirst(value) {
    this._isRestartNeeded = false;
    this.isEmpty.set(!value);
    await this._updateFinder(value);
    if (!value || !this._finder) {
      this.noMatch.set(true);
      return;
    }
    await this._run(async (finder) => {
      await finder.matchNext(1);
    });
  }
  async _updateFinder(value) {
    if (this._finder) {
      this._finder.abort();
    }
    const impl = new FinderImpl(this._gristDoc, value, this._openDocPage.bind(this), this.multiPage);
    const isValid = await impl.init();
    this._finder = isValid ? impl : null;
  }
  async _run(cb) {
    const finder = this._finder;
    if (!finder) {
      throw new Error("SearchModel: finder is not defined");
    }
    try {
      this.isRunning.set(true);
      finder.startPosition = finder.getCurrentPosition();
      await cb(finder);
    } finally {
      this.isRunning.set(false);
      this.noMatch.set(!finder.matchFound);
    }
  }
  async _openDocPage(viewId) {
    await this._gristDoc.openDocPage(viewId);
    this._isRestartNeeded = false;
  }
}
function makeRegexp(value) {
  const escaped = value.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  return new RegExp(escaped, "i");
}


/***/ }),

/***/ "./app/client/ui2018/search.ts":
/*!*************************************!*\
  !*** ./app/client/ui2018/search.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SearchModelImpl": () => (/* reexport safe */ app_client_models_SearchModel__WEBPACK_IMPORTED_MODULE_9__.SearchModelImpl),
/* harmony export */   "searchBar": () => (/* binding */ searchBar)
/* harmony export */ });
/* harmony import */ var app_client_components_commands__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/client/components/commands */ "./app/client/components/commands.ts");
/* harmony import */ var app_client_lib_localization__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/client/lib/localization */ "./app/client/lib/localization.ts");
/* harmony import */ var app_client_models_AppModel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/client/models/AppModel */ "./app/client/models/AppModel.ts");
/* harmony import */ var app_client_ui_tooltips__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/client/ui/tooltips */ "./app/client/ui/tooltips.ts");
/* harmony import */ var app_client_ui_TopBarCss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/client/ui/TopBarCss */ "./app/client/ui/TopBarCss.ts");
/* harmony import */ var app_client_ui2018_checkbox__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/client/ui2018/checkbox */ "./app/client/ui2018/checkbox.ts");
/* harmony import */ var app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! app/client/ui2018/cssVars */ "./app/client/ui2018/cssVars.ts");
/* harmony import */ var app_client_ui2018_icons__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! app/client/ui2018/icons */ "./app/client/ui2018/icons.ts");
/* harmony import */ var grainjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! grainjs */ "./node_modules/grainjs/dist/esm/index.js");
/* harmony import */ var app_client_models_SearchModel__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! app/client/models/SearchModel */ "./app/client/models/SearchModel.ts");










const debounce = __webpack_require__(/*! lodash/debounce */ "./node_modules/lodash/debounce.js");

const t = (0,app_client_lib_localization__WEBPACK_IMPORTED_MODULE_1__.makeT)("search");
const EXPAND_TIME = 0.5;
const searchWrapper = (0,grainjs__WEBPACK_IMPORTED_MODULE_8__.styled)("div", `
  display: flex;
  flex: initial;
  align-items: center;
  box-sizing: border-box;
  border: 1px solid transparent;
  padding: 0px 16px;
  width: 50px;
  height: 100%;
  max-height: 50px;
  transition: width 0.4s;
  position: relative;
  &-expand {
    width: 100% !important;
    border: 1px solid ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_6__.theme.searchBorder};
  }
  @media ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_6__.mediaSmall} {
    & {
      width: 32px;
      padding: 0px;
    }
  }
`);
const expandedSearch = (0,grainjs__WEBPACK_IMPORTED_MODULE_8__.styled)("div", `
  display: flex;
  flex-grow: 0;
  align-items: center;
  width: 0;
  opacity: 0;
  align-self: stretch;
  transition: width ${EXPAND_TIME}s, opacity ${EXPAND_TIME / 2}s ${EXPAND_TIME / 2}s;
  .${searchWrapper.className}-expand > & {
    width: auto;
    flex-grow: 1;
    opacity: 1;
  }
`);
const searchInput = (0,grainjs__WEBPACK_IMPORTED_MODULE_8__.styled)(grainjs__WEBPACK_IMPORTED_MODULE_8__.input, `
  background-color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_6__.theme.topHeaderBg};
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_6__.theme.inputFg};
  outline: none;
  border: none;
  margin: 0;
  padding: 0;
  padding-left: 4px;
  box-sizing: border-box;
  align-self: stretch;
  width: 0;
  transition: width ${EXPAND_TIME}s;
  .${searchWrapper.className}-expand & {
    width: 100%;
  }
  &::placeholder {
    color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_6__.theme.inputPlaceholderFg};
  }
`);
const cssArrowBtn = (0,grainjs__WEBPACK_IMPORTED_MODULE_8__.styled)("div", `
  font-size: 14px;
  padding: 3px;
  cursor: pointer;
  margin: 2px 4px;
  visibility: hidden;
  width: 24px;
  height: 24px;
  background-color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_6__.theme.searchPrevNextButtonBg};
  --icon-color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_6__.theme.searchPrevNextButtonFg};
  border-radius: 3px;
  text-align: center;
  display: flex;
  align-items: center;

  .${searchWrapper.className}-expand & {
    visibility: visible;
  }
`);
const cssCloseBtn = (0,grainjs__WEBPACK_IMPORTED_MODULE_8__.styled)(app_client_ui2018_icons__WEBPACK_IMPORTED_MODULE_7__.icon, `
  cursor: pointer;
  background-color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_6__.theme.controlFg};
  margin-left: 4px;
  flex-shrink: 0;
`);
const cssLabel = (0,grainjs__WEBPACK_IMPORTED_MODULE_8__.styled)("span", `
  font-size: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_6__.vars.smallFontSize};
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_6__.theme.lightText};
  white-space: nowrap;
  margin-right: 12px;
`);
const cssOptions = (0,grainjs__WEBPACK_IMPORTED_MODULE_8__.styled)("div", `
  background: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_6__.theme.topHeaderBg};
  position: absolute;
  right: 0;
  top: 48px;
  z-index: 1;
  padding: 2px 4px;
  overflow: hidden;
  white-space: nowrap;
`);
const cssShortcut = (0,grainjs__WEBPACK_IMPORTED_MODULE_8__.styled)("span", `
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_6__.theme.lightText};
`);
function searchBar(model, testId = grainjs__WEBPACK_IMPORTED_MODULE_8__.noTestId) {
  let keepExpanded = false;
  const focusAndSelect = () => {
    inputElem.focus();
    inputElem.select();
  };
  const commandGroup = (0,app_client_components_commands__WEBPACK_IMPORTED_MODULE_0__.createGroup)({
    find: focusAndSelect,
    findNext: () => {
      model.findNext().catch(app_client_models_AppModel__WEBPACK_IMPORTED_MODULE_2__.reportError);
      return false;
    },
    findPrev: () => {
      model.findPrev().catch(app_client_models_AppModel__WEBPACK_IMPORTED_MODULE_2__.reportError);
      return false;
    }
  }, null, true);
  const toggleMenu = debounce((_value) => {
    model.isOpen.set(_value === void 0 ? !model.isOpen.get() : _value);
  }, 100);
  const inputElem = searchInput(model.value, { onInput: true }, { type: "text", placeholder: t("Search in document") }, grainjs__WEBPACK_IMPORTED_MODULE_8__.dom.on("blur", () => keepExpanded ? setTimeout(() => inputElem.focus(), 0) : toggleMenu(false)), grainjs__WEBPACK_IMPORTED_MODULE_8__.dom.onKeyDown({
    Enter: (ev) => ev.shiftKey ? model.findPrev() : model.findNext(),
    Escape: () => {
      keepExpanded = false;
      toggleMenu(false);
    },
    Tab: () => toggleMenu(false)
  }), grainjs__WEBPACK_IMPORTED_MODULE_8__.dom.on("focus", () => toggleMenu(true)), commandGroup.attach());
  const lis = model.isOpen.addListener((val) => val || inputElem.blur());
  return searchWrapper(testId("wrapper"), searchWrapper.cls("-expand", model.isOpen), grainjs__WEBPACK_IMPORTED_MODULE_8__.dom.autoDispose(commandGroup), grainjs__WEBPACK_IMPORTED_MODULE_8__.dom.autoDispose(lis), grainjs__WEBPACK_IMPORTED_MODULE_8__.dom.onDispose(() => toggleMenu.cancel()), (0,app_client_ui_TopBarCss__WEBPACK_IMPORTED_MODULE_4__.cssHoverCircle)((0,app_client_ui_TopBarCss__WEBPACK_IMPORTED_MODULE_4__.cssTopBarBtn)("Search", testId("icon"), grainjs__WEBPACK_IMPORTED_MODULE_8__.dom.on("click", focusAndSelect), (0,app_client_ui_tooltips__WEBPACK_IMPORTED_MODULE_3__.hoverTooltip)(t("Search"), { key: "topBarBtnTooltip" }))), expandedSearch(testId("input"), inputElem, grainjs__WEBPACK_IMPORTED_MODULE_8__.dom.domComputed((use) => {
    const noMatch = use(model.noMatch);
    const isEmpty = use(model.isEmpty);
    if (isEmpty) {
      return null;
    }
    if (noMatch) {
      return cssLabel(t("No results"));
    }
    return [
      cssArrowBtn((0,app_client_ui2018_icons__WEBPACK_IMPORTED_MODULE_7__.icon)("Dropdown"), testId("next"), grainjs__WEBPACK_IMPORTED_MODULE_8__.dom.on("mousedown", (event) => event.preventDefault()), grainjs__WEBPACK_IMPORTED_MODULE_8__.dom.on("click", () => model.findNext()), (0,app_client_ui_tooltips__WEBPACK_IMPORTED_MODULE_3__.hoverTooltip)([
        t("Find Next "),
        cssShortcut(`(${["Enter", app_client_components_commands__WEBPACK_IMPORTED_MODULE_0__.allCommands.findNext.humanKeys].join(", ")})`)
      ], { key: "searchArrowBtnTooltip" })),
      cssArrowBtn((0,app_client_ui2018_icons__WEBPACK_IMPORTED_MODULE_7__.icon)("DropdownUp"), testId("prev"), grainjs__WEBPACK_IMPORTED_MODULE_8__.dom.on("mousedown", (event) => event.preventDefault()), grainjs__WEBPACK_IMPORTED_MODULE_8__.dom.on("click", () => model.findPrev()), (0,app_client_ui_tooltips__WEBPACK_IMPORTED_MODULE_3__.hoverTooltip)([
        t("Find Previous "),
        cssShortcut(app_client_components_commands__WEBPACK_IMPORTED_MODULE_0__.allCommands.findPrev.getKeysDesc())
      ], { key: "searchArrowBtnTooltip" }))
    ];
  }), cssCloseBtn("CrossSmall", testId("close"), grainjs__WEBPACK_IMPORTED_MODULE_8__.dom.on("click", () => toggleMenu(false))), cssOptions((0,app_client_ui2018_checkbox__WEBPACK_IMPORTED_MODULE_5__.labeledSquareCheckbox)(model.multiPage, grainjs__WEBPACK_IMPORTED_MODULE_8__.dom.text(model.allLabel)), grainjs__WEBPACK_IMPORTED_MODULE_8__.dom.on("mouseenter", () => keepExpanded = true), grainjs__WEBPACK_IMPORTED_MODULE_8__.dom.on("mouseleave", () => keepExpanded = false), testId("option-all-pages"))));
}


/***/ })

}]);
//# sourceMappingURL=app_client_ui2018_search_ts.bundle.js.map