"use strict";
(self["webpackChunkgristy"] = self["webpackChunkgristy"] || []).push([["app_client_ui_AccountPage_ts"],{

/***/ "./app/client/ui/AccountPage.ts":
/*!**************************************!*\
  !*** ./app/client/ui/AccountPage.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AccountPage": () => (/* binding */ AccountPage),
/* harmony export */   "checkName": () => (/* binding */ checkName)
/* harmony export */ });
/* harmony import */ var app_client_models_AppModel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/client/models/AppModel */ "./app/client/models/AppModel.ts");
/* harmony import */ var app_client_models_gristUrlState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/client/models/gristUrlState */ "./app/client/models/gristUrlState.ts");
/* harmony import */ var app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/client/ui/AccountPageCss */ "./app/client/ui/AccountPageCss.ts");
/* harmony import */ var app_client_ui_ApiKey__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/client/ui/ApiKey */ "./app/client/ui/ApiKey.ts");
/* harmony import */ var app_client_ui_AppHeader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/client/ui/AppHeader */ "./app/client/ui/AppHeader.ts");
/* harmony import */ var app_client_ui_ChangePasswordDialog__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/client/ui/ChangePasswordDialog */ "./stubs/app/client/ui/ChangePasswordDialog.ts");
/* harmony import */ var app_client_ui_LeftPanelCommon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! app/client/ui/LeftPanelCommon */ "./app/client/ui/LeftPanelCommon.ts");
/* harmony import */ var app_client_ui_MFAConfig__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! app/client/ui/MFAConfig */ "./stubs/app/client/ui/MFAConfig.ts");
/* harmony import */ var app_client_ui_PagePanels__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! app/client/ui/PagePanels */ "./app/client/ui/PagePanels.ts");
/* harmony import */ var app_client_ui_ThemeConfig__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! app/client/ui/ThemeConfig */ "./app/client/ui/ThemeConfig.ts");
/* harmony import */ var app_client_ui_TopBar__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! app/client/ui/TopBar */ "./app/client/ui/TopBar.ts");
/* harmony import */ var app_client_ui_transientInput__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! app/client/ui/transientInput */ "./app/client/ui/transientInput.ts");
/* harmony import */ var app_client_ui2018_breadcrumbs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! app/client/ui2018/breadcrumbs */ "./app/client/ui2018/breadcrumbs.ts");
/* harmony import */ var app_client_ui2018_checkbox__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! app/client/ui2018/checkbox */ "./app/client/ui2018/checkbox.ts");
/* harmony import */ var app_client_ui2018_links__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! app/client/ui2018/links */ "./app/client/ui2018/links.ts");
/* harmony import */ var app_client_ui2018_menus__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! app/client/ui2018/menus */ "./app/client/ui2018/menus.ts");
/* harmony import */ var app_common_urlUtils__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! app/common/urlUtils */ "./app/common/urlUtils.ts");
/* harmony import */ var app_client_lib_localization__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! app/client/lib/localization */ "./app/client/lib/localization.ts");
/* harmony import */ var app_client_ui_LanguageMenu__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! app/client/ui/LanguageMenu */ "./app/client/ui/LanguageMenu.ts");
/* harmony import */ var grainjs__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! grainjs */ "./node_modules/grainjs/dist/esm/index.js");




















