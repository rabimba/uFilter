// Attach event listeners to buttons
var allButtons = document.getElementsByTagName('button');


for (var i = 0; i < allButtons.length; i++) {
	// TODO: add these functions
	if (allButtons[i].id == "done" || allButtons[i].id == "question") {
		allButtons[i].addEventListener("click", null, false);
	}
 
	else {
		allButtons[i].addEventListener("click", toggleTrigger, false);
	}
};


// Reflect colours
function showActiveTriggers() {

	chrome.storage.local.get(['activeFilterTypes'], function (arrayOfFilterTypes) {
		
		// Check if any preferences exist
		console.log(arrayOfFilterTypes.activeFilterTypes);

		try {
			// Change colours
			(arrayOfFilterTypes.activeFilterTypes).forEach(function(item) {
				var button = document.getElementById(item);
				button.className = "mdl-button mdl-js-button mdl-button--raised mdl-button--accent mdl-color--red-700";
			});

		}

		catch(err) {
			console.log("new");
			chrome.storage.local.set({'activeFilterTypes': []});

		}

	});
}

// Add new trigger
function toggleTrigger(){

	window.trigger = this.id;

	chrome.storage.local.get(['activeFilterTypes'], function (arrayOfFilterTypes) {

		console.log(arrayOfFilterTypes);
		allPermissions = (arrayOfFilterTypes.activeFilterTypes);
		updateChromePermissions(allPermissions);
	});

	function updateChromePermissions(perms) {

		// Add to local storage
		if (perms.indexOf(trigger) > -1) {
			perms.splice(perms.indexOf(trigger, 1));
			document.getElementById(trigger).className = "mdl-button mdl-js-button mdl-button--raised mdl-button--accent mdl-color--blue-grey-200";
		}

		else {
			perms.push(trigger);
		}

		chrome.storage.local.set({'activeFilterTypes': perms});
		showActiveTriggers();
	}


}

showActiveTriggers();