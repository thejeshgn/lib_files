"use strict";
(self["webpackChunkgristy"] = self["webpackChunkgristy"] || []).push([["app_client_ui_UserManager_ts"],{

/***/ "./app/client/lib/ACUserManager.ts":
/*!*****************************************!*\
  !*** ./app/client/lib/ACUserManager.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "buildACMemberEmail": () => (/* binding */ buildACMemberEmail)
/* harmony export */ });
/* harmony import */ var app_client_lib_localization__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/client/lib/localization */ "./app/client/lib/localization.ts");
/* harmony import */ var app_client_lib_ACIndex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/client/lib/ACIndex */ "./app/client/lib/ACIndex.ts");
/* harmony import */ var app_client_lib_ACSelect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/client/lib/ACSelect */ "./app/client/lib/ACSelect.ts");
/* harmony import */ var app_client_lib_autocomplete__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/client/lib/autocomplete */ "./app/client/lib/autocomplete.ts");
/* harmony import */ var app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/client/ui2018/cssVars */ "./app/client/ui2018/cssVars.ts");
/* harmony import */ var app_client_ui2018_menus__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/client/ui2018/menus */ "./app/client/ui2018/menus.ts");
/* harmony import */ var app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! app/client/ui/UserItem */ "./app/client/ui/UserItem.ts");
/* harmony import */ var app_client_ui_UserImage__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! app/client/ui/UserImage */ "./app/client/ui/UserImage.ts");
/* harmony import */ var grainjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! grainjs */ "./node_modules/grainjs/dist/esm/index.js");
/* harmony import */ var popweasel__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! popweasel */ "./node_modules/popweasel/dist/index.js");
/* harmony import */ var popweasel__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(popweasel__WEBPACK_IMPORTED_MODULE_9__);










const t = (0,app_client_lib_localization__WEBPACK_IMPORTED_MODULE_0__.makeT)("ACUserManager");
function buildACMemberEmail(owner, options, ...args) {
  const { acIndex, emailObs, save, prompt } = options;
  const acHolder = grainjs__WEBPACK_IMPORTED_MODULE_8__.Holder.create(owner);
  let emailInput;
  const isValid = grainjs__WEBPACK_IMPORTED_MODULE_8__.Observable.create(owner, true);
  const isOpen = () => !acHolder.isEmpty();
  const acOpen = () => acHolder.isEmpty() && app_client_lib_autocomplete__WEBPACK_IMPORTED_MODULE_3__.Autocomplete.create(acHolder, emailInput, acOptions);
  const acClose = () => acHolder.clear();
  const finish = () => {
    acClose();
    emailObs.set("");
    emailInput.value = emailObs.get();
    emailInput.focus();
  };
  const onEnter = () => {
    isOpen() ? commitIfValid() : acOpen();
  };
  const commitIfValid = () => {
    var _a;
    const item = (_a = acHolder.get()) == null ? void 0 : _a.getSelectedItem();
    if (item) {
      emailObs.set(item.value);
    }
    emailInput.setCustomValidity("");
    isValid.set(emailInput.checkValidity());
    const selectedEmail = (item == null ? void 0 : item.value) || emailObs.get();
    try {
      if (selectedEmail && isValid.get()) {
        save(emailObs.get());
        finish();
      }
    } catch (e) {
      emailInput.setCustomValidity(e.message);
    } finally {
      emailInput.reportValidity();
    }
  };
  const maybeShowAddNew = async (results, text) => {
    const cleanText = (0,app_client_lib_ACIndex__WEBPACK_IMPORTED_MODULE_1__.normalizeText)(text);
    const items = results.items.filter((item) => item.cleanText.includes(cleanText)).sort((a, b) => a.cleanText.localeCompare(b.cleanText));
    results.items = items;
    if (!results.items.length && cleanText) {
      const newObject = {
        value: text,
        cleanText,
        name: "",
        email: "",
        isNew: true,
        label: text,
        id: 0
      };
      results.items.push(newObject);
    }
    return results;
  };
  const renderSearchItem = (item, highlightFunc) => (item == null ? void 0 : item.isNew) ? (0,app_client_lib_ACSelect__WEBPACK_IMPORTED_MODULE_2__.cssSelectItem)((0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_6__.cssMemberListItem)(cssUserImagePlus("+", app_client_ui_UserImage__WEBPACK_IMPORTED_MODULE_7__.cssUserImage.cls("-large"), cssUserImagePlus.cls("-invalid", (use) => !use(enableAdd))), (0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_6__.cssMemberText)(cssMemberPrimaryPlus(t("Invite new member")), cssMemberSecondaryPlus(grainjs__WEBPACK_IMPORTED_MODULE_8__.dom.text((use) => t("We'll email an invite to {{email}}", { email: use(emailObs) })))), (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_4__.testId)("um-add-email"))) : (0,app_client_lib_ACSelect__WEBPACK_IMPORTED_MODULE_2__.cssSelectItem)((0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_6__.cssMemberListItem)((0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_6__.cssMemberImage)((0,app_client_ui_UserImage__WEBPACK_IMPORTED_MODULE_7__.createUserImage)(item, "large")), (0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_6__.cssMemberText)(cssMemberPrimaryPlus(item.name, (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_4__.testId)("um-member-name")), cssMemberSecondaryPlus((0,app_client_lib_ACIndex__WEBPACK_IMPORTED_MODULE_1__.buildHighlightedDom)(item.label, highlightFunc, cssMatchText)))));
  const enableAdd = (0,grainjs__WEBPACK_IMPORTED_MODULE_8__.computed)((use) => Boolean(use(emailObs) && use(isValid)));
  const acOptions = {
    attach: null,
    menuCssClass: `${app_client_ui2018_menus__WEBPACK_IMPORTED_MODULE_5__.menuCssClass} test-acselect-dropdown`,
    search: (term) => maybeShowAddNew(acIndex.search(term), term),
    renderItem: renderSearchItem,
    getItemText: (item) => item.value,
    onClick: commitIfValid
  };
  const result = (0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_6__.cssEmailInputContainer)((0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_6__.cssMailIcon)("Mail"), emailInput = (0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_6__.cssEmailInput)(emailObs, { onInput: true, isValid }, { type: "email", placeholder: t("Enter email address") }, grainjs__WEBPACK_IMPORTED_MODULE_8__.dom.on("input", acOpen), grainjs__WEBPACK_IMPORTED_MODULE_8__.dom.on("focus", acOpen), grainjs__WEBPACK_IMPORTED_MODULE_8__.dom.on("click", acOpen), grainjs__WEBPACK_IMPORTED_MODULE_8__.dom.on("blur", acClose), grainjs__WEBPACK_IMPORTED_MODULE_8__.dom.onKeyDown({
    Escape: finish,
    Enter: onEnter,
    ArrowDown: acOpen,
    Tab: commitIfValid
  })), app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_6__.cssEmailInputContainer.cls("-green", enableAdd), ...args);
  owner.autoDispose(emailObs.addListener(() => emailInput.setCustomValidity("")));
  if (prompt) {
    setTimeout(() => emailInput.focus(), 0);
  }
  return result;
}
const cssMemberPrimaryPlus = (0,grainjs__WEBPACK_IMPORTED_MODULE_8__.styled)(app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_6__.cssMemberPrimary, `
  .${app_client_lib_ACSelect__WEBPACK_IMPORTED_MODULE_2__.cssSelectItem.className}.selected & {
    color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_4__.theme.menuItemSelectedFg};
  }
`);
const cssMemberSecondaryPlus = (0,grainjs__WEBPACK_IMPORTED_MODULE_8__.styled)(app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_6__.cssMemberSecondary, `
  .${app_client_lib_ACSelect__WEBPACK_IMPORTED_MODULE_2__.cssSelectItem.className}.selected & {
    color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_4__.theme.menuItemSelectedFg};
  }
`);
const cssMatchText = (0,grainjs__WEBPACK_IMPORTED_MODULE_8__.styled)("span", `
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_4__.theme.autocompleteMatchText};
  .${app_client_lib_ACSelect__WEBPACK_IMPORTED_MODULE_2__.cssSelectItem.className}.selected & {
    color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_4__.theme.autocompleteSelectedMatchText};
  }
`);
const cssUserImagePlus = (0,grainjs__WEBPACK_IMPORTED_MODULE_8__.styled)(app_client_ui_UserImage__WEBPACK_IMPORTED_MODULE_7__.cssUserImage, `
  background-color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_4__.colors.lightGreen};
  margin: auto 0;

  &-invalid {
    background-color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_4__.colors.mediumGrey};
  }

  .${popweasel__WEBPACK_IMPORTED_MODULE_9__.cssMenuItem.className}-sel & {
    background-color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_4__.theme.menuItemIconSelectedFg};
    color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_4__.theme.menuItemSelectedBg};
  }
`);