const testId = (0,grainjs__WEBPACK_IMPORTED_MODULE_19__.makeTestId)("test-account-page-");
const t = (0,app_client_lib_localization__WEBPACK_IMPORTED_MODULE_17__.makeT)("AccountPage");
class AccountPage extends grainjs__WEBPACK_IMPORTED_MODULE_19__.Disposable {
  constructor(_appModel) {
    super();
    this._appModel = _appModel;
    this._apiKey = grainjs__WEBPACK_IMPORTED_MODULE_19__.Observable.create(this, "");
    this._userObs = grainjs__WEBPACK_IMPORTED_MODULE_19__.Observable.create(this, null);
    this._isEditingName = grainjs__WEBPACK_IMPORTED_MODULE_19__.Observable.create(this, false);
    this._nameEdit = grainjs__WEBPACK_IMPORTED_MODULE_19__.Observable.create(this, "");
    this._isNameValid = grainjs__WEBPACK_IMPORTED_MODULE_19__.Computed.create(this, this._nameEdit, (_use, val) => checkName(val));
    this._allowGoogleLogin = grainjs__WEBPACK_IMPORTED_MODULE_19__.Computed.create(this, (use) => {
      var _a, _b;
      return (_b = (_a = use(this._userObs)) == null ? void 0 : _a.allowGoogleLogin) != null ? _b : false;
    }).onWrite((val) => this._updateAllowGooglelogin(val));
    this._fetchAll().catch(app_client_models_AppModel__WEBPACK_IMPORTED_MODULE_0__.reportError);
  }
  buildDom() {
    const panelOpen = grainjs__WEBPACK_IMPORTED_MODULE_19__.Observable.create(this, false);
    return (0,app_client_ui_PagePanels__WEBPACK_IMPORTED_MODULE_8__.pagePanels)({
      leftPanel: {
        panelWidth: grainjs__WEBPACK_IMPORTED_MODULE_19__.Observable.create(this, 240),
        panelOpen,
        hideOpener: true,
        header: grainjs__WEBPACK_IMPORTED_MODULE_19__.dom.create(app_client_ui_AppHeader__WEBPACK_IMPORTED_MODULE_4__.AppHeader, this._appModel),
        content: (0,app_client_ui_LeftPanelCommon__WEBPACK_IMPORTED_MODULE_6__.leftPanelBasic)(this._appModel, panelOpen)
      },
      headerMain: this._buildHeaderMain(),
      contentMain: this._buildContentMain(),
      testId
    });
  }
  _buildContentMain() {
    var _a;
    const { enableCustomCss } = (0,app_common_urlUtils__WEBPACK_IMPORTED_MODULE_16__.getGristConfig)();
    const supportedLngs = (_a = (0,app_common_urlUtils__WEBPACK_IMPORTED_MODULE_16__.getGristConfig)().supportedLngs) != null ? _a : ["en"];
    const languageOptions = supportedLngs.map((lng) => ({ value: lng, label: (0,app_client_ui_LanguageMenu__WEBPACK_IMPORTED_MODULE_18__.translateLocale)(lng) })).sort((a, b) => a.value.localeCompare(b.value));
    const userLocale = grainjs__WEBPACK_IMPORTED_MODULE_19__.Computed.create(this, (use) => {
      const selected = (0,app_client_lib_localization__WEBPACK_IMPORTED_MODULE_17__.detectCurrentLang)();
      if (!supportedLngs.includes(selected)) {
        return "en";
      }
      return selected;
    });
    userLocale.onWrite(async (value) => {
      await this._appModel.api.updateUserLocale(value || null);
      window.location.reload();
    });
    return (0,grainjs__WEBPACK_IMPORTED_MODULE_19__.domComputed)(this._userObs, (user) => user && app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.container(app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.accountPage(app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.header(t("Account settings")), app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.dataRow(app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.inlineSubHeader(t("Email")), app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.email(user.email)), app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.dataRow(app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.inlineSubHeader(t("Name")), (0,grainjs__WEBPACK_IMPORTED_MODULE_19__.domComputed)(this._isEditingName, (isEditing) => isEditing ? [
      (0,app_client_ui_transientInput__WEBPACK_IMPORTED_MODULE_11__.transientInput)({
        initialValue: user.name,
        save: (val) => this._isNameValid.get() && this._updateUserName(val),
        close: () => {
          this._isEditingName.set(false);
          this._nameEdit.set("");
        }
      }, { size: "5" }, grainjs__WEBPACK_IMPORTED_MODULE_19__.dom.on("input", (_ev, el) => this._nameEdit.set(el.value)), app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.flexGrow.cls("")),
      app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.textBtn(app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.icon("Settings"), t("Save"))
    ] : [
      app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.name(user.name),
      app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.textBtn(app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.icon("Settings"), t("Edit"), grainjs__WEBPACK_IMPORTED_MODULE_19__.dom.on("click", () => this._isEditingName.set(true)))
    ]), testId("username")), grainjs__WEBPACK_IMPORTED_MODULE_19__.dom.maybe((use) => use(this._nameEdit) && !use(this._isNameValid), this._buildNameWarningsDom.bind(this)), app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.header(t("Password & Security")), app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.dataRow(app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.inlineSubHeader(t("Login Method")), app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.loginMethod(user.loginMethod), user.loginMethod === "Email + Password" ? app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.textBtn(t("Change Password"), grainjs__WEBPACK_IMPORTED_MODULE_19__.dom.on("click", () => this._showChangePasswordDialog())) : null, testId("login-method")), user.loginMethod !== "Email + Password" ? null : grainjs__WEBPACK_IMPORTED_MODULE_19__.dom.frag(app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.dataRow((0,app_client_ui2018_checkbox__WEBPACK_IMPORTED_MODULE_13__.labeledSquareCheckbox)(this._allowGoogleLogin, t("Allow signing in to this account with Google"), testId("allow-google-login-checkbox")), testId("allow-google-login")), app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.subHeader(t("Two-factor authentication")), app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.description(t("Two-factor authentication is an extra layer of security for your Grist account designed to ensure that you're the only person who can access your account, even if someone knows your password.")), grainjs__WEBPACK_IMPORTED_MODULE_19__.dom.create(app_client_ui_MFAConfig__WEBPACK_IMPORTED_MODULE_7__.MFAConfig, user)), app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.header(t("Theme")), enableCustomCss ? null : grainjs__WEBPACK_IMPORTED_MODULE_19__.dom.create(app_client_ui_ThemeConfig__WEBPACK_IMPORTED_MODULE_9__.ThemeConfig, this._appModel), app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.subHeader(t("Language")), app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.dataRow({ style: "width: 300px" }, (0,app_client_ui2018_menus__WEBPACK_IMPORTED_MODULE_15__.select)(userLocale, languageOptions, {
      renderOptionArgs: () => {
        return grainjs__WEBPACK_IMPORTED_MODULE_19__.dom.cls(cssFirstUpper.className);
      }
    }), testId("language")), app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.header(t("API")), app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.dataRow(app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.inlineSubHeader(t("API Key")), app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.content(grainjs__WEBPACK_IMPORTED_MODULE_19__.dom.create(app_client_ui_ApiKey__WEBPACK_IMPORTED_MODULE_3__.ApiKey, {
      apiKey: this._apiKey,
      onCreate: () => this._createApiKey(),
      onDelete: () => this._deleteApiKey(),
      anonymous: false,
      inputArgs: [{ size: "5" }]
    })))), testId("body")));
  }
  _buildHeaderMain() {
    return grainjs__WEBPACK_IMPORTED_MODULE_19__.dom.frag((0,app_client_ui2018_breadcrumbs__WEBPACK_IMPORTED_MODULE_12__.cssBreadcrumbs)({ style: "margin-left: 16px;" }, (0,app_client_ui2018_links__WEBPACK_IMPORTED_MODULE_14__.cssLink)((0,app_client_models_gristUrlState__WEBPACK_IMPORTED_MODULE_1__.urlState)().setLinkUrl({}), "Home", testId("home")), (0,app_client_ui2018_breadcrumbs__WEBPACK_IMPORTED_MODULE_12__.separator)(" / "), (0,grainjs__WEBPACK_IMPORTED_MODULE_19__.dom)("span", "Account")), (0,app_client_ui_TopBar__WEBPACK_IMPORTED_MODULE_10__.createTopBarHome)(this._appModel));
  }
  async _fetchApiKey() {
    this._apiKey.set(await this._appModel.api.fetchApiKey());
  }
  async _createApiKey() {
    this._apiKey.set(await this._appModel.api.createApiKey());
  }
  async _deleteApiKey() {
    await this._appModel.api.deleteApiKey();
    this._apiKey.set("");
  }
  async _fetchUserProfile() {
    this._userObs.set(await this._appModel.api.getUserProfile());
  }
  async _fetchAll() {
    await Promise.all([
      this._fetchApiKey(),
      this._fetchUserProfile()
    ]);
  }
  async _updateUserName(val) {
    const user = this._userObs.get();
    if (user && val && val === user.name) {
      return;
    }
    await this._appModel.api.updateUserName(val);
    await this._fetchAll();
  }
  async _updateAllowGooglelogin(allowGoogleLogin) {
    await this._appModel.api.updateAllowGoogleLogin(allowGoogleLogin);
    await this._fetchUserProfile();
  }
  _showChangePasswordDialog() {
    return (0,app_client_ui_ChangePasswordDialog__WEBPACK_IMPORTED_MODULE_5__.buildChangePasswordDialog)();
  }
  _buildNameWarningsDom() {
    return cssWarnings(t("Names only allow letters, numbers and certain special characters"), testId("username-warning"));
  }
}
const VALID_NAME_REGEXP = /^(\w|[^\u0000-\u007F])(\w|[- ./'"()]|[^\u0000-\u007F])*$/;
function checkName(name) {
  return VALID_NAME_REGEXP.test(name);
}
const cssWarnings = (0,grainjs__WEBPACK_IMPORTED_MODULE_19__.styled)(app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_2__.warning, `
  margin: -8px 0 0 110px;
`);
const cssFirstUpper = (0,grainjs__WEBPACK_IMPORTED_MODULE_19__.styled)("div", `
  & > div::first-letter {
    text-transform: capitalize;
  }
`);


/***/ }),

