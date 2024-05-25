var grist;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 1406:
/***/ (() => {



/***/ }),

/***/ 9872:
/***/ (() => {



/***/ }),

/***/ 5090:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "X": () => (/* binding */ RPC_GRISTAPI_INTERFACE)
/* harmony export */ });
const RPC_GRISTAPI_INTERFACE = "_grist_api";


/***/ }),

/***/ 6263:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "w": () => (/* binding */ GristObjCode)
/* harmony export */ });
var GristObjCode = /* @__PURE__ */ ((GristObjCode2) => {
  GristObjCode2["List"] = "L";
  GristObjCode2["LookUp"] = "l";
  GristObjCode2["Dict"] = "O";
  GristObjCode2["DateTime"] = "D";
  GristObjCode2["Date"] = "d";
  GristObjCode2["Skip"] = "S";
  GristObjCode2["Censored"] = "C";
  GristObjCode2["Reference"] = "R";
  GristObjCode2["ReferenceList"] = "r";
  GristObjCode2["Exception"] = "E";
  GristObjCode2["Pending"] = "P";
  GristObjCode2["Unmarshallable"] = "U";
  GristObjCode2["Versions"] = "V";
  return GristObjCode2;
})(GristObjCode || {});


/***/ }),

/***/ 511:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "E": () => (/* binding */ APIType)
/* harmony export */ });
var APIType = /* @__PURE__ */ ((APIType2) => {
  APIType2[APIType2["ImportSourceAPI"] = 0] = "ImportSourceAPI";
  APIType2[APIType2["ImportProcessorAPI"] = 1] = "ImportProcessorAPI";
  APIType2[APIType2["ParseOptionsAPI"] = 2] = "ParseOptionsAPI";
  APIType2[APIType2["ParseFileAPI"] = 3] = "ParseFileAPI";
  return APIType2;
})(APIType || {});


/***/ }),

/***/ 332:
/***/ (() => {



/***/ }),

/***/ 7907:
/***/ (() => {



/***/ }),

/***/ 128:
/***/ (() => {



/***/ }),

/***/ 2104:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Ld": () => (/* binding */ TableOperationsImpl)
});

// UNUSED EXPORTS: areSameFields, convertToBulkColValues, fieldNames, handleSandboxErrorOnPlatform

;// CONCATENATED MODULE: ./app/plugin/gutil.ts
const constant = __webpack_require__(5703);
const times = __webpack_require__(8913);
function arrayRepeat(count, value) {
  return times(count, constant(value));
}

;// CONCATENATED MODULE: ./app/plugin/TableOperationsImpl.ts
var __defProp = Object.defineProperty;
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

const flatMap = __webpack_require__(4654);
const isEqual = __webpack_require__(8446);
const pick = __webpack_require__(8718);
const groupBy = __webpack_require__(7739);
class TableOperationsImpl {
  constructor(_platform, _defaultOptions) {
    this._platform = _platform;
    this._defaultOptions = _defaultOptions;
  }
  getTableId() {
    return this._platform.getTableId();
  }
  async create(recordsOrRecord, options) {
    return await withRecords(recordsOrRecord, async (records) => {
      const postRecords = convertToBulkColValues(records);
      const ids = await this.addRecords(records.length, postRecords, options);
      return ids.map((id) => ({ id }));
    });
  }
  async update(recordOrRecords, options) {
    await withRecords(recordOrRecords, async (records) => {
      if (!areSameFields(records)) {
        this._platform.throwError("PATCH", "requires all records to have same fields", 400);
      }
      const rowIds = records.map((r) => r.id);
      const columnValues = convertToBulkColValues(records);
      if (!rowIds.length || !columnValues) {
        this._platform.throwError("PATCH", "requires a valid record object", 400);
      }
      await this.updateRecords(columnValues, rowIds, options);
      return [];
    });
  }
  async upsert(recordOrRecords, upsertOptions) {
    await withRecords(recordOrRecords, async (records) => {
      const tableId = await this._platform.getTableId();
      const options = {
        add: upsertOptions == null ? void 0 : upsertOptions.add,
        update: upsertOptions == null ? void 0 : upsertOptions.update,
        on_many: upsertOptions == null ? void 0 : upsertOptions.onMany,
        allow_empty_require: upsertOptions == null ? void 0 : upsertOptions.allowEmptyRequire
      };
      const recordOptions = pick(upsertOptions, "parseStrings");
      const recGroups = groupBy(records, (rec) => {
        const requireKeys = Object.keys(rec.require).sort().join(",");
        const fieldsKeys = Object.keys(rec.fields || {}).sort().join(",");
        return `${requireKeys}:${fieldsKeys}`;
      });
      const actions = Object.values(recGroups).map((group) => {
        const require2 = convertToBulkColValues(group.map((r) => ({ fields: r.require })));
        const fields = convertToBulkColValues(group.map((r) => ({ fields: r.fields || {} })));
        return ["BulkAddOrUpdateRecord", tableId, require2, fields, options];
      });
      await this._applyUserActions(tableId, [...fieldNames(records)], actions, recordOptions);
      return [];
    });
  }
  async destroy(recordIdOrRecordIds) {
    await withRecords(recordIdOrRecordIds, async (recordIds) => {
      const tableId = await this._platform.getTableId();
      const actions = [["BulkRemoveRecord", tableId, recordIds]];
      await this._applyUserActions(tableId, [], actions);
      return [];
    });
  }
  async updateRecords(columnValues, rowIds, options) {
    await this._addOrUpdateRecords(columnValues, rowIds, "BulkUpdateRecord", options);
  }
  async addRecords(count, columnValues, options) {
    const rowIds = arrayRepeat(count, null);
    return this._addOrUpdateRecords(columnValues, rowIds, "BulkAddRecord", options);
  }
  async _addOrUpdateRecords(columnValues, rowIds, actionType, options) {
    const tableId = await this._platform.getTableId();
    const colNames = Object.keys(columnValues);
    const sandboxRes = await this._applyUserActions(tableId, colNames, [[actionType, tableId, rowIds, columnValues]], options);
    return sandboxRes.retValues[0];
  }
  async _applyUserActions(tableId, colNames, actions, options = {}) {
    return handleSandboxErrorOnPlatform(tableId, colNames, this._platform.applyUserActions(actions, __spreadValues(__spreadValues({}, this._defaultOptions), options)), this._platform);
  }
}
function convertToBulkColValues(records) {
  const result = {};
  for (const fieldName of fieldNames(records)) {
    result[fieldName] = records.map((record) => {
      var _a, _b;
      return (_b = (_a = record.fields) == null ? void 0 : _a[fieldName]) != null ? _b : null;
    });
  }
  return result;
}
function fieldNames(records) {
  return new Set(flatMap(records, (r) => Object.keys(__spreadValues(__spreadValues({}, r.fields), r.require))));
}
function areSameFields(records) {
  const recordsFields = records.map((r) => new Set(Object.keys(r.fields || {})));
  return recordsFields.every((s) => isEqual(recordsFields[0], s));
}
async function withRecords(recordsOrRecord, op) {
  const records = Array.isArray(recordsOrRecord) ? recordsOrRecord : [recordsOrRecord];
  const result = records.length == 0 ? [] : await op(records);
  return Array.isArray(recordsOrRecord) ? result : result[0];
}
async function handleSandboxErrorOnPlatform(tableId, colNames, p, platform) {
  var _a;
  try {
    return await p;
  } catch (err) {
    const message = err instanceof Error && ((_a = err.message) == null ? void 0 : _a.startsWith("[Sandbox] ")) ? err.message : void 0;
    if (message) {
      let match = message.match(/non-existent record #([0-9]+)/);
      if (match) {
        platform.throwError("", `Invalid row id ${match[1]}`, 400);
      }
      match = message.match(/\[Sandbox] (?:KeyError u?'(?:Table \w+ has no column )?|ValueError No such table: |ValueError No such column: )([\w.]+)/);
      if (match) {
        if (match[1] === tableId) {
          platform.throwError("", `Table not found "${tableId}"`, 404);
        } else if (colNames.includes(match[1])) {
          platform.throwError("", `Invalid column "${match[1]}"`, 400);
        } else if (colNames.includes(match[1].replace(`${tableId}.`, ""))) {
          platform.throwError("", `Table or column not found "${match[1]}"`, 404);
        }
      }
      platform.throwError("", `Error manipulating data: ${message}`, 400);
    }
    throw err;
  }
}


/***/ }),

/***/ 8975:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "wv": () => (/* reexport */ CustomSectionAPI_ti),
  "t4": () => (/* reexport */ FileParserAPI_ti),
  "Dv": () => (/* reexport */ GristAPI_ti),
  "PY": () => (/* reexport */ GristTable_ti),
  "Lj": () => (/* reexport */ ImportSourceAPI_ti),
  "tX": () => (/* reexport */ InternalImportSourceAPI_ti),
  "yM": () => (/* reexport */ RenderOptions_ti),
  "jC": () => (/* reexport */ StorageAPI_ti),
  "$H": () => (/* reexport */ WidgetAPI_ti),
  "C4": () => (/* binding */ checkers)
});

// EXTERNAL MODULE: ./node_modules/ts-interface-checker/dist/index.js
var dist = __webpack_require__(1074);
;// CONCATENATED MODULE: ./app/plugin/CustomSectionAPI-ti.ts

const ColumnToMap = dist.iface([], {
  "name": "string",
  "title": dist.opt(dist.union("string", "null")),
  "description": dist.opt(dist.union("string", "null")),
  "type": dist.opt("string"),
  "optional": dist.opt("boolean"),
  "allowMultiple": dist.opt("boolean")
});
const ColumnsToMap = dist.array(dist.union("string", "ColumnToMap"));
const InteractionOptionsRequest = dist.iface([], {
  "requiredAccess": dist.opt("string"),
  "hasCustomOptions": dist.opt("boolean"),
  "columns": dist.opt("ColumnsToMap"),
  "allowSelectBy": dist.opt("boolean")
});
const InteractionOptions = dist.iface([], {
  "accessLevel": "string"
});
const WidgetColumnMap = dist.iface([], {
  [dist.indexKey]: dist.union("string", dist.array("string"), "null")
});
const CustomSectionAPI = dist.iface([], {
  "configure": dist.func("void", dist.param("customOptions", "InteractionOptionsRequest")),
  "mappings": dist.func(dist.union("WidgetColumnMap", "null"))
});
const exportedTypeSuite = {
  ColumnToMap,
  ColumnsToMap,
  InteractionOptionsRequest,
  InteractionOptions,
  WidgetColumnMap,
  CustomSectionAPI
};
/* harmony default export */ const CustomSectionAPI_ti = (exportedTypeSuite);

;// CONCATENATED MODULE: ./app/plugin/FileParserAPI-ti.ts

const EditOptionsAPI = dist.iface([], {
  "getParseOptions": dist.func("ParseOptions", dist.param("parseOptions", "ParseOptions", true))
});
const ParseFileAPI = dist.iface([], {
  "parseFile": dist.func("ParseFileResult", dist.param("file", "FileSource"), dist.param("parseOptions", "ParseOptions", true))
});
const ParseOptions = dist.iface([], {
  "NUM_ROWS": dist.opt("number"),
  "SCHEMA": dist.opt(dist.array("ParseOptionSchema")),
  "WARNING": dist.opt("string")
});
const ParseOptionSchema = dist.iface([], {
  "name": "string",
  "label": "string",
  "type": "string",
  "visible": "boolean"
});
const FileSource = dist.iface([], {
  "path": "string",
  "origName": "string"
});
const ParseFileResult = dist.iface(["GristTables"], {
  "parseOptions": "ParseOptions"
});
const FileParserAPI_ti_exportedTypeSuite = {
  EditOptionsAPI,
  ParseFileAPI,
  ParseOptions,
  ParseOptionSchema,
  FileSource,
  ParseFileResult
};
/* harmony default export */ const FileParserAPI_ti = (FileParserAPI_ti_exportedTypeSuite);

;// CONCATENATED MODULE: ./app/plugin/GristAPI-ti.ts

const UIRowId = dist.union("number", dist.lit("new"));
const CursorPos = dist.iface([], {
  "rowId": dist.opt("UIRowId"),
  "rowIndex": dist.opt("number"),
  "fieldIndex": dist.opt("number"),
  "sectionId": dist.opt("number")
});
const ComponentKind = dist.union(dist.lit("safeBrowser"), dist.lit("safePython"), dist.lit("unsafeNode"));
const GristAPI = dist.iface([], {
  "render": dist.func("number", dist.param("path", "string"), dist.param("target", "RenderTarget"), dist.param("options", "RenderOptions", true)),
  "dispose": dist.func("void", dist.param("procId", "number")),
  "subscribe": dist.func("void", dist.param("tableId", "string")),
  "unsubscribe": dist.func("void", dist.param("tableId", "string"))
});
const GristDocAPI = dist.iface([], {
  "getDocName": dist.func("string"),
  "listTables": dist.func(dist.array("string")),
  "fetchTable": dist.func("any", dist.param("tableId", "string")),
  "applyUserActions": dist.func("any", dist.param("actions", dist.array(dist.array("any"))), dist.param("options", "any", true)),
  "getAccessToken": dist.func("AccessTokenResult", dist.param("options", "AccessTokenOptions"))
});
const GristView = dist.iface([], {
  "fetchSelectedTable": dist.func("any"),
  "fetchSelectedRecord": dist.func("any", dist.param("rowId", "number")),
  "allowSelectBy": dist.func("void"),
  "setSelectedRows": dist.func("void", dist.param("rowIds", dist.union(dist.array("number"), "null"))),
  "setCursorPos": dist.func("void", dist.param("pos", "CursorPos"))
});
const AccessTokenOptions = dist.iface([], {
  "readOnly": dist.opt("boolean")
});
const AccessTokenResult = dist.iface([], {
  "token": "string",
  "baseUrl": "string",
  "ttlMsecs": "number"
});
const GristAPI_ti_exportedTypeSuite = {
  UIRowId,
  CursorPos,
  ComponentKind,
  GristAPI,
  GristDocAPI,
  GristView,
  AccessTokenOptions,
  AccessTokenResult
};
/* harmony default export */ const GristAPI_ti = (GristAPI_ti_exportedTypeSuite);

;// CONCATENATED MODULE: ./app/plugin/GristTable-ti.ts

const GristTable = dist.iface([], {
  "table_name": dist.union("string", "null"),
  "column_metadata": dist.array("GristColumn"),
  "table_data": dist.array(dist.array("any"))
});
const GristTables = dist.iface([], {
  "tables": dist.array("GristTable")
});
const GristColumn = dist.iface([], {
  "id": "string",
  "type": "string"
});
const APIType = dist.enumtype({
  "ImportSourceAPI": 0,
  "ImportProcessorAPI": 1,
  "ParseOptionsAPI": 2,
  "ParseFileAPI": 3
});
const GristTable_ti_exportedTypeSuite = {
  GristTable,
  GristTables,
  GristColumn,
  APIType
};
/* harmony default export */ const GristTable_ti = (GristTable_ti_exportedTypeSuite);

;// CONCATENATED MODULE: ./app/plugin/ImportSourceAPI-ti.ts

const ImportSourceAPI = dist.iface([], {
  "getImportSource": dist.func(dist.union("ImportSource", "undefined"))
});
const ImportProcessorAPI = dist.iface([], {
  "processImport": dist.func(dist.array("GristTable"), dist.param("source", "ImportSource"))
});
const FileContent = dist.iface([], {
  "content": "any",
  "name": "string"
});
const FileListItem = dist.iface([], {
  "kind": dist.lit("fileList"),
  "files": dist.array("FileContent")
});
const URL = dist.iface([], {
  "kind": dist.lit("url"),
  "url": "string"
});
const ImportSource = dist.iface([], {
  "item": dist.union("FileListItem", "URL"),
  "options": dist.opt(dist.union("string", "Buffer")),
  "description": dist.opt("string")
});
const ImportSourceAPI_ti_exportedTypeSuite = {
  ImportSourceAPI,
  ImportProcessorAPI,
  FileContent,
  FileListItem,
  URL,
  ImportSource
};
/* harmony default export */ const ImportSourceAPI_ti = (ImportSourceAPI_ti_exportedTypeSuite);

;// CONCATENATED MODULE: ./app/plugin/InternalImportSourceAPI-ti.ts