/***/ }),

/***/ "./app/client/lib/MultiUserManager.ts":
/*!********************************************!*\
  !*** ./app/client/lib/MultiUserManager.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "buildMultiUserManagerModal": () => (/* binding */ buildMultiUserManagerModal)
/* harmony export */ });
/* harmony import */ var grainjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! grainjs */ "./node_modules/grainjs/dist/esm/index.js");
/* harmony import */ var app_client_ui2018_modals__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/client/ui2018/modals */ "./app/client/ui2018/modals.ts");
/* harmony import */ var app_client_ui2018_buttons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/client/ui2018/buttons */ "./app/client/ui2018/buttons.ts");
/* harmony import */ var app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/client/ui2018/cssVars */ "./app/client/ui2018/cssVars.ts");
/* harmony import */ var app_client_ui2018_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/client/ui2018/icons */ "./app/client/ui2018/icons.ts");
/* harmony import */ var app_client_ui_inputs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/client/ui/inputs */ "./app/client/ui/inputs.ts");
/* harmony import */ var app_common_roles__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! app/common/roles */ "./app/common/roles.ts");
/* harmony import */ var app_client_ui2018_menus__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! app/client/ui2018/menus */ "./app/client/ui2018/menus.ts");








function parseEmailList(emailListRaw) {
  return emailListRaw.split("\n").map((email) => email.trim().toLowerCase()).filter((email) => email !== "");
}
function validateEmail(email) {
  const mailformat = /\S+@\S+\.\S+/;
  return mailformat.test(email);
}
function buildMultiUserManagerModal(owner, model, onAdd) {
  const emailListObs = grainjs__WEBPACK_IMPORTED_MODULE_0__.Observable.create(owner, "");
  const rolesObs = grainjs__WEBPACK_IMPORTED_MODULE_0__.Observable.create(owner, app_common_roles__WEBPACK_IMPORTED_MODULE_6__.VIEWER);
  const isValidObs = grainjs__WEBPACK_IMPORTED_MODULE_0__.Observable.create(owner, true);
  const enableAdd = (0,grainjs__WEBPACK_IMPORTED_MODULE_0__.computed)((use) => Boolean(use(emailListObs) && use(rolesObs) && use(isValidObs)));
  const save = (ctl) => {
    const emailList = parseEmailList(emailListObs.get());
    const role = rolesObs.get();
    if (emailList.some((email) => !validateEmail(email))) {
      isValidObs.set(false);
    } else {
      emailList.forEach((email) => onAdd(email, role));
      ctl.close();
    }
  };
  return (0,app_client_ui2018_modals__WEBPACK_IMPORTED_MODULE_1__.modal)((ctl) => [
    { style: "padding: 0;" },
    grainjs__WEBPACK_IMPORTED_MODULE_0__.dom.cls(app_client_ui2018_modals__WEBPACK_IMPORTED_MODULE_1__.cssAnimatedModal.className),
    cssTitle("Invite Users", (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_3__.testId)("um-header")),
    (0,app_client_ui2018_modals__WEBPACK_IMPORTED_MODULE_1__.cssModalBody)(cssUserManagerBody(buildEmailsTextarea(emailListObs, isValidObs), grainjs__WEBPACK_IMPORTED_MODULE_0__.dom.maybe((use) => !use(isValidObs), () => cssErrorMessage("At least one email is invalid")), cssInheritRoles((0,grainjs__WEBPACK_IMPORTED_MODULE_0__.dom)("span", "Access: "), buildRolesSelect(rolesObs, model)))),
    (0,app_client_ui2018_modals__WEBPACK_IMPORTED_MODULE_1__.cssModalButtons)({ style: "margin: 32px 64px; display: flex;" }, (0,app_client_ui2018_buttons__WEBPACK_IMPORTED_MODULE_2__.bigPrimaryButton)("Confirm", grainjs__WEBPACK_IMPORTED_MODULE_0__.dom.boolAttr("disabled", (use) => !use(enableAdd)), grainjs__WEBPACK_IMPORTED_MODULE_0__.dom.on("click", () => save(ctl)), (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_3__.testId)("um-confirm")), (0,app_client_ui2018_buttons__WEBPACK_IMPORTED_MODULE_2__.bigBasicButton)("Cancel", grainjs__WEBPACK_IMPORTED_MODULE_0__.dom.on("click", () => ctl.close()), (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_3__.testId)("um-cancel")))
  ]);
}
function buildRolesSelect(roleSelectedObs, model) {
  const allRoles = (model.isOrg ? model.orgUserSelectOptions : model.userSelectOptions).filter((x) => (0,app_common_roles__WEBPACK_IMPORTED_MODULE_6__.isBasicRole)(x.value));
  return cssOptionBtn((0,app_client_ui2018_menus__WEBPACK_IMPORTED_MODULE_7__.menu)(() => [
    grainjs__WEBPACK_IMPORTED_MODULE_0__.dom.forEach(allRoles, (_role) => (0,app_client_ui2018_menus__WEBPACK_IMPORTED_MODULE_7__.menuItem)(() => roleSelectedObs.set(_role.value), _role.label, (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_3__.testId)(`um-role-option`)))
  ]), grainjs__WEBPACK_IMPORTED_MODULE_0__.dom.text((use) => {
    const activeRole = allRoles.find((_role) => use(roleSelectedObs) === _role.value);
    return activeRole ? activeRole.label : "";
  }), cssCollapseIcon("Collapse"), (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_3__.testId)("um-role-select"));
}
function buildEmailsTextarea(emailListObs, isValidObs, ...args) {
  return cssTextarea(emailListObs, { onInput: true, isValid: isValidObs }, { placeholder: "Enter one email address per line" }, grainjs__WEBPACK_IMPORTED_MODULE_0__.dom.on("change", (_ev) => isValidObs.set(true)), ...args);
}
const cssTitle = (0,grainjs__WEBPACK_IMPORTED_MODULE_0__.styled)(app_client_ui2018_modals__WEBPACK_IMPORTED_MODULE_1__.cssModalTitle, `
  margin: 40px 64px 0 64px;

  @media ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_3__.mediaXSmall} {
    & {
      margin: 16px;
    }
  }
`);
const cssInheritRoles = (0,grainjs__WEBPACK_IMPORTED_MODULE_0__.styled)("span", `
  margin: 13px 63px 42px;
`);
const cssErrorMessage = (0,grainjs__WEBPACK_IMPORTED_MODULE_0__.styled)("span", `
  margin: 0 63px;
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_3__.theme.errorText};
`);
const cssOptionBtn = (0,grainjs__WEBPACK_IMPORTED_MODULE_0__.styled)("span", `
  display: inline-flex;
  font-size: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_3__.vars.mediumFontSize};
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_3__.theme.controlFg};
  cursor: pointer;
`);
const cssCollapseIcon = (0,grainjs__WEBPACK_IMPORTED_MODULE_0__.styled)(app_client_ui2018_icons__WEBPACK_IMPORTED_MODULE_4__.icon, `
  margin-top: 1px;
  background-color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_3__.theme.controlFg};
`);
const cssAccessDetailsBody = (0,grainjs__WEBPACK_IMPORTED_MODULE_0__.styled)("div", `
  display: flex;
  flex-direction: column;
  width: 600px;
  font-size: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_3__.vars.mediumFontSize};
`);
const cssUserManagerBody = (0,grainjs__WEBPACK_IMPORTED_MODULE_0__.styled)(cssAccessDetailsBody, `
  height: 374px;
  border-bottom: 1px solid ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_3__.theme.modalBorderDark};
`);
const cssTextarea = (0,grainjs__WEBPACK_IMPORTED_MODULE_0__.styled)(app_client_ui_inputs__WEBPACK_IMPORTED_MODULE_5__.textarea, `
  margin: 16px 63px;
  padding: 12px 10px;
  border-radius: 3px;
  resize: none;
  border: 1px solid ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_3__.theme.inputBorder};
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_3__.theme.inputFg};
  background-color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_3__.theme.inputBg};
  flex: 1 1 0;
  font-size: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_3__.vars.mediumFontSize};
  font-family: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_3__.vars.fontFamily};
  outline: none;

  &::placeholder {
    color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_3__.theme.inputPlaceholderFg};
  }
`);


/***/ }),

/***/ "./app/client/models/UserManagerModel.ts":
/*!***********************************************!*\
  !*** ./app/client/models/UserManagerModel.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UserManagerModelImpl": () => (/* binding */ UserManagerModelImpl),
