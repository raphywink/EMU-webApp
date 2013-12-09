'use strict';

angular.module('emulvcApp')
	.service('Appcachehandler', function Appcachehandler($http) {
		// shared service object
		var sServObj = {};

		var appCache = window.applicationCache;

		var cacheProperties = {
			filesDownloaded: 0,
			totalFiles: 0
		};

		function getTotalFiles() {
			// First, reset the total file count and download count.
			cacheProperties.filesDownloaded = 0;
			cacheProperties.totalFiles = 0;

			$http.get('manifest.appcache').success(function (content) {
				// console.log(content);
				content = content.replace(
					new RegExp(
						'(NETWORK|FALLBACK):' +
						'((?!(NETWORK|FALLBACK|CACHE):)[\\w\\W]*)',
						'gi'
					),
					''
				);

				// Strip out all comments.
				content = content.replace(
					new RegExp('#[^\\r\\n]*(\\r\\n?|\\n)', 'g'),
					''
				);

				// Strip out the cache manifest header and
				// trailing slashes.
				content = content.replace(
					new RegExp('CACHE MANIFEST\\s*|\\s*$', 'g'),
					''
				);

				// Strip out extra line breaks and replace with
				// a hash sign that we can break on.
				content = content.replace(
					new RegExp('[\\r\\n]+', 'g'),
					'#'
				);

				// Get the total number of files.
				var totalFiles = content.split('#').length;

				// Store the total number of files. Here, we are
				// adding one for *THIS* file, which is cached
				// implicitly as it points to the manifest.
				cacheProperties.totalFiles = (totalFiles + 1);
				console.log('##########################');
				alert(cacheProperties.totalFiles);
			});

		}

		function handleCheckingEvent(e) {
			console.log('###### handleCheckingEvent ##########');
			console.log(e);
		}

		function handleNoupdateEvent(e) {
			console.log('###### handleNoupdateEvent ##########');
			console.log(e);
		}

		function handleDownloadingEvent(e) {
			console.log('######## handleDownloadingEvent ##########');
			console.log(e);
			getTotalFiles();
		}

		function handleProgressEvent(e) {
			console.log('###### handleProgressEvent ##########');
			console.log(e);
		}

		function handleCachedEvent(e) {
			console.log('###### handleCachedEvent ##########');
			console.log(e);
		}

		function handleUpdatereadyEvent(e) {
			console.log('###### handleUpdatereadyEvent ##########');
			console.log(e);
		}

		function handleObsoleteEvent(e) {
			console.log('###### handleObsoleteEvent ##########');
			console.log(e);
		}

		function handleErrorEvent(e) {
			console.log('###### handleErrorEvent ##########');
			console.log(e);
		}


		// bind evts
		// appCache.addEventListener('progress', handleProgressEvent, false);

		appCache.addEventListener('checking', handleCheckingEvent, false);
		appCache.addEventListener('noupdate', handleNoupdateEvent, false);
		appCache.addEventListener('downloading', handleDownloadingEvent, false);
		appCache.addEventListener('progress', handleProgressEvent, false);
		appCache.addEventListener('cached', handleCachedEvent, false);
		appCache.addEventListener('updateready', handleUpdatereadyEvent, false);
		appCache.addEventListener('obsolete', handleObsoleteEvent, false);
		appCache.addEventListener('error', handleErrorEvent, false);

		/////////////////////////////////////////////////
		// public api

		sServObj.checkForNewVersion = function () {
			console.log('check for new version');
			// appCache.update();
		};

		return sServObj;
	});