const InternalImportSourceAPI = dist.iface([], {
  "getImportSource": dist.func(dist.union("ImportSource", "undefined"), dist.param("inlineTarget", "RenderTarget"))
});
const InternalImportSourceAPI_ti_exportedTypeSuite = {
  InternalImportSourceAPI
};
/* harmony default export */ const InternalImportSourceAPI_ti = (InternalImportSourceAPI_ti_exportedTypeSuite);

;// CONCATENATED MODULE: ./app/plugin/RenderOptions-ti.ts

const RenderTarget = dist.union(dist.lit("fullscreen"), "number");
const RenderOptions = dist.iface([], {
  "height": dist.opt("string")
});
const RenderOptions_ti_exportedTypeSuite = {
  RenderTarget,
  RenderOptions
};
/* harmony default export */ const RenderOptions_ti = (RenderOptions_ti_exportedTypeSuite);

;// CONCATENATED MODULE: ./app/plugin/StorageAPI-ti.ts

const Storage = dist.iface([], {
  "getItem": dist.func("any", dist.param("key", "string")),
  "hasItem": dist.func("boolean", dist.param("key", "string")),
  "setItem": dist.func("void", dist.param("key", "string"), dist.param("value", "any")),
  "removeItem": dist.func("void", dist.param("key", "string")),
  "clear": dist.func("void")
});
const StorageAPI_ti_exportedTypeSuite = {
  Storage
};
/* harmony default export */ const StorageAPI_ti = (StorageAPI_ti_exportedTypeSuite);

;// CONCATENATED MODULE: ./app/plugin/WidgetAPI-ti.ts

const WidgetAPI = dist.iface([], {
  "getOptions": dist.func(dist.union("object", "null")),
  "setOptions": dist.func("void", dist.param("options", dist.iface([], {
    [dist.indexKey]: "any"
  }))),
  "clearOptions": dist.func("void"),
  "setOption": dist.func("void", dist.param("key", "string"), dist.param("value", "any")),
  "getOption": dist.func("any", dist.param("key", "string"))
});
const WidgetAPI_ti_exportedTypeSuite = {
  WidgetAPI
};
/* harmony default export */ const WidgetAPI_ti = (WidgetAPI_ti_exportedTypeSuite);

;// CONCATENATED MODULE: ./app/plugin/TypeCheckers.ts











const allTypes = [
  CustomSectionAPI_ti,
  FileParserAPI_ti,
  GristAPI_ti,
  GristTable_ti,
  ImportSourceAPI_ti,
  InternalImportSourceAPI_ti,
  RenderOptions_ti,
  StorageAPI_ti,
  WidgetAPI_ti
];
if (typeof Buffer === "undefined") {
  allTypes.push({ Buffer: new dist.BasicType((v) => false, "Buffer is not supported") });
}
function checkDuplicates(types) {
  const seen = /* @__PURE__ */ new Set();
  for (const t of types) {
    for (const key of Object.keys(t)) {
      if (seen.has(key)) {
        throw new Error(`TypeCheckers: Duplicate type name ${key}`);
      }
      seen.add(key);
    }
  }
}
checkDuplicates(allTypes);
const checkers = (0,dist.createCheckers)(...allTypes);


/***/ }),

/***/ 8980:
/***/ (() => {



/***/ }),

/***/ 3965:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Q8": () => (/* binding */ mapValues),
/* harmony export */   "xD": () => (/* binding */ decodeObject)
/* harmony export */ });
/* unused harmony exports PENDING_DATA_PLACEHOLDER, GristDate, GristDateTime, Reference, ReferenceList, RaisedException, UnknownValue, PendingValue, SkipValue, CensoredValue, encodeObject */
/* harmony import */ var _GristData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6263);

const isPlainObject = __webpack_require__(8630);
const PENDING_DATA_PLACEHOLDER = "Loading...";
class GristDate extends Date {
  static fromGristValue(epochSec) {
    return new GristDate(epochSec * 1e3);
  }
  toString() {
    return this.toISOString().slice(0, 10);
  }
}
class GristDateTime extends Date {
  static fromGristValue(epochSec, timezone) {
    return Object.assign(new GristDateTime(epochSec * 1e3), { timezone });
  }
  toString() {
    return this.toISOString();
  }
}
class Reference {
  constructor(tableId, rowId) {
    this.tableId = tableId;
    this.rowId = rowId;
  }
  toString() {
    return `${this.tableId}[${this.rowId}]`;
  }
}
class ReferenceList {
  constructor(tableId, rowIds) {
    this.tableId = tableId;
    this.rowIds = rowIds;
  }
  toString() {
    return `${this.tableId}[[${this.rowIds}]]`;
  }
}
class RaisedException {
  constructor(list) {
    var _a;
    if (!list.length) {
      throw new Error("RaisedException requires a name as first element");
    }
    list = [...list];
    this.name = list.shift();
    this.message = list.shift();
    this.details = list.shift();
    this.user_input = (_a = list.shift()) == null ? void 0 : _a.u;
  }
  toString() {
    switch (this.name) {
      case "ZeroDivisionError":
        return "#DIV/0!";
      case "UnmarshallableError":
        return this.details || "#" + this.name;
      case "InvalidTypedValue":
        return `#Invalid ${this.message}: ${this.details}`;
    }
    return "#" + this.name;
  }
}
class UnknownValue {
  constructor(value) {
    this.value = value;
  }
  static safeRepr(value) {
    try {
      return String(value);
    } catch (e) {
      return `<${typeof value}>`;
    }
  }
  toString() {
    return String(this.value);
  }
}
class PendingValue {
  toString() {
    return PENDING_DATA_PLACEHOLDER;
  }
}
class SkipValue {
  toString() {
    return "...";
  }
}
class CensoredValue {
  toString() {
    return "CENSORED";
  }
}
function encodeObject(value) {
  try {
    switch (typeof value) {
      case "string":
      case "number":
      case "boolean":
        return value;
    }
    if (value == null) {
      return null;
    } else if (value instanceof Reference) {
      return [GristObjCode.Reference, value.tableId, value.rowId];
    } else if (value instanceof ReferenceList) {
      return [GristObjCode.ReferenceList, value.tableId, value.rowIds];
    } else if (value instanceof Date) {
      const timestamp = value.valueOf() / 1e3;
      if ("timezone" in value) {
        return [GristObjCode.DateTime, timestamp, value.timezone];
      } else {
        return [GristObjCode.DateTime, timestamp, "UTC"];
      }
    } else if (value instanceof CensoredValue) {
      return [GristObjCode.Censored];
    } else if (value instanceof RaisedException) {
      return [GristObjCode.Exception, value.name, value.message, value.details];
    } else if (Array.isArray(value)) {
      return [GristObjCode.List, ...value.map(encodeObject)];
    } else if (isPlainObject(value)) {
      return [GristObjCode.Dict, mapValues(value, encodeObject, { sort: true })];
    }
  } catch (e) {
  }
  return [GristObjCode.Unmarshallable, UnknownValue.safeRepr(value)];
}
function decodeObject(value) {
  if (!Array.isArray(value)) {
    return value;
  }
  const code = value[0];
  const args = value.slice(1);
  let err;
  try {
    switch (code) {
      case "D":
        return GristDateTime.fromGristValue(args[0], String(args[1]));
      case "d":
        return GristDate.fromGristValue(args[0]);
      case "E":
        return new RaisedException(args);
      case "L":
        return args.map(decodeObject);
      case "O":
        return mapValues(args[0], decodeObject, { sort: true });
      case "P":
        return new PendingValue();
      case "r":
        return new ReferenceList(String(args[0]), args[1]);
      case "R":
        return new Reference(String(args[0]), args[1]);
      case "S":
        return new SkipValue();
      case "C":
        return new CensoredValue();
      case "U":
        return new UnknownValue(args[0]);
    }
  } catch (e) {
    err = e;
  }
  return new UnknownValue(`${code}(${JSON.stringify(args).slice(1, -1)})` + (err ? `#${err.name}(${err.message})` : ""));
}
function mapValues(sourceObj, mapper, options = {}) {
  const result = {};
  const keys = Object.keys(sourceObj);
  if (options.sort) {
    keys.sort();
  }
  for (const key of keys) {
    result[key] = mapper(sourceObj[key]);
  }
  return result;
}


/***/ }),

/***/ 7187:
/***/ ((module) => {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),

/***/ 5217:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", ({ value: true }));
__export(__webpack_require__(5408));
__export(__webpack_require__(7219));


/***/ }),

/***/ 5408:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/**
 * This defines the message types sent over an RpcChannel.
 *
 * WARNING: Any changes to these must be backward-compatible, since Rpc may be used across
 * different versions of this library. Specifically, enums must not be renumbered, fields renamed,
 * or their types changed. Really, the only reasonable enhancement is adding a new optional field.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var MsgType;
(function (MsgType) {
    // Warning: Do NOT renumber enums (see warning above).
    MsgType[MsgType["RpcCall"] = 1] = "RpcCall";
    MsgType[MsgType["RpcRespData"] = 2] = "RpcRespData";
    MsgType[MsgType["RpcRespErr"] = 3] = "RpcRespErr";
    MsgType[MsgType["Custom"] = 4] = "Custom";
    MsgType[MsgType["Ready"] = 5] = "Ready";
})(MsgType = exports.MsgType || (exports.MsgType = {}));


/***/ }),

/***/ 7219:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Rpc implements an remote-procedure-call interface on top of a simple messaging interface.
 *
 * The user must provide the messaging between two endpoints, and in return gets the ability to
 * register interfaces or functions at either endpoint, and call them from the other side. For
 * messaging, the user must supply a sendMessage() function to send messages to the other side,
 * and must call rpc.receiveMessage(msg) whenever a message is received.
 *
 * E.g.
 *    rpc.registerImpl<MyInterface>("some-name", new MyInterfaceImpl(), descMyInterfaceImpl);
 *    rpc.getStub<MyInterface>("some-name", descMyInterfaceImpl)
 *          => returns a stub implemeting MyInterface
 *
 * Calls to the generated stub get turned into messages across the channel, and then call to the
 * implementation object registered on the other side. Both return values and exceptions get
 * passed back over the channel, and cause the promise from the stub to be resolved or rejected.
 *
 * Note that the stub interface returns Promises for all methods.
 *
 * Rpc library supports ts-interface-checker descriptors for the interfaces, to allow validation.
 * You may skip it by passing in `rpc.unchecked` where a descriptor is expected; it will skip
 * checks and you will not get descriptive errors.
 *
 * The string name used to register and use an implementation allows for the same Rpc object to be
 * used to expose multiple interfaces, or different implementations of the same interface.
 *
 * Messaging
 * ---------
 * Rpc also supports a messaging interface, with postMessage() to send arbitrary messages, and an
 * EventEmitter interface for "message" events to receive them, e.g. on("message", ...). So if you
 * need to multiplex non-Rpc messages over the same channel, Rpc class does it for you.
 *
 * Cleanup
 * -------
 * If the channel is closed or had an error, and will no longer be used, the user of Rpc must
 * call rpc.close() to reject any calls waiting for an answer.
 *
 * If a particular stub for a remote API is no longer needed, user may call rpc.discardStub(stub)
 * to reject any pending calls made to that stub.
 *
 * Timeouts
 * --------
 * TODO (Not yet implementd.)
 * You may call rpc.setTimeout(ms) or rpc.setStubTimeout(stub, ms) to set a call timeout for all
 * stubs or for a particular one. If a response to a call does not arrive within the timeout, the
 * call gets rejected, and the rejection Error will have a "code" property set to "TIMEOUT".
 *
 * Forwarding
 * ----------
 * Rpc.registerForwarder() along with methods with "-Forward" suffix allow one Rpc object to forward
 * calls and messages to another Rpc object. The intended usage is when Rpc connects A to B, and B
 * to C. Then B can use registerForwarder to expose A's interfaces to C (or C's to A) without having
 * to know what exactly they are. A default forwarder can be registered using the '*' name.
 *
 *
 * Instead of using getStubForward and callRemoteFuncForward, the forwarder name can be
 * appended to the interface name as "interfaceName@forwarderName" and the regular
 * getStub and callRemoteFunc methods can be used.  For example:
 *   getStub("iface@forwarder")
 * is the same as:
 *   getStubForward("forwarder", "iface")
 *
 *
 * E.g. with A.registerImpl("A-name", ...) and B.registerForwarder("b2a", A), we may now call
 * C.getStubForward("b2a", "A-name") to get a stub that will forward calls to A, as well as
 * C.postMessageForward("b2a", msg) to have the message received by A.
 *
 * TODO We may want to support progress callbacks, perhaps by supporting arbitrary callbacks as
 * parameters. (Could be implemented by allowing "meth" to be [reqId, paramPath]) It would be nice
 * to allow the channel to report progress too, e.g. to report progress of uploading large files.
 *
 * TODO Sending of large files should probably be a separate feature, to allow for channel
 * implementations to stream them.
 */