/* harmony export */   "getResourceParent": () => (/* binding */ getResourceParent),
/* harmony export */   "shouldSupportAnon": () => (/* binding */ shouldSupportAnon)
/* harmony export */ });
/* harmony import */ var app_client_lib_localization__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/client/lib/localization */ "./app/client/lib/localization.ts");
/* harmony import */ var app_common_ShareAnnotator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/common/ShareAnnotator */ "./app/common/ShareAnnotator.ts");
/* harmony import */ var app_common_emails__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/common/emails */ "./app/common/emails.ts");
/* harmony import */ var app_common_roles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/common/roles */ "./app/common/roles.ts");
/* harmony import */ var app_common_urlUtils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/common/urlUtils */ "./app/common/urlUtils.ts");
/* harmony import */ var app_common_UserAPI__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/common/UserAPI */ "./app/common/UserAPI.ts");
/* harmony import */ var grainjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! grainjs */ "./node_modules/grainjs/dist/esm/index.js");
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
var _a, _b, _c, _d, _e, _f;







const some = __webpack_require__(/*! lodash/some */ "./node_modules/lodash/some.js");
const t = (0,app_client_lib_localization__WEBPACK_IMPORTED_MODULE_0__.makeT)("UserManagerModel");
class UserManagerModelImpl extends grainjs__WEBPACK_IMPORTED_MODULE_6__.Disposable {
  constructor(initData, resourceType, _options) {
    super();
    this.initData = initData;
    this.resourceType = resourceType;
    this._options = _options;
    this.userSelectOptions = [
      { value: app_common_roles__WEBPACK_IMPORTED_MODULE_3__.OWNER, label: t("Owner") },
      { value: app_common_roles__WEBPACK_IMPORTED_MODULE_3__.EDITOR, label: t("Editor") },
      { value: app_common_roles__WEBPACK_IMPORTED_MODULE_3__.VIEWER, label: t("Viewer") }
    ];
    this.orgUserSelectOptions = [
      { value: app_common_roles__WEBPACK_IMPORTED_MODULE_3__.OWNER, label: t("Owner") },
      { value: app_common_roles__WEBPACK_IMPORTED_MODULE_3__.EDITOR, label: t("Editor") },
      { value: app_common_roles__WEBPACK_IMPORTED_MODULE_3__.VIEWER, label: t("Viewer") },
      { value: app_common_roles__WEBPACK_IMPORTED_MODULE_3__.MEMBER, label: t("No Default Access") }
    ];
    this.inheritSelectOptions = [
      { value: app_common_roles__WEBPACK_IMPORTED_MODULE_3__.OWNER, label: t("In Full") },
      { value: app_common_roles__WEBPACK_IMPORTED_MODULE_3__.EDITOR, label: t("View & Edit") },
      { value: app_common_roles__WEBPACK_IMPORTED_MODULE_3__.VIEWER, label: t("View Only") },
      { value: null, label: t("None") }
    ];
    this.publicUserSelectOptions = [
      { value: app_common_roles__WEBPACK_IMPORTED_MODULE_3__.EDITOR, label: t("Editor") },
      { value: app_common_roles__WEBPACK_IMPORTED_MODULE_3__.VIEWER, label: t("Viewer") }
    ];
    this.activeUser = (_a = this._options.activeUser) != null ? _a : null;
    this.resource = (_b = this._options.resource) != null ? _b : null;
    this.maxInheritedRole = (0,grainjs__WEBPACK_IMPORTED_MODULE_6__.observable)(this.initData.maxInheritedRole || null);
    this.publicMember = this._buildPublicMember();
    this.membersEdited = this.autoDispose((0,grainjs__WEBPACK_IMPORTED_MODULE_6__.obsArray)(this._buildAllMembers()));
    this.annotations = this.autoDispose((0,grainjs__WEBPACK_IMPORTED_MODULE_6__.observable)({ users: /* @__PURE__ */ new Map() }));
    this.isPersonal = (_c = this.initData.personal) != null ? _c : false;
    this.isPublicMember = (_d = this.initData.public) != null ? _d : false;
    this.isOrg = this.resourceType === "organization";
    this.gristDoc = (_f = (_e = this._options.docPageModel) == null ? void 0 : _e.gristDoc.get()) != null ? _f : null;
    this.isAnythingChanged = this.autoDispose((0,grainjs__WEBPACK_IMPORTED_MODULE_6__.computed)((use) => {
      const isMemberChangedFn = (m) => m.isNew || m.isRemoved || use(m.access) !== m.origAccess;
      const isInheritanceChanged = !this.isOrg && use(this.maxInheritedRole) !== this.initData.maxInheritedRole;
      return some(use(this.membersEdited), isMemberChangedFn) || isInheritanceChanged || (this.publicMember ? isMemberChangedFn(this.publicMember) : false);
    }));
    this.isSelfRemoved = this.autoDispose((0,grainjs__WEBPACK_IMPORTED_MODULE_6__.computed)((use) => {
      return some(use(this.membersEdited), (m) => {
        var _a2;
        return m.isRemoved && m.email === ((_a2 = this.activeUser) == null ? void 0 : _a2.email);
      });
    }));
    if (this._options.appModel) {
      const product = this._options.appModel.currentProduct;
      const { supportEmail } = (0,app_common_urlUtils__WEBPACK_IMPORTED_MODULE_4__.getGristConfig)();
      this._shareAnnotator = new app_common_ShareAnnotator__WEBPACK_IMPORTED_MODULE_1__.ShareAnnotator(product, initData, { supportEmail });
    }
    this.annotate();
  }
  reset() {
    this.membersEdited.set(this._buildAllMembers());
    this.annotate();
  }
  async reloadAnnotations() {
    if (!this._options.reload || !this._shareAnnotator) {
      return;
    }
    const data = await this._options.reload();
    this._shareAnnotator.updateState(data);
    this.annotate();
  }
  async save(userApi, resourceId) {
    if (this.resourceType === "organization") {
      await userApi.updateOrgPermissions(resourceId, this.getDelta());
    } else if (this.resourceType === "workspace") {
      await userApi.updateWorkspacePermissions(resourceId, this.getDelta());
    } else if (this.resourceType === "document") {
      await userApi.updateDocPermissions(resourceId, this.getDelta());
    }
  }
  add(email, role) {
    email = (0,app_common_emails__WEBPACK_IMPORTED_MODULE_2__.normalizeEmail)(email);
    const members = this.membersEdited.get();
    const index = members.findIndex((m) => m.email === email);
    const existing = index > -1 ? members[index] : null;
    if (existing && existing.isRemoved) {
      this.membersEdited.splice(index, 1, __spreadProps(__spreadValues({}, existing), { isRemoved: false }));
    } else if (existing) {
      const effective = existing.effectiveAccess.get();
      if (effective && effective !== app_common_roles__WEBPACK_IMPORTED_MODULE_3__.GUEST) {
        throw new Error("This user is already in the list");
      }
      existing.access.set(role);
      existing.isNew = true;
    } else {
      const newMember = this._buildEditableMember({
        id: -1,
        email,
        name: "",
        access: role,
        parentAccess: null
      });
      newMember.isNew = true;
      this.membersEdited.push(newMember);
    }
    this.annotate();
  }
  remove(member) {
    const index = this.membersEdited.get().indexOf(member);
    if (member.isNew) {
      this.membersEdited.splice(index, 1);
    } else {
      this.membersEdited.splice(index, 1, __spreadProps(__spreadValues({}, member), { isRemoved: true }));
    }
    this.annotate();
  }
  isActiveUser(member) {
    var _a2;
    return member.email === ((_a2 = this.activeUser) == null ? void 0 : _a2.email);
  }
  annotate() {
    if (!this._shareAnnotator) {
      return;
    }
    this.annotations.set(this._shareAnnotator.annotateChanges(this.getDelta({ silent: true })));
  }
  getDelta(options) {
    const delta = { users: {} };
    if (this.resourceType !== "organization") {
      const maxInheritedRole = this.maxInheritedRole.get();
      if (this.initData.maxInheritedRole !== maxInheritedRole) {
        delta.maxInheritedRole = maxInheritedRole;
      }
    }
    const members = [...this.membersEdited.get()];
    if (this.publicMember) {
      members.push(this.publicMember);
    }
    for (const m of members) {
      const access = m.access.get();
      if (!app_common_roles__WEBPACK_IMPORTED_MODULE_3__.isValidRole(access)) {
        if (!(options == null ? void 0 : options.silent)) {
          throw new Error(`Cannot update user to invalid role ${access}`);
        }
        continue;
      }
      if (m.isNew || m.isRemoved || m.origAccess !== access) {
        delta.users[m.email] = m.isRemoved ? null : access;
      }
    }
    return delta;
  }
  _buildAllMembers() {
    let users = this.initData.users;
    const publicMember = this.publicMember;
    if (publicMember) {
      users = users.filter((m) => m.email !== publicMember.email);
    }
    return users.map((m) => this._buildEditableMember({
      id: m.id,
      email: m.email,
      name: m.name,
      picture: m.picture,
      access: m.access,
      parentAccess: m.parentAccess || null,
      isTeamMember: m.isMember
    }));
  }
  _buildPublicMember() {
    const email = shouldSupportAnon() ? app_common_UserAPI__WEBPACK_IMPORTED_MODULE_5__.ANONYMOUS_USER_EMAIL : this.resourceType === "document" ? app_common_UserAPI__WEBPACK_IMPORTED_MODULE_5__.EVERYONE_EMAIL : null;
    if (!email) {
      return null;
    }
    const user = this.initData.users.find((m) => m.email === email);
    return this._buildEditableMember({
      id: user ? user.id : -1,
      email,
      name: "",
      access: user ? user.access : null,
      parentAccess: user ? user.parentAccess || null : null
    });
  }
  _buildEditableMember(member) {
    var _a2;
    const access = grainjs__WEBPACK_IMPORTED_MODULE_6__.Observable.create(this, member.access);
    let inheritedAccess;
    if (member.email === ((_a2 = this.activeUser) == null ? void 0 : _a2.email)) {
      const initialAccessBasicRole = app_common_roles__WEBPACK_IMPORTED_MODULE_3__.getEffectiveRole((0,app_common_UserAPI__WEBPACK_IMPORTED_MODULE_5__.getRealAccess)(member, this.initData));
      inheritedAccess = grainjs__WEBPACK_IMPORTED_MODULE_6__.Computed.create(this, (use) => initialAccessBasicRole);
    } else {
      inheritedAccess = grainjs__WEBPACK_IMPORTED_MODULE_6__.Computed.create(this, this.maxInheritedRole, (use, maxInherited) => app_common_roles__WEBPACK_IMPORTED_MODULE_3__.getWeakestRole(member.parentAccess, maxInherited));
    }
    const effectiveAccess = grainjs__WEBPACK_IMPORTED_MODULE_6__.Computed.create(this, (use) => app_common_roles__WEBPACK_IMPORTED_MODULE_3__.getStrongestRole(use(access), use(inheritedAccess)));
    effectiveAccess.onWrite((value) => {
      const inherited = inheritedAccess.get();
      const isAboveInherit = app_common_roles__WEBPACK_IMPORTED_MODULE_3__.getStrongestRole(value, inherited) !== inherited;
      access.set(isAboveInherit ? value : null);
    });
    return {
      id: member.id,
      email: member.email,
      name: member.name,
      picture: member.picture,
      access,
      parentAccess: member.parentAccess || null,
      inheritedAccess,
      effectiveAccess,
      origAccess: member.access,
      isNew: false,
      isRemoved: false,
      isTeamMember: member.isTeamMember
    };
  }
}
function getResourceParent(resource) {
  if (resource === "workspace") {
    return "organization";
  } else if (resource === "document") {
    return "workspace";
  } else {
    return null;
  }
}
function shouldSupportAnon() {
  const gristConfig = window.gristConfig || {};
  return gristConfig.supportAnon || false;
}