/***/ "./app/client/ui/AccountPageCss.ts":
/*!*****************************************!*\
  !*** ./app/client/ui/AccountPageCss.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "accountPage": () => (/* binding */ accountPage),
/* harmony export */   "betaTag": () => (/* binding */ betaTag),
/* harmony export */   "container": () => (/* binding */ container),
/* harmony export */   "content": () => (/* binding */ content),
/* harmony export */   "dataRow": () => (/* binding */ dataRow),
/* harmony export */   "description": () => (/* binding */ description),
/* harmony export */   "email": () => (/* binding */ email),
/* harmony export */   "flexGrow": () => (/* binding */ flexGrow),
/* harmony export */   "header": () => (/* binding */ header),
/* harmony export */   "icon": () => (/* binding */ icon),
/* harmony export */   "inlineSubHeader": () => (/* binding */ inlineSubHeader),
/* harmony export */   "loginMethod": () => (/* binding */ loginMethod),
/* harmony export */   "name": () => (/* binding */ name),
/* harmony export */   "subHeader": () => (/* binding */ subHeader),
/* harmony export */   "textBtn": () => (/* binding */ textBtn),
/* harmony export */   "warning": () => (/* binding */ warning)
/* harmony export */ });
/* harmony import */ var app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/client/ui2018/cssVars */ "./app/client/ui2018/cssVars.ts");
/* harmony import */ var app_client_ui2018_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/client/ui2018/icons */ "./app/client/ui2018/icons.ts");
/* harmony import */ var grainjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! grainjs */ "./node_modules/grainjs/dist/esm/index.js");