const events_1 = __webpack_require__(7187);
const tic = __webpack_require__(1074);
const message_1 = __webpack_require__(5408);
const plainCall = (callFunc) => callFunc();
class Rpc extends events_1.EventEmitter {
    /**
     * To use Rpc, you must provide a sendMessage function that sends a message to the other side;
     * it may be given in the constructor, or later with setSendMessage. You must also call
     * receiveMessage() for every message received from the other side.
     */
    constructor(options = {}) {
        super();
        // Note the invariant: _inactiveSendQueue == null iff (_sendMessageCB != null && !_waitForReadyMessage)
        this._sendMessageCB = null;
        this._inactiveRecvQueue = null; // queue of received message
        this._inactiveSendQueue = null; // queue of messages to be sent
        this._waitForReadyMessage = false;
        this._implMap = new Map();
        this._forwarders = new Map();
        this._pendingCalls = new Map();
        this._nextRequestId = 1;
        const { logger = console, sendMessage = null, callWrapper = plainCall } = options;
        this._logger = logger;
        this._callWrapper = callWrapper;
        this.setSendMessage(sendMessage);
    }
    /**
     * To use Rpc, call this for every message received from the other side of the channel.
     */
    receiveMessage(msg) {
        if (this._inactiveRecvQueue) {
            this._inactiveRecvQueue.push(msg);
        }
        else {
            this._dispatch(msg);
        }
    }
    /**
     * If you've set up calls to receiveMessage(), but need time to call registerImpl() before
     * processing new messages, you may use queueIncoming(), make the registerImpl() calls,
     * and then call processIncoming() to handle queued messages and resume normal processing.
     */
    queueIncoming() {
        if (!this._inactiveRecvQueue) {
            this._inactiveRecvQueue = [];
        }
    }
    /**
     * Process received messages queued since queueIncoming, and resume normal processing of
     * received messages.
     */
    processIncoming() {
        if (this._inactiveRecvQueue) {
            processQueue(this._inactiveRecvQueue, this._dispatch.bind(this));
            this._inactiveRecvQueue = null;
        }
    }
    /**
     * Set the callback to send messages. If set to null, sent messages will be queued. If you
     * disconnect and want for sent messages to throw, set a callback that throws.
     */
    setSendMessage(sendMessage) {
        this._sendMessageCB = sendMessage;
        if (this._sendMessageCB) {
            this._processOutgoing();
        }
        else {
            this._queueOutgoing();
        }
    }
    /**
     * If your peer may not be listening yet to your messages, you may call this to queue outgoing
     * messages until receiving a "ready" message from the peer. I.e. one peer may call
     * queueOutgoingUntilReadyMessage() while the other calls sendReadyMessage().
     */
    queueOutgoingUntilReadyMessage() {
        this._waitForReadyMessage = true;
        this._queueOutgoing();
    }
    /**
     * If your peer is using queueOutgoingUntilReadyMessage(), you should let it know that you are
     * ready using sendReadyMessage() as soon as you've set up the processing of received messages.
     * Note that at most one peer may use queueOutgoingUntilReadyMessage(), or they will deadlock.
     */
    sendReadyMessage() {
        return this._sendMessage({ mtype: message_1.MsgType.Ready });
    }
    /**
     * Messaging interface: send data to the other side, to be emitted there as a "message" event.
     */
    postMessage(data) { return this.postMessageForward("", data); }
    postMessageForward(fwdDest, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = { mtype: message_1.MsgType.Custom, data };
            if (fwdDest) {
                msg.mdest = fwdDest;
            }
            yield this._sendMessage(msg);
        });
    }
    registerImpl(name, impl, checker) {
        if (this._implMap.has(name)) {
            throw new Error(`Rpc.registerImpl has already been called for ${name}`);
        }
        const invokeImpl = (call) => impl[call.meth](...call.args);
        if (!checker) {
            this._implMap.set(name, { name, invokeImpl, argsCheckers: null });
        }
        else {
            const ttype = checker.getType();
            if (!(ttype instanceof tic.TIface)) {
                throw new Error("Rpc.registerImpl requires a Checker for an interface");
            }
            const argsCheckers = {};
            for (const prop of ttype.props) {
                if (prop.ttype instanceof tic.TFunc) {
                    argsCheckers[prop.name] = checker.methodArgs(prop.name);
                }
            }
            this._implMap.set(name, { name, invokeImpl, argsCheckers });
        }
    }
    registerForwarder(fwdName, dest, fwdDest = (fwdName === "*" ? "*" : "")) {
        const passThru = fwdDest === "*";
        this._forwarders.set(fwdName, {
            name: "[FWD]" + fwdName,
            argsCheckers: null,
            invokeImpl: (c) => dest.forwardCall(Object.assign({}, c, { mdest: passThru ? c.mdest : fwdDest })),
            forwardMessage: (msg) => dest.forwardMessage(Object.assign({}, msg, { mdest: passThru ? msg.mdest : fwdDest })),
        });
    }
    unregisterForwarder(fwdName) {
        this._forwarders.delete(fwdName);
    }
    /**
     * Unregister an implementation, if one was registered with this name.
     */
    unregisterImpl(name) {
        this._implMap.delete(name);
    }
    getStub(name, checker) {
        const parts = this._parseName(name);
        return this.getStubForward(parts.forwarder, parts.name, checker);
    }
    getStubForward(fwdDest, name, checker) {
        if (!checker) {
            // TODO Test, then explain how this works.
            return new Proxy({}, {
                get: (target, property, receiver) => {
                    if (property === "then") {
                        // By default, take care not to look "thenable", so that the stub can be returned
                        // as a value of a Promise:
                        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve
                        // If user really wants to proxy "then", they can write a checker.
                        return undefined;
                    }
                    return (...args) => this._makeCall(name, property, args, anyChecker, fwdDest);
                },
            });
        }
        else {
            const ttype = checker.getType();
            if (!(ttype instanceof tic.TIface)) {
                throw new Error("Rpc.getStub requires a Checker for an interface");
            }
            const api = {};
            for (const prop of ttype.props) {
                if (prop.ttype instanceof tic.TFunc) {
                    const resultChecker = checker.methodResult(prop.name);
                    api[prop.name] = (...args) => this._makeCall(name, prop.name, args, resultChecker, fwdDest);
                }
            }
            return api;
        }
    }
    /**
     * Simple way to registers a function under a given name, with no argument checking.
     */
    registerFunc(name, impl) {
        return this.registerImpl(name, { invoke: impl }, checkerAnyFunc);
    }
    /**
     * Unregister a function, if one was registered with this name.
     */
    unregisterFunc(name) {
        return this.unregisterImpl(name);
    }
    /**
     * Call a remote function registered with registerFunc. Does no type checking.
     */
    callRemoteFunc(name, ...args) {
        const parts = this._parseName(name);
        return this.callRemoteFuncForward(parts.forwarder, parts.name, ...args);
    }
    callRemoteFuncForward(fwdDest, name, ...args) {
        return this._makeCall(name, "invoke", args, anyChecker, fwdDest);
    }
    forwardCall(c) {
        return this._makeCall(c.iface, c.meth, c.args, anyChecker, c.mdest || "");
    }
    forwardMessage(msg) {
        return this.postMessageForward(msg.mdest || "", msg.data);
    }
    // Mark outgoing messages for queueing.
    _queueOutgoing() {
        if (!this._inactiveSendQueue) {
            this._inactiveSendQueue = [];
        }
    }
    // If sendMessageCB is set and we are no longer waiting for a ready message, send out any
    // queued outgoing messages and resume normal sending.
    _processOutgoing() {
        if (this._inactiveSendQueue && this._sendMessageCB && !this._waitForReadyMessage) {
            processQueue(this._inactiveSendQueue, this._sendMessageOrReject.bind(this, this._sendMessageCB));
            this._inactiveSendQueue = null;
        }
    }
    _sendMessage(msg) {
        if (this._inactiveSendQueue) {
            this._inactiveSendQueue.push(msg);
        }
        else {
            return this._sendMessageOrReject(this._sendMessageCB, msg);
        }
    }
    // This helper calls calls sendMessage(msg), and if that call fails, rejects the call
    // represented by msg (when it's of type RpcCall).
    _sendMessageOrReject(sendMessage, msg) {
        if (this._logger.info) {
            const desc = (msg.mtype === message_1.MsgType.RpcCall) ? ": " + this._callDesc(msg) : "";
            this._logger.info(`Rpc sending ${message_1.MsgType[msg.mtype]}${desc}`);
        }
        return catchMaybePromise(() => sendMessage(msg), (err) => this._sendReject(msg, err));
    }
    // Rejects a RpcCall due to the given send error; this helper always re-throws.
    _sendReject(msg, err) {
        const newErr = new ErrorWithCode("RPC_SEND_FAILED", `Send failed: ${err.message}`);
        if (msg.mtype === message_1.MsgType.RpcCall && msg.reqId !== undefined) {
            const callObj = this._pendingCalls.get(msg.reqId);
            if (callObj) {
                this._pendingCalls.delete(msg.reqId);
                callObj.reject(newErr);
            }
        }
        this.emit("error", newErr);
        throw newErr;
    }
    _makeCallRaw(iface, meth, args, resultChecker, fwdDest) {
        return new Promise((resolve, reject) => {
            const reqId = this._nextRequestId++;
            const callObj = { reqId, iface, meth, resolve, reject, resultChecker };
            this._pendingCalls.set(reqId, callObj);
            // Send the Call message. If the sending fails, reject the _makeCall promise. If it
            // succeeds, we save {resolve,reject} to resolve _makeCall when we get back a response.
            this._info(callObj, "RPC_CALLING");
            const msg = { mtype: message_1.MsgType.RpcCall, reqId, iface, meth, args };
            if (fwdDest) {
                msg.mdest = fwdDest;
            }
            // If _sendMessage fails, reject, allowing it to throw synchronously or not.
            catchMaybePromise(() => this._sendMessage(msg), reject);
        });
    }
    _makeCall(iface, meth, args, resultChecker, fwdDest) {
        return this._callWrapper(() => this._makeCallRaw(iface, meth, args, resultChecker, fwdDest));
    }
    _dispatch(msg) {
        switch (msg.mtype) {
            case message_1.MsgType.RpcCall: {
                this._onMessageCall(msg);
                return;
            }
            case message_1.MsgType.RpcRespData:
            case message_1.MsgType.RpcRespErr: {
                this._onMessageResp(msg);
                return;
            }
            case message_1.MsgType.Custom: {
                this._onCustomMessage(msg);
                return;
            }
            case message_1.MsgType.Ready: {
                this._waitForReadyMessage = false;
                try {
                    this._processOutgoing();
                }
                catch (e) { /* swallowing error, an event 'error' was already emitted */ }
                return;
            }
        }
    }
    _onCustomMessage(msg) {
        if (msg.mdest) {
            const impl = this._forwarders.get(msg.mdest) || this._forwarders.get("*");
            if (!impl) {
                this._warn(null, "RPC_UNKNOWN_FORWARD_DEST", `Unknown forward destination: ${msg.mdest}`);
            }
            else {
                impl.forwardMessage(msg);
            }
        }
        else {
            this.emit("message", msg.data);
        }
    }
    _onMessageCall(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let impl;
            if (call.mdest) {
                impl = this._forwarders.get(call.mdest) || this._forwarders.get("*");
                if (!impl) {
                    return this._failCall(call, "RPC_UNKNOWN_FORWARD_DEST", `Unknown forward destination: ${call.mdest}`);
                }
            }
            else {
                impl = this._implMap.get(call.iface);
                if (!impl) {
                    return this._failCall(call, "RPC_UNKNOWN_INTERFACE", "Unknown interface");
                }
            }
            if (!impl.argsCheckers) {
                // No call or argument checking.
            }
            else {
                // Check the method name and argument types.
                if (!impl.argsCheckers.hasOwnProperty(call.meth)) {
                    return this._failCall(call, "RPC_UNKNOWN_METHOD", "Unknown method");
                }
                const argsChecker = impl.argsCheckers[call.meth];
                try {
                    argsChecker.check(call.args);
                }
                catch (e) {
                    return this._failCall(call, "RPC_INVALID_ARGS", `Invalid args: ${e.message}`);
                }
            }
            if (call.reqId === undefined) {
                return this._failCall(call, "RPC_MISSING_REQID", "Missing request id");
            }
            this._info(call, "RPC_ONCALL");
            let result;
            try {
                result = yield impl.invokeImpl(call);
            }
            catch (e) {
                return this._failCall(call, e.code, e.message, "RPC_ONCALL_ERROR");
            }
            this._info(call, "RPC_ONCALL_OK");
            return this._sendResponse(call.reqId, result);
        });
    }
    _failCall(call, code, mesg, reportCode) {
        return __awaiter(this, void 0, void 0, function* () {
            this._warn(call, reportCode || code, mesg);
            if (call.reqId !== undefined) {
                const msg = { mtype: message_1.MsgType.RpcRespErr, reqId: call.reqId, mesg, code };
                yield this._sendMessage(msg);
            }
        });
    }
    _sendResponse(reqId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = { mtype: message_1.MsgType.RpcRespData, reqId, data };
            yield this._sendMessage(msg);
        });
    }
    _onMessageResp(resp) {
        const callObj = this._pendingCalls.get(resp.reqId);
        this._pendingCalls.delete(resp.reqId);
        if (!callObj) {
            this._warn(null, "RPC_UNKNOWN_REQID", `Response to unknown reqId ${resp.reqId}`);
            return;
        }
        if (resp.mtype === message_1.MsgType.RpcRespErr) {
            this._info(callObj, "RPC_RESULT_ERROR", resp.mesg);
            return callObj.reject(new ErrorWithCode(resp.code, resp.mesg));
        }
        try {
            callObj.resultChecker.check(resp.data);
        }
        catch (e) {
            this._warn(callObj, "RPC_RESULT_INVALID", e.message);
            return callObj.reject(new ErrorWithCode("RPC_INVALID_RESULT", `Implementation produced invalid result: ${e.message}`));
        }
        this._info(callObj, "RPC_RESULT_OK");
        callObj.resolve(resp.data);
    }
    _info(call, code, message) {
        if (this._logger.info) {
            const msg = message ? " " + message : "";
            this._logger.info(`Rpc for ${this._callDesc(call)}: ${code}${msg}`);
        }
    }
    _warn(call, code, message) {
        if (this._logger.warn) {
            const msg = message ? " " + message : "";
            this._logger.warn(`Rpc for ${this._callDesc(call)}: ${code}${msg}`);
        }
    }
    _callDesc(call) {
        if (!call) {
            return "?";
        }
        return `${call.iface}.${call.meth}#${call.reqId || "-"}`;
    }
    _parseName(name) {
        const idx = name.lastIndexOf("@");
        if (idx === -1) {
            return {
                forwarder: "",
                name,
            };
        }
        return {
            name: name.substr(0, idx),
            forwarder: name.substr(idx + 1),
        };
    }
}
exports.Rpc = Rpc;
/**
 * Interfaces may throw errors that include .code field, and it gets propagated to callers (e.g.
 * "NOT_AUTHORIZED"). Its purpose is to be a stable way to distinguish different types of errors.
 * This way the human-friendly error message can be changed without affecting behavior.
 */
class ErrorWithCode extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}
exports.ErrorWithCode = ErrorWithCode;
const IAnyFunc = tic.iface([], {
    invoke: tic.func("any"),
});
const { IAnyFunc: checkerAnyFunc } = tic.createCheckers({ IAnyFunc });
const checkerAnyResult = checkerAnyFunc.methodResult("invoke");
const anyChecker = checkerAnyResult;
/**
 * A little helper that processes message queues when starting an rpc instance.
 */
function processQueue(queue, processFunc) {
    let i = 0;
    try {
        while (i < queue.length) {
            // i gets read and then incremented before the call, so that if processFunc throws, the
            // message still gets removed from the queue (to avoid processing it twice).
            processFunc(queue[i++]);
        }
    }
    finally {
        queue.splice(0, i);
    }
}
/**
 * Calls callback(), handling the exception both synchronously and not. If callback and handler
 * both return or throw synchronously, then so does this method.
 */
function catchMaybePromise(callback, handler) {
    try {
        const p = callback();
        if (p) {
            return p.catch(handler);
        }
    }
    catch (err) {
        return handler(err);
    }
}


/***/ }),

/***/ 8552:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(852),
    root = __webpack_require__(5639);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;


/***/ }),

/***/ 1989:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hashClear = __webpack_require__(1789),
    hashDelete = __webpack_require__(401),
    hashGet = __webpack_require__(7667),
    hashHas = __webpack_require__(1327),
    hashSet = __webpack_require__(1866);

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;


/***/ }),

/***/ 8407:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var listCacheClear = __webpack_require__(7040),
    listCacheDelete = __webpack_require__(4125),
    listCacheGet = __webpack_require__(2117),
    listCacheHas = __webpack_require__(7518),
    listCacheSet = __webpack_require__(4705);

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;


/***/ }),

/***/ 7071:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(852),
    root = __webpack_require__(5639);

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),

/***/ 3369:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var mapCacheClear = __webpack_require__(4785),
    mapCacheDelete = __webpack_require__(1285),
    mapCacheGet = __webpack_require__(6000),
    mapCacheHas = __webpack_require__(9916),
    mapCacheSet = __webpack_require__(5265);

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;


/***/ }),

/***/ 3818:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(852),
    root = __webpack_require__(5639);

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;


/***/ }),

/***/ 8525:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(852),
    root = __webpack_require__(5639);

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;


/***/ }),

/***/ 8668:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var MapCache = __webpack_require__(3369),
    setCacheAdd = __webpack_require__(619),
    setCacheHas = __webpack_require__(2385);

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;


/***/ }),

/***/ 6384:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(8407),
    stackClear = __webpack_require__(7465),
    stackDelete = __webpack_require__(3779),
    stackGet = __webpack_require__(7599),
    stackHas = __webpack_require__(4758),
    stackSet = __webpack_require__(4309);

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;


/***/ }),

/***/ 2705:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(5639);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),

/***/ 1149:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(5639);

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;


/***/ }),

/***/ 577:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(852),
    root = __webpack_require__(5639);

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;


/***/ }),

/***/ 6874:
/***/ ((module) => {

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;


/***/ }),

/***/ 4174:
/***/ ((module) => {

/**
 * A specialized version of `baseAggregator` for arrays.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} setter The function to set `accumulator` values.
 * @param {Function} iteratee The iteratee to transform keys.
 * @param {Object} accumulator The initial aggregated object.
 * @returns {Function} Returns `accumulator`.
 */
function arrayAggregator(array, setter, iteratee, accumulator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    var value = array[index];
    setter(accumulator, value, iteratee(value), array);
  }
  return accumulator;
}

module.exports = arrayAggregator;


/***/ }),

/***/ 4963:
/***/ ((module) => {

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;


/***/ }),

/***/ 4636:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseTimes = __webpack_require__(2545),
    isArguments = __webpack_require__(5694),
    isArray = __webpack_require__(1469),
    isBuffer = __webpack_require__(4144),
    isIndex = __webpack_require__(5776),
    isTypedArray = __webpack_require__(6719);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;


/***/ }),

/***/ 9932:
/***/ ((module) => {

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;


/***/ }),

/***/ 2488:
/***/ ((module) => {

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;


/***/ }),

/***/ 2908:
/***/ ((module) => {

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;


/***/ }),

/***/ 4865:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseAssignValue = __webpack_require__(9465),
    eq = __webpack_require__(7813);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;


/***/ }),

/***/ 8470:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var eq = __webpack_require__(7813);

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;


/***/ }),

/***/ 1119:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseEach = __webpack_require__(9881);

