"use strict";
(self["webpackChunkgristy"] = self["webpackChunkgristy"] || []).push([["app_client_ui_SupportGristPage_ts"],{

/***/ "./app/client/ui/SupportGristPage.ts":
/*!*******************************************!*\
  !*** ./app/client/ui/SupportGristPage.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SupportGristPage": () => (/* binding */ SupportGristPage)
/* harmony export */ });
/* harmony import */ var app_client_components_Banners__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/client/components/Banners */ "./stubs/app/client/components/Banners.ts");
/* harmony import */ var app_client_lib_localization__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/client/lib/localization */ "./app/client/lib/localization.ts");
/* harmony import */ var app_client_models_gristUrlState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/client/models/gristUrlState */ "./app/client/models/gristUrlState.ts");
/* harmony import */ var app_client_models_TelemetryModel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/client/models/TelemetryModel */ "./app/client/models/TelemetryModel.ts");
/* harmony import */ var app_client_ui_AppHeader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/client/ui/AppHeader */ "./app/client/ui/AppHeader.ts");
/* harmony import */ var app_client_ui_LeftPanelCommon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/client/ui/LeftPanelCommon */ "./app/client/ui/LeftPanelCommon.ts");
/* harmony import */ var app_client_ui_PagePanels__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! app/client/ui/PagePanels */ "./app/client/ui/PagePanels.ts");
/* harmony import */ var app_client_ui_TopBar__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! app/client/ui/TopBar */ "./app/client/ui/TopBar.ts");
/* harmony import */ var app_client_ui2018_breadcrumbs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! app/client/ui2018/breadcrumbs */ "./app/client/ui2018/breadcrumbs.ts");
/* harmony import */ var app_client_ui2018_buttons__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! app/client/ui2018/buttons */ "./app/client/ui2018/buttons.ts");
/* harmony import */ var app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! app/client/ui2018/cssVars */ "./app/client/ui2018/cssVars.ts");
/* harmony import */ var app_client_ui2018_icons__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! app/client/ui2018/icons */ "./app/client/ui2018/icons.ts");
/* harmony import */ var app_client_ui2018_links__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! app/client/ui2018/links */ "./app/client/ui2018/links.ts");
/* harmony import */ var app_client_ui2018_loaders__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! app/client/ui2018/loaders */ "./app/client/ui2018/loaders.ts");
/* harmony import */ var app_common_gristUrls__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! app/common/gristUrls */ "./app/common/gristUrls.ts");
/* harmony import */ var app_common_urlUtils__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! app/common/urlUtils */ "./app/common/urlUtils.ts");
/* harmony import */ var grainjs__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! grainjs */ "./node_modules/grainjs/dist/esm/index.js");

















