(self["webpackChunkgristy"] = self["webpackChunkgristy"] || []).push([["app_client_components_ViewPane_ts"],{

/***/ "./app/client/components/ViewPane.ts":
/*!*******************************************!*\
  !*** ./app/client/components/ViewPane.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ConditionalStyle": () => (/* reexport safe */ app_client_widgets_ConditionalStyle__WEBPACK_IMPORTED_MODULE_2__.ConditionalStyle),
/* harmony export */   "FieldConfig": () => (/* reexport module object */ app_client_ui_FieldConfig__WEBPACK_IMPORTED_MODULE_1__),
/* harmony export */   "ViewConfigTab": () => (/* reexport default from dynamic */ app_client_components_ViewConfigTab__WEBPACK_IMPORTED_MODULE_0___default.a)
/* harmony export */ });
/* harmony import */ var app_client_components_ViewConfigTab__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/client/components/ViewConfigTab */ "./app/client/components/ViewConfigTab.js");
/* harmony import */ var app_client_components_ViewConfigTab__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(app_client_components_ViewConfigTab__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var app_client_ui_FieldConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/client/ui/FieldConfig */ "./app/client/ui/FieldConfig.ts");
/* harmony import */ var app_client_widgets_ConditionalStyle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/client/widgets/ConditionalStyle */ "./app/client/widgets/ConditionalStyle.ts");






/***/ }),

/***/ "./app/client/ui/SortFilterConfig.ts":
/*!*******************************************!*\
  !*** ./app/client/ui/SortFilterConfig.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SortFilterConfig": () => (/* binding */ SortFilterConfig)
/* harmony export */ });
/* harmony import */ var app_client_lib_localization__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/client/lib/localization */ "./app/client/lib/localization.ts");
/* harmony import */ var app_client_ui_FilterConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/client/ui/FilterConfig */ "./app/client/ui/FilterConfig.ts");
/* harmony import */ var app_client_ui_RightPanelStyles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/client/ui/RightPanelStyles */ "./app/client/ui/RightPanelStyles.ts");
/* harmony import */ var app_client_ui_SortConfig__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/client/ui/SortConfig */ "./app/client/ui/SortConfig.ts");
/* harmony import */ var app_client_ui2018_buttons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/client/ui2018/buttons */ "./app/client/ui2018/buttons.ts");
/* harmony import */ var grainjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! grainjs */ "./node_modules/grainjs/dist/esm/index.js");






