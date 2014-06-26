'use strict';

angular.module('emuwebApp')
	.controller('ModalCtrl', function ($scope, dialogService, passedInTxt, viewState, Levelservice, HistoryService) {

		$scope.passedInTxt = passedInTxt;
		$scope.passedOutTxt = {
			'var': null,
		};

		$scope.cancel = function () {
			dialogService.close();
		};

		/**
		 *
		 */
		$scope.cursorInTextField = function () {
			viewState.focusInTextField = true;
		};

		/**
		 *
		 */
		$scope.cursorOutOfTextField = function () {
			viewState.focusInTextField = false;
		};

		/**
		 *  Save changes made on SSFF
		 */
		$scope.saveChanges = function (name) {
			dialogService.close('saveChanges');
		};


		/**
		 *  Save changes made on SSFF
		 */
		$scope.discardChanges = function (name) {
			dialogService.close('discardChanges');
		};


		/**
		 *  Rename a level
		 */
		$scope.renameLevel = function () {

			Levelservice.renameLevel($scope.passedInTxt, $scope.passedOutTxt.var, viewState.curPerspectiveIdx);
			HistoryService.addObjToUndoStack({
				'type': 'ESPS',
				'action': 'renameLevel',
				'levelName': $scope.passedOutTxt.var,
				'oldName': $scope.passedInTxt,
				'curPerspectiveIdx': viewState.curPerspectiveIdx
			});
			dialogService.close();
		};

		/**
		 *  Delete a complete level from Levelservice
		 */
		$scope.deleteLevel = function () {
			var lvl = Levelservice.getLevelDetails(viewState.getcurClickLevelName());
			Levelservice.deleteLevel(viewState.getcurClickLevelName(), viewState.getcurClickLevelIndex(), viewState.curPerspectiveIdx);
			HistoryService.addObjToUndoStack({
				'type': 'ESPS',
				'action': 'deleteLevel',
				'level': lvl.level,
				'idx': viewState.getcurClickLevelIndex(),
				'curPerspectiveIdx': viewState.curPerspectiveIdx
			});
			dialogService.close();
		};

	});