const testId = (0,grainjs__WEBPACK_IMPORTED_MODULE_16__.makeTestId)("test-support-grist-page-");
const t = (0,app_client_lib_localization__WEBPACK_IMPORTED_MODULE_1__.makeT)("SupportGristPage");
class SupportGristPage extends grainjs__WEBPACK_IMPORTED_MODULE_16__.Disposable {
  constructor(_appModel) {
    super();
    this._appModel = _appModel;
    this._model = new app_client_models_TelemetryModel__WEBPACK_IMPORTED_MODULE_3__.TelemetryModelImpl(this._appModel);
    this._optInToTelemetry = grainjs__WEBPACK_IMPORTED_MODULE_16__.Computed.create(this, this._model.prefs, (_use, prefs) => {
      if (!prefs) {
        return null;
      }
      return prefs.telemetryLevel.value !== "off";
    }).onWrite(async (optIn) => {
      const telemetryLevel = optIn ? "limited" : "off";
      await this._model.updateTelemetryPrefs({ telemetryLevel });
    });
    this._model.fetchTelemetryPrefs().catch(reportError);
  }
  buildDom() {
    const panelOpen = grainjs__WEBPACK_IMPORTED_MODULE_16__.Observable.create(this, false);
    return (0,app_client_ui_PagePanels__WEBPACK_IMPORTED_MODULE_6__.pagePanels)({
      leftPanel: {
        panelWidth: grainjs__WEBPACK_IMPORTED_MODULE_16__.Observable.create(this, 240),
        panelOpen,
        hideOpener: true,
        header: grainjs__WEBPACK_IMPORTED_MODULE_16__.dom.create(app_client_ui_AppHeader__WEBPACK_IMPORTED_MODULE_4__.AppHeader, this._appModel),
        content: (0,app_client_ui_LeftPanelCommon__WEBPACK_IMPORTED_MODULE_5__.leftPanelBasic)(this._appModel, panelOpen)
      },
      headerMain: this._buildMainHeader(),
      contentTop: (0,app_client_components_Banners__WEBPACK_IMPORTED_MODULE_0__.buildHomeBanners)(this._appModel),
      contentMain: this._buildMainContent()
    });
  }
  _buildMainHeader() {
    return grainjs__WEBPACK_IMPORTED_MODULE_16__.dom.frag((0,app_client_ui2018_breadcrumbs__WEBPACK_IMPORTED_MODULE_8__.cssBreadcrumbs)({ style: "margin-left: 16px;" }, (0,app_client_ui2018_links__WEBPACK_IMPORTED_MODULE_12__.cssLink)((0,app_client_models_gristUrlState__WEBPACK_IMPORTED_MODULE_2__.urlState)().setLinkUrl({}), t("Home")), (0,app_client_ui2018_breadcrumbs__WEBPACK_IMPORTED_MODULE_8__.separator)(" / "), (0,grainjs__WEBPACK_IMPORTED_MODULE_16__.dom)("span", t("Support Grist"))), (0,app_client_ui_TopBar__WEBPACK_IMPORTED_MODULE_7__.createTopBarHome)(this._appModel));
  }
  _buildMainContent() {
    return cssPageContainer(cssPage((0,grainjs__WEBPACK_IMPORTED_MODULE_16__.dom)("div", cssPageTitle(t("Support Grist")), this._buildTelemetrySection(), this._buildSponsorshipSection())));
  }
  _buildTelemetrySection() {
    return cssSection(cssSectionTitle(t("Telemetry")), grainjs__WEBPACK_IMPORTED_MODULE_16__.dom.domComputed(this._model.prefs, (prefs) => {
      if (prefs === null) {
        return cssSpinnerBox((0,app_client_ui2018_loaders__WEBPACK_IMPORTED_MODULE_13__.loadingSpinner)());
      }
      const { activation } = (0,app_common_urlUtils__WEBPACK_IMPORTED_MODULE_15__.getGristConfig)();
      if (!(activation == null ? void 0 : activation.isManager)) {
        if (prefs.telemetryLevel.value === "limited") {
          return [
            cssParagraph(t("This instance is opted in to telemetry. Only the site administrator has permission to change this."))
          ];
        } else {
          return [
            cssParagraph(t("This instance is opted out of telemetry. Only the site administrator has permission to change this."))
          ];
        }
      } else {
        return [
          cssParagraph(t("Support Grist by opting in to telemetry, which helps us understand how the product is used, so that we can prioritize future improvements.")),
          cssParagraph(t("We only collect usage statistics, as detailed in our {{link}}, never document contents.", {
            link: telemetryHelpCenterLink()
          })),
          cssParagraph(t("You can opt out of telemetry at any time from this page.")),
          this._buildTelemetrySectionButtons(prefs)
        ];
      }
    }), testId("telemetry-section"));
  }
  _buildTelemetrySectionButtons(prefs) {
    const { telemetryLevel: { value, source } } = prefs;
    if (source === "preferences") {
      return grainjs__WEBPACK_IMPORTED_MODULE_16__.dom.domComputed(this._optInToTelemetry, (optedIn) => {
        if (optedIn) {
          return [
            cssOptInOutMessage(t("You have opted in to telemetry. Thank you!"), " \u{1F64F}", testId("telemetry-section-message")),
            cssOptOutButton(t("Opt out of Telemetry"), grainjs__WEBPACK_IMPORTED_MODULE_16__.dom.on("click", () => this._optInToTelemetry.set(false)))
          ];
        } else {
          return [
            cssOptInButton(t("Opt in to Telemetry"), grainjs__WEBPACK_IMPORTED_MODULE_16__.dom.on("click", () => this._optInToTelemetry.set(true)))
          ];
        }
      });
    } else {
      return cssOptInOutMessage(value !== "off" ? [t("You have opted in to telemetry. Thank you!"), " \u{1F64F}"] : t("You have opted out of telemetry."), testId("telemetry-section-message"));
    }
  }
  _buildSponsorshipSection() {
    return cssSection(cssSectionTitle(t("Sponsor Grist Labs on GitHub")), cssParagraph(t("Grist software is developed by Grist Labs, which offers free and paid hosted plans. We also make Grist code available under a standard free and open OSS license (Apache 2.0) on {{link}}.", { link: gristCoreLink() })), cssParagraph(t("You can support Grist open-source development by sponsoring us on our {{link}}.", { link: sponsorGristLink() })), cssParagraph(t("We are a small and determined team. Your support matters a lot to us. It also shows to others that there is a determined community behind this product.")), cssSponsorButton(cssButtonIconAndText((0,app_client_ui2018_icons__WEBPACK_IMPORTED_MODULE_11__.icon)("Heart"), cssButtonText(t("Manage Sponsorship"))), { href: app_common_gristUrls__WEBPACK_IMPORTED_MODULE_14__.commonUrls.githubSponsorGristLabs, target: "_blank" }), testId("sponsorship-section"));
  }
}
function telemetryHelpCenterLink() {
  return (0,app_client_ui2018_links__WEBPACK_IMPORTED_MODULE_12__.cssLink)(t("Help Center"), { href: app_common_gristUrls__WEBPACK_IMPORTED_MODULE_14__.commonUrls.helpTelemetryLimited, target: "_blank" });
}
function sponsorGristLink() {
  return (0,app_client_ui2018_links__WEBPACK_IMPORTED_MODULE_12__.cssLink)(t("GitHub Sponsors page"), { href: app_common_gristUrls__WEBPACK_IMPORTED_MODULE_14__.commonUrls.githubSponsorGristLabs, target: "_blank" });
}
function gristCoreLink() {
  return (0,app_client_ui2018_links__WEBPACK_IMPORTED_MODULE_12__.cssLink)(t("GitHub"), { href: app_common_gristUrls__WEBPACK_IMPORTED_MODULE_14__.commonUrls.githubGristCore, target: "_blank" });
}
const cssPageContainer = (0,grainjs__WEBPACK_IMPORTED_MODULE_16__.styled)("div", `
  overflow: auto;
  padding: 64px 80px;

  @media ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_10__.mediaSmall} {
    & {
      padding: 0px;
    }
  }
`);
const cssPage = (0,grainjs__WEBPACK_IMPORTED_MODULE_16__.styled)("div", `
  padding: 16px;
  max-width: 600px;
  width: 100%;
`);
const cssPageTitle = (0,grainjs__WEBPACK_IMPORTED_MODULE_16__.styled)("div", `
  height: 32px;
  line-height: 32px;
  margin-bottom: 24px;
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_10__.theme.text};
  font-size: 24px;
  font-weight: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_10__.vars.headerControlTextWeight};
`);
const cssSectionTitle = (0,grainjs__WEBPACK_IMPORTED_MODULE_16__.styled)("div", `
  height: 24px;
  line-height: 24px;
  margin-bottom: 24px;
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_10__.theme.text};
  font-size: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_10__.vars.xlargeFontSize};
  font-weight: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_10__.vars.headerControlTextWeight};
`);
const cssSection = (0,grainjs__WEBPACK_IMPORTED_MODULE_16__.styled)("div", `
  margin-bottom: 60px;
`);
const cssParagraph = (0,grainjs__WEBPACK_IMPORTED_MODULE_16__.styled)("div", `
  color: ${app_client_ui2018_cssVars__WEBPACK_IMPORTED_MODULE_10__.theme.text};
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 12px;
`);
const cssOptInOutMessage = (0,grainjs__WEBPACK_IMPORTED_MODULE_16__.styled)(cssParagraph, `
  line-height: 40px;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 0px;
`);
const cssOptInButton = (0,grainjs__WEBPACK_IMPORTED_MODULE_16__.styled)(app_client_ui2018_buttons__WEBPACK_IMPORTED_MODULE_9__.bigPrimaryButton, `
  margin-top: 24px;
`);
const cssOptOutButton = (0,grainjs__WEBPACK_IMPORTED_MODULE_16__.styled)(app_client_ui2018_buttons__WEBPACK_IMPORTED_MODULE_9__.bigBasicButton, `
  margin-top: 24px;
`);
const cssSponsorButton = (0,grainjs__WEBPACK_IMPORTED_MODULE_16__.styled)(app_client_ui2018_buttons__WEBPACK_IMPORTED_MODULE_9__.bigBasicButtonLink, `
  margin-top: 24px;
`);
const cssButtonIconAndText = (0,grainjs__WEBPACK_IMPORTED_MODULE_16__.styled)("div", `
  display: flex;
  align-items: center;
`);
const cssButtonText = (0,grainjs__WEBPACK_IMPORTED_MODULE_16__.styled)("span", `
  margin-left: 8px;
`);
const cssSpinnerBox = (0,grainjs__WEBPACK_IMPORTED_MODULE_16__.styled)("div", `
  margin-top: 24px;
  text-align: center;
`);


/***/ }),

/***/ "./stubs/app/client/components/Banners.ts":
/*!************************************************!*\
  !*** ./stubs/app/client/components/Banners.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "buildDocumentBanners": () => (/* binding */ buildDocumentBanners),
/* harmony export */   "buildHomeBanners": () => (/* binding */ buildHomeBanners)
/* harmony export */ });
function buildHomeBanners(_app) {
  return null;
}
function buildDocumentBanners(_docPageModel) {
  return null;
}


/***/ })

}]);
//# sourceMappingURL=app_client_ui_SupportGristPage_ts.bundle.js.map