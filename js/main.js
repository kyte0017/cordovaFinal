"use strict";
document.addEventListener("DOMContentLoaded", init);
let teams = [];

function init() {
	if (!localStorage.getItem("kyte0017")) {
		getData();
	}
	else {
		let parseMe = localStorage.getItem("kyte0017");
		let savedData = JSON.parse(parseMe);
		displayData(savedData);
	}
	//End of INIT
}

function getData() {
	let url = "https://griffis.edumedia.ca/mad9014/sports/quidditch.php";
	let myData = new FormData();
	let opts = {
		method: "post",
		mode: "cors",
		body: myData
	};
	fetch(url, opts).then(function (response) {
		return response.json();
	}).then(function (data) {
		displayData(data);
	}, function (error) {
		alert(error);
	});
}

function displayData(data) {
	//*************** ORIGINAL ********************    
	//console.log('Its Fecthing!');
	//console.log(data);
	let scores = data.scores;
	//console.log(scores);
	teams = data.teams;
	let standings = [];
	//The Id and Name of Each Team
	teams.forEach(function (value) {
		let id = (value.id);
		let name = (value.name);
		//Creating The Standings
		standings.push({
			"id": id,
			"name": name,
			"W": 0,
			"L": 0,
			"T": 0
		});
		//console.log(standings);
	});
	let numlist = document.getElementsByClassName("num_list")[0];
	//clearing my previous list
	numlist.innerHTML = "";
	data.scores.forEach(function (item) {
		//Creating the Divs for the List
		//The Conatiner for all the divs and classes - date, score and logo
		let container = document.createElement("div");
		container.className = "container";
		let dateItem = document.createElement("div");
		dateItem.className = "dateItem";
		let gameOne = document.createElement("div");
		let gameTwo = document.createElement("div");
		//Inputing the Text
		dateItem.textContent = item.date;
		// Each Team
		//console.log(nameLookup(item.games[0].away));
		let VS1 = nameLookup(item.games[0].away);
		let VS2 = nameLookup(item.games[0].home);
		let VS3 = nameLookup(item.games[1].away);
		let VS4 = nameLookup(item.games[1].home);
		//The Score
		let awayOne = teamLogos(nameLookup(item.games[0].away));
		let homeOne = teamLogos(nameLookup(item.games[0].home));
		let awayTwo = teamLogos(nameLookup(item.games[1].away));
		let homeTwo = teamLogos(nameLookup(item.games[1].home));
		gameOne.innerHTML = (awayOne + "&nbsp;" + VS1 + "&nbsp;" + "VS." + "&nbsp;" + VS2 + "&nbsp;" + homeOne);
		gameTwo.innerHTML = (awayTwo + "&nbsp;" + VS3 + "&nbsp;" + "VS." + "&nbsp;" + VS4 + "&nbsp;" + homeTwo);
		//Appending conatiner into ul
		numlist.appendChild(container);
		container.appendChild(dateItem);
		container.appendChild(gameOne);
		container.appendChild(gameTwo);
		//STANDINGS LOOP
		item.games.forEach(function (stand) {
			let indexAway = standings.map(function (item) {
				return item.id;
			}).indexOf(stand.away);
			let indexHome = standings.map(function (item) {
				return item.id;
			}).indexOf(stand.home);
			//            console.log(indexAway);
			if (stand.away_score > stand.home_score) {
				standings[indexAway].W++;
				standings[indexHome].L++;
			}
			else if (stand.away_score < stand.home_score) {
				standings[indexAway].L++;
				standings[indexHome].W++;
			}
			else {
				standings[indexAway].T++;
				standings[indexHome].T++;
			}
		});
		sortMe(standings);
		//console.log(standings);
	});
	displayTable(standings);
	saveLocal(standings, scores);
}
//ID to NAME LOOKUP FUNCTION
function nameLookup(id) {
	//console.log('id: ', id);
	let nm = "";
	//    let parseMe = localStorage.getItem("kyte0017");
	//    let savedData = JSON.parse(parseMe);
	//    console.log(savedData);
	//	console.log('teams', teams);
	teams.forEach(function (item) {
		if (item.id == id) {
			nm = item.name;
		}
	});
	return nm;
}
//SORTING STANDINDS ARRAY
function sortMe(standings) {
	standings.sort(function (a, b) {
		if (a.W > b.W) {
			return -1;
		}
		else if (a.W < b.W) {
			return 1;
		}
		else {
			if (a.T > b.T) {
				return -1;
			}
			else if (a.T < b.T) {
				return 1;
			}
			else {
				return 0;
			}
		}
	});
	return standings;
}
//NAV JAVASCRIPT