/**
 * Aggregates elements of `collection` on `accumulator` with keys transformed
 * by `iteratee` and values set by `setter`.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} setter The function to set `accumulator` values.
 * @param {Function} iteratee The iteratee to transform keys.
 * @param {Object} accumulator The initial aggregated object.
 * @returns {Function} Returns `accumulator`.
 */
function baseAggregator(collection, setter, iteratee, accumulator) {
  baseEach(collection, function(value, key, collection) {
    setter(accumulator, value, iteratee(value), collection);
  });
  return accumulator;
}

module.exports = baseAggregator;


/***/ }),

/***/ 9465:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var defineProperty = __webpack_require__(8777);

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;


/***/ }),

/***/ 9881:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseForOwn = __webpack_require__(7816),
    createBaseEach = __webpack_require__(9291);

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;


/***/ }),

/***/ 1078:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayPush = __webpack_require__(2488),
    isFlattenable = __webpack_require__(7285);

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;


/***/ }),

/***/ 8483:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var createBaseFor = __webpack_require__(5063);

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;


/***/ }),

/***/ 7816:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseFor = __webpack_require__(8483),
    keys = __webpack_require__(3674);

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;


/***/ }),

/***/ 7786:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var castPath = __webpack_require__(1811),
    toKey = __webpack_require__(327);

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;


/***/ }),

/***/ 8866:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayPush = __webpack_require__(2488),
    isArray = __webpack_require__(1469);

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;


/***/ }),

/***/ 4239:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(2705),
    getRawTag = __webpack_require__(9607),
    objectToString = __webpack_require__(2333);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),

/***/ 13:
/***/ ((module) => {

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

module.exports = baseHasIn;


/***/ }),

/***/ 9454:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(4239),
    isObjectLike = __webpack_require__(7005);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ }),

/***/ 939:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsEqualDeep = __webpack_require__(2492),
    isObjectLike = __webpack_require__(7005);

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

module.exports = baseIsEqual;


/***/ }),

/***/ 2492:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Stack = __webpack_require__(6384),
    equalArrays = __webpack_require__(7114),
    equalByTag = __webpack_require__(8351),
    equalObjects = __webpack_require__(6096),
    getTag = __webpack_require__(4160),
    isArray = __webpack_require__(1469),
    isBuffer = __webpack_require__(4144),
    isTypedArray = __webpack_require__(6719);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

module.exports = baseIsEqualDeep;


/***/ }),

/***/ 2958:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Stack = __webpack_require__(6384),
    baseIsEqual = __webpack_require__(939);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;


/***/ }),

/***/ 8458:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isFunction = __webpack_require__(3560),
    isMasked = __webpack_require__(5346),
    isObject = __webpack_require__(3218),
    toSource = __webpack_require__(346);

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;


/***/ }),

/***/ 8749:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(4239),
    isLength = __webpack_require__(1780),
    isObjectLike = __webpack_require__(7005);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;


/***/ }),

/***/ 7206:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseMatches = __webpack_require__(1573),
    baseMatchesProperty = __webpack_require__(6432),
    identity = __webpack_require__(6557),
    isArray = __webpack_require__(1469),
    property = __webpack_require__(9601);

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

module.exports = baseIteratee;


/***/ }),

/***/ 280:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isPrototype = __webpack_require__(5726),
    nativeKeys = __webpack_require__(6916);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;


/***/ }),

/***/ 9199:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseEach = __webpack_require__(9881),
    isArrayLike = __webpack_require__(8612);

/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

module.exports = baseMap;


/***/ }),

/***/ 1573:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsMatch = __webpack_require__(2958),
    getMatchData = __webpack_require__(1499),
    matchesStrictComparable = __webpack_require__(2634);

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

module.exports = baseMatches;


/***/ }),

/***/ 6432:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsEqual = __webpack_require__(939),
    get = __webpack_require__(7361),
    hasIn = __webpack_require__(9095),
    isKey = __webpack_require__(5403),
    isStrictComparable = __webpack_require__(9162),
    matchesStrictComparable = __webpack_require__(2634),
    toKey = __webpack_require__(327);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}

module.exports = baseMatchesProperty;


/***/ }),

/***/ 5970:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var basePickBy = __webpack_require__(3012),
    hasIn = __webpack_require__(9095);

/**
 * The base implementation of `_.pick` without support for individual
 * property identifiers.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @returns {Object} Returns the new object.
 */
function basePick(object, paths) {
  return basePickBy(object, paths, function(value, path) {
    return hasIn(object, path);
  });
}

module.exports = basePick;


/***/ }),

/***/ 3012:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGet = __webpack_require__(7786),
    baseSet = __webpack_require__(611),
    castPath = __webpack_require__(1811);

/**
 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @param {Function} predicate The function invoked per property.
 * @returns {Object} Returns the new object.
 */
function basePickBy(object, paths, predicate) {
  var index = -1,
      length = paths.length,
      result = {};

  while (++index < length) {
    var path = paths[index],
        value = baseGet(object, path);

    if (predicate(value, path)) {
      baseSet(result, castPath(path, object), value);
    }
  }
  return result;
}

module.exports = basePickBy;


/***/ }),

/***/ 371:
/***/ ((module) => {

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;


/***/ }),

/***/ 9152:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGet = __webpack_require__(7786);

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

module.exports = basePropertyDeep;


/***/ }),

/***/ 611:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assignValue = __webpack_require__(4865),
    castPath = __webpack_require__(1811),
    isIndex = __webpack_require__(5776),
    isObject = __webpack_require__(3218),
    toKey = __webpack_require__(327);

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;

    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return object;
    }

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

module.exports = baseSet;


/***/ }),

/***/ 6560:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var constant = __webpack_require__(5703),
    defineProperty = __webpack_require__(8777),
    identity = __webpack_require__(6557);

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

module.exports = baseSetToString;


/***/ }),

/***/ 2545:
/***/ ((module) => {

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;


/***/ }),

/***/ 531:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(2705),
    arrayMap = __webpack_require__(9932),
    isArray = __webpack_require__(1469),
    isSymbol = __webpack_require__(3448);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;


/***/ }),

/***/ 7561:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var trimmedEndIndex = __webpack_require__(7990);

/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;

/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */
function baseTrim(string) {
  return string
    ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
    : string;
}

module.exports = baseTrim;


/***/ }),

/***/ 1717:
/***/ ((module) => {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;


/***/ }),

/***/ 4757:
/***/ ((module) => {

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;


/***/ }),

/***/ 4290:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var identity = __webpack_require__(6557);

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction(value) {
  return typeof value == 'function' ? value : identity;
}

module.exports = castFunction;


/***/ }),

/***/ 1811:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isArray = __webpack_require__(1469),
    isKey = __webpack_require__(5403),
    stringToPath = __webpack_require__(5514),
    toString = __webpack_require__(9833);

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

module.exports = castPath;


/***/ }),

/***/ 4429:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(5639);

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),

/***/ 5189:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayAggregator = __webpack_require__(4174),
    baseAggregator = __webpack_require__(1119),
    baseIteratee = __webpack_require__(7206),
    isArray = __webpack_require__(1469);

/**
 * Creates a function like `_.groupBy`.
 *
 * @private
 * @param {Function} setter The function to set accumulator values.
 * @param {Function} [initializer] The accumulator object initializer.
 * @returns {Function} Returns the new aggregator function.
 */
function createAggregator(setter, initializer) {
  return function(collection, iteratee) {
    var func = isArray(collection) ? arrayAggregator : baseAggregator,
        accumulator = initializer ? initializer() : {};

    return func(collection, setter, baseIteratee(iteratee, 2), accumulator);
  };
}

module.exports = createAggregator;


/***/ }),

/***/ 9291:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isArrayLike = __webpack_require__(8612);

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;


/***/ }),

/***/ 5063:
/***/ ((module) => {

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;


/***/ }),

/***/ 8777:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(852);

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;


/***/ }),

/***/ 7114:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var SetCache = __webpack_require__(8668),
    arraySome = __webpack_require__(2908),
    cacheHas = __webpack_require__(4757);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Check that cyclic values are equal.
  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

module.exports = equalArrays;


/***/ }),

/***/ 8351:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(2705),
    Uint8Array = __webpack_require__(1149),
    eq = __webpack_require__(7813),
    equalArrays = __webpack_require__(7114),
    mapToArray = __webpack_require__(8776),
    setToArray = __webpack_require__(1814);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;


/***/ }),

/***/ 6096:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getAllKeys = __webpack_require__(8234);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Check that cyclic values are equal.
  var objStacked = stack.get(object);
  var othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

module.exports = equalObjects;


/***/ }),

/***/ 9021:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var flatten = __webpack_require__(5564),
    overRest = __webpack_require__(5357),
    setToString = __webpack_require__(61);

/**
 * A specialized version of `baseRest` which flattens the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */
function flatRest(func) {
  return setToString(overRest(func, undefined, flatten), func + '');
}

module.exports = flatRest;


/***/ }),

/***/ 1957:
/***/ ((module) => {

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;


/***/ }),

/***/ 8234:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetAllKeys = __webpack_require__(8866),
    getSymbols = __webpack_require__(9551),
    keys = __webpack_require__(3674);

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;


/***/ }),

/***/ 5050:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isKeyable = __webpack_require__(7019);

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;


/***/ }),

/***/ 1499:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isStrictComparable = __webpack_require__(9162),
    keys = __webpack_require__(3674);

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

module.exports = getMatchData;


/***/ }),

/***/ 852:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsNative = __webpack_require__(8458),
    getValue = __webpack_require__(7801);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;


/***/ }),

/***/ 5924:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var overArg = __webpack_require__(5569);

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;


/***/ }),

/***/ 9607:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(2705);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),

/***/ 9551:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayFilter = __webpack_require__(4963),
    stubArray = __webpack_require__(479);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;


/***/ }),

/***/ 4160:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DataView = __webpack_require__(8552),
    Map = __webpack_require__(7071),
    Promise = __webpack_require__(3818),
    Set = __webpack_require__(8525),
    WeakMap = __webpack_require__(577),
    baseGetTag = __webpack_require__(4239),
    toSource = __webpack_require__(346);

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;


/***/ }),

/***/ 7801:
/***/ ((module) => {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;


/***/ }),

/***/ 222:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var castPath = __webpack_require__(1811),
    isArguments = __webpack_require__(5694),
    isArray = __webpack_require__(1469),
    isIndex = __webpack_require__(5776),
    isLength = __webpack_require__(1780),
    toKey = __webpack_require__(327);

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

module.exports = hasPath;


/***/ }),

/***/ 1789:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(4536);

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;


/***/ }),

/***/ 401:
/***/ ((module) => {

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;


/***/ }),

/***/ 7667:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(4536);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;


/***/ }),

/***/ 1327:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(4536);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;


/***/ }),

/***/ 1866:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(4536);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;


/***/ }),

/***/ 7285:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(2705),
    isArguments = __webpack_require__(5694),
    isArray = __webpack_require__(1469);

/** Built-in value references. */
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

module.exports = isFlattenable;


/***/ }),

/***/ 5776:
/***/ ((module) => {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ }),

/***/ 5403:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isArray = __webpack_require__(1469),
    isSymbol = __webpack_require__(3448);

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;


/***/ }),

/***/ 7019:
/***/ ((module) => {

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;


/***/ }),

/***/ 5346:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var coreJsData = __webpack_require__(4429);

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;


/***/ }),

/***/ 5726:
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;


/***/ }),

/***/ 9162:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(3218);

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;


/***/ }),

/***/ 7040:
/***/ ((module) => {

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;


/***/ }),

/***/ 4125:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(8470);

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;


/***/ }),

/***/ 2117:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(8470);

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;


/***/ }),

/***/ 7518:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(8470);

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;


/***/ }),

/***/ 4705:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(8470);

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;


/***/ }),

/***/ 4785:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Hash = __webpack_require__(1989),
    ListCache = __webpack_require__(8407),
    Map = __webpack_require__(7071);

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;


/***/ }),

/***/ 1285:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(5050);

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;


/***/ }),

/***/ 6000:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(5050);

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;


/***/ }),

/***/ 9916:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(5050);

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;


/***/ }),

/***/ 5265:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(5050);

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;


/***/ }),

/***/ 8776:
/***/ ((module) => {

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;


/***/ }),

/***/ 2634:
/***/ ((module) => {

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

module.exports = matchesStrictComparable;


/***/ }),

/***/ 4523:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var memoize = __webpack_require__(8306);

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

module.exports = memoizeCapped;


/***/ }),

/***/ 4536:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(852);

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),

/***/ 6916:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var overArg = __webpack_require__(5569);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ }),

/***/ 1167:
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var freeGlobal = __webpack_require__(1957);

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;


/***/ }),

/***/ 2333:
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),

/***/ 5569:
/***/ ((module) => {

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;


/***/ }),

/***/ 5357:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var apply = __webpack_require__(6874);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

module.exports = overRest;


/***/ }),

/***/ 5639:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var freeGlobal = __webpack_require__(1957);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),

/***/ 619:
/***/ ((module) => {

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;


/***/ }),

/***/ 2385:
/***/ ((module) => {

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;


/***/ }),

/***/ 1814:
/***/ ((module) => {

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;


/***/ }),

/***/ 61:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseSetToString = __webpack_require__(6560),
    shortOut = __webpack_require__(1275);

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;


/***/ }),

/***/ 1275:
/***/ ((module) => {

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

module.exports = shortOut;


/***/ }),

/***/ 7465:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(8407);

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;


/***/ }),

/***/ 3779:
/***/ ((module) => {

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;


/***/ }),

/***/ 7599:
/***/ ((module) => {

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;


/***/ }),

/***/ 4758:
/***/ ((module) => {

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;


/***/ }),

/***/ 4309:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(8407),
    Map = __webpack_require__(7071),
    MapCache = __webpack_require__(3369);

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;


/***/ }),

/***/ 5514:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var memoizeCapped = __webpack_require__(4523);

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;


/***/ }),

/***/ 327:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isSymbol = __webpack_require__(3448);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;


/***/ }),

/***/ 346:
/***/ ((module) => {

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;


/***/ }),

/***/ 7990:
/***/ ((module) => {

/** Used to match a single whitespace character. */
var reWhitespace = /\s/;

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */
function trimmedEndIndex(string) {
  var index = string.length;

  while (index-- && reWhitespace.test(string.charAt(index))) {}
  return index;
}

module.exports = trimmedEndIndex;


/***/ }),

/***/ 5703:
/***/ ((module) => {

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;


/***/ }),

/***/ 7813:
/***/ ((module) => {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;


/***/ }),

/***/ 4654:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseFlatten = __webpack_require__(1078),
    map = __webpack_require__(5161);

/**
 * Creates a flattened array of values by running each element in `collection`
 * thru `iteratee` and flattening the mapped results. The iteratee is invoked
 * with three arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * function duplicate(n) {
 *   return [n, n];
 * }
 *
 * _.flatMap([1, 2], duplicate);
 * // => [1, 1, 2, 2]
 */
function flatMap(collection, iteratee) {
  return baseFlatten(map(collection, iteratee), 1);
}

module.exports = flatMap;


/***/ }),

/***/ 5564:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseFlatten = __webpack_require__(1078);

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}

module.exports = flatten;


/***/ }),

/***/ 7361:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGet = __webpack_require__(7786);

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;


/***/ }),

/***/ 7739:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseAssignValue = __webpack_require__(9465),
    createAggregator = __webpack_require__(5189);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an object composed of keys generated from the results of running
 * each element of `collection` thru `iteratee`. The order of grouped values
 * is determined by the order they occur in `collection`. The corresponding
 * value of each key is an array of elements responsible for generating the
 * key. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
 * @returns {Object} Returns the composed aggregate object.
 * @example
 *
 * _.groupBy([6.1, 4.2, 6.3], Math.floor);
 * // => { '4': [4.2], '6': [6.1, 6.3] }
 *
 * // The `_.property` iteratee shorthand.
 * _.groupBy(['one', 'two', 'three'], 'length');
 * // => { '3': ['one', 'two'], '5': ['three'] }
 */
var groupBy = createAggregator(function(result, value, key) {
  if (hasOwnProperty.call(result, key)) {
    result[key].push(value);
  } else {
    baseAssignValue(result, key, [value]);
  }
});

module.exports = groupBy;


/***/ }),

/***/ 9095:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseHasIn = __webpack_require__(13),
    hasPath = __webpack_require__(222);

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