const container = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)("div", `
  display: flex;
  justify-content: center;
  overflow: auto;
`);
const accountPage = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)("div", `
  max-width: 600px;
  margin-top: auto;
  margin-bottom: auto;
  padding: 16px;
`);
const content = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)("div", `
  flex: 1 1 300px;
`);
const textBtn = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)("button", `
  font-size: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.vars.mediumFontSize};
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.controlFg};
  cursor: pointer;
  margin-left: 16px;
  background-color: transparent;
  border: none;
  padding: 0;
  text-align: left;
  min-width: 110px;

  &:hover {
    color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.controlHoverFg};
  }
`);
const icon = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)(app_client_ui2018_icons__WEBPACK_IMPORTED_MODULE_1__.icon, `
  background-color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.controlFg};
  margin: 0 4px 2px 0;

  .${textBtn.className}:hover > & {
    background-color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.controlHoverFg};
  }
`);
const description = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)("div", `
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.lightText};
  font-size: 13px;
`);
const flexGrow = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)("div", `
  flex-grow: 1;
`);
const name = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)(flexGrow, `
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.text};
  word-break: break-word;
`);
const email = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)("div", `
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.text};
  word-break: break-word;
`);
const loginMethod = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)(flexGrow, `
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.text};
  word-break: break-word;
`);
const warning = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)("div", `
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.errorText};
`);
const header = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)("div", `
  height: 32px;
  line-height: 32px;
  margin: 28px 0 16px 0;
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.text};
  font-size: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.vars.xxxlargeFontSize};
  font-weight: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.vars.headerControlTextWeight};
`);
const subHeader = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)("div", `
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.text};
  padding: 8px 0;
  vertical-align: top;
  font-weight: bold;
  display: block;
`);
const inlineSubHeader = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)(subHeader, `
  display: inline-block;
  min-width: 110px;
`);
const dataRow = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)("div", `
  margin: 8px 0px;
  display: flex;
  align-items: baseline;
  gap: 2px;
`);
const betaTag = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)("span", `
  text-transform: uppercase;
  vertical-align: super;
  font-size: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.vars.xsmallFontSize};
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.accentText};
`);


