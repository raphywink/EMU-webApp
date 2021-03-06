import * as angular from 'angular';

/**
 * @ngdoc service
 * @name emuwebApp.loadedMetaDataService
 * @description
 * # loadedMetaDataService
 * Service in the emuwebApp.
 */
angular.module('emuwebApp')
	.service('loadedMetaDataService', function loadedMetaDataService(Validationservice) {
		// shared service object
		var sServObj = {} as any;

		//////////////////////
		// private vars
		var uniqSessionList = [];
		var bundleList = [];
		var curBndl = {} as any;
		var demoDbName = '';
		var rendOptBndlList = {} as any; // render optimized bundle list

		//////////////////////
		// private functions
		function genUniqSessionList(bndlList) {
			var sList = [];
			var fistSes;
			bndlList.forEach(function (bndl, idx) {
				sList[bndl.session] = {
					'collapsed': true
				};
				if (idx === 0) {
					fistSes = bndl.session;
				}
			});
			// open fist session up 
			sList[fistSes].collapsed = false;
			return sList;
		}

		function genRendOptBndlList(bndlList) {
			bndlList.forEach(function (bndl) {
				if (rendOptBndlList[bndl.session] === undefined) {
					rendOptBndlList[bndl.session] = [];
				}
				rendOptBndlList[bndl.session].push(bndl);
			});
			return rendOptBndlList;
		}

		//////////////////////
		//////////////////////
		// public API

		///////////////
		// bundleList

		/**
		 * setter for bundleList
		 * @returns validation result for bundle list
		 */
		sServObj.setBundleList = function (bList) {
			// validate
			var validRes = Validationservice.validateJSO('bundleListSchema', bList);
			if (validRes === true) {
				// set
				bundleList = bList;
				// generate uniqSessionList
				uniqSessionList = genUniqSessionList(bundleList);
				// generate render optimized bundlList
				rendOptBndlList = genRendOptBndlList(bundleList);
			}
			return validRes;
		};

		/**
		 * getter for bundleList
		 */
		sServObj.getBundleList = function () {
			return bundleList;
		};

		/**
		 * getter for rendOptBndlList
		 */
		sServObj.getRendOptBndlList = function () {
			return rendOptBndlList;
		};

		///////////
		// curBndl 

		/**
		 * getter curBndl
		 */
		sServObj.getCurBndl = function () {
			return curBndl;
		};

		/**
		 * setter curBndl
		 */
		sServObj.setCurBndl = function (bndl) {
			curBndl = bndl;
		};

		/**
		 * remove BndlComment
		 */
		sServObj.setBndlComment = function (comment, key, index) {
			rendOptBndlList[key][index].comment = comment;
		};

		/**
		 * setter BndlFinished
		 */
		sServObj.setBndlFinished = function (finished, key, index) {
			rendOptBndlList[key][index].finishedEditing = finished;
		};


		/**
		 * getter curBndl name
		 */
		sServObj.getCurBndlName = function () {
			return curBndl.name;
		};

		/**
		 * setter curBndl name
		 */
		sServObj.setCurBndlName = function (name) {
			curBndl.name = name;
		};

		///////////
		// timeAnchors

		/**
		 * setter timeAnchors
		 */
		sServObj.setTimeAnchors = function (timeAnchors) {
			curBndl.timeAnchors = timeAnchors;
		};



		//////////////
		// demoDbName

		/**
		 * setter demoDbName
		 */
		sServObj.setDemoDbName = function (name) {
			demoDbName = name;
		};

		/**
		 * getter demoDbName
		 */
		sServObj.getDemoDbName = function () {
			return demoDbName;
		};


		///////////////////
		// uniqSessionList

		/**
		 *
		 */
		sServObj.toggleCollapseSession = function (session) {
			// console.log(session);
			if(uniqSessionList[session] === undefined) {
				uniqSessionList[session] = {};
			}
			uniqSessionList[session].collapsed = !uniqSessionList[session].collapsed;
			// close all other sessions
			Object.keys(uniqSessionList).forEach(function (key) {
				if (key !== session) {
					uniqSessionList[key].collapsed = true;
				}
			});
		};
		
		sServObj.openCollapseSession = function (session) {
			// console.log(session);
			uniqSessionList[session] = {};
			uniqSessionList[session].collapsed = false;
			// close all other sessions
			Object.keys(uniqSessionList).forEach(function (key) {
				if (key !== session) {
					uniqSessionList[key].collapsed = true;
				}
			});
		};

		/**
		 *
		 */
		// sServObj.updateCollapseSessionState = function (text) {
		// 	angular.forEach(sServObj.getBundleList(), function (bundle) {
		// 		if (bundle.name.indexOf(text)) {
		// 			uniqSessionList[bundle.session].collapsed = false;
		// 		} else {
		// 			uniqSessionList[bundle.session].collapsed = true;
		// 		}
		// 	});
		// };

		/**
		 *
		 */
		sServObj.getSessionCollapseState = function (session) {
			if(uniqSessionList[session] === undefined) {
				return undefined;
			}
			else {
				return uniqSessionList[session].collapsed;
			}
		};


		///////////////////
		// other functions

		/**
		 * reset all private vals to init state
		 */
		sServObj.resetToInitState = function () {
			uniqSessionList = [];
			bundleList = [];
			curBndl = {};
			rendOptBndlList = {};
		};

		return (sServObj);
	});