module.exports = hasIn;


/***/ }),

/***/ 6557:
/***/ ((module) => {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ }),

/***/ 5694:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsArguments = __webpack_require__(9454),
    isObjectLike = __webpack_require__(7005);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ }),

/***/ 1469:
/***/ ((module) => {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),

/***/ 8612:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isFunction = __webpack_require__(3560),
    isLength = __webpack_require__(1780);

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;


/***/ }),

/***/ 4144:
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var root = __webpack_require__(5639),
    stubFalse = __webpack_require__(5062);

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;


/***/ }),

/***/ 8446:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsEqual = __webpack_require__(939);

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
}

module.exports = isEqual;


/***/ }),

/***/ 3560:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(4239),
    isObject = __webpack_require__(3218);

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ }),

/***/ 1780:
/***/ ((module) => {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ }),

/***/ 3218:
/***/ ((module) => {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),

/***/ 7005:
/***/ ((module) => {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),

/***/ 8630:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(4239),
    getPrototype = __webpack_require__(5924),
    isObjectLike = __webpack_require__(7005);

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

module.exports = isPlainObject;


/***/ }),

/***/ 3448:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(4239),
    isObjectLike = __webpack_require__(7005);

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),

/***/ 6719:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsTypedArray = __webpack_require__(8749),
    baseUnary = __webpack_require__(1717),
    nodeUtil = __webpack_require__(1167);

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;


/***/ }),

/***/ 3674:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeKeys = __webpack_require__(4636),
    baseKeys = __webpack_require__(280),
    isArrayLike = __webpack_require__(8612);

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;


/***/ }),

/***/ 5161:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayMap = __webpack_require__(9932),
    baseIteratee = __webpack_require__(7206),
    baseMap = __webpack_require__(9199),
    isArray = __webpack_require__(1469);

/**
 * Creates an array of values by running each element in `collection` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * _.map([4, 8], square);
 * // => [16, 64]
 *
 * _.map({ 'a': 4, 'b': 8 }, square);
 * // => [16, 64] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */
function map(collection, iteratee) {
  var func = isArray(collection) ? arrayMap : baseMap;
  return func(collection, baseIteratee(iteratee, 3));
}

module.exports = map;


/***/ }),

/***/ 8306:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var MapCache = __webpack_require__(3369);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

module.exports = memoize;


/***/ }),

/***/ 8718:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var basePick = __webpack_require__(5970),
    flatRest = __webpack_require__(9021);

/**
 * Creates an object composed of the picked `object` properties.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to pick.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.pick(object, ['a', 'c']);
 * // => { 'a': 1, 'c': 3 }
 */
var pick = flatRest(function(object, paths) {
  return object == null ? {} : basePick(object, paths);
});

module.exports = pick;


/***/ }),

/***/ 9601:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseProperty = __webpack_require__(371),
    basePropertyDeep = __webpack_require__(9152),
    isKey = __webpack_require__(5403),
    toKey = __webpack_require__(327);

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = property;


/***/ }),

/***/ 479:
/***/ ((module) => {

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;


/***/ }),

/***/ 5062:
/***/ ((module) => {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ }),

/***/ 8913:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseTimes = __webpack_require__(2545),
    castFunction = __webpack_require__(4290),
    toInteger = __webpack_require__(554);

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH = 4294967295;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * Invokes the iteratee `n` times, returning an array of the results of
 * each invocation. The iteratee is invoked with one argument; (index).
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 * @example
 *
 * _.times(3, String);
 * // => ['0', '1', '2']
 *
 *  _.times(4, _.constant(0));
 * // => [0, 0, 0, 0]
 */
function times(n, iteratee) {
  n = toInteger(n);
  if (n < 1 || n > MAX_SAFE_INTEGER) {
    return [];
  }
  var index = MAX_ARRAY_LENGTH,
      length = nativeMin(n, MAX_ARRAY_LENGTH);

  iteratee = castFunction(iteratee);
  n -= MAX_ARRAY_LENGTH;

  var result = baseTimes(length, iteratee);
  while (++index < n) {
    iteratee(index);
  }
  return result;
}

module.exports = times;


/***/ }),

/***/ 8601:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toNumber = __webpack_require__(4841);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

module.exports = toFinite;


/***/ }),

/***/ 554:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toFinite = __webpack_require__(8601);

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

module.exports = toInteger;


/***/ }),

/***/ 4841:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseTrim = __webpack_require__(7561),
    isObject = __webpack_require__(3218),
    isSymbol = __webpack_require__(3448);

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;


/***/ }),

/***/ 9833:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseToString = __webpack_require__(531);

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;


/***/ }),

/***/ 1074:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Checker = exports.createCheckers = void 0;
var types_1 = __webpack_require__(2746);
var util_1 = __webpack_require__(7180);
/**
 * Export functions used to define interfaces.
 */
var types_2 = __webpack_require__(2746);
Object.defineProperty(exports, "TArray", ({ enumerable: true, get: function () { return types_2.TArray; } }));
Object.defineProperty(exports, "TEnumType", ({ enumerable: true, get: function () { return types_2.TEnumType; } }));
Object.defineProperty(exports, "TEnumLiteral", ({ enumerable: true, get: function () { return types_2.TEnumLiteral; } }));
Object.defineProperty(exports, "TFunc", ({ enumerable: true, get: function () { return types_2.TFunc; } }));
Object.defineProperty(exports, "TIface", ({ enumerable: true, get: function () { return types_2.TIface; } }));
Object.defineProperty(exports, "TLiteral", ({ enumerable: true, get: function () { return types_2.TLiteral; } }));
Object.defineProperty(exports, "TName", ({ enumerable: true, get: function () { return types_2.TName; } }));
Object.defineProperty(exports, "TOptional", ({ enumerable: true, get: function () { return types_2.TOptional; } }));
Object.defineProperty(exports, "TParam", ({ enumerable: true, get: function () { return types_2.TParam; } }));
Object.defineProperty(exports, "TParamList", ({ enumerable: true, get: function () { return types_2.TParamList; } }));
Object.defineProperty(exports, "TProp", ({ enumerable: true, get: function () { return types_2.TProp; } }));
Object.defineProperty(exports, "TTuple", ({ enumerable: true, get: function () { return types_2.TTuple; } }));
Object.defineProperty(exports, "TType", ({ enumerable: true, get: function () { return types_2.TType; } }));
Object.defineProperty(exports, "TUnion", ({ enumerable: true, get: function () { return types_2.TUnion; } }));
Object.defineProperty(exports, "TIntersection", ({ enumerable: true, get: function () { return types_2.TIntersection; } }));
Object.defineProperty(exports, "array", ({ enumerable: true, get: function () { return types_2.array; } }));
Object.defineProperty(exports, "enumlit", ({ enumerable: true, get: function () { return types_2.enumlit; } }));
Object.defineProperty(exports, "enumtype", ({ enumerable: true, get: function () { return types_2.enumtype; } }));
Object.defineProperty(exports, "func", ({ enumerable: true, get: function () { return types_2.func; } }));
Object.defineProperty(exports, "iface", ({ enumerable: true, get: function () { return types_2.iface; } }));
Object.defineProperty(exports, "lit", ({ enumerable: true, get: function () { return types_2.lit; } }));
Object.defineProperty(exports, "name", ({ enumerable: true, get: function () { return types_2.name; } }));
Object.defineProperty(exports, "opt", ({ enumerable: true, get: function () { return types_2.opt; } }));
Object.defineProperty(exports, "param", ({ enumerable: true, get: function () { return types_2.param; } }));
Object.defineProperty(exports, "tuple", ({ enumerable: true, get: function () { return types_2.tuple; } }));
Object.defineProperty(exports, "union", ({ enumerable: true, get: function () { return types_2.union; } }));
Object.defineProperty(exports, "intersection", ({ enumerable: true, get: function () { return types_2.intersection; } }));
Object.defineProperty(exports, "rest", ({ enumerable: true, get: function () { return types_2.rest; } }));
Object.defineProperty(exports, "indexKey", ({ enumerable: true, get: function () { return types_2.indexKey; } }));
Object.defineProperty(exports, "BasicType", ({ enumerable: true, get: function () { return types_2.BasicType; } }));
var util_2 = __webpack_require__(7180);
Object.defineProperty(exports, "VError", ({ enumerable: true, get: function () { return util_2.VError; } }));
/**
 * Takes one of more type suites (e.g. a module generated by `ts-interface-builder`), and combines
 * them into a suite of interface checkers. If a type is used by name, that name should be present
 * among the passed-in type suites.
 *
 * The returned object maps type names to Checker objects.
 */
function createCheckers() {
    var typeSuite = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        typeSuite[_i] = arguments[_i];
    }
    var fullSuite = Object.assign.apply(Object, __spreadArrays([{}, types_1.basicTypes], typeSuite));
    var checkers = {};
    for (var _a = 0, typeSuite_1 = typeSuite; _a < typeSuite_1.length; _a++) {
        var suite_1 = typeSuite_1[_a];
        for (var _b = 0, _c = Object.keys(suite_1); _b < _c.length; _b++) {
            var name = _c[_b];
            checkers[name] = new Checker(fullSuite, suite_1[name]);
        }
    }
    return checkers;
}
exports.createCheckers = createCheckers;
/**
 * Checker implements validation of objects, and also includes accessors to validate method calls.
 * Checkers should be created using `createCheckers()`.
 */
var Checker = /** @class */ (function () {
    // Create checkers by using `createCheckers()` function.
    function Checker(suite, ttype, _path) {
        if (_path === void 0) { _path = 'value'; }
        this.suite = suite;
        this.ttype = ttype;
        this._path = _path;
        this.props = new Map();
        if (ttype instanceof types_1.TIface) {
            for (var _i = 0, _a = ttype.props; _i < _a.length; _i++) {
                var p = _a[_i];
                this.props.set(p.name, p.ttype);
            }
        }
        this.checkerPlain = this.ttype.getChecker(suite, false);
        this.checkerStrict = this.ttype.getChecker(suite, true);
    }
    /**
     * Set the path to report in errors, instead of the default "value". (E.g. if the Checker is for
     * a "person" interface, set path to "person" to report e.g. "person.name is not a string".)
     */
    Checker.prototype.setReportedPath = function (path) {
        this._path = path;
    };
    /**
     * Check that the given value satisfies this checker's type, or throw Error.
     */
    Checker.prototype.check = function (value) { return this._doCheck(this.checkerPlain, value); };
    /**
     * A fast check for whether or not the given value satisfies this Checker's type. This returns
     * true or false, does not produce an error message, and is fast both on success and on failure.
     */
    Checker.prototype.test = function (value) {
        return this.checkerPlain(value, new util_1.NoopContext());
    };
    /**
     * Returns a non-empty array of error objects describing the errors if the given value does not satisfy this
     * Checker's type, or null if it does.
     */
    Checker.prototype.validate = function (value) {
        return this._doValidate(this.checkerPlain, value);
    };
    /**
     * Check that the given value satisfies this checker's type strictly. This checks that objects
     * and tuples have no extra members. Note that this prevents backward compatibility, so usually
     * a plain check() is more appropriate.
     */
    Checker.prototype.strictCheck = function (value) { return this._doCheck(this.checkerStrict, value); };
    /**
     * A fast strict check for whether or not the given value satisfies this Checker's type. Returns
     * true or false, does not produce an error message, and is fast both on success and on failure.
     */
    Checker.prototype.strictTest = function (value) {
        return this.checkerStrict(value, new util_1.NoopContext());
    };
    /**
     * Returns a non-empty array of error objects describing the errors if the given value does not satisfy this
     * Checker's type strictly, or null if it does.
     */
    Checker.prototype.strictValidate = function (value) {
        return this._doValidate(this.checkerStrict, value);
    };
    /**
     * If this checker is for an interface, returns a Checker for the type required for the given
     * property of this interface.
     */
    Checker.prototype.getProp = function (prop) {
        var ttype = this.props.get(prop);
        if (!ttype) {
            throw new Error("Type has no property " + prop);
        }
        return new Checker(this.suite, ttype, this._path + "." + prop);
    };
    /**
     * If this checker is for an interface, returns a Checker for the argument-list required to call
     * the given method of this interface. E.g. if this Checker is for the interface:
     *    interface Foo {
     *      find(s: string, pos?: number): number;
     *    }
     * Then methodArgs("find").check(...) will succeed for ["foo"] and ["foo", 3], but not for [17].
     */
    Checker.prototype.methodArgs = function (methodName) {
        var tfunc = this._getMethod(methodName);
        return new Checker(this.suite, tfunc.paramList);
    };
    /**
     * If this checker is for an interface, returns a Checker for the return value of the given
     * method of this interface.
     */
    Checker.prototype.methodResult = function (methodName) {
        var tfunc = this._getMethod(methodName);
        return new Checker(this.suite, tfunc.result);
    };
    /**
     * If this checker is for a function, returns a Checker for its argument-list.
     */
    Checker.prototype.getArgs = function () {
        if (!(this.ttype instanceof types_1.TFunc)) {
            throw new Error("getArgs() applied to non-function");
        }
        return new Checker(this.suite, this.ttype.paramList);
    };
    /**
     * If this checker is for a function, returns a Checker for its result.
     */
    Checker.prototype.getResult = function () {
        if (!(this.ttype instanceof types_1.TFunc)) {
            throw new Error("getResult() applied to non-function");
        }
        return new Checker(this.suite, this.ttype.result);
    };
    /**
     * Return the type for which this is a checker.
     */
    Checker.prototype.getType = function () {
        return this.ttype;
    };
    /**
     * Actual implementation of check() and strictCheck().
     */
    Checker.prototype._doCheck = function (checkerFunc, value) {
        var noopCtx = new util_1.NoopContext();
        if (!checkerFunc(value, noopCtx)) {
            var detailCtx = new util_1.DetailContext();
            checkerFunc(value, detailCtx);
            throw detailCtx.getError(this._path);
        }
    };
    Checker.prototype._doValidate = function (checkerFunc, value) {
        var noopCtx = new util_1.NoopContext();
        if (checkerFunc(value, noopCtx)) {
            return null;
        }
        var detailCtx = new util_1.DetailContext();
        checkerFunc(value, detailCtx);
        return detailCtx.getErrorDetails(this._path);
    };
    Checker.prototype._getMethod = function (methodName) {
        var ttype = this.props.get(methodName);
        if (!ttype) {
            throw new Error("Type has no property " + methodName);
        }
        if (!(ttype instanceof types_1.TFunc)) {
            throw new Error("Property " + methodName + " is not a method");
        }
        return ttype;
    };
    return Checker;
}());
exports.Checker = Checker;


/***/ }),

/***/ 2746:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * This module defines nodes used to define types and validations for objects and interfaces.
 */
// tslint:disable:no-shadowed-variable prefer-for-of
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.basicTypes = exports.BasicType = exports.TParamList = exports.TParam = exports.param = exports.TFunc = exports.func = exports.TProp = exports.TOptional = exports.opt = exports.TIface = exports.iface = exports.indexKey = exports.TEnumLiteral = exports.enumlit = exports.TEnumType = exports.enumtype = exports.TIntersection = exports.intersection = exports.TUnion = exports.union = exports.TTuple = exports.tuple = exports.RestType = exports.rest = exports.TArray = exports.array = exports.TLiteral = exports.lit = exports.TName = exports.name = exports.TType = void 0;
var util_1 = __webpack_require__(7180);
/** Node that represents a type. */
var TType = /** @class */ (function () {
    function TType() {
    }
    return TType;
}());
exports.TType = TType;
/** Parses a type spec into a TType node. */
function parseSpec(typeSpec) {
    return typeof typeSpec === "string" ? name(typeSpec) : typeSpec;
}
function getNamedType(suite, name) {
    var ttype = suite[name];
    if (!ttype) {
        throw new Error("Unknown type " + name);
    }
    return ttype;
}
/**
 * Defines a type name, either built-in, or defined in this suite. It can typically be included in
 * the specs as just a plain string.
 */