const testId = (0,grainjs__WEBPACK_IMPORTED_MODULE_5__.makeTestId)("test-sort-filter-config-");
const t = (0,app_client_lib_localization__WEBPACK_IMPORTED_MODULE_0__.makeT)("SortFilterConfig");
class SortFilterConfig extends grainjs__WEBPACK_IMPORTED_MODULE_5__.Disposable {
  constructor(_section, _gristDoc) {
    super();
    this._section = _section;
    this._gristDoc = _gristDoc;
    this._docModel = this._gristDoc.docModel;
    this._isReadonly = this._gristDoc.isReadonly;
    this._hasChanges = grainjs__WEBPACK_IMPORTED_MODULE_5__.Computed.create(this, (use) => use(this._section.filterSpecChanged) || !use(this._section.activeSortJson.isSaved));
  }
  buildDom() {
    return [
      (0,app_client_ui_RightPanelStyles__WEBPACK_IMPORTED_MODULE_2__.cssLabel)(t("Sort")),
      grainjs__WEBPACK_IMPORTED_MODULE_5__.dom.create(app_client_ui_SortConfig__WEBPACK_IMPORTED_MODULE_3__.SortConfig, this._section, this._gristDoc, {
        menuOptions: { attach: "body" }
      }),
      (0,app_client_ui_RightPanelStyles__WEBPACK_IMPORTED_MODULE_2__.cssLabel)(t("Filter")),
      grainjs__WEBPACK_IMPORTED_MODULE_5__.dom.create(app_client_ui_FilterConfig__WEBPACK_IMPORTED_MODULE_1__.FilterConfig, this._section, {
        menuOptions: { attach: "body" }
      }),
      grainjs__WEBPACK_IMPORTED_MODULE_5__.dom.maybe(this._hasChanges, () => [
        (0,app_client_ui_RightPanelStyles__WEBPACK_IMPORTED_MODULE_2__.cssSaveButtonsRow)(cssSaveButton(t("Save"), grainjs__WEBPACK_IMPORTED_MODULE_5__.dom.on("click", () => this._save()), grainjs__WEBPACK_IMPORTED_MODULE_5__.dom.boolAttr("disabled", this._isReadonly), testId("save")), (0,app_client_ui2018_buttons__WEBPACK_IMPORTED_MODULE_4__.basicButton)(t("Revert"), grainjs__WEBPACK_IMPORTED_MODULE_5__.dom.on("click", () => this._revert()), testId("revert")), testId("save-btns"))
      ])
    ];
  }
  async _save() {
    await this._docModel.docData.bundleActions(t("Update Sort & Filter settings"), () => Promise.all([
      this._section.activeSortJson.save(),
      this._section.saveFilters()
    ]));
  }
  _revert() {
    this._section.activeSortJson.revert();
    this._section.revertFilters();
  }
}
const cssSaveButton = (0,grainjs__WEBPACK_IMPORTED_MODULE_5__.styled)(app_client_ui2018_buttons__WEBPACK_IMPORTED_MODULE_4__.primaryButton, `
  margin-right: 8px;
`);


/***/ }),

/***/ "./app/client/components/ViewConfigTab.js":
/*!************************************************!*\
  !*** ./app/client/components/ViewConfigTab.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! underscore */ "./node_modules/underscore/modules/index-all.js");