/***/ }),

/***/ "./app/client/ui/ApiKey.ts":
/*!*********************************!*\
  !*** ./app/client/ui/ApiKey.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ApiKey": () => (/* binding */ ApiKey)
/* harmony export */ });
/* harmony import */ var app_client_lib_localization__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/client/lib/localization */ "./app/client/lib/localization.ts");
/* harmony import */ var app_client_ui2018_buttons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/client/ui2018/buttons */ "./app/client/ui2018/buttons.ts");
/* harmony import */ var app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/client/ui2018/cssVars */ "./app/client/ui2018/cssVars.ts");
/* harmony import */ var app_client_ui2018_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/client/ui2018/icons */ "./app/client/ui2018/icons.ts");
/* harmony import */ var app_client_ui2018_modals__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/client/ui2018/modals */ "./app/client/ui2018/modals.ts");
/* harmony import */ var grainjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! grainjs */ "./node_modules/grainjs/dist/esm/index.js");






const t = (0,app_client_lib_localization__WEBPACK_IMPORTED_MODULE_0__.makeT)("ApiKey");
const testId = (0,grainjs__WEBPACK_IMPORTED_MODULE_5__.makeTestId)("test-apikey-");
class ApiKey extends grainjs__WEBPACK_IMPORTED_MODULE_5__.Disposable {
  constructor(options) {
    var _a;
    super();
    this._loading = (0,grainjs__WEBPACK_IMPORTED_MODULE_5__.observable)(false);
    this._isHidden = grainjs__WEBPACK_IMPORTED_MODULE_5__.Observable.create(this, true);
    this._apiKey = options.apiKey;
    this._onDeleteCB = options.onDelete;
    this._onCreateCB = options.onCreate;
    this._anonymous = Boolean(options.anonymous);
    this._inputArgs = (_a = options.inputArgs) != null ? _a : [];
  }
  buildDom() {
    return (0,grainjs__WEBPACK_IMPORTED_MODULE_5__.dom)("div", testId("container"), grainjs__WEBPACK_IMPORTED_MODULE_5__.dom.style("position", "relative"), grainjs__WEBPACK_IMPORTED_MODULE_5__.dom.maybe(this._apiKey, (apiKey) => (0,grainjs__WEBPACK_IMPORTED_MODULE_5__.dom)("div", cssRow(cssInput({
      readonly: true,
      value: this._apiKey.get()
    }, grainjs__WEBPACK_IMPORTED_MODULE_5__.dom.attr("type", (use) => use(this._isHidden) ? "password" : "text"), testId("key"), { title: t("Click to show") }, grainjs__WEBPACK_IMPORTED_MODULE_5__.dom.on("click", (_ev, el) => {
      this._isHidden.set(false);
      setTimeout(() => el.select(), 0);
    }), grainjs__WEBPACK_IMPORTED_MODULE_5__.dom.on("blur", (ev) => {
      if (ev.target !== document.activeElement) {
        this._isHidden.set(true);
      }
    }), this._inputArgs), cssTextBtn(cssTextBtnIcon("Remove"), t("Remove"), grainjs__WEBPACK_IMPORTED_MODULE_5__.dom.on("click", () => this._showRemoveKeyModal()), testId("delete"), grainjs__WEBPACK_IMPORTED_MODULE_5__.dom.boolAttr("disabled", (use) => use(this._loading) || this._anonymous))), description(this._getDescription(), testId("description")))), grainjs__WEBPACK_IMPORTED_MODULE_5__.dom.maybe((use) => !(use(this._apiKey) || this._anonymous), () => [
      (0,app_client_ui2018_buttons__WEBPACK_IMPORTED_MODULE_1__.basicButton)(t("Create"), grainjs__WEBPACK_IMPORTED_MODULE_5__.dom.on("click", () => this._onCreate()), testId("create"), grainjs__WEBPACK_IMPORTED_MODULE_5__.dom.boolAttr("disabled", this._loading)),
      description(t("By generating an API key, you will be able to make API calls for your own account."), testId("description"))
    ]));
  }
  async _switchLoadingFlag(promise) {
    this._loading.set(true);
    try {
      await promise;
    } finally {
      this._loading.set(false);
    }
  }
  _onDelete() {
    return this._switchLoadingFlag(this._onDeleteCB());
  }
  _onCreate() {
    return this._switchLoadingFlag(this._onCreateCB());
  }
  _getDescription() {
    return t(!this._anonymous ? "This API key can be used to access your account via the API. Don\u2019t share your API key with anyone." : "This API key can be used to access this account anonymously via the API.");
  }
  _showRemoveKeyModal() {
    (0,app_client_ui2018_modals__WEBPACK_IMPORTED_MODULE_4__.confirmModal)(t("Remove API Key"), t("Remove"), () => this._onDelete(), {
      explanation: t("You're about to delete an API key. This will cause all future requests using this API key to be rejected. Do you still want to delete?")
    });
  }
}
const description = (0,grainjs__WEBPACK_IMPORTED_MODULE_5__.styled)("div", `
  margin-top: 8px;
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_2__.theme.lightText};
  font-size: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_2__.vars.mediumFontSize};
`);
const cssInput = (0,grainjs__WEBPACK_IMPORTED_MODULE_5__.styled)("input", `
  background-color: transparent;
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_2__.theme.inputFg};
  border: 1px solid ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_2__.theme.inputBorder};
  padding: 4px;
  border-radius: 3px;
  outline: none;
  flex: 1 0 0;
`);
const cssRow = (0,grainjs__WEBPACK_IMPORTED_MODULE_5__.styled)("div", `
  display: flex;
`);
const cssTextBtn = (0,grainjs__WEBPACK_IMPORTED_MODULE_5__.styled)(app_client_ui2018_buttons__WEBPACK_IMPORTED_MODULE_1__.textButton, `
  text-align: left;
  width: 90px;
  margin-left: 16px;
`);
const cssTextBtnIcon = (0,grainjs__WEBPACK_IMPORTED_MODULE_5__.styled)(app_client_ui2018_icons__WEBPACK_IMPORTED_MODULE_3__.icon, `
  margin: 0 4px 2px 0;
`);