function name(value) { return new TName(value); }
exports.name = name;
var TName = /** @class */ (function (_super) {
    __extends(TName, _super);
    function TName(name) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this._failMsg = "is not a " + name;
        return _this;
    }
    TName.prototype.getChecker = function (suite, strict, allowedProps) {
        // Using names, we can reference a type recursively in its own definition. To avoid an
        // infinite recursion in getChecker() calls, we cache and reuse the checker that's being built
        // when it references its own TName node. Note that it's important to reuse the result only
        // when getChecker() is called with the same arguments, but that's already guaranteed because
        // we are caching only for the current call and only for the same TName object (not another
        // instance of name() call for the same name).
        //
        // Note also that this is about handling recursive types; it does NOT help validating data
        // with circular references.
        var checkerFunc = this._checkerBeingBuilt;
        if (!checkerFunc) {
            this._checkerBeingBuilt = function (value, ctx) { return checkerFunc(value, ctx); };
            try {
                checkerFunc = this._getChecker(suite, strict, allowedProps);
            }
            finally {
                this._checkerBeingBuilt = undefined;
            }
        }
        return checkerFunc;
    };
    TName.prototype._getChecker = function (suite, strict, allowedProps) {
        var _this = this;
        var ttype = getNamedType(suite, this.name);
        var checker = ttype.getChecker(suite, strict, allowedProps);
        if (ttype instanceof BasicType || ttype instanceof TName) {
            return checker;
        }
        // For complex types, add an additional "is not a <Type>" message on failure.
        return function (value, ctx) { return checker(value, ctx) ? true : ctx.fail(null, _this._failMsg, 0); };
    };
    return TName;
}(TType));
exports.TName = TName;
/**
 * Defines a literal value, e.g. lit('hello') or lit(123).
 */
function lit(value) { return new TLiteral(value); }
exports.lit = lit;
var TLiteral = /** @class */ (function (_super) {
    __extends(TLiteral, _super);
    function TLiteral(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        _this.name = JSON.stringify(value);
        _this._failMsg = "is not " + _this.name;
        return _this;
    }
    TLiteral.prototype.getChecker = function (suite, strict) {
        var _this = this;
        return function (value, ctx) { return (value === _this.value) ? true : ctx.fail(null, _this._failMsg, -1); };
    };
    return TLiteral;
}(TType));
exports.TLiteral = TLiteral;
/**
 * Defines an array type, e.g. array('number').
 */
function array(typeSpec) { return new TArray(parseSpec(typeSpec)); }
exports.array = array;
var TArray = /** @class */ (function (_super) {
    __extends(TArray, _super);
    function TArray(ttype) {
        var _this = _super.call(this) || this;
        _this.ttype = ttype;
        var elementTypeName = getTypeName(ttype);
        if (elementTypeName) {
            _this.name = elementTypeName + "[]";
        }
        return _this;
    }
    TArray.prototype.getChecker = function (suite, strict) {
        var itemChecker = this.ttype.getChecker(suite, strict);
        return function (value, ctx) {
            if (!Array.isArray(value)) {
                return ctx.fail(null, "is not an array", 0);
            }
            for (var i = 0; i < value.length; i++) {
                var ok = itemChecker(value[i], ctx);
                if (!ok) {
                    return ctx.fail(i, null, 1);
                }
            }
            return true;
        };
    };
    return TArray;
}(TType));
exports.TArray = TArray;
/**
 * Defines a rest type, e.g. tuple('string', rest(array('number'))).
 */
function rest(typeSpec) {
    return new RestType(typeSpec);
}
exports.rest = rest;
var RestType = /** @class */ (function (_super) {
    __extends(RestType, _super);
    function RestType(typeSpec) {
        var _this = _super.call(this) || this;
        _this.typeSpec = typeSpec;
        return _this;
    }
    RestType.prototype.setStart = function (start) {
        this._start = start;
    };
    RestType.prototype.getChecker = function (suite, strict) {
        var arrType = typeof this.typeSpec === "string" ? getNamedType(suite, this.typeSpec) : this.typeSpec;
        if (!(arrType instanceof TArray)) {
            throw new Error("Rest type must be an array");
        }
        var itemChecker = arrType.ttype.getChecker(suite, strict);
        var start = this._start;
        return function (value, ctx) {
            for (var i = start; i < value.length; i++) {
                if (!itemChecker(value[i], ctx)) {
                    return ctx.fail(i, null, 1);
                }
            }
            return true;
        };
    };
    return RestType;
}(TType));
exports.RestType = RestType;
/**
 * Defines a tuple type, e.g. tuple('string', 'number').
 */
function tuple() {
    var typeSpec = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        typeSpec[_i] = arguments[_i];
    }
    return new TTuple(typeSpec.map(function (t) { return parseSpec(t); }));
}
exports.tuple = tuple;
var TTuple = /** @class */ (function (_super) {
    __extends(TTuple, _super);
    function TTuple(ttypes) {
        var _this = _super.call(this) || this;
        _this.ttypes = ttypes;
        var last = ttypes[ttypes.length - 1];
        if (last instanceof RestType) {
            ttypes.pop();
            _this._restType = last;
            _this._restType.setStart(ttypes.length);
        }
        return _this;
    }
    TTuple.prototype.getChecker = function (suite, strict) {
        var itemCheckers = this.ttypes.map(function (t) { return t.getChecker(suite, strict); });
        var checker = function (value, ctx) {
            if (!Array.isArray(value)) {
                return ctx.fail(null, "is not an array", 0);
            }
            for (var i = 0; i < itemCheckers.length; i++) {
                var ok = itemCheckers[i](value[i], ctx);
                if (!ok) {
                    return ctx.fail(i, null, 1);
                }
            }
            return true;
        };
        if (this._restType) {
            var restChecker_1 = this._restType.getChecker(suite, strict);
            return function (value, ctx) {
                return checker(value, ctx) && restChecker_1(value, ctx);
            };
        }
        if (!strict) {
            return checker;
        }
        return function (value, ctx) {
            if (!checker(value, ctx)) {
                return false;
            }
            return value.length <= itemCheckers.length ? true :
                ctx.fail(itemCheckers.length, "is extraneous", 2);
        };
    };
    return TTuple;
}(TType));
exports.TTuple = TTuple;
/**
 * Defines a union type, e.g. union('number', 'null').
 */
function union() {
    var typeSpec = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        typeSpec[_i] = arguments[_i];
    }
    return new TUnion(typeSpec.map(function (t) { return parseSpec(t); }));
}
exports.union = union;
var TUnion = /** @class */ (function (_super) {
    __extends(TUnion, _super);
    function TUnion(ttypes) {
        var _this = _super.call(this) || this;
        _this.ttypes = ttypes;
        var names = ttypes.map(getTypeName)
            .filter(function (n) { return n; });
        var otherTypes = ttypes.length - names.length;
        if (names.length) {
            if (otherTypes > 0) {
                names.push(otherTypes + " more");
            }
            _this._failMsg = "is none of " + names.join(", ");
        }
        else {
            _this._failMsg = "is none of " + otherTypes + " types";
        }
        return _this;
    }
    TUnion.prototype.getChecker = function (suite, strict, allowedProps) {
        var _this = this;
        var itemCheckers = this.ttypes.map(function (t) { return t.getChecker(suite, strict, allowedProps); });
        return function (value, ctx) {
            var ur = ctx.unionResolver();
            for (var i = 0; i < itemCheckers.length; i++) {
                var ok = itemCheckers[i](value, ur.createContext());
                if (ok) {
                    return true;
                }
            }
            ctx.resolveUnion(ur);
            return ctx.fail(null, _this._failMsg, 0);
        };
    };
    return TUnion;
}(TType));
exports.TUnion = TUnion;
/**
 * Defines an intersection type, e.g. intersection('number', 'null').
 */
function intersection() {
    var typeSpec = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        typeSpec[_i] = arguments[_i];
    }
    return new TIntersection(typeSpec.map(function (t) { return parseSpec(t); }));
}
exports.intersection = intersection;
var TIntersection = /** @class */ (function (_super) {
    __extends(TIntersection, _super);
    function TIntersection(ttypes) {
        var _this = _super.call(this) || this;
        _this.ttypes = ttypes;
        return _this;
    }
    TIntersection.prototype.getChecker = function (suite, strict, allowedProps) {
        if (allowedProps === void 0) { allowedProps = new Set(); }
        var itemCheckers = this.ttypes.map(function (t) { return t.getChecker(suite, strict, allowedProps); });
        return function (value, ctx) {
            return itemCheckers.every(function (checker) {
                checker(value, ctx.fork());
                return ctx.completeFork();
            }) && !ctx.failed();
        };
    };
    return TIntersection;
}(TType));
exports.TIntersection = TIntersection;
/**
 * Defines an enum type, e.g. enum({'A': 1, 'B': 2}).
 */
function enumtype(values) {
    return new TEnumType(values);
}
exports.enumtype = enumtype;
var TEnumType = /** @class */ (function (_super) {
    __extends(TEnumType, _super);
    function TEnumType(members) {
        var _this = _super.call(this) || this;
        _this.members = members;
        _this.validValues = new Set();
        _this._failMsg = "is not a valid enum value";
        _this.validValues = new Set(Object.keys(members).map(function (name) { return members[name]; }));
        return _this;
    }
    TEnumType.prototype.getChecker = function (suite, strict) {
        var _this = this;
        return function (value, ctx) {
            return (_this.validValues.has(value) ? true : ctx.fail(null, _this._failMsg, 0));
        };
    };
    return TEnumType;
}(TType));
exports.TEnumType = TEnumType;
/**
 * Defines a literal enum value, such as Direction.Up, specified as enumlit("Direction", "Up").
 */
function enumlit(name, prop) {
    return new TEnumLiteral(name, prop);
}
exports.enumlit = enumlit;
var TEnumLiteral = /** @class */ (function (_super) {
    __extends(TEnumLiteral, _super);
    function TEnumLiteral(enumName, prop) {
        var _this = _super.call(this) || this;
        _this.enumName = enumName;
        _this.prop = prop;
        _this._failMsg = "is not " + enumName + "." + prop;
        return _this;
    }
    TEnumLiteral.prototype.getChecker = function (suite, strict) {
        var _this = this;
        var ttype = getNamedType(suite, this.enumName);
        if (!(ttype instanceof TEnumType)) {
            throw new Error("Type " + this.enumName + " used in enumlit is not an enum type");
        }
        var val = ttype.members[this.prop];
        if (!ttype.members.hasOwnProperty(this.prop)) {
            throw new Error("Unknown value " + this.enumName + "." + this.prop + " used in enumlit");
        }
        return function (value, ctx) { return (value === val) ? true : ctx.fail(null, _this._failMsg, -1); };
    };
    return TEnumLiteral;
}(TType));
exports.TEnumLiteral = TEnumLiteral;
function makeIfaceProps(props) {
    return Object.keys(props)
        .filter(function (name) { return (name !== exports.indexKey); })
        .map(function (name) { return makeIfaceProp(name, props[name]); });
}
function makeIfaceProp(name, prop) {
    return prop instanceof TOptional ?
        new TProp(name, prop.ttype, true) :
        new TProp(name, parseSpec(prop), false);
}
/**
 * indexKey is a special key that indicates an index signature when used as a key in an interface.
 * E.g. {[key: string]: number} becomes t.iface([], {[t.indexKey]: "number"}).
 *
 * We don't distinguish between string- and number-type index signatures, and don't support
 * multiple index signatures.
 */
exports.indexKey = Symbol();
/**
 * Defines an interface. The first argument is an array of interfaces that it extends, and the
 * second is an array of properties.
 */
function iface(bases, props) {
    return new TIface(bases, makeIfaceProps(props), props[exports.indexKey]);
}
exports.iface = iface;
var TIface = /** @class */ (function (_super) {
    __extends(TIface, _super);
    function TIface(bases, props, indexType) {
        var _this = _super.call(this) || this;
        _this.bases = bases;
        _this.props = props;
        _this.indexType = indexType ? parseSpec(indexType) : undefined;
        _this.propSet = new Set(props.map(function (p) { return p.name; }));
        return _this;
    }
    TIface.prototype.getChecker = function (suite, strict, allowedProps) {
        var _this = this;
        var _a;
        if (allowedProps === void 0) { allowedProps = new Set(); }
        this.propSet.forEach(function (prop) { return allowedProps.add(prop); });
        var baseCheckers = this.bases.map(function (b) { return getNamedType(suite, b).getChecker(suite, strict, allowedProps); });
        var propCheckers = this.props.map(function (prop) { return prop.ttype.getChecker(suite, strict); });
        var indexTypeChecker = (_a = this.indexType) === null || _a === void 0 ? void 0 : _a.getChecker(suite, strict);
        var testCtx = new util_1.NoopContext();
        // Consider a prop required if it's not optional AND does not allow for undefined as a value.
        var isPropRequired = this.props.map(function (prop, i) {
            return !prop.isOpt && !propCheckers[i](undefined, testCtx);
        });
        return function (value, ctx) {
            if (typeof value !== "object" || value === null) {
                return ctx.fail(null, "is not an object", 0);
            }
            for (var i = 0; i < baseCheckers.length; i++) {
                baseCheckers[i](value, ctx.fork());
                if (!ctx.completeFork()) {
                    return false;
                }
            }
            for (var i = 0; i < propCheckers.length; i++) {
                var name_1 = _this.props[i].name;
                var v = value[name_1];
                if (v === undefined) {
                    if (isPropRequired[i]) {
                        ctx.fork().fail(name_1, "is missing", 1);
                        if (!ctx.completeFork()) {
                            return false;
                        }
                    }
                }
                else {
                    var fork = ctx.fork();
                    var ok = propCheckers[i](v, fork);
                    if (!ok) {
                        fork.fail(name_1, null, 1);
                    }
                    if (!ctx.completeFork()) {
                        return false;
                    }
                }
            }
            if (indexTypeChecker) {
                for (var prop in value) {
                    var fork = ctx.fork();
                    if (!indexTypeChecker(value[prop], fork)) {
                        fork.fail(prop, null, 1);
                    }
                    if (!ctx.completeFork()) {
                        return false;
                    }
                }
            }
            else if (strict) {
                // In strict mode, check also for unknown enumerable properties.
                for (var prop in value) {
                    if (!allowedProps.has(prop)) {
                        ctx.fork().fail(prop, "is extraneous", 2);
                        if (!ctx.completeFork()) {
                            return false;
                        }
                    }
                }
            }
            return !ctx.failed();
        };
    };
    return TIface;
}(TType));
exports.TIface = TIface;
/**
 * Defines an optional property on an interface.
 */
function opt(typeSpec) { return new TOptional(parseSpec(typeSpec)); }
exports.opt = opt;
var TOptional = /** @class */ (function (_super) {
    __extends(TOptional, _super);
    function TOptional(ttype) {
        var _this = _super.call(this) || this;
        _this.ttype = ttype;
        return _this;
    }
    TOptional.prototype.getChecker = function (suite, strict) {
        var itemChecker = this.ttype.getChecker(suite, strict);
        return function (value, ctx) {
            return value === undefined || itemChecker(value, ctx);
        };
    };
    return TOptional;
}(TType));
exports.TOptional = TOptional;
/**
 * Defines a property in an interface.
 */
var TProp = /** @class */ (function () {
    function TProp(name, ttype, isOpt) {
        this.name = name;
        this.ttype = ttype;
        this.isOpt = isOpt;
    }
    return TProp;
}());
exports.TProp = TProp;
/**
 * Defines a function. The first argument declares the function's return type, the rest declare
 * its parameters.
 */
function func(resultSpec) {
    var params = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        params[_i - 1] = arguments[_i];
    }
    return new TFunc(new TParamList(params), parseSpec(resultSpec));
}
exports.func = func;
var TFunc = /** @class */ (function (_super) {
    __extends(TFunc, _super);
    function TFunc(paramList, result) {
        var _this = _super.call(this) || this;
        _this.paramList = paramList;
        _this.result = result;
        return _this;
    }
    TFunc.prototype.getChecker = function (suite, strict) {
        return function (value, ctx) {
            return typeof value === "function" ? true : ctx.fail(null, "is not a function", 0);
        };
    };
    return TFunc;
}(TType));
exports.TFunc = TFunc;
/**
 * Defines a function parameter.
 */
function param(name, typeSpec, isOpt) {
    return new TParam(name, parseSpec(typeSpec), Boolean(isOpt));
}
exports.param = param;
var TParam = /** @class */ (function () {
    function TParam(name, ttype, isOpt) {
        this.name = name;
        this.ttype = ttype;
        this.isOpt = isOpt;
    }
    return TParam;
}());
exports.TParam = TParam;
/**
 * Defines a function parameter list.
 */