/***/ }),

/***/ "./app/client/ui/UserItem.ts":
/*!***********************************!*\
  !*** ./app/client/ui/UserItem.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "cssEmailInput": () => (/* binding */ cssEmailInput),
/* harmony export */   "cssEmailInputContainer": () => (/* binding */ cssEmailInputContainer),
/* harmony export */   "cssMailIcon": () => (/* binding */ cssMailIcon),
/* harmony export */   "cssMemberBtn": () => (/* binding */ cssMemberBtn),
/* harmony export */   "cssMemberImage": () => (/* binding */ cssMemberImage),
/* harmony export */   "cssMemberListItem": () => (/* binding */ cssMemberListItem),
/* harmony export */   "cssMemberPrimary": () => (/* binding */ cssMemberPrimary),
/* harmony export */   "cssMemberSecondary": () => (/* binding */ cssMemberSecondary),
/* harmony export */   "cssMemberText": () => (/* binding */ cssMemberText),
/* harmony export */   "cssMemberType": () => (/* binding */ cssMemberType),
/* harmony export */   "cssMemberTypeProblem": () => (/* binding */ cssMemberTypeProblem),
/* harmony export */   "cssRemoveIcon": () => (/* binding */ cssRemoveIcon)
/* harmony export */ });
/* harmony import */ var app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/client/ui2018/cssVars */ "./app/client/ui2018/cssVars.ts");
/* harmony import */ var app_client_ui2018_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/client/ui2018/icons */ "./app/client/ui2018/icons.ts");
/* harmony import */ var grainjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! grainjs */ "./node_modules/grainjs/dist/esm/index.js");
/* harmony import */ var popweasel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! popweasel */ "./node_modules/popweasel/dist/index.js");
/* harmony import */ var popweasel__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(popweasel__WEBPACK_IMPORTED_MODULE_3__);




const cssMemberListItem = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)("div", `
  display: flex;
  width: 460px;
  min-height: 64px;
  margin: 0 auto;
  padding: 12px 0;
`);
const cssMemberImage = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)("div", `
  width: 40px;
  height: 40px;
  margin: 0 4px;
  border-radius: 20px;
  background-color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.colors.lightGreen};
  background-size: cover;

  .${cssMemberListItem.className}-removed & {
    opacity: 0.4;
  }
`);
const cssMemberText = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)("div", `
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 2px 12px;
  flex: 1 1 0;
  min-width: 0px;
  font-size: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.vars.mediumFontSize};

  .${cssMemberListItem.className}-removed & {
    opacity: 0.4;
  }
`);
const cssMemberPrimary = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)("span", `
  font-weight: bold;
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.text};
  padding: 2px 0;

  .${popweasel__WEBPACK_IMPORTED_MODULE_3__.cssMenuItem.className}-sel & {
    color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.menuItemSelectedFg};
  }
`);
const cssMemberSecondary = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)("span", `
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.lightText};
  /* the following just undo annoying bootstrap styles that apply to all labels */
  margin: 0px;
  font-weight: normal;
  padding: 2px 0;
  white-space: nowrap;

  .${popweasel__WEBPACK_IMPORTED_MODULE_3__.cssMenuItem.className}-sel & {
    color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.menuItemSelectedFg};
  }
`);
const cssMemberType = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)("span", `
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.lightText};
  /* the following just undo annoying bootstrap styles that apply to all labels */
  margin: 0px;
  font-weight: normal;
  padding: 2px 0;
  white-space: nowrap;

  .${popweasel__WEBPACK_IMPORTED_MODULE_3__.cssMenuItem.className}-sel & {
    color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.menuItemSelectedFg};
  }
`);
const cssMemberTypeProblem = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)("span", `
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.errorText};
  /* the following just undo annoying bootstrap styles that apply to all labels */
  margin: 0px;
  font-weight: normal;
  padding: 2px 0;
  white-space: nowrap;

  .${popweasel__WEBPACK_IMPORTED_MODULE_3__.cssMenuItem.className}-sel & {
    color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.menuItemSelectedFg};
  }
`);
const cssMemberBtn = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)("div", `
  width: 16px;
  height: 16px;
  cursor: pointer;

  &-disabled {
    opacity: 0.3;
    cursor: default;
  }
`);
const cssRemoveIcon = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)(app_client_ui2018_icons__WEBPACK_IMPORTED_MODULE_1__.icon, `
  background-color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.lightText};
  margin: 12px 0;
`);
const cssEmailInputContainer = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)("div", `
  position: relative;
  display: flex;
  height: 42px;
  padding: 0 3px;
  margin: 16px 63px;
  border: 1px solid ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.inputBorder};
  border-radius: 3px;
  font-size: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.vars.mediumFontSize};
  outline: none;

  &-green {
    border: 1px solid ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.inputValid};
  }
`);
const cssEmailInput = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)(grainjs__WEBPACK_IMPORTED_MODULE_2__.input, `
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.inputFg};
  background-color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.inputBg};
  flex: 1 1 0;
  font-size: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.vars.mediumFontSize};
  font-family: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.vars.fontFamily};
  outline: none;
  border: none;

  &::placeholder {
    color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.inputPlaceholderFg};
  }
`);
const cssMailIcon = (0,grainjs__WEBPACK_IMPORTED_MODULE_2__.styled)(app_client_ui2018_icons__WEBPACK_IMPORTED_MODULE_1__.icon, `
  margin: 12px 8px 12px 13px;
  background-color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_0__.theme.lightText};
`);


