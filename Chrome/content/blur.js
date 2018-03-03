var SOOTHE_ELEMS = [];

function addBlur(elem) {

	if(elem.soothe) {
		return;
	} else {
		elem.soothe = {};
	}

	var targetDiv = elem;

	if (targetDiv.tagName == "B" || targetDiv.tagName == "I" ) {

		targetDiv = targetDiv.parentNode;

	}
		var sentimood = new Sentimood();
		var analysis = sentimood.analyze(targetDiv.textContent);
		// console.log(analysis);

		if (analysis.score < 0) {

			targetDiv.style.webkitFilter =  "blur(10px)";
			targetDiv.addEventListener("click", removeBlur, false);

			elem.soothe.div = targetDiv;
			SOOTHE_ELEMS.push(targetDiv);
		}
}


function removeBlur(){
	// Find index of offensive div
	var pos = SOOTHE_ELEMS.indexOf(this.parentNode);
	SOOTHE_ELEMS.splice(pos, 1);

	this.style.webkitFilter =  "blur(0px)";
	this.soothe = null;
}
