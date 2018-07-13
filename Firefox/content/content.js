function processMutation (mutRec) {
	var _elemContext = this;

	// call listeners for "insert" event
	if(mutRec.type === 'childList' && mutRec.addedNodes && mutRec.addedNodes.length){
		Array.prototype.forEach.call(mutRec.addedNodes, function (addedNode) {
			iterateOffensiveNodes(addedNode, function (elem) {
				// console.log('Offensive Node found : ', elem);
				addBlur(elem);
			});
		});
	}

	// search for characterData changes
	if(mutRec.type === 'characterData') {
		iterateOffensiveNodes(mutRec.targetDiv, function (elem) {
			// console.log('Offensive Node found : ', elem);
			addBlur(elem);
		});
	}
}

var globalObserver = new MutationObserver(function (muts) {
	muts.forEach(processMutation);
});

var globalObserverParams = {
	subtree : true,
	childList: true,
	characterData: true
};

window.addEventListener("load", onloadFunction,false);

function onloadFunction(event){
	window.removeEventListener("load", onloadFunction, false); //remove listener, no longer needed

	iterateOffensiveNodes(document.body, function (elem) {
		// console.log('Offensive Node found : ', elem);
		addBlur(elem);
	});

	globalObserver.observe(document, globalObserverParams);

}

chrome.storage.onChanged.addListener(function (changes, areaName) {
	if (areaName === 'local') {
		SOOTHE_ELEMS.forEach(function (elem) {
			elem.soothe.div.remove();
			elem.soothe = null;
		});
		SOOTHE_ELEMS = [];
		generateTriggerRegexes(function (triggers_regex) {
			iterateOffensiveNodes(document.body, function (elem) {
				// console.log('Offensive Node found : ', elem);
				addBlur(elem);
			});
		});
	}
});