/***/ }),

/***/ "./app/client/ui/UserManager.ts":
/*!**************************************!*\
  !*** ./app/client/ui/UserManager.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ACMemberEmail": () => (/* binding */ ACMemberEmail),
/* harmony export */   "UserManager": () => (/* binding */ UserManager),
/* harmony export */   "showUserManagerModal": () => (/* binding */ showUserManagerModal)
/* harmony export */ });
/* harmony import */ var app_client_lib_localization__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/client/lib/localization */ "./app/client/lib/localization.ts");
/* harmony import */ var app_common_gristUrls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/common/gristUrls */ "./app/common/gristUrls.ts");
/* harmony import */ var app_common_gutil__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/common/gutil */ "./app/common/gutil.ts");
/* harmony import */ var app_common_roles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/common/roles */ "./app/common/roles.ts");
/* harmony import */ var grainjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! grainjs */ "./node_modules/grainjs/dist/esm/index.js");
/* harmony import */ var app_client_lib_ACIndex__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/client/lib/ACIndex */ "./app/client/lib/ACIndex.ts");
/* harmony import */ var app_client_lib_clipboardUtils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! app/client/lib/clipboardUtils */ "./app/client/lib/clipboardUtils.ts");
/* harmony import */ var app_client_lib_testState__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! app/client/lib/testState */ "./app/client/lib/testState.ts");
/* harmony import */ var app_client_lib_MultiUserManager__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! app/client/lib/MultiUserManager */ "./app/client/lib/MultiUserManager.ts");
/* harmony import */ var app_client_lib_ACUserManager__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! app/client/lib/ACUserManager */ "./app/client/lib/ACUserManager.ts");
/* harmony import */ var app_client_models_errors__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! app/client/models/errors */ "./app/client/models/errors.ts");
/* harmony import */ var app_client_models_gristUrlState__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! app/client/models/gristUrlState */ "./app/client/models/gristUrlState.ts");
/* harmony import */ var app_client_models_UserManagerModel__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! app/client/models/UserManagerModel */ "./app/client/models/UserManagerModel.ts");
/* harmony import */ var app_client_ui_GristTooltips__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! app/client/ui/GristTooltips */ "./app/client/ui/GristTooltips.ts");
/* harmony import */ var app_client_ui_shadowScroll__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! app/client/ui/shadowScroll */ "./app/client/ui/shadowScroll.ts");
/* harmony import */ var app_client_ui_tooltips__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! app/client/ui/tooltips */ "./app/client/ui/tooltips.ts");
/* harmony import */ var app_client_ui_UserImage__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! app/client/ui/UserImage */ "./app/client/ui/UserImage.ts");
/* harmony import */ var app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! app/client/ui/UserItem */ "./app/client/ui/UserItem.ts");
/* harmony import */ var app_client_ui2018_buttons__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! app/client/ui2018/buttons */ "./app/client/ui2018/buttons.ts");
/* harmony import */ var app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! app/client/ui2018/cssVars */ "./app/client/ui2018/cssVars.ts");
/* harmony import */ var app_client_ui2018_icons__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! app/client/ui2018/icons */ "./app/client/ui2018/icons.ts");
/* harmony import */ var app_client_ui2018_links__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! app/client/ui2018/links */ "./app/client/ui2018/links.ts");
/* harmony import */ var app_client_ui2018_loaders__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! app/client/ui2018/loaders */ "./app/client/ui2018/loaders.ts");
/* harmony import */ var app_client_ui2018_menus__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! app/client/ui2018/menus */ "./app/client/ui2018/menus.ts");
/* harmony import */ var app_client_ui2018_modals__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! app/client/ui2018/modals */ "./app/client/ui2018/modals.ts");





const pick = __webpack_require__(/*! lodash/pick */ "./node_modules/lodash/pick.js");





















