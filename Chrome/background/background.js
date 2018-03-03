var offensiveTypes = [{
	title : 'Tag this as Homophobic',
	type : 'homophobic'
},{
	title : 'Tag this as Sexist',
	type : 'sexism'
},{
	title : 'Tag this as Violent',
	type : 'violence'
},{
	title : 'Tag this as Racist',
	type : 'racism'
},{
	title : 'Tag this as Transphobic',
	type : 'transphobism'
},{
	title : 'Tag this as Sexually Violent',
	type : 'sexual-violence'
}];

var empty_trigupdate = {TRIGGERS : {
	'homophobic' : [],
	'sexism' : [],
	'violence' : [],
	'racism' : [],
	'transphobism' : [],
	'sexual-violence' : []
}};




	apiKey: "AIzaSyDSvpWIcJsYmTYtgfy4rEH02s2MOvOWBCY",
    authDomain: "blocker-5cdbd.firebaseapp.com",
    databaseURL: "https://blocker-5cdbd.firebaseio.com",
    projectId: "blocker-5cdbd",
    storageBucket: "blocker-5cdbd.appspot.com",
    messagingSenderId: "565739493986"
};
firebase.initializeApp(config);

var triggersRef = firebase.database().ref().child('triggers');

triggersRef.once('value').then(function (snap) {
	var trigsArrs = fromObjToArr(snap.val());

	chrome.storage.local.set(empty_trigupdate, function () {
		setTimeout(function(){chrome.storage.local.set({TRIGGERS : trigsArrs});}, 1);
	});
});

offensiveTypes.forEach(function (typeObj) {
	triggersRef.child(typeObj.type).on('child_added', updateLocalStorage.bind(null, typeObj.type, 'child_added'));
	triggersRef.child(typeObj.type).on('child_removed', updateLocalStorage.bind(null, typeObj.type, 'child_removed'));

});


function updateLocalStorage(type, eventType, data) {
	chrome.storage.local.get('TRIGGERS', function (val) {
		if(eventType == 'child_added') {
			val.TRIGGERS[type].push(data.key);
		} else if (eventType === 'child_removed') {
			val.TRIGGERS[type].splice(val.TRIGGERS[type].indexOf(data.key), 1);
		}
		chrome.storage.local.set({TRIGGERS : {}}, function () {
			chrome.storage.local.set({TRIGGERS : val.TRIGGERS});
		});
	});
}

function fromObjToArr(trigsObj) {
	return Object.keys(trigsObj).reduce((obj, type) => {obj[type] = Object.keys(trigsObj[type]); return obj;}, {});
}

function fromArrToDicts(trigsArrs) {
	var trigObj = {}
	for(var i in trigsArrs){
		trigObj[i] = trigsArrs[i].reduce((obj, word)=>{obj[word] = true; return obj}, {});
	}
	return trigObj;
}


offensiveTypes.forEach(function (offenseObj) {
	chrome.contextMenus.create({
		title : offenseObj.title,
		contexts : ['selection'],
		onclick : addOffensiveSlur.bind(null, offenseObj.type)
	})
})

function addOffensiveSlur(type, selectionInfo, tab) {
	console.info('categorizing offensive slur', type, selectionInfo.selectionText);
	var updateObj = {};
	updateObj[selectionInfo.selectionText] = true;
	return triggersRef.child(type).update(updateObj);
}