/***/ }),

/***/ "./app/client/ui/ThemeConfig.ts":
/*!**************************************!*\
  !*** ./app/client/ui/ThemeConfig.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ThemeConfig": () => (/* binding */ ThemeConfig)
/* harmony export */ });
/* harmony import */ var app_client_lib_localization__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/client/lib/localization */ "./app/client/lib/localization.ts");
/* harmony import */ var app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/client/ui/AccountPageCss */ "./app/client/ui/AccountPageCss.ts");
/* harmony import */ var app_client_ui2018_checkbox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/client/ui2018/checkbox */ "./app/client/ui2018/checkbox.ts");
/* harmony import */ var app_client_ui2018_menus__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/client/ui2018/menus */ "./app/client/ui2018/menus.ts");
/* harmony import */ var grainjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! grainjs */ "./node_modules/grainjs/dist/esm/index.js");
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));





const testId = (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.makeTestId)("test-theme-config-");
const t = (0,app_client_lib_localization__WEBPACK_IMPORTED_MODULE_0__.makeT)("ThemeConfig");
class ThemeConfig extends grainjs__WEBPACK_IMPORTED_MODULE_4__.Disposable {
  constructor(_appModel) {
    super();
    this._appModel = _appModel;
    this._themePrefs = this._appModel.themePrefs;
    this._appearance = grainjs__WEBPACK_IMPORTED_MODULE_4__.Computed.create(this, this._themePrefs, (_use, prefs) => {
      return prefs.appearance;
    }).onWrite((value) => this._updateAppearance(value));
    this._syncWithOS = grainjs__WEBPACK_IMPORTED_MODULE_4__.Computed.create(this, this._themePrefs, (_use, prefs) => {
      return prefs.syncWithOS;
    }).onWrite((value) => this._updateSyncWithOS(value));
  }
  buildDom() {
    return (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.dom)("div", app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_1__.subHeader(t("Appearance "), app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_1__.betaTag("Beta")), app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_1__.dataRow(cssAppearanceSelect((0,app_client_ui2018_menus__WEBPACK_IMPORTED_MODULE_3__.select)(this._appearance, [
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" }
    ]), testId("appearance"))), app_client_ui_AccountPageCss__WEBPACK_IMPORTED_MODULE_1__.dataRow((0,app_client_ui2018_checkbox__WEBPACK_IMPORTED_MODULE_2__.labeledSquareCheckbox)(this._syncWithOS, t("Switch appearance automatically to match system"), testId("sync-with-os"))), testId("container"));
  }
  _updateAppearance(appearance) {
    this._themePrefs.set(__spreadProps(__spreadValues({}, this._themePrefs.get()), { appearance }));
  }
  _updateSyncWithOS(syncWithOS) {
    this._themePrefs.set(__spreadProps(__spreadValues({}, this._themePrefs.get()), { syncWithOS }));
  }
}
const cssAppearanceSelect = (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.styled)("div", `
  width: 120px;
`);