const t = (0,app_client_lib_localization__WEBPACK_IMPORTED_MODULE_0__.makeT)("UserManager");
async function getModel(options) {
  const permissionData = await options.permissionData;
  return new app_client_models_UserManagerModel__WEBPACK_IMPORTED_MODULE_12__.UserManagerModelImpl(permissionData, options.resourceType, pick(options, ["activeUser", "reload", "appModel", "docPageModel", "resource"]));
}
function showUserManagerModal(userApi, options) {
  const modelObs = (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.observable)(null);
  async function onConfirm(ctl) {
    const model = modelObs.get();
    if (!model || model === "slow") {
      ctl.close();
      return;
    }
    const tryToSaveChanges = async () => {
      var _a;
      try {
        const isAnythingChanged = model.isAnythingChanged.get();
        if (isAnythingChanged) {
          await model.save(userApi, options.resourceId);
        }
        await ((_a = options.onSave) == null ? void 0 : _a.call(options, model.isPersonal));
        ctl.close();
        if (model.isPersonal && isAnythingChanged) {
          window.location.reload();
        }
      } catch (err) {
        (0,app_client_models_errors__WEBPACK_IMPORTED_MODULE_10__.reportError)(err);
      }
    };
    if (model.isSelfRemoved.get()) {
      const resourceType = resourceName(model.resourceType);
      (0,app_client_ui2018_modals__WEBPACK_IMPORTED_MODULE_24__.confirmModal)(t(`You are about to remove your own access to this {{resourceType}}`, { resourceType }), t("Remove my access"), tryToSaveChanges, {
        explanation: t(`Once you have removed your own access, you will not be able to get it back without assistance from someone else with sufficient access to the {{resourceType}}.`, { resourceType })
      });
    } else {
      tryToSaveChanges().catch(app_client_models_errors__WEBPACK_IMPORTED_MODULE_10__.reportError);
    }
  }
  const waitPromise = getModel(options).then((model) => modelObs.set(model)).catch(app_client_models_errors__WEBPACK_IMPORTED_MODULE_10__.reportError);
  (0,app_common_gutil__WEBPACK_IMPORTED_MODULE_2__.isLongerThan)(waitPromise, 400).then((slow) => slow && modelObs.set("slow")).catch(() => {
  });
  return buildUserManagerModal(modelObs, onConfirm, options);
}
function buildUserManagerModal(modelObs, onConfirm, options) {
  return (0,app_client_ui2018_modals__WEBPACK_IMPORTED_MODULE_24__.modal)((ctl) => [
    { style: "padding: 0;" },
    options.showAnimation ? grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.cls(app_client_ui2018_modals__WEBPACK_IMPORTED_MODULE_24__.cssAnimatedModal.className) : null,
    grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.domComputed(modelObs, (model) => {
      if (!model) {
        return null;
      }
      if (model === "slow") {
        return cssSpinner((0,app_client_ui2018_loaders__WEBPACK_IMPORTED_MODULE_22__.loadingSpinner)());
      }
      const cssBody = model.isPersonal ? cssAccessDetailsBody : cssUserManagerBody;
      return [
        cssTitle(renderTitle(options.resourceType, options.resource, model.isPersonal), options.resourceType === "document" && (!model.isPersonal || model.isPublicMember) ? makeCopyBtn(options.linkToCopy, cssCopyBtn.cls("-header")) : null, (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)("um-header")),
        (0,app_client_ui2018_modals__WEBPACK_IMPORTED_MODULE_24__.cssModalBody)(cssBody(new UserManager(model, pick(options, "linkToCopy", "docPageModel", "appModel", "prompt", "resource")).buildDom())),
        (0,app_client_ui2018_modals__WEBPACK_IMPORTED_MODULE_24__.cssModalButtons)({ style: "margin: 32px 64px; display: flex;" }, model.isPublicMember ? null : (0,app_client_ui2018_buttons__WEBPACK_IMPORTED_MODULE_18__.bigPrimaryButton)(t("Confirm"), grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.boolAttr("disabled", (use) => !use(model.isAnythingChanged)), grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.on("click", () => onConfirm(ctl)), (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)("um-confirm")), (0,app_client_ui2018_buttons__WEBPACK_IMPORTED_MODULE_18__.bigBasicButton)(model.isPublicMember ? t("Close") : t("Cancel"), grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.on("click", () => ctl.close()), (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)("um-cancel")), model.resourceType === "document" && model.gristDoc && !model.isPersonal ? (0,app_client_ui_tooltips__WEBPACK_IMPORTED_MODULE_15__.withInfoTooltip)((0,app_client_ui2018_links__WEBPACK_IMPORTED_MODULE_21__.cssLink)({ href: (0,app_client_models_gristUrlState__WEBPACK_IMPORTED_MODULE_11__.urlState)().makeUrl({ docPage: "acl" }) }, grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.text((use) => use(model.isAnythingChanged) ? t("Save & ") : ""), t("Open Access Rules"), grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.on("click", (ev) => {
          ev.preventDefault();
          return onConfirm(ctl).then(() => (0,app_client_models_gristUrlState__WEBPACK_IMPORTED_MODULE_11__.urlState)().pushUrl({ docPage: "acl" }));
        }), (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)("um-open-access-rules")), app_client_ui_GristTooltips__WEBPACK_IMPORTED_MODULE_13__.GristTooltips.openAccessRules(), { domArgs: [cssAccessLink.cls("")] }) : null, (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)("um-buttons"))
      ];
    })
  ]);
}
class UserManager extends grainjs__WEBPACK_IMPORTED_MODULE_4__.Disposable {
  constructor(_model, _options) {
    super();
    this._model = _model;
    this._options = _options;
  }
  buildDom() {
    if (this._model.isPublicMember) {
      return this._buildSelfPublicAccessDom();
    }
    if (this._model.isPersonal) {
      return this._buildSelfAccessDom();
    }
    const acMemberEmail = this.autoDispose(new ACMemberEmail(this._onAdd.bind(this), this._model.membersEdited.get(), this._options.prompt));
    return [
      acMemberEmail.buildDom(),
      this._buildOptionsDom(),
      this._dom = (0,app_client_ui_shadowScroll__WEBPACK_IMPORTED_MODULE_14__.shadowScroll)((0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)("um-members"), this._buildPublicAccessMember(), grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.forEach(this._model.membersEdited, (member) => this._buildMemberDom(member)))
    ];
  }
  _onAddOrEdit(email, role) {
    const members = this._model.membersEdited.get();
    const maybeMember = members.find((m) => m.email === email);
    if (maybeMember) {
      maybeMember.access.set(role);
    } else {
      this._onAdd(email, role);
    }
  }
  _onAdd(email, role) {
    var _a;
    this._model.add(email, role);
    (_a = Array.from(this._dom.querySelectorAll(".member-email")).find((el) => el.textContent === email)) == null ? void 0 : _a.scrollIntoView();
  }
  _buildOptionsDom() {
    const publicMember = this._model.publicMember;
    let tooltipControl;
    return (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.dom)("div", cssOptionRowMultiple((0,app_client_ui2018_icons__WEBPACK_IMPORTED_MODULE_20__.icon)("AddUser"), cssLabel(t("Invite multiple")), grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.on("click", (_ev) => (0,app_client_lib_MultiUserManager__WEBPACK_IMPORTED_MODULE_8__.buildMultiUserManagerModal)(this, this._model, (email, role) => {
      this._onAddOrEdit(email, role);
    }))), cssOptionRow(this._model.isOrg ? null : (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.dom)("span", { style: `float: left;` }, (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.dom)("span", "Inherit access: "), this._inheritRoleSelector()), publicMember ? (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.dom)("span", { style: `float: right;` }, cssSmallPublicMemberIcon("PublicFilled"), (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.dom)("span", t("Public access: ")), cssOptionBtn((0,app_client_ui2018_menus__WEBPACK_IMPORTED_MODULE_23__.menu)(() => {
      tooltipControl == null ? void 0 : tooltipControl.close();
      return [
        (0,app_client_ui2018_menus__WEBPACK_IMPORTED_MODULE_23__.menuItem)(() => publicMember.access.set(app_common_roles__WEBPACK_IMPORTED_MODULE_3__.VIEWER), t("On"), (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)(`um-public-option`)),
        (0,app_client_ui2018_menus__WEBPACK_IMPORTED_MODULE_23__.menuItem)(() => publicMember.access.set(null), t("Off"), grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.cls("disabled", (use) => use(publicMember.inheritedAccess) !== null), (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)(`um-public-option`)),
        grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.maybe((use) => use(publicMember.inheritedAccess) !== null, () => (0,app_client_ui2018_menus__WEBPACK_IMPORTED_MODULE_23__.menuText)(t(`Public access inherited from {{parent}}. To remove, set 'Inherit access' option to 'None'.`, { parent: (0,app_client_models_UserManagerModel__WEBPACK_IMPORTED_MODULE_12__.getResourceParent)(this._model.resourceType) })))
      ];
    }), grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.text((use) => use(publicMember.effectiveAccess) ? t("On") : t("Off")), cssCollapseIcon("Collapse"), (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)("um-public-access")), (0,app_client_ui_tooltips__WEBPACK_IMPORTED_MODULE_15__.hoverTooltip)((ctl) => {
      tooltipControl = ctl;
      return t("Allow anyone with the link to open.");
    })) : null));
  }
  _buildMemberDom(member) {
    const disableRemove = grainjs__WEBPACK_IMPORTED_MODULE_4__.Computed.create(null, (use) => this._model.isPersonal ? !member.origAccess : Boolean(this._model.isActiveUser(member) || use(member.inheritedAccess)));
    return (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.dom)("div", grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.autoDispose(disableRemove), grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.maybe((use) => use(member.effectiveAccess) && use(member.effectiveAccess) !== app_common_roles__WEBPACK_IMPORTED_MODULE_3__.GUEST, () => (0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_17__.cssMemberListItem)(app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_17__.cssMemberListItem.cls("-removed", member.isRemoved), (0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_17__.cssMemberImage)((0,app_client_ui_UserImage__WEBPACK_IMPORTED_MODULE_16__.createUserImage)(getFullUser(member), "large")), (0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_17__.cssMemberText)((0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_17__.cssMemberPrimary)(member.name || member.email, member.email ? grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.cls("member-email") : null, (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)("um-member-name")), !member.name ? null : (0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_17__.cssMemberSecondary)(member.email, grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.cls("member-email"), (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)("um-member-email")), this._model.isPersonal ? this._buildSelfAnnotationDom(member) : this._buildAnnotationDom(member)), member.isRemoved ? null : this._memberRoleSelector(member.effectiveAccess, member.inheritedAccess, this._model.isActiveUser(member)), (0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_17__.cssMemberBtn)(member.isRemoved ? cssUndoIcon("Undo", (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)("um-member-undo")) : (0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_17__.cssRemoveIcon)("Remove", (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)("um-member-delete")), app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_17__.cssMemberBtn.cls("-disabled", disableRemove), grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.on("click", () => disableRemove.get() || (member.isRemoved ? this._model.add(member.email, member.access.get()) : this._model.remove(member)))), (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)("um-member"))));
  }
  _buildAnnotationDom(member) {
    return grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.domComputed(this._model.annotations, (annotations) => {
      const annotation = annotations.users.get(member.email);
      if (!annotation) {
        return null;
      }
      if (annotation.isSupport) {
        return (0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_17__.cssMemberType)(t("Grist support"));
      }
      if (annotation.isMember && annotations.hasTeam) {
        return (0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_17__.cssMemberType)(t("Team member"));
      }
      const collaborator = annotations.hasTeam ? t("guest") : t("free collaborator");
      const limit = annotation.collaboratorLimit;
      if (!limit || !limit.top) {
        return null;
      }
      const elements = [];
      if (limit.at <= limit.top) {
        elements.push((0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_17__.cssMemberType)(t(`{{limitAt}} of {{limitTop}} {{collaborator}}s`, { limitAt: limit.at, limitTop: limit.top, collaborator })));
      } else {
        elements.push((0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_17__.cssMemberTypeProblem)(t(`{{collaborator}} limit exceeded`, { collaborator: (0,app_common_gutil__WEBPACK_IMPORTED_MODULE_2__.capitalizeFirstWord)(collaborator) })));
      }
      if (annotations.hasTeam) {
        elements.push((0,app_client_ui2018_links__WEBPACK_IMPORTED_MODULE_21__.cssLink)({ href: (0,app_client_models_gristUrlState__WEBPACK_IMPORTED_MODULE_11__.urlState)().makeUrl({ manageUsers: true }) }, grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.on("click", (e) => {
          if (this._options.appModel) {
            e.preventDefault();
            manageTeam(this._options.appModel, () => this._model.reloadAnnotations(), { email: member.email }).catch(app_client_models_errors__WEBPACK_IMPORTED_MODULE_10__.reportError);
          }
        }), t(`Add {{member}} to your team`, { member: member.name || t("member") })));
      } else if (limit.at >= limit.top) {
        elements.push((0,app_client_ui2018_links__WEBPACK_IMPORTED_MODULE_21__.cssLink)({ href: app_common_gristUrls__WEBPACK_IMPORTED_MODULE_1__.commonUrls.plans, target: "_blank" }, t("Create a team to share with more people")));
      }
      return elements;
    });
  }
  _buildSelfAnnotationDom(user) {
    return grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.domComputed(this._model.annotations, (annotations) => {
      const annotation = annotations.users.get(user.email);
      if (!annotation) {
        return null;
      }
      let memberType;
      if (annotation.isSupport) {
        memberType = t("Grist support");
      } else if (annotation.isMember && annotations.hasTeam) {
        memberType = t("Team member");
      } else if (annotations.hasTeam) {
        memberType = t("Outside collaborator");
      } else {
        memberType = t("Collaborator");
      }
      return (0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_17__.cssMemberType)(memberType, (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)("um-member-annotation"));
    });
  }
  _buildPublicAccessMember() {
    const publicMember = this._model.publicMember;
    if (!publicMember) {
      return null;
    }
    return (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.dom)("div", grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.maybe((use) => Boolean(use(publicMember.effectiveAccess)), () => (0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_17__.cssMemberListItem)(cssPublicMemberIcon("PublicFilled"), (0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_17__.cssMemberText)((0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_17__.cssMemberPrimary)(t("Public Access")), (0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_17__.cssMemberSecondary)(t("Anyone with link "), makeCopyBtn(this._options.linkToCopy))), this._memberRoleSelector(publicMember.effectiveAccess, publicMember.inheritedAccess, false, this._model.publicUserSelectOptions), (0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_17__.cssMemberBtn)((0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_17__.cssRemoveIcon)("Remove", (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)("um-member-delete")), grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.on("click", () => publicMember.access.set(null))), (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)("um-public-member"))));
  }
  _buildSelfPublicAccessDom() {
    var _a, _b, _c;
    const accessValue = (_a = this._options.resource) == null ? void 0 : _a.access;
    const accessLabel = (_b = this._model.publicUserSelectOptions.find((opt) => opt.value === accessValue)) == null ? void 0 : _b.label;
    const activeUser = this._model.activeUser;
    const name = (_c = activeUser == null ? void 0 : activeUser.name) != null ? _c : "Anonymous";
    return (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.dom)("div", (0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_17__.cssMemberListItem)(!activeUser ? cssPublicMemberIcon("PublicFilled") : (0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_17__.cssMemberImage)((0,app_client_ui_UserImage__WEBPACK_IMPORTED_MODULE_16__.createUserImage)(activeUser, "large")), (0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_17__.cssMemberText)((0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_17__.cssMemberPrimary)(name, (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)("um-member-name")), (activeUser == null ? void 0 : activeUser.email) ? (0,app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_17__.cssMemberSecondary)(activeUser.email) : null, cssMemberPublicAccess((0,grainjs__WEBPACK_IMPORTED_MODULE_4__.dom)("span", t("Public access"), (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)("um-member-annotation")), cssPublicAccessIcon("PublicFilled"))), cssRoleBtn(accessLabel != null ? accessLabel : t("Guest"), cssCollapseIcon("Collapse"), grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.cls("disabled"), (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)("um-member-role")), (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)("um-member")), (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)("um-members"));
  }
  _buildSelfAccessDom() {
    return (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.dom)("div", grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.domComputed(this._model.membersEdited, (members) => members[0] ? this._buildMemberDom(members[0]) : null), (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)("um-members"));
  }
  _memberRoleSelector(role, inherited, isActiveUser, allRolesOverride) {
    const allRoles = allRolesOverride || (this._model.isOrg ? this._model.orgUserSelectOptions : this._model.userSelectOptions);
    return cssRoleBtn(this._model.isPersonal ? null : (0,app_client_ui2018_menus__WEBPACK_IMPORTED_MODULE_23__.menu)(() => [
      grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.forEach(allRoles, (_role) => (0,app_client_ui2018_menus__WEBPACK_IMPORTED_MODULE_23__.menuItem)(() => isActiveUser || role.set(_role.value), _role.label, grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.text((use) => use(inherited) && use(inherited) === _role.value && !isActiveUser ? " (inherited)" : ""), grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.cls("disabled", (use) => app_common_roles__WEBPACK_IMPORTED_MODULE_3__.getStrongestRole(_role.value, use(inherited)) !== _role.value), (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)(`um-role-option`))),
      isActiveUser ? (0,app_client_ui2018_menus__WEBPACK_IMPORTED_MODULE_23__.menuText)(t(`User may not modify their own access.`)) : null,
      grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.maybe((use) => use(inherited) && !isActiveUser, () => (0,app_client_ui2018_menus__WEBPACK_IMPORTED_MODULE_23__.menuText)(t(`User inherits permissions from {{parent}}. To remove, set 'Inherit access' option to 'None'.`, { parent: (0,app_client_models_UserManagerModel__WEBPACK_IMPORTED_MODULE_12__.getResourceParent)(this._model.resourceType) }))),
      grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.maybe((use) => !this._model.isOrg && use(role) === app_common_roles__WEBPACK_IMPORTED_MODULE_3__.GUEST, () => (0,app_client_ui2018_menus__WEBPACK_IMPORTED_MODULE_23__.menuText)(t(`User has view access to {{resource}} resulting from manually-set access to resources inside. If removed here, this user will lose access to resources inside.`, { resource: this._model.resourceType }))),
      this._model.isOrg ? (0,app_client_ui2018_menus__WEBPACK_IMPORTED_MODULE_23__.menuText)(t(`No default access allows access to be granted to individual documents or workspaces, rather than the full team site.`)) : null
    ]), grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.text((use) => {
      const activeRole = allRoles.find((_role) => use(role) === _role.value);
      return activeRole ? activeRole.label : t("Guest");
    }), cssCollapseIcon("Collapse"), this._model.isPersonal ? grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.cls("disabled") : null, (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)("um-member-role"));
  }
  _inheritRoleSelector() {
    const role = this._model.maxInheritedRole;
    const allRoles = this._model.inheritSelectOptions;
    return cssOptionBtn((0,app_client_ui2018_menus__WEBPACK_IMPORTED_MODULE_23__.menu)(() => [
      grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.forEach(allRoles, (_role) => (0,app_client_ui2018_menus__WEBPACK_IMPORTED_MODULE_23__.menuItem)(() => role.set(_role.value), _role.label, (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)(`um-role-option`)))
    ]), grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.text((use) => {
      const activeRole = allRoles.find((_role) => use(role) === _role.value);
      return activeRole ? activeRole.label : "";
    }), cssCollapseIcon("Collapse"), (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)("um-max-inherited-role"));
  }
}
function getUserItem(member) {
  return {
    value: member.email,
    label: member.email,
    cleanText: (0,app_client_lib_ACIndex__WEBPACK_IMPORTED_MODULE_5__.normalizeText)(member.email),
    email: member.email,
    name: member.name,
    picture: member == null ? void 0 : member.picture,
    id: member.id
  };
}
class ACMemberEmail extends grainjs__WEBPACK_IMPORTED_MODULE_4__.Disposable {
  constructor(_onAdd, _members, _prompt) {
    super();
    this._onAdd = _onAdd;
    this._members = _members;
    this._prompt = _prompt;
    this._email = this.autoDispose((0,grainjs__WEBPACK_IMPORTED_MODULE_4__.observable)(""));
    if (_prompt) {
      this._email.set(_prompt.email);
    }
  }
  buildDom() {
    const acUserItem = this._members.filter((member) => member.isTeamMember).map((member) => getUserItem(member));
    const acIndex = new app_client_lib_ACIndex__WEBPACK_IMPORTED_MODULE_5__.ACIndexImpl(acUserItem);
    return (0,app_client_lib_ACUserManager__WEBPACK_IMPORTED_MODULE_9__.buildACMemberEmail)(this, {
      acIndex,
      emailObs: this._email,
      save: this._handleSave.bind(this),
      prompt: this._prompt
    }, (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)("um-member-new"));
  }
  _handleSave(selectedEmail) {
    this._onAdd(selectedEmail, app_common_roles__WEBPACK_IMPORTED_MODULE_3__.VIEWER);
  }
}
function getFullUser(member) {
  return {
    id: member.id,
    name: member.name,
    email: member.email,
    picture: member.picture,
    locale: member.locale
  };
}
function makeCopyBtn(linkToCopy, ...domArgs) {
  return linkToCopy && cssCopyBtn(cssCopyIcon("Copy"), t("Copy Link"), grainjs__WEBPACK_IMPORTED_MODULE_4__.dom.on("click", (ev, elem) => copyLink(elem, linkToCopy)), (0,app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.testId)("um-copy-link"), ...domArgs);
}
async function copyLink(elem, link) {
  await (0,app_client_lib_clipboardUtils__WEBPACK_IMPORTED_MODULE_6__.copyToClipboard)(link);
  (0,app_client_lib_testState__WEBPACK_IMPORTED_MODULE_7__.setTestState)({ clipboard: link });
  (0,app_client_ui_tooltips__WEBPACK_IMPORTED_MODULE_15__.showTransientTooltip)(elem, t("Link copied to clipboard"), { key: "copy-doc-link" });
}
async function manageTeam(appModel, onSave, prompt) {
  await (0,app_client_models_gristUrlState__WEBPACK_IMPORTED_MODULE_11__.urlState)().pushUrl({ manageUsers: false });
  const user = appModel.currentValidUser;
  const currentOrg = appModel.currentOrg;
  if (currentOrg) {
    const api = appModel.api;
    showUserManagerModal(api, {
      permissionData: api.getOrgAccess(currentOrg.id),
      activeUser: user,
      resourceType: "organization",
      resourceId: currentOrg.id,
      resource: currentOrg,
      onSave,
      prompt,
      showAnimation: true
    });
  }
}
const cssAccessDetailsBody = (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.styled)("div", `
  display: flex;
  flex-direction: column;
  width: 600px;
  font-size: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.vars.mediumFontSize};
`);
const cssUserManagerBody = (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.styled)(cssAccessDetailsBody, `
  height: 374px;
  border-bottom: 1px solid ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.theme.modalBorderDark};
`);
const cssSpinner = (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.styled)("div", `
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 32px;
`);
const cssCopyBtn = (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.styled)(app_client_ui2018_buttons__WEBPACK_IMPORTED_MODULE_18__.basicButton, `
  border: none;
  font-weight: normal;
  padding: 0 8px;
  &-header {
    float: right;
    margin-top: 8px;
  }
`);
const cssCopyIcon = (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.styled)(app_client_ui2018_icons__WEBPACK_IMPORTED_MODULE_20__.icon, `
  margin-right: 4px;
  margin-top: -2px;
`);
const cssOptionRow = (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.styled)("div", `
  font-size: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.vars.mediumFontSize};
  margin: 0 63px 23px 63px;
`);
const cssOptionRowMultiple = (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.styled)("div", `
  margin: 0 63px 12px 63px;
  font-size: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.vars.mediumFontSize};
  display: flex;
  cursor: pointer;
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.theme.controlFg};
  --icon-color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.theme.controlFg};

  &:hover {
    color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.theme.controlHoverFg};
    --icon-color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.theme.controlHoverFg};
  }
`);
const cssLabel = (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.styled)("span", `
  margin-left: 4px;
`);
const cssOptionBtn = (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.styled)("span", `
  display: inline-flex;
  font-size: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.vars.mediumFontSize};
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.theme.controlFg};
  cursor: pointer;
`);
const cssPublicMemberIcon = (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.styled)(app_client_ui2018_icons__WEBPACK_IMPORTED_MODULE_20__.icon, `
  width: 40px;
  height: 40px;
  margin: 0 4px;
  --icon-color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.theme.accentIcon};
`);
const cssSmallPublicMemberIcon = (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.styled)(cssPublicMemberIcon, `
  width: 16px;
  height: 16px;
  top: -2px;
`);
const cssPublicAccessIcon = (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.styled)(app_client_ui2018_icons__WEBPACK_IMPORTED_MODULE_20__.icon, `
  --icon-color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.theme.accentIcon};
`);
const cssUndoIcon = (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.styled)(app_client_ui2018_icons__WEBPACK_IMPORTED_MODULE_20__.icon, `
  --icon-color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.theme.controlSecondaryFg};
  margin: 12px 0;
`);
const cssRoleBtn = (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.styled)("div", `
  display: flex;
  justify-content: flex-end;
  font-size: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.vars.mediumFontSize};
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.theme.controlFg};
  margin: 12px 24px;
  cursor: pointer;

  &.disabled {
    opacity: 0.5;
    cursor: default;
  }
`);
const cssCollapseIcon = (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.styled)(app_client_ui2018_icons__WEBPACK_IMPORTED_MODULE_20__.icon, `
  margin-top: 1px;
  background-color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.theme.controlFg};
`);
const cssAccessLink = (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.styled)(app_client_ui2018_links__WEBPACK_IMPORTED_MODULE_21__.cssLink, `
  align-self: center;
  margin-left: auto;
`);
const cssOrgName = (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.styled)("div", `
  font-size: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.vars.largeFontSize};
`);
const cssOrgDomain = (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.styled)("span", `
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.theme.accentText};
`);
const cssTitle = (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.styled)(app_client_ui2018_modals__WEBPACK_IMPORTED_MODULE_24__.cssModalTitle, `
  margin: 40px 64px 0 64px;

  @media ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_19__.mediaXSmall} {
    & {
      margin: 16px;
    }
  }
`);
const cssMemberPublicAccess = (0,grainjs__WEBPACK_IMPORTED_MODULE_4__.styled)(app_client_ui_UserItem__WEBPACK_IMPORTED_MODULE_17__.cssMemberSecondary, `
  display: flex;
  align-items: center;
  gap: 8px;
`);
function renderTitle(resourceType, resource, personal) {
  switch (resourceType) {
    case "organization": {
      if (personal) {
        return t("Your role for this team site");
      }
      return [
        t("Manage members of team site"),
        !resource ? null : cssOrgName(`${resource.name} (`, cssOrgDomain(`${resource.domain}.getgrist.com`), ")")
      ];
    }
    default: {
      return personal ? t(`Your role for this {{resourceType}}`, { resourceType }) : t(`Invite people to {{resourceType}}`, { resourceType });
    }
  }
}
function resourceName(resourceType) {
  return resourceType === "organization" ? t("team site") : resourceType;
}


