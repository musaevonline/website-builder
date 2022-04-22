/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"MaterialUI/Stepper.js": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./MaterialUI/js/Stepper.js","vendors.js"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./MaterialUI/js/Stepper.js":
/*!**********************************!*\
  !*** ./MaterialUI/js/Stepper.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return VerticalLinearStepper; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ \"./node_modules/react-dom/index.js\");\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _mui_material_Box__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @mui/material/Box */ \"./node_modules/@mui/material/Box/index.js\");\n/* harmony import */ var _mui_material_Stepper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @mui/material/Stepper */ \"./node_modules/@mui/material/Stepper/index.js\");\n/* harmony import */ var _mui_material_Step__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @mui/material/Step */ \"./node_modules/@mui/material/Step/index.js\");\n/* harmony import */ var _mui_material_StepLabel__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @mui/material/StepLabel */ \"./node_modules/@mui/material/StepLabel/index.js\");\n/* harmony import */ var _mui_material_StepContent__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @mui/material/StepContent */ \"./node_modules/@mui/material/StepContent/index.js\");\n/* harmony import */ var _mui_material_Button__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @mui/material/Button */ \"./node_modules/@mui/material/Button/index.js\");\n/* harmony import */ var _mui_material_Paper__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @mui/material/Paper */ \"./node_modules/@mui/material/Paper/index.js\");\n/* harmony import */ var _mui_material_Typography__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @mui/material/Typography */ \"./node_modules/@mui/material/Typography/index.js\");\n\n\n\n\n\n\n\n\n\n\nconst SCRIPT = document.currentScript;\nconst SCRIPT_ID = SCRIPT.getAttribute('id');\nconst TEMPLATE = window.TEMPLATES[SCRIPT_ID];\nconst steps = [{\n  label: 'Select campaign settings',\n  description: `For each ad campaign that you create, you can control how much\n              you're willing to spend on clicks and conversions, which networks\n              and geographical locations you want your ads to show on, and more.`\n}, {\n  label: 'Create an ad group',\n  description: 'An ad group contains one or more ads which target a shared set of keywords.'\n}, {\n  label: 'Create an ad',\n  description: `Try out different ad text to see what brings in the most customers,\n              and learn how to enhance your ads using features like ad extensions.\n              If you run into any problems with your ads, find out how to tell if\n              they're running and how to resolve approval issues.`\n}];\nfunction VerticalLinearStepper() {\n  const [activeStep, setActiveStep] = react__WEBPACK_IMPORTED_MODULE_0__[\"useState\"](0);\n\n  const handleNext = () => {\n    setActiveStep(prevActiveStep => prevActiveStep + 1);\n  };\n\n  const handleBack = () => {\n    setActiveStep(prevActiveStep => prevActiveStep - 1);\n  };\n\n  const handleReset = () => {\n    setActiveStep(0);\n  };\n\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](_mui_material_Box__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n    sx: {\n      maxWidth: 400\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](_mui_material_Stepper__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n    activeStep: activeStep,\n    orientation: \"vertical\"\n  }, steps.map((step, index) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](_mui_material_Step__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n    key: step.label\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](_mui_material_StepLabel__WEBPACK_IMPORTED_MODULE_5__[\"default\"], {\n    optional: index === 2 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](_mui_material_Typography__WEBPACK_IMPORTED_MODULE_9__[\"default\"], {\n      variant: \"caption\"\n    }, \"Last step\") : null\n  }, step.label), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](_mui_material_StepContent__WEBPACK_IMPORTED_MODULE_6__[\"default\"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](_mui_material_Typography__WEBPACK_IMPORTED_MODULE_9__[\"default\"], null, step.description), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](_mui_material_Box__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n    sx: {\n      mb: 2\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](_mui_material_Button__WEBPACK_IMPORTED_MODULE_7__[\"default\"], {\n    variant: \"contained\",\n    onClick: handleNext,\n    sx: {\n      mt: 1,\n      mr: 1\n    }\n  }, index === steps.length - 1 ? 'Finish' : 'Continue'), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](_mui_material_Button__WEBPACK_IMPORTED_MODULE_7__[\"default\"], {\n    disabled: index === 0,\n    onClick: handleBack,\n    sx: {\n      mt: 1,\n      mr: 1\n    }\n  }, \"Back\"))))))), activeStep === steps.length && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](_mui_material_Paper__WEBPACK_IMPORTED_MODULE_8__[\"default\"], {\n    square: true,\n    elevation: 0,\n    sx: {\n      p: 3\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](_mui_material_Typography__WEBPACK_IMPORTED_MODULE_9__[\"default\"], null, \"All steps completed - you're finished\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](_mui_material_Button__WEBPACK_IMPORTED_MODULE_7__[\"default\"], {\n    onClick: handleReset,\n    sx: {\n      mt: 1,\n      mr: 1\n    }\n  }, \"Reset\")));\n}\nreact_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](VerticalLinearStepper, null), TEMPLATE);\n\n//# sourceURL=webpack:///./MaterialUI/js/Stepper.js?");

/***/ })

/******/ });