/***/ }),

/***/ "./app/client/ui/transientInput.ts":
/*!*****************************************!*\
  !*** ./app/client/ui/transientInput.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "transientInput": () => (/* binding */ transientInput)
/* harmony export */ });
/* harmony import */ var app_client_models_AppModel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/client/models/AppModel */ "./app/client/models/AppModel.ts");
/* harmony import */ var app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/client/ui2018/cssVars */ "./app/client/ui2018/cssVars.ts");
/* harmony import */ var grainjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! grainjs */ "./node_modules/grainjs/dist/esm/index.js");



function transientInput({ initialValue, save, close }, ...args) {
  let lastSave = initialValue;
  async function onSave(explicitSave) {
    try {
      if (explicitSave || input.value !== lastSave) {
        lastSave = input.value;
        await save(input.value);
      }
      close();
    } catch (err) {
      (0,app_client_models_AppModel__WEBPACK_IMPORTED_MODULE_0__.reportError)(err);
      delayedFocus();
    }
  }
  function delayedFocus() {
    setTimeout(() => {
      input.focus();
      input.select();
    }, 10);
  }
  const input = cssInput({ type: "text", placeholder: "Enter name" }, grainjs__WEBPACK_IMPORTED_MODULE_2__.dom.prop("value", initialValue), grainjs__WEBPACK_IMPORTED_MODULE_2__.dom.on("blur", () => onSave(false)), grainjs__WEBPACK_IMPORTED_MODULE_2__.dom.onKeyDown({
    Enter: () => onSave(true),
    Escape: () => close()
  }), ...args);
  delayedFocus();
  return input;
}
const cssInput = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)("input", `
  background-color: transparent;
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_1__.theme.inputFg};

  &::placeholder {
    color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_1__.theme.inputPlaceholderFg};
  }
`);


/***/ }),

/***/ "./stubs/app/client/ui/ChangePasswordDialog.ts":
/*!*****************************************************!*\
  !*** ./stubs/app/client/ui/ChangePasswordDialog.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "buildChangePasswordDialog": () => (/* binding */ buildChangePasswordDialog)
/* harmony export */ });
function buildChangePasswordDialog() {
  return null;
}


/***/ }),

/***/ "./stubs/app/client/ui/MFAConfig.ts":
/*!******************************************!*\
  !*** ./stubs/app/client/ui/MFAConfig.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MFAConfig": () => (/* binding */ MFAConfig)
/* harmony export */ });
/* harmony import */ var grainjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! grainjs */ "./node_modules/grainjs/dist/esm/index.js");

class MFAConfig extends grainjs__WEBPACK_IMPORTED_MODULE_0__.Disposable {
  constructor(_user) {
    super();
  }
  buildDom() {
    return null;
  }
}


/***/ })

}]);
//# sourceMappingURL=app_client_ui_AccountPage_ts.bundle.js.map