/***/ }),

/***/ "./app/common/ShareAnnotator.ts":
/*!**************************************!*\
  !*** ./app/common/ShareAnnotator.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ShareAnnotator": () => (/* binding */ ShareAnnotator)
/* harmony export */ });
/* harmony import */ var app_common_Features__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/common/Features */ "./app/common/Features.ts");
/* harmony import */ var app_common_emails__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/common/emails */ "./app/common/emails.ts");
var _a, _b;


class ShareAnnotator {
  constructor(_product, _state, _options = {}) {
    this._product = _product;
    this._state = _state;
    this._options = _options;
    this._features = (_b = (_a = this._product) == null ? void 0 : _a.features) != null ? _b : {};
    this._supportEmail = this._options.supportEmail;
  }
  updateState(state) {
    this._state = state;
  }
  annotateChanges(change) {
    const features = this._features;
    const annotations = {
      hasTeam: !this._product || (0,app_common_Features__WEBPACK_IMPORTED_MODULE_0__.isTeamPlan)(this._product.name),
      users: /* @__PURE__ */ new Map()
    };
    if (features.maxSharesPerDocPerRole || features.maxSharesPerWorkspace) {
      return annotations;
    }
    const top = features.maxSharesPerDoc;
    let at = 0;
    const makeAnnotation = (user) => {
      const annotation = {
        isMember: user.isMember
      };
      if (user.isSupport) {
        return { isSupport: true };
      }
      if (!annotation.isMember && user.access) {
        at++;
        annotation.collaboratorLimit = {
          at,
          top
        };
      }
      return annotation;
    };
    const removed = new Set(Object.entries((change == null ? void 0 : change.users) || {}).filter(([, v]) => v === null).map(([k]) => (0,app_common_emails__WEBPACK_IMPORTED_MODULE_1__.normalizeEmail)(k)));
    for (const user of this._state.users) {
      if (removed.has(user.email)) {
        continue;
      }
      if (!user.isMember && !user.access) {
        continue;
      }
      annotations.users.set(user.email, makeAnnotation(user));
    }
    const tweaks = new Set(Object.entries((change == null ? void 0 : change.users) || {}).filter(([, v]) => v !== null).map(([k]) => (0,app_common_emails__WEBPACK_IMPORTED_MODULE_1__.normalizeEmail)(k)));
    for (const email of tweaks) {
      const annotation = annotations.users.get(email) || makeAnnotation({
        email,
        isMember: false,
        isSupport: Boolean(email.trim() !== "" && email === this._supportEmail),
        access: "<set>"
      });
      annotations.users.set(email, annotation);
    }
    return annotations;
  }
}


/***/ }),

/***/ "./app/common/emails.ts":
/*!******************************!*\
  !*** ./app/common/emails.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "normalizeEmail": () => (/* binding */ normalizeEmail)
/* harmony export */ });
function normalizeEmail(displayEmail) {
  return displayEmail.toLowerCase();
}


/***/ })

}]);
//# sourceMappingURL=app_client_ui_UserManager_ts.bundle.js.map