(self["webpackChunkgristy"] = self["webpackChunkgristy"] || []).push([["app_client_exposeModulesForTests_js"],{

/***/ "./app/client/exposeModulesForTests.js":
/*!*********************************************!*\
  !*** ./app/client/exposeModulesForTests.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Object.assign(window.exposedModules, {
  dom: __webpack_require__(/*! ./lib/dom */ "./app/client/lib/dom.js"),
  grainjs: __webpack_require__(/*! grainjs */ "./node_modules/grainjs/dist/esm/index.js"),
  ko: __webpack_require__(/*! knockout */ "./node_modules/knockout/build/output/knockout-latest.js"),
  moment: __webpack_require__(/*! moment-timezone */ "./node_modules/moment-timezone/index.js"),
  Comm: __webpack_require__(/*! app/client/components/Comm */ "../ext/app/server/lib/CommStub.ts"),
  _loadScript: __webpack_require__(/*! ./lib/loadScript */ "./app/client/lib/loadScript.js"),
  ConnectState: __webpack_require__(/*! ./models/ConnectState */ "./app/client/models/ConnectState.ts")
});


/***/ }),

/***/ "./app/client/lib/loadScript.js":
/*!**************************************!*\
  !*** ./app/client/lib/loadScript.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Promise = __webpack_require__(/*! bluebird */ "./node_modules/bluebird/js/browser/bluebird.js");
const G = (__webpack_require__(/*! ./browserGlobals */ "./app/client/lib/browserGlobals.js").get)("document");
function loadScript(url) {
  return new Promise((resolve, reject) => {
    let script = G.document.createElement("script");
    script.type = "text/javascript";
    script.onload = resolve;
    script.onerror = reject;
    script.src = url;
    G.document.getElementsByTagName("head")[0].appendChild(script);
  });
}
module.exports = loadScript;


/***/ })

}]);
//# sourceMappingURL=app_client_exposeModulesForTests_js.bundle.js.map