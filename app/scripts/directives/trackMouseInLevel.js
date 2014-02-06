'use strict';

angular.module('emulvcApp')
  .directive('trackmouseinlevel', function (ConfigProviderService, viewState, Levelservice) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {

        var lastEventClick;
        var lastEventClickId;
        var lastEventRightClick;
        var lastEventRightClickId;
        var lastEventMove;
        var lastEventMoveId;
        var lastPCM;
        var thisPCM;
        var levelID = scope.level.name;
        var levelType = scope.level.type;

        element.bind('click', function (event) {
          setLastMove(event, true);
          setLastClick(event);
        });

        element.bind('contextmenu', function (event) {
          event.preventDefault();
          setLastMove(event, true);
          setLastRightClick(event);

        });

        element.bind('dblclick', function (event) {
          setLastMove(event, true);
          if (ConfigProviderService.vals.restrictions.editItemName) {
            setLastDblClick(event);
          } else {
            setLastClick(event);
          }
        });

        element.bind('mousemove', function (event) {
          var moveLine = true;
          var zoom = viewState.getPCMpp(event);
          thisPCM = getX(event) * zoom;
          var moveBy = (thisPCM - lastPCM);

          if (zoom <= 1) {
            // ansolute movement in pcm below 1 pcm per pixel
            moveBy = Math.floor((thisPCM + scope.vs.curViewPort.sS) - Levelservice.getElementDetails(scope.this.level.LevelName, viewState.getcurMouseSegmentId()).sampleStart);
          } else {
            // relative movement in pcm above 1 pcm per pixel
            moveBy = Math.round(thisPCM - lastPCM);
          }
          switch (event.which) {
          case 1:
            //console.log('Left mouse button pressed');
            break;
          case 2:
            //console.log('Middle mouse button pressed');
            break;
          case 3:
            //console.log('Right mouse button pressed');
            break;
          default:
            if (viewState.getdragBarActive() === false) {
              if (ConfigProviderService.vals.restrictions.editItemSize && event.shiftKey) {
                viewState.deleteEditArea();
                scope.levelDetails.moveBoundry(moveBy, scope.this.level, viewState.getcurMouseSegmentId(), scope.vs.curViewPort.bufferLength);
                // console.log(lastPCM);
                // console.log(scope.this.level.LevelName);
                viewState.selectBoundry();
                viewState.movingBoundary = true;
                scope.hists.updateCurChangeObj({
                  'type': 'ESPS',
                  'action': 'moveBoundary',
                  'levelName': scope.this.level.LevelName,
                  'itemIdx': viewState.getcurMouseSegmentId(),
                  'max': scope.vs.curViewPort.bufferLength,
                  'movedBy': moveBy
                });

                lastPCM = thisPCM;
                scope.$apply();
                moveLine = false;
              } else if (ConfigProviderService.vals.restrictions.editItemSize && event.altKey) {
                viewState.deleteEditArea();
                scope.levelDetails.moveSegment(moveBy, scope.this.level, viewState.getselected().sort());
                lastPCM = thisPCM;
                viewState.selectBoundry();
                scope.hists.updateCurChangeObj({
                  'type': 'ESPS',
                  'action': 'moveSegment',
                  'levelName': scope.this.level.LevelName,
                  'itemIdx': viewState.getselected().sort(),
                  'movedBy': moveBy
                });

                scope.$apply();
              } else {
                viewState.movingBoundary = false;
              }
            }
            break;
          }
          setLastMove(event, moveLine);
        });

        element.bind('mousedown', function (event) {
          setLastMove(event, true);
        });


        element.bind('mouseup', function (event) {
          setLastMove(event, true);
        });

        element.bind('mouseout', function (event) {
          viewState.movingBoundary = false;
          setLastMove(event, true);
        });
        //levelID

        function setLastClick(x) {
          thisPCM = getX(x) * viewState.getPCMpp(x);
          console.log(thisPCM);
          viewState.deleteEditArea();
          viewState.setEditing(false);
          viewState.focusInTextField = false;
          lastEventClick = Levelservice.getEvent(thisPCM + scope.vs.curViewPort.sS, scope.this.level, false, scope.vs.curViewPort.bufferLength);
          lastEventRightClick = lastEventClick;
          viewState.setlasteditArea('_' + lastEventClick.id);
          viewState.setcurClickLevel(levelID, levelType, scope.$index, scope.this.level.elements.length);
          viewState.setcurClickSegment(lastEventClick, lastEventClick.id);
          lastPCM = thisPCM;
          scope.$apply();
        }

        function setLastRightClick(x) {
          if (viewState.getcurClickLevelName() !== levelID) {
            setLastClick(x);
          }
          thisPCM = getX(x) * viewState.getPCMpp(x);
          viewState.deleteEditArea();
          lastEventClick = Levelservice.getEvent(thisPCM + scope.vs.curViewPort.sS, scope.this.level, false, scope.vs.curViewPort.bufferLength);
          viewState.setcurClickLevel(levelID, levelType, scope.$index, scope.this.level.elements.length);
          viewState.setcurClickSegmentMultiple(lastEventClick, lastEventClick.id);
          lastPCM = thisPCM;
          scope.$apply();
        }

        function setLastDblClick(x) {
          thisPCM = getX(x) * viewState.getPCMpp(x);
          lastEventClick = Levelservice.getEvent(thisPCM + scope.vs.curViewPort.sS, scope.this.level, false, scope.vs.curViewPort.bufferLength);
          viewState.setcurClickLevel(levelID, levelType, scope.$index, scope.this.level.elements.length);
          viewState.setcurClickSegment(lastEventClick, lastEventClick.id);
          viewState.setlasteditArea('_' + lastEventClick.id);
          viewState.setEditing(true);
          viewState.openEditArea(lastEventClick, lastEventClick.id, levelType, element);
          scope.cursorInTextField();
          lastPCM = thisPCM;
          scope.$apply();
        }

        function setLastMove(x, doChange) {
          thisPCM = getX(x) * viewState.getPCMpp(x);
          lastEventMove = Levelservice.getEvent(thisPCM + scope.vs.curViewPort.sS, scope.this.level, true, scope.vs.curViewPort.bufferLength);
          viewState.setcurMouseLevelName(levelID);
          if (doChange && (lastEventMove != undefined)) {
            viewState.setcurMouseSegment(lastEventMove);
            viewState.setcurMouseSegmentId(lastEventMove.id);
          }
          viewState.setcurMouseLevelName(levelID);
          viewState.setcurMouseLevelType(levelType);
          lastPCM = thisPCM;
          scope.$apply();
        }

        function getX(e) {
          return e.offsetX * (e.originalEvent.srcElement.width / e.originalEvent.srcElement.clientWidth);
        }
      }
    };
  });