if (document.deviceready) {
	document.addEventListener("deviceready", onDeviceReady, false);
}
else {
	document.addEventListener("DOMContentLoaded", onDeviceReady, false);
}
let pages = []; // used to store all our screens/pages
let links = []; // used to store all our navigation links
function onDeviceReady() {
	pages = document.querySelectorAll("[data-role=\"page\"]");
	links = document.querySelectorAll("[data-role=\"nav\"] a");
	for (let i = 0; i < links.length; i++) {
		links[i].addEventListener("click", navigate);
	}
}

function navigate(ev) {
	ev.preventDefault();
	let link = ev.currentTarget;
	//    console.log(link);
	// split a string into an array of substrings using # as the seperator
	let id = link.href.split("#")[1]; // get the href page name
	//    console.log(id);
	//update what is shown in the location bar
	history.replaceState({}, "", link.href);
	for (let i = 0; i < pages.length; i++) {
		if (pages[i].id == id) {
			pages[i].classList.add("active");
		}
		else {
			pages[i].classList.remove("active");
		}
	}
}
//ADDING THE REFRESH BUTTON
let referesh = document.querySelector(".fab");
referesh.addEventListener("click", function () {
	getData();
});

function saveLocal(standings, scores) {
	//    let teams = JSON.stringify(standings);
	//    let scoresSave = JSON.stringify(scores);
	var jsonData = {
		teams: standings,
		scores: scores
	};
	jsonData = JSON.stringify(jsonData);
	//	console.log(jsonData);
	localStorage.setItem("kyte0017", jsonData);
	//    localStorage.setItem("kyte0017",'["name", "email", "phoneNum"]');
	//    console.log(standings);
}
//DISPLAY FUNCTION
function displayTable(standings) {
	//    console.log("test");
	let tableList = document.querySelector("table.tableList");
	tableList.innerHTML = "";
	//POPULATION THE SCEHDULE
	let rowTitle = document.createElement("tr");
	rowTitle.innerHTML = "<th>" + "ID" + "</th><th>" + "Name" + "</th><th>" + "W" + "</th><th>" + "L" + "</th><th>" + "T" + "</th>";
	tableList.appendChild(rowTitle);
	standings.forEach(function (item) {
		//            console.log("WE ARE HERE!! ");
		//            console.log(item);
		let row = document.createElement("tr");
		row.innerHTML = "<td>" + item.id + "</td><td>" + teamLogos(item.name) + " " + item.name + "</td><td>" + item.W + "</td><td>" + item.L + "</td><td>" + item.T + "</td>";
		tableList.appendChild(row);
	});
}

function teamLogos(teams) {
	var switchMe;
	switch (teams) {
	case "Hufflepuff" || "hufflepuff":
		switchMe = "<img src=\"img/team-icon/hufflepuff.png\">";
		break;
	case "Gryffindor" || "gryffindor":
		switchMe = "<img src=\"img/team-icon/gryffindor.png\">";
		break;
	case "Slytherin" || "slytherin":
		switchMe = "<img src=\"img/team-icon/slytherin.png\">";
		break;
	case "Ravenclaw" || "ravenclaw":
		switchMe = "<img src=\"img/team-icon/ravenclaw.png\">";
		break;
	default:
		switchMe = "TeamNotFound";
	}
	return teams = switchMe;
}