var TParamList = /** @class */ (function (_super) {
    __extends(TParamList, _super);
    function TParamList(params) {
        var _this = _super.call(this) || this;
        _this.params = params;
        return _this;
    }
    TParamList.prototype.getChecker = function (suite, strict) {
        var _this = this;
        var itemCheckers = this.params.map(function (t) { return t.ttype.getChecker(suite, strict); });
        var testCtx = new util_1.NoopContext();
        var isParamRequired = this.params.map(function (param, i) {
            return !param.isOpt && !itemCheckers[i](undefined, testCtx);
        });
        var checker = function (value, ctx) {
            if (!Array.isArray(value)) {
                return ctx.fail(null, "is not an array", 0);
            }
            for (var i = 0; i < itemCheckers.length; i++) {
                var p = _this.params[i];
                if (value[i] === undefined) {
                    if (isParamRequired[i]) {
                        return ctx.fail(p.name, "is missing", 1);
                    }
                }
                else {
                    var ok = itemCheckers[i](value[i], ctx);
                    if (!ok) {
                        return ctx.fail(p.name, null, 1);
                    }
                }
            }
            return true;
        };
        if (!strict) {
            return checker;
        }
        return function (value, ctx) {
            if (!checker(value, ctx)) {
                return false;
            }
            return value.length <= itemCheckers.length ? true :
                ctx.fail(itemCheckers.length, "is extraneous", 2);
        };
    };
    return TParamList;
}(TType));
exports.TParamList = TParamList;
/**
 * Single TType implementation for all basic built-in types.
 */
var BasicType = /** @class */ (function (_super) {
    __extends(BasicType, _super);
    function BasicType(validator, message) {
        var _this = _super.call(this) || this;
        _this.validator = validator;
        _this.message = message;
        return _this;
    }
    BasicType.prototype.getChecker = function (suite, strict) {
        var _this = this;
        return function (value, ctx) { return _this.validator(value) ? true : ctx.fail(null, _this.message, 0); };
    };
    return BasicType;
}(TType));
exports.BasicType = BasicType;
/**
 * Defines the suite of basic types.
 */
exports.basicTypes = {
    any: new BasicType(function (v) { return true; }, "is invalid"),
    unknown: new BasicType(function (v) { return true; }, "is invalid"),
    number: new BasicType(function (v) { return (typeof v === "number"); }, "is not a number"),
    object: new BasicType(function (v) { return (typeof v === "object" && v); }, "is not an object"),
    boolean: new BasicType(function (v) { return (typeof v === "boolean"); }, "is not a boolean"),
    string: new BasicType(function (v) { return (typeof v === "string"); }, "is not a string"),
    symbol: new BasicType(function (v) { return (typeof v === "symbol"); }, "is not a symbol"),
    void: new BasicType(function (v) { return (v == null); }, "is not void"),
    undefined: new BasicType(function (v) { return (v === undefined); }, "is not undefined"),
    null: new BasicType(function (v) { return (v === null); }, "is not null"),
    never: new BasicType(function (v) { return false; }, "is unexpected"),
    Date: new BasicType(getIsNativeChecker("[object Date]"), "is not a Date"),
    RegExp: new BasicType(getIsNativeChecker("[object RegExp]"), "is not a RegExp"),
};
// This approach for checking native object types mirrors that of lodash. Its advantage over
// `isinstance` is that it can still return true for native objects created in different JS
// execution environments.
var nativeToString = Object.prototype.toString;
function getIsNativeChecker(tag) {
    return function (v) { return typeof v === "object" && v && nativeToString.call(v) === tag; };
}
if (typeof Buffer !== "undefined") {
    exports.basicTypes.Buffer = new BasicType(function (v) { return Buffer.isBuffer(v); }, "is not a Buffer");
}
var _loop_1 = function (array_1) {
    exports.basicTypes[array_1.name] = new BasicType(function (v) { return (v instanceof array_1); }, "is not a " + array_1.name);
};
// Support typed arrays of various flavors
for (var _i = 0, _a = [Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array,
    Int32Array, Uint32Array, Float32Array, Float64Array, ArrayBuffer]; _i < _a.length; _i++) {
    var array_1 = _a[_i];
    _loop_1(array_1);
}
function getTypeName(t) {
    if (t instanceof TName || t instanceof TLiteral || t instanceof TArray) {
        return t.name;
    }
}


/***/ }),

/***/ 7180:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DetailContext = exports.NoopContext = exports.VError = void 0;
/**
 * Error thrown by validation. Besides an informative message, it includes the path to the
 * property which triggered the failure.
 */
var VError = /** @class */ (function (_super) {
    __extends(VError, _super);
    function VError(path, message) {
        var _this = _super.call(this, message) || this;
        _this.path = path;
        // See https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work for info about this workaround.
        Object.setPrototypeOf(_this, VError.prototype);
        return _this;
    }
    return VError;
}(Error));
exports.VError = VError;
/**
 * Fast implementation of IContext used for first-pass validation. If that fails, we can validate
 * using DetailContext to collect error messages. That's faster for the common case when messages
 * normally pass validation.
 */
var NoopContext = /** @class */ (function () {
    function NoopContext() {
        this._failed = false;
    }
    NoopContext.prototype.fail = function (relPath, message, score) {
        this._failed = true;
        return false;
    };
    NoopContext.prototype.fork = function () {
        return this;
    };
    NoopContext.prototype.completeFork = function () {
        return !this._failed;
    };
    NoopContext.prototype.failed = function () {
        return this._failed;
    };
    NoopContext.prototype.unionResolver = function () { return this; };
    NoopContext.prototype.createContext = function () {
        this._failed = false;
        return this;
    };
    NoopContext.prototype.resolveUnion = function (ur) { };
    return NoopContext;
}());
exports.NoopContext = NoopContext;
/**
 * Complete implementation of IContext that collects meaningfull errors.
 */
var DetailContext = /** @class */ (function () {
    function DetailContext() {
        // Stack of property names and associated messages for reporting helpful error messages.
        this._propNames = [];
        this._messages = [];
        /** Contexts created by fork() which have completed and contain failures */
        this._failedForks = [];
        /**
         * Contains the context returned by fork() which should be checked until
         * completeFork() is called.
         * Will be reused for the next fork() if there are no failures.
         */
        this._currentFork = null;
        // Score is used to choose the best union member whose DetailContext to use for reporting.
        // Higher score means better match (or rather less severe mismatch).
        this._score = 0;
    }
    DetailContext.prototype.fail = function (relPath, message, score) {
        this._propNames.push(relPath);
        this._messages.push(message);
        this._score += score;
        return false;
    };
    DetailContext.prototype.unionResolver = function () {
        return new DetailUnionResolver();
    };
    DetailContext.prototype.resolveUnion = function (unionResolver) {
        var _a, _b, _c;
        var u = unionResolver;
        var best = null;
        for (var _i = 0, _d = u.contexts; _i < _d.length; _i++) {
            var ctx = _d[_i];
            if (!best || ctx._score >= best._score) {
                best = ctx;
            }
        }
        if (best && best._score > 0) {
            (_a = this._propNames).push.apply(_a, best._propNames);
            (_b = this._messages).push.apply(_b, best._messages);
            (_c = this._failedForks).push.apply(_c, best._failedForks);
        }
    };
    DetailContext.prototype.getError = function (path) {
        var fullMessage = flatten(this.getErrorDetails(path).map(errorLines))
            .join("\n");
        return new VError(path, fullMessage);
    };
    DetailContext.prototype.getErrorDetails = function (path) {
        var detail = null;
        var nested;
        var details = [];
        // As checkers call fail() and return to their parent checkers,
        // the deepest failures are recorded first.
        // Go through failures in reverse to start from the root type
        for (var i = this._propNames.length - 1; i >= 0; i--) {
            var p = this._propNames[i];
            path += (typeof p === "number") ? "[" + p + "]" : (p ? "." + p : "");
            var message = this._messages[i];
            if (!message) {
                continue;
            }
            nested = { path: path, message: message };
            if (detail) {
                detail.nested = [nested];
            }
            else {
                // This is the root failure, so it will be returned
                details.push(nested);
            }
            // Move into the deeper error
            detail = nested;
        }
        var forkErrors = flatten(this._failedForks.map(function (fork) { return fork.getErrorDetails(path); }));
        if (detail) {
            // don't put an empty array in detail.nested
            if (forkErrors.length) {
                // detail is the deepest nested error, so detail.nested is null at this point
                detail.nested = forkErrors;
            }
        }
        else {
            // There were no 'plain' failures, only fork failures
            details = forkErrors;
        }
        return details;
    };
    DetailContext.prototype.fork = function () {
        if (this._currentFork == null) {
            this._currentFork = new DetailContext();
        }
        return this._currentFork;
    };
    DetailContext.prototype.completeFork = function () {
        var fork = this._currentFork;
        if (fork._failed()) {
            this._failedForks.push(fork);
            this._currentFork = null;
            // To preserve old behaviour, use the score of the first failure
            // Might want to revise this
            if (this._failedForks.length === 1) {
                this._score = fork._score;
            }
        }
        return this._failedForks.length < DetailContext.maxForks;
    };
    // failed() is the public interface,
    // it gets monkeypatched to ensure correct usage in checkers.
    // _failed() may be called internally
    // in ways which would fail the monkeypatched assertions.
    DetailContext.prototype.failed = function () {
        return this._failed();
    };
    DetailContext.prototype._failed = function () {
        return this._propNames.length + this._failedForks.length > 0;
    };
    /**
     * Maximum number of errors recorded at one level for an object,
     * i.e. the maximum length of Checker.validate() or IErrorDetail.nested.
     */
    // If _failedForks has this length then completeFork() should return false
    // so that the checker stops making more forks.
    DetailContext.maxForks = 3;
    return DetailContext;
}());
exports.DetailContext = DetailContext;
var DetailUnionResolver = /** @class */ (function () {
    function DetailUnionResolver() {
        this.contexts = [];
    }
    DetailUnionResolver.prototype.createContext = function () {
        var ctx = new DetailContext();
        this.contexts.push(ctx);
        return ctx;
    };
    return DetailUnionResolver;
}());
/**
 * Returns lines of a message describing `error`.
 * The lines should be newline separated in the final message.
 * Only returns multiple lines if `error` or a descendant
 * has multiple errors in its `.nested` array.
 * Simple paths of nested errors anywhere in the tree
 * are collapsed into a single line until a branch is reached.
 */
