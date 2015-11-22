'use strict';

$(function() {
	var puzzle = new Picpuzzle(),
		level = 3,
		collWidth = 0,
		startX = 0,
		collectionItemsList = $('#items'),
		previewImage = $('#previewpic'),
		getImageByURLButton = $('#loadpic'),
		imageURLBox = $('#imageUrl'),
		files = $('#fromfile'),
		startGameButton = $('#startgame'),
		sections = $('section'),
		complexity = $('input[name="complexity"'),
		colil = $('#colil'),
		toResultButton = $('#toResultsBtn'),
		againBtn = $('#againBtn'),
		toNextPictureButton = $('#nextPic'),
		toPrevPictruveButton = $('#prevPic'),
		collectionItems = $('.collection-item'),
		imageFailLoadingBox = $('#imgloadingfail');

	setCollectionListWidth();
	complexity.on('change', setLevel);
	files.on('change', handleFileUploading);
	
	previewImage.on('load', handlePreviewImageSuccessLoading);
	previewImage.on('error', handlePreviewImageErrorLoading);

	window.addEventListener('keydown', puzzle.handleKeyInput.bind(puzzle), false);
	window.addEventListener('touchstart', puzzle.handleTouchStart.bind(puzzle), false);
	window.addEventListener('touchend', puzzle.handleTouchEnd.bind(puzzle), false);

	toNextPictureButton.on('mousedown', changeSelectedItem);
	toPrevPictruveButton.on('mousedown', changeSelectedItem);

	startGameButton.on('click', handleStartClick);
	getImageByURLButton.on('click', handleLoadingImageFromURL);
	toResultButton.on('click', puzzle.handleToResultBtnClick.bind(puzzle));
	againBtn.on('click', puzzle.handleAgainBtnClick.bind(puzzle));

	colil.on('wheel', slideCollection);
	colil.on('touchstart', slideCollectionTouch);
	colil.on('touchend', slideCollectionTouch);
	collectionItems.on('click', selectItem);

	$(collectionItems[0]).click();

	function selectItem(evt) {
		var currentItemId = getSelectedItemId(),
			t = evt.target,
			src = t.src,
			tWidth = collectionItemsList.outerWidth(),
			aWidth = colil.outerWidth(),
			isEnd = false;
		deselectCollectionItems();
		// if (t.tagName.toLov === 'li') {
		// 	t = $(t).children('img');
		// }
		console.log(t);
		$(t).addClass('selected-item');
		var id = getSelectedItemId(),
			prevOffset = $(collectionItems[id]).get(0).offsetLeft;
		if (id !== 0) {
			prevOffset = $(collectionItems[id - 1]).get(0).offsetLeft
		}

		previewImage.prop('src', src);

		if (tWidth - prevOffset < aWidth) {
			isEnd = true;
		}
		// console.log(tWidth, '-', prevOffset, '=', aWidth);

		if (!isEnd) {
			collectionItemsList.animate({
				'left': -prevOffset
			}, 500);
		}

	}

	function changeSelectedItem(evt) {
		var currentItemId = getSelectedItemId(),
			target = evt.target,
			left = parseInt(collectionItemsList.css('left')),
			delta = 0,
			isStart = (currentItemId === 0) ? true : false,
			tWidth = collectionItemsList.outerWidth(),
			aWidth = colil.outerWidth(),
			isEnd = false;
		if (target.tagName.toLowerCase() === 'span') {
			target = $(target).parents('div').get(0);
		}

		var item = $(collectionItems[currentItemId]),
			delta = 0,
			prevOffset = item.get(0).offsetLeft;
		// console.log(isStart);
		item.removeClass('selected-item');
		console.log(currentItemId);
		if (target.id === 'nextPic') {// && id + 1 < collectionItems.length) {
			// id++;
			selectNextItem(currentItemId);
		} else if (target.id === 'prevPic') { //} && id > 0) {
			// prevOffset = $(collectionItems[id - 1]).get(0).offsetLeft;
			// id--;
			// if (id !== 0) {
			// 	prevOffset = $(collectionItems[id - 1]).get(0).offsetLeft;
			// }
			selectPreviousItem(currentItemId);
		}
		// console.log('offset left', item.get(0).offsetLeft);
		// console.log(tWidth - prevOffset, '=', aWidth);
		if (tWidth - prevOffset < aWidth) {
			isEnd = true;
		}

		item = $(collectionItems[currentItemId]);
		var offsetLeft = item.get(0).offsetLeft,
			src = item.prop('src'),
			tX = item.get(0).x;

		$(collectionItems[currentItemId]).addClass('selected-item');
		previewImage.prop('src', src);
		if (!isStart && !isEnd) {
			// console.log('wtf');
			collectionItemsList.animate({
				'left': -prevOffset
			}, 500);
		}
	}

	// return new offset
	function selectNextItem(currentItemId) {
		console.log('next');
		var item = $(collectionItems[currentItemId]);
		console.log(item);
	}

	// return new offset
	function selectPreviousItem(currentItemId) {
		console.log('previous');
		var item = $(collectionItems[currentItemId]);
		console.log(item);
	}

	function slideCollectionTouch(evt) {
		var type = evt.type,
			original = evt.originalEvent.changedTouches[0];
		if (type === "touchstart") {
			startX = original.screenX;
		} else if (type === "touchend") {
			var deltaX = original.screenX - startX,
				left = parseInt(collectionItemsList.css('left')),
				delta = 100,
				tWidth = colil.width();

			if (deltaX > 0 && left < 0) {
				left += delta;
			} else if (deltaX < 0 && (collWidth - Math.abs(left)) > tWidth) {
				left -= delta;
			}

			collectionItemsList.animate({
				'left': left
			}, 200);
		}
	}

	function handleStartClick() {
		puzzle.startGame(level);
	}

	function slideCollection(evt) {
		var original = evt.originalEvent,
			target = evt.target,
			type = evt.type,
			left = parseInt(collectionItemsList.css('left')),
			delta = 15,
			tWidth = colil.width();

		if (target.localName === 'span') {
			target = $(target).parents('div').get(0);
		}

		if (type !== 'wheel') {
			delta = 50;
		}

		if (original.deltaY < 0 && type === 'wheel' && left < 0) {
			left += delta;
		} else if ((original.deltaY > 0 && type === 'wheel')) {
			if (collWidth - Math.abs(left) > tWidth) {
				left -= delta;
			}
		}
		collectionItemsList.css('left', left);
	}

	function setLevel(evt) {
		level = parseInt(evt.target.value);
	}

	function handleFileUploading(evt) {
		var file = evt.target.files[0],
			reader = new FileReader();

		reader.addEventListener('loadend', function(evt) {
			previewImage.attr('src', reader.result);
		});

		if (file) {
			blockButton();
			reader.readAsDataURL(file);
		}
	}

	

	function handleLoadingImageFromURL(evt) {
		var source = imageURLBox.val().trim();
		if (source === '') {
			imageURLBox.val('');
			return;
		}
		blockButton();
		$.ajax('./loadimage.php', {
			method: 'GET',
			data: {
				url: source
			},
			success: function(data) {
				var response = JSON.parse(data);
				previewImage.attr('src', response[0].data);
			}
		});
	}

	function blockButton() {
		startGameButton.prop('disabled', true).addClass('disabled');
	}

	function unblockButton() {
		startGameButton.prop('disabled', false).removeClass('disabled');
	}

	function setCollectionListWidth() {
		var ichild = collectionItemsList.children().toArray();
		if (ichild.length > 5) {
			ichild.forEach(function(item) {
				collWidth += $(item).outerWidth() + parseInt($(item).css('marginRight'));
			});
			collectionItemsList.width(collWidth);
		}

	}

	function handlePreviewImageSuccessLoading(evt) {
		var target  = $(evt.target);
		if (!target.hasClass('borderedpi')) {
			target.addClass('borderedpi');
		}
		$(this).css('display', 'block');
		imageFailLoadingBox.css('display', 'none');
		unblockButton();
	}

	function handlePreviewImageErrorLoading(evt) {
		imageURLBox.val('');
		imageFailLoadingBox.css('display', 'block');
		$(this).css('display', 'none');
	}

	function deselectCollectionItems() {
		for (var i = 0; i < collectionItems.length; i++) {
			var item = $(collectionItems[i]);
			if (item.hasClass('selected-item')) {
				item.removeClass('selected-item');
			}
		}
	}

	function getSelectedItemId() {
		for (var i = 0; i < collectionItems.length; i++) {
			var item = $(collectionItems[i]);
			if (item.hasClass('selected-item')) {
				return i;
			}
		}
	}
});