var ko = __webpack_require__(/*! knockout */ "./node_modules/knockout/build/output/knockout-latest.js");
var dispose = __webpack_require__(/*! ../lib/dispose */ "./app/client/lib/dispose.js");
var dom = __webpack_require__(/*! ../lib/dom */ "./app/client/lib/dom.js");
var kd = __webpack_require__(/*! ../lib/koDom */ "./app/client/lib/koDom.js");
var kf = __webpack_require__(/*! ../lib/koForm */ "./app/client/lib/koForm.js");
var koArray = __webpack_require__(/*! ../lib/koArray */ "./app/client/lib/koArray.js");
var commands = __webpack_require__(/*! ./commands */ "./app/client/components/commands.ts");
var { CustomSectionElement } = __webpack_require__(/*! ../lib/CustomSectionElement */ "./app/client/lib/CustomSectionElement.ts");
const { ChartConfig } = __webpack_require__(/*! ./ChartView */ "./app/client/components/ChartView.ts");
const { Computed, dom: grainjsDom, makeTestId } = __webpack_require__(/*! grainjs */ "./node_modules/grainjs/dist/esm/index.js");
const { cssRow } = __webpack_require__(/*! app/client/ui/RightPanelStyles */ "./app/client/ui/RightPanelStyles.ts");
const { SortFilterConfig } = __webpack_require__(/*! app/client/ui/SortFilterConfig */ "./app/client/ui/SortFilterConfig.ts");
const { primaryButton } = __webpack_require__(/*! app/client/ui2018/buttons */ "./app/client/ui2018/buttons.ts");
const { select } = __webpack_require__(/*! app/client/ui2018/menus */ "./app/client/ui2018/menus.ts");
const { confirmModal } = __webpack_require__(/*! app/client/ui2018/modals */ "./app/client/ui2018/modals.ts");
const { makeT } = __webpack_require__(/*! app/client/lib/localization */ "./app/client/lib/localization.ts");
const testId = makeTestId("test-vconfigtab-");
const t = makeT("ViewConfigTab");
function ViewSectionData(section) {
  this.section = section;
  this.hiddenFields = this.autoDispose(koArray.syncedKoArray(section.hiddenColumns));
}
dispose.makeDisposable(ViewSectionData);
function ViewConfigTab(options) {
  var self = this;
  this.gristDoc = options.gristDoc;
  this.viewModel = options.viewModel;
  this.viewSectionData = this.autoDispose(koArray.syncedKoArray(this.viewModel.viewSections, function(section) {
    return ViewSectionData.create(section);
  }).setAutoDisposeValues());
  this.isDetail = this.autoDispose(ko.computed(function() {
    return ["detail", "single"].includes(this.viewModel.activeSection().parentKey());
  }, this));
  this.isChart = this.autoDispose(ko.computed(function() {
    return this.viewModel.activeSection().parentKey() === "chart";
  }, this));
  this.isGrid = this.autoDispose(ko.computed(function() {
    return this.viewModel.activeSection().parentKey() === "record";
  }, this));
  this.isCustom = this.autoDispose(ko.computed(function() {
    return this.viewModel.activeSection().parentKey() === "custom";
  }, this));
  this.isRaw = this.autoDispose(ko.computed(function() {
    return this.viewModel.activeSection().isRaw();
  }, this));
  this.activeRawSectionData = this.autoDispose(ko.computed(function() {
    return self.isRaw() ? ViewSectionData.create(self.viewModel.activeSection()) : null;
  }));
  this.activeSectionData = this.autoDispose(ko.computed(function() {
    return _.find(self.viewSectionData.all(), function(sectionData) {
      return sectionData.section && sectionData.section.getRowId() === self.viewModel.activeSectionId();
    }) || self.activeRawSectionData() || self.viewSectionData.at(0);
  }));
}
dispose.makeDisposable(ViewConfigTab);
ViewConfigTab.prototype.buildSortFilterDom = function() {
  return grainjsDom.maybe(this.activeSectionData, ({ section }) => {
    return grainjsDom.create(SortFilterConfig, section, this.gristDoc);
  });
};
ViewConfigTab.prototype._makeOnDemand = function(table) {
  const onConfirm = () => {
    return table.onDemand.saveOnly(!table.onDemand.peek()).then(() => {
      return this.gristDoc.docComm.reloadDoc().catch((err) => {
        if (!err.message.includes("GristWSConnection disposed")) {
          throw err;
        }
      });
    });
  };
  if (table.onDemand()) {
    confirmModal("Unmark table On-Demand?", "Unmark On-Demand", onConfirm, {
      explanation: dom("div", "If you unmark table ", dom("b", table), " as On-Demand, its data will be loaded into the calculation engine and will be available for use in formulas. For a big table, this may greatly increase load times.", dom("br"), dom("br"), "Changing this setting will reload the document for all users.")
    });
  } else {
    confirmModal("Make table On-Demand?", "Make On-Demand", onConfirm, {
      explanation: dom("div", "If you make table ", dom("b", table), " On-Demand, its data will no longer be loaded into the calculation engine and will not be available for use in formulas. It will remain available for viewing and editing.", dom("br"), dom("br"), "Changing this setting will reload the document for all users.")
    });
  }
};
ViewConfigTab.prototype._buildAdvancedSettingsDom = function() {
  return kd.maybe(() => {
    const s = this.activeSectionData();
    return s && !s.section.table().summarySourceTable() ? s : null;
  }, (sectionData) => {
    const table = sectionData.section.table();
    const isCollapsed = ko.observable(true);
    return [
      kf.collapserLabel(isCollapsed, t("Advanced settings"), dom.testId("ViewConfig_advanced")),
      kf.helpRow(kd.hide(isCollapsed), t('Big tables may be marked as "on-demand" to avoid loading them into the data engine.'), kd.style("text-align", "left"), kd.style("margin-top", "1.5rem")),
      kf.row(kd.hide(isCollapsed), kf.label("Table ", dom("b", kd.text(table.tableId)), ":")),
      kf.row(kd.hide(isCollapsed), kf.buttonGroup(kf.button(() => this._makeOnDemand(table), kd.text(() => table.onDemand() ? t("Unmark On-Demand") : t("Make On-Demand")), dom.testId("ViewConfig_onDemandBtn"))))
    ];
  });
};
ViewConfigTab.prototype._buildThemeDom = function() {
  return kd.maybe(this.activeSectionData, (sectionData) => {
    var section = sectionData.section;
    if (this.isDetail()) {
      const theme = Computed.create(null, (use) => use(section.themeDef));
      theme.onWrite((val) => section.themeDef.setAndSave(val));
      return cssRow(dom.autoDispose(theme), select(theme, [
        { label: t("Form"), value: "form" },
        { label: t("Compact"), value: "compact" },
        { label: t("Blocks"), value: "blocks" }
      ]), testId("detail-theme"));
    }
  });
};
ViewConfigTab.prototype._buildChartConfigDom = function() {
  return grainjsDom.maybe(this.viewModel.activeSection, (section) => grainjsDom.create(ChartConfig, this.gristDoc, section));
};
ViewConfigTab.prototype._buildLayoutDom = function() {
  return kd.maybe(this.activeSectionData, (sectionData) => {
    if (this.isDetail()) {
      const view = sectionData.section.viewInstance.peek();
      const layoutEditorObs = ko.computed(() => view && view.recordLayout && view.recordLayout.layoutEditor());
      return cssRow({ style: "margin-top: 16px;" }, kd.maybe(layoutEditorObs, (editor) => editor.buildFinishButtons()), primaryButton(t("Edit Card Layout"), dom.autoDispose(layoutEditorObs), dom.on("click", () => commands.allCommands.editLayout.run()), grainjsDom.hide(layoutEditorObs), grainjsDom.cls("behavioral-prompt-edit-card-layout"), testId("detail-edit-layout")));
    }
  });
};
ViewConfigTab.prototype._buildCustomTypeItems = function() {
  const docPluginManager = this.gristDoc.docPluginManager;
  const activeSection = this.viewModel.activeSection;
  const customSections = _.groupBy(CustomSectionElement.getSections(docPluginManager.pluginsList), (s) => s.pluginId);
  const allPlugins = Object.keys(customSections);
  const customSectionIds = ko.pureComputed(() => {
    const sections = customSections[this.viewModel.activeSection().customDef.pluginId()] || [];
    return sections.map(({ sectionId }) => sectionId);
  });
  return [{
    buildDom: () => kd.scope(activeSection, ({ customDef }) => kf.buttonSelect(customDef.mode, kf.optionButton("url", "URL", dom.testId("ViewConfigTab_customView_url")), kf.optionButton("plugin", "Plugin", dom.testId("ViewConfigTab_customView_plugin"))))
  }, {}, {
    showObs: () => activeSection().customDef.mode() === "plugin",
    buildDom: () => kd.scope(activeSection, ({ customDef }) => dom("div", kf.row(5, t("Plugin: "), 13, kf.text(customDef.pluginId, {}, { list: "list_plugin" }, dom.testId("ViewConfigTab_customView_pluginId"))), kf.row(5, t("Section: "), 13, kf.text(customDef.sectionId, {}, { list: "list_section" }, dom.testId("ViewConfigTab_customView_sectionId"))), dom("datalist#list_plugin", kd.foreach(koArray(allPlugins), (value) => dom("option", { value }))), dom("datalist#list_section", kd.scope(customSectionIds, (sections) => kd.foreach(koArray(sections), (value) => dom("option", { value }))))))
  }];
};
module.exports = ViewConfigTab;


/***/ })

}]);
//# sourceMappingURL=app_client_components_ViewPane_ts.bundle.js.map