var errorLines = function (error) {
    var rootMessage = error.path + " " + error.message;
    var nestedErrors = error.nested || [];
    var nestedLines = flatten(nestedErrors.map(errorLines));
    if (nestedErrors.length == 1) {
        // Single nested errors are collapsed into the first line,
        // but they may have branches deeper down leading to more lines
        // which are already indented
        var first = nestedLines[0], rest = nestedLines.slice(1);
        return __spreadArrays([
            rootMessage + "; " + first
        ], rest);
    }
    else {
        // Indent messages from nested errors
        // or just return [rootMessage] if there are no nested errors
        return __spreadArrays([
            rootMessage
        ], nestedLines.map(function (line) { return "    " + line; }));
    }
};
/** Shallow flatten a 2D array into a 1D array */
function flatten(arr) {
    var _a;
    return (_a = []).concat.apply(_a, arr);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "APIType": () => (/* reexport safe */ _GristTable__WEBPACK_IMPORTED_MODULE_6__.E),
/* harmony export */   "CustomSectionAPITI": () => (/* reexport safe */ _TypeCheckers__WEBPACK_IMPORTED_MODULE_2__.wv),
/* harmony export */   "FileParserAPITI": () => (/* reexport safe */ _TypeCheckers__WEBPACK_IMPORTED_MODULE_2__.t4),
/* harmony export */   "GristAPITI": () => (/* reexport safe */ _TypeCheckers__WEBPACK_IMPORTED_MODULE_2__.Dv),
/* harmony export */   "GristObjCode": () => (/* reexport safe */ _GristData__WEBPACK_IMPORTED_MODULE_5__.w),
/* harmony export */   "GristTableTI": () => (/* reexport safe */ _TypeCheckers__WEBPACK_IMPORTED_MODULE_2__.PY),
/* harmony export */   "ImportSourceAPITI": () => (/* reexport safe */ _TypeCheckers__WEBPACK_IMPORTED_MODULE_2__.Lj),
/* harmony export */   "InternalImportSourceAPITI": () => (/* reexport safe */ _TypeCheckers__WEBPACK_IMPORTED_MODULE_2__.tX),
/* harmony export */   "RPC_GRISTAPI_INTERFACE": () => (/* reexport safe */ _GristAPI__WEBPACK_IMPORTED_MODULE_4__.X),
/* harmony export */   "RenderOptionsTI": () => (/* reexport safe */ _TypeCheckers__WEBPACK_IMPORTED_MODULE_2__.yM),
/* harmony export */   "StorageAPITI": () => (/* reexport safe */ _TypeCheckers__WEBPACK_IMPORTED_MODULE_2__.jC),
/* harmony export */   "WidgetAPITI": () => (/* reexport safe */ _TypeCheckers__WEBPACK_IMPORTED_MODULE_2__.$H),
/* harmony export */   "addImporter": () => (/* binding */ addImporter),
/* harmony export */   "allowSelectBy": () => (/* binding */ allowSelectBy),
/* harmony export */   "api": () => (/* binding */ api),
/* harmony export */   "checkers": () => (/* reexport safe */ _TypeCheckers__WEBPACK_IMPORTED_MODULE_2__.C4),
/* harmony export */   "clearOptions": () => (/* binding */ clearOptions),
/* harmony export */   "coreDocApi": () => (/* binding */ coreDocApi),
/* harmony export */   "docApi": () => (/* binding */ docApi),
/* harmony export */   "fetchSelectedRecord": () => (/* binding */ fetchSelectedRecord),
/* harmony export */   "fetchSelectedTable": () => (/* binding */ fetchSelectedTable),
/* harmony export */   "getAccessToken": () => (/* binding */ getAccessToken),
/* harmony export */   "getOption": () => (/* binding */ getOption),
/* harmony export */   "getOptions": () => (/* binding */ getOptions),
/* harmony export */   "getSelectedTableId": () => (/* binding */ getSelectedTableId),
/* harmony export */   "getSelectedTableIdSync": () => (/* binding */ getSelectedTableIdSync),
/* harmony export */   "getTable": () => (/* binding */ getTable),
/* harmony export */   "mapColumnNames": () => (/* binding */ mapColumnNames),
/* harmony export */   "mapColumnNamesBack": () => (/* binding */ mapColumnNamesBack),
/* harmony export */   "on": () => (/* binding */ on),
/* harmony export */   "onNewRecord": () => (/* binding */ onNewRecord),
/* harmony export */   "onOptions": () => (/* binding */ onOptions),
/* harmony export */   "onRecord": () => (/* binding */ onRecord),
/* harmony export */   "onRecords": () => (/* binding */ onRecords),
/* harmony export */   "ready": () => (/* binding */ ready),
/* harmony export */   "rpc": () => (/* binding */ rpc),
/* harmony export */   "sectionApi": () => (/* binding */ sectionApi),
/* harmony export */   "selectedTable": () => (/* binding */ selectedTable),
/* harmony export */   "setCursorPos": () => (/* binding */ setCursorPos),
/* harmony export */   "setOption": () => (/* binding */ setOption),
/* harmony export */   "setOptions": () => (/* binding */ setOptions),
/* harmony export */   "setSelectedRows": () => (/* binding */ setSelectedRows),
/* harmony export */   "viewApi": () => (/* binding */ viewApi),
/* harmony export */   "widgetApi": () => (/* binding */ widgetApi)
/* harmony export */ });
/* harmony import */ var _GristAPI__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5090);
/* harmony import */ var _objtypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3965);
/* harmony import */ var _TableOperationsImpl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2104);
/* harmony import */ var _TypeCheckers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8975);
/* harmony import */ var _FileParserAPI__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9872);
/* harmony import */ var _FileParserAPI__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_FileParserAPI__WEBPACK_IMPORTED_MODULE_3__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _FileParserAPI__WEBPACK_IMPORTED_MODULE_3__) if(["default","rpc","api","coreDocApi","viewApi","widgetApi","sectionApi","allowSelectBy","setSelectedRows","setCursorPos","fetchSelectedTable","fetchSelectedRecord","docApi","on","getOption","setOption","setOptions","getOptions","clearOptions","getTable","getAccessToken","selectedTable","getSelectedTableId","getSelectedTableIdSync","mapColumnNames","mapColumnNamesBack","onRecord","onNewRecord","onRecords","onOptions","addImporter","ready","CustomSectionAPITI","FileParserAPITI","GristAPITI","GristTableTI","ImportSourceAPITI","InternalImportSourceAPITI","RenderOptionsTI","StorageAPITI","WidgetAPITI","checkers"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _FileParserAPI__WEBPACK_IMPORTED_MODULE_3__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var _GristData__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6263);
/* harmony import */ var _GristTable__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(511);
/* harmony import */ var _ImportSourceAPI__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(332);
/* harmony import */ var _ImportSourceAPI__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_ImportSourceAPI__WEBPACK_IMPORTED_MODULE_7__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _ImportSourceAPI__WEBPACK_IMPORTED_MODULE_7__) if(["default","rpc","api","coreDocApi","viewApi","widgetApi","sectionApi","allowSelectBy","setSelectedRows","setCursorPos","fetchSelectedTable","fetchSelectedRecord","docApi","on","getOption","setOption","setOptions","getOptions","clearOptions","getTable","getAccessToken","selectedTable","getSelectedTableId","getSelectedTableIdSync","mapColumnNames","mapColumnNamesBack","onRecord","onNewRecord","onRecords","onOptions","addImporter","ready","CustomSectionAPITI","FileParserAPITI","GristAPITI","GristTableTI","ImportSourceAPITI","InternalImportSourceAPITI","RenderOptionsTI","StorageAPITI","WidgetAPITI","checkers","RPC_GRISTAPI_INTERFACE","GristObjCode","APIType"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _ImportSourceAPI__WEBPACK_IMPORTED_MODULE_7__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var _StorageAPI__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(128);
/* harmony import */ var _StorageAPI__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_StorageAPI__WEBPACK_IMPORTED_MODULE_8__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _StorageAPI__WEBPACK_IMPORTED_MODULE_8__) if(["default","rpc","api","coreDocApi","viewApi","widgetApi","sectionApi","allowSelectBy","setSelectedRows","setCursorPos","fetchSelectedTable","fetchSelectedRecord","docApi","on","getOption","setOption","setOptions","getOptions","clearOptions","getTable","getAccessToken","selectedTable","getSelectedTableId","getSelectedTableIdSync","mapColumnNames","mapColumnNamesBack","onRecord","onNewRecord","onRecords","onOptions","addImporter","ready","CustomSectionAPITI","FileParserAPITI","GristAPITI","GristTableTI","ImportSourceAPITI","InternalImportSourceAPITI","RenderOptionsTI","StorageAPITI","WidgetAPITI","checkers","RPC_GRISTAPI_INTERFACE","GristObjCode","APIType"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _StorageAPI__WEBPACK_IMPORTED_MODULE_8__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var _RenderOptions__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(7907);
/* harmony import */ var _RenderOptions__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_RenderOptions__WEBPACK_IMPORTED_MODULE_9__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _RenderOptions__WEBPACK_IMPORTED_MODULE_9__) if(["default","rpc","api","coreDocApi","viewApi","widgetApi","sectionApi","allowSelectBy","setSelectedRows","setCursorPos","fetchSelectedTable","fetchSelectedRecord","docApi","on","getOption","setOption","setOptions","getOptions","clearOptions","getTable","getAccessToken","selectedTable","getSelectedTableId","getSelectedTableIdSync","mapColumnNames","mapColumnNamesBack","onRecord","onNewRecord","onRecords","onOptions","addImporter","ready","CustomSectionAPITI","FileParserAPITI","GristAPITI","GristTableTI","ImportSourceAPITI","InternalImportSourceAPITI","RenderOptionsTI","StorageAPITI","WidgetAPITI","checkers","RPC_GRISTAPI_INTERFACE","GristObjCode","APIType"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _RenderOptions__WEBPACK_IMPORTED_MODULE_9__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var _WidgetAPI__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(8980);
/* harmony import */ var _WidgetAPI__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_WidgetAPI__WEBPACK_IMPORTED_MODULE_10__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _WidgetAPI__WEBPACK_IMPORTED_MODULE_10__) if(["default","rpc","api","coreDocApi","viewApi","widgetApi","sectionApi","allowSelectBy","setSelectedRows","setCursorPos","fetchSelectedTable","fetchSelectedRecord","docApi","on","getOption","setOption","setOptions","getOptions","clearOptions","getTable","getAccessToken","selectedTable","getSelectedTableId","getSelectedTableIdSync","mapColumnNames","mapColumnNamesBack","onRecord","onNewRecord","onRecords","onOptions","addImporter","ready","CustomSectionAPITI","FileParserAPITI","GristAPITI","GristTableTI","ImportSourceAPITI","InternalImportSourceAPITI","RenderOptionsTI","StorageAPITI","WidgetAPITI","checkers","RPC_GRISTAPI_INTERFACE","GristObjCode","APIType"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _WidgetAPI__WEBPACK_IMPORTED_MODULE_10__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var _CustomSectionAPI__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(1406);
/* harmony import */ var _CustomSectionAPI__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_CustomSectionAPI__WEBPACK_IMPORTED_MODULE_11__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _CustomSectionAPI__WEBPACK_IMPORTED_MODULE_11__) if(["default","rpc","api","coreDocApi","viewApi","widgetApi","sectionApi","allowSelectBy","setSelectedRows","setCursorPos","fetchSelectedTable","fetchSelectedRecord","docApi","on","getOption","setOption","setOptions","getOptions","clearOptions","getTable","getAccessToken","selectedTable","getSelectedTableId","getSelectedTableIdSync","mapColumnNames","mapColumnNamesBack","onRecord","onNewRecord","onRecords","onOptions","addImporter","ready","CustomSectionAPITI","FileParserAPITI","GristAPITI","GristTableTI","ImportSourceAPITI","InternalImportSourceAPITI","RenderOptionsTI","StorageAPITI","WidgetAPITI","checkers","RPC_GRISTAPI_INTERFACE","GristObjCode","APIType"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _CustomSectionAPI__WEBPACK_IMPORTED_MODULE_11__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var grain_rpc__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(5217);
/* harmony import */ var grain_rpc__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(grain_rpc__WEBPACK_IMPORTED_MODULE_12__);
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















const rpc = new grain_rpc__WEBPACK_IMPORTED_MODULE_12__.Rpc({ logger: createRpcLogger() });
const api = rpc.getStub(_GristAPI__WEBPACK_IMPORTED_MODULE_4__/* .RPC_GRISTAPI_INTERFACE */ .X, _TypeCheckers__WEBPACK_IMPORTED_MODULE_2__/* .checkers.GristAPI */ .C4.GristAPI);
const coreDocApi = rpc.getStub("GristDocAPI@grist", _TypeCheckers__WEBPACK_IMPORTED_MODULE_2__/* .checkers.GristDocAPI */ .C4.GristDocAPI);
const viewApi = rpc.getStub("GristView", _TypeCheckers__WEBPACK_IMPORTED_MODULE_2__/* .checkers.GristView */ .C4.GristView);
const widgetApi = rpc.getStub("WidgetAPI", _TypeCheckers__WEBPACK_IMPORTED_MODULE_2__/* .checkers.WidgetAPI */ .C4.WidgetAPI);
const sectionApi = rpc.getStub("CustomSectionAPI", _TypeCheckers__WEBPACK_IMPORTED_MODULE_2__/* .checkers.CustomSectionAPI */ .C4.CustomSectionAPI);
const allowSelectBy = viewApi.allowSelectBy;
const setSelectedRows = viewApi.setSelectedRows;
const setCursorPos = viewApi.setCursorPos;
async function fetchSelectedTable(options = {}) {
  const table = await viewApi.fetchSelectedTable();
  return options.keepEncoded ? table : (0,_objtypes__WEBPACK_IMPORTED_MODULE_0__/* .mapValues */ .Q8)(table, (col) => col.map(_objtypes__WEBPACK_IMPORTED_MODULE_0__/* .decodeObject */ .xD));
}
async function fetchSelectedRecord(rowId, options = {}) {
  const rec = await viewApi.fetchSelectedRecord(rowId);
  return options.keepEncoded ? rec : (0,_objtypes__WEBPACK_IMPORTED_MODULE_0__/* .mapValues */ .Q8)(rec, _objtypes__WEBPACK_IMPORTED_MODULE_0__/* .decodeObject */ .xD);
}
const docApi = __spreadProps(__spreadValues(__spreadValues({}, coreDocApi), viewApi), {
  fetchSelectedTable,
  fetchSelectedRecord
});
const on = rpc.on.bind(rpc);
const getOption = widgetApi.getOption.bind(widgetApi);
const setOption = widgetApi.setOption.bind(widgetApi);
const setOptions = widgetApi.setOptions.bind(widgetApi);
const getOptions = widgetApi.getOptions.bind(widgetApi);
const clearOptions = widgetApi.clearOptions.bind(widgetApi);
function getTable(tableId) {
  return new _TableOperationsImpl__WEBPACK_IMPORTED_MODULE_1__/* .TableOperationsImpl */ .Ld({
    async getTableId() {
      return tableId || await getSelectedTableId();
    },
    throwError(verb, text, status) {
      throw new Error(text);
    },
    applyUserActions(actions, opts) {
      return docApi.applyUserActions(actions, opts);
    }
  }, {});
}
async function getAccessToken(options) {
  return docApi.getAccessToken(options || {});
}
const selectedTable = getTable();
async function getSelectedTableId() {
  await _initialization;
  return _tableId;
}
function getSelectedTableIdSync() {
  return _tableId;
}
let _mappingsCache;
let _activeRefreshReq = null;
let _columnsToMap;
let _tableId;
let _setInitialized;
const _initialization = new Promise((resolve) => _setInitialized = resolve);
let _readyCalled = false;
async function getMappingsIfChanged(data) {
  const uninitialized = _mappingsCache === void 0;
  if (data.mappingsChange || uninitialized) {
    if (!_activeRefreshReq) {
      _activeRefreshReq = sectionApi.mappings().then((mappings) => void (_mappingsCache = mappings)).finally(() => _activeRefreshReq = null);
    }
    await _activeRefreshReq;
  }
  return _mappingsCache ? JSON.parse(JSON.stringify(_mappingsCache)) : null;
}
function mapColumnNames(data, options) {
  options = __spreadValues({ columns: _columnsToMap, mappings: _mappingsCache, reverse: false }, options);
  if (!options.columns) {
    return data;
  }
  if (!options.mappings) {
    return null;
  }
  if (Array.isArray(data) && data.length === 0) {
    return data;
  }
  const transformations = [];
  transformations.push((from, to) => to.id = from.id);
  function isOptional(col) {
    var _a, _b;
    return Boolean(!((_a = options.columns) == null ? void 0 : _a.includes(col)) && ((_b = options.columns) == null ? void 0 : _b.find((c) => typeof c === "object" && (c == null ? void 0 : c.name) === col && c.optional)));
  }
  for (const widgetCol of Object.keys(options.mappings).sort()) {
    const gristCol = options.mappings[widgetCol];
    if (Array.isArray(gristCol) && gristCol.length) {
      if (!options.reverse) {
        transformations.push((from, to) => {
          to[widgetCol] = gristCol.map((col) => from[col]);
        });
      } else {
        transformations.push((from, to) => {
          var _a;
          for (const [idx, col] of gristCol.entries()) {
            to[col] = (_a = from[widgetCol]) == null ? void 0 : _a[idx];
          }
        });
      }
    } else if (!Array.isArray(gristCol) && gristCol) {
      if (!options.reverse) {
        transformations.push((from, to) => to[widgetCol] = from[gristCol]);
      } else {
        transformations.push((from, to) => to[gristCol] = from[widgetCol]);
      }
    } else if (!isOptional(widgetCol)) {
      return null;
    }
  }
  const convert = (rec) => transformations.reduce((obj, tran) => {
    tran(rec, obj);
    return obj;
  }, {});
  return Array.isArray(data) ? data.map(convert) : convert(data);
}
function mapColumnNamesBack(data, options) {
  return mapColumnNames(data, __spreadProps(__spreadValues({}, options), { reverse: true }));
}
function onRecord(callback) {
  on("message", async function(msg) {
    if (!msg.tableId || !msg.rowId || msg.rowId === "new") {
      return;
    }
    const rec = await docApi.fetchSelectedRecord(msg.rowId);
    callback(rec, await getMappingsIfChanged(msg));
  });
}
function onNewRecord(callback) {
  on("message", async function(msg) {
    if (msg.tableId && msg.rowId === "new") {
      callback(await getMappingsIfChanged(msg));
    }
  });
}
function onRecords(callback) {
  on("message", async function(msg) {
    if (!msg.tableId || !msg.dataChange) {
      return;
    }
    const data = await docApi.fetchSelectedTable();
    if (!data.id) {
      return;
    }
    const rows = [];
    for (let i = 0; i < data.id.length; i++) {
      const row = { id: data.id[i] };
      for (const key of Object.keys(data)) {
        row[key] = data[key][i];
      }
      rows.push(row);
    }
    callback(rows, await getMappingsIfChanged(msg));
  });
}
function onOptions(callback) {
  on("message", async function(msg) {
    if (msg.settings) {
      callback(msg.options || null, msg.settings);
    }
  });
}
async function addImporter(name, path, mode, options) {
  rpc.registerImpl(name, {
    async getImportSource(target) {
      const procId = await api.render(path, mode === "inline" ? target : "fullscreen", options);
      try {
        const stubName = `${name}@${path}`;
        return await rpc.getStub(stubName).getImportSource();
      } finally {
        await api.dispose(procId);
      }
    }
  });
}
function ready(settings) {
  if (_readyCalled) {
    return;
  }
  _readyCalled = true;
  if (settings && settings.onEditOptions) {
    rpc.registerFunc("editOptions", settings.onEditOptions);
  }
  on("message", async function(msg) {
    if (msg.tableId && msg.tableId !== _tableId) {
      if (!_tableId) {
        _setInitialized();
      }
      _tableId = msg.tableId;
    }
  });
  rpc.processIncoming();
  void async function() {
    await rpc.sendReadyMessage();
    if (settings) {
      const options = __spreadProps(__spreadValues({}, settings), {
        hasCustomOptions: Boolean(settings.onEditOptions)
      });
      delete options.onEditOptions;
      _columnsToMap = options.columns;
      await sectionApi.configure(options).catch((err) => console.error(err));
    }
  }();
}
function getPluginPath(location) {
  return location.pathname.replace(/^\/plugins\//, "");
}
if (typeof window !== "undefined") {
  const preloadWindow = window;
  if (preloadWindow.isRunningUnderElectron) {
    rpc.setSendMessage((msg) => preloadWindow.sendToHost(msg));
    preloadWindow.onGristMessage((data) => rpc.receiveMessage(data));
  } else {
    rpc.setSendMessage((msg) => window.parent.postMessage(msg, "*"));
    window.onmessage = (e) => rpc.receiveMessage(e.data);
  }
  rpc.registerFunc("print", () => window.print());
} else if (typeof process === "undefined") {
  self.onmessage = (e) => rpc.receiveMessage(e.data);
  rpc.setSendMessage((mssg) => self.postMessage(mssg));
} else if (typeof process.send !== "undefined") {
  rpc.setSendMessage((data) => {
    process.send(data);
  });
  process.on("message", (data) => rpc.receiveMessage(data));
  process.on("disconnect", () => {
    process.exit(0);
  });
} else {
  rpc.setSendMessage((data) => {
    return;
  });
}
function createRpcLogger() {
  let prefix;
  if (typeof window !== "undefined") {
    prefix = `PLUGIN VIEW ${getPluginPath(window.location)}:`;
  } else if (typeof process === "undefined") {
    prefix = `PLUGIN VIEW ${getPluginPath(self.location)}:`;
  } else if (typeof process.send !== "undefined") {
    prefix = `PLUGIN NODE ${process.env.GRIST_PLUGIN_PATH || "<unset-plugin-id>"}:`;
  } else {
    return {};
  }
  return {
    info(msg) {
      console.log("%s %s", prefix, msg);
    },
    warn(msg) {
      console.warn("%s %s", prefix, msg);
    }
  };
}

})();

grist = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=grist-plugin-api.js.map