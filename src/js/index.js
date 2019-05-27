import css from "../styles.css";
import {
    createTrip,
    calcTotalMiles,
    updateDatabase,
    removeTrip,
    sortTripsByDate
} from "./model/Trips";
import { printAllTrips } from "./model/Print";
import {
    renderTrips,
    clearTrips,
    renderTotalMiles,
    tripHtml,
    displaySpinner,
    hideSpinner
} from "./views/tripsView";
import { elements } from "./views/domBase";
import Axios from "axios";
import exampleView from "../exampleview.png";

document.getElementById("exampleview").src = exampleView;

/* GLOBAL CONTROLLER */
let state = {
    nextid: 0,
    trips: []
};
//once login screen is accepted, the user data here
let userData = {
    email: "",
    password: ""
};

//On login, update state.  If it doesnt exist, set a default;

const logMeIn = (email, password) => {
    Axios({
        method: "post",
        url: "https://freemilelog.com/users/login",
        headers: { "Content-Type": "application/json" },
        crossDomain: true,
        data: {
            email: email,
            password: password
        }
    })
        .then(res => {
            if (!res.data.nextid) {
                userData.email = email;
                userData.password = password;

                init();
            } else {
                state.nextid = res.data.nextid;
                state.trips = [...res.data.trips];
                userData.email = email;
                userData.password = password;

                init();
            }
        })
        .catch(err => {
            document.getElementById("error").textContent =
                "email and/or password are invalid";
        });
};

const registerUser = () => {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    if (email === "" || password === "") {
        //display error
        elements.errorField.style.color = "red";
        elements.errorField.textContent = "please fill out all fields";
    } else {
        let data = {
            email: email,
            password: password
        };
        Axios({
            method: "post",
            url: "https://freemilelog.com/users/register",
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(data)
        })
            .then(res => {
                if (res.status === 200) {
                    elements.errorField.style.color = "green";
                    elements.errorField.textContent =
                        "SUCCESS, you may now login";
                }
            })
            .catch(err => {
                elements.errorField.style.color = "red";
                elements.errorField.textContent =
                    "that user is already registered";
            });
    }
};

// after Logged In run This
const init = () => {
    //hide login page

    document.querySelector(".login-menu").style.display = "none";

    //show main page
    document.getElementById("main_mile_logger").style.opacity = "1";
    //Sort trips by date

    state.trips = [...sortTripsByDate(state)];

    clearTrips();
    renderTrips(state);

    renderTotalMiles(calcTotalMiles(state.trips));
    deleteTripEventListener(
        userData.email,
        userData.password,
        state,
        displaySpinner,
        hideSpinner
    );

    /*
     *
     *   Event Listeners
     *
     */

    elements.submitBtn.addEventListener("click", e => {
        // 2- onclick event for submitting new trip - validate form

        if (
            elements.formStartingMile.value &&
            elements.formEndingMile.value &&
            elements.formDate
        ) {
            e.preventDefault();

            // 3- push new trip onto existing state
            let vehicle = elements.formVehicle.value;
            let tripType = elements.formTripType.value;
            let date = elements.formDate.value;
            let startingMile = elements.formStartingMile.value;
            let endingMile = elements.formEndingMile.value;
            state.trips.push(
                new createTrip(
                    state.nextid,
                    vehicle,
                    date,
                    tripType,
                    startingMile,
                    endingMile
                )
            );
            // 4- increment state.id(keeps track fo the trip for deletion)
            state.nextid = state.nextid + 1;
            // 5- clear the current trips
            clearTrips();
            //SORT TRIPS BY DATE
            state.trips = [...sortTripsByDate(state)];

            // 6- renders all trips in state(calculate all miles using reduce function)
            renderTrips(state);
            renderTotalMiles(calcTotalMiles(state.trips));
            // 7- Add event listener for deleting trip
            deleteTripEventListener();

            //8 - Clear the form
            elements.formDate.value = "";
            elements.formStartingMile.value = "";
            elements.formEndingMile.value = "";
            elements.formCurrentTripMiles.textContent = "0";
            //9 - Update the database
            updateDatabase(
                userData.email,
                userData.password,
                state,
                displaySpinner,
                hideSpinner
            );
        }
    });

    elements.formEndingMile.addEventListener("keyup", () => {
        elements.formCurrentTripMiles.textContent =
            parseInt(elements.formEndingMile.value) -
            parseInt(elements.formStartingMile.value);
    });

    elements.formTripType.addEventListener("focus", () => {
        elements.formTripType.value = "";
    });

    elements.printBtn.addEventListener("click", e => {
        e.preventDefault();
        let totalMiles = calcTotalMiles(state.trips);
        console.log(totalMiles);
        printAllTrips(state, totalMiles, tripHtml);
    });
};

const registerButtonClicked = () => {
   
    registerUser();
};
const loginButtonClicked = () => {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    logMeIn(email, password);
};

//On login form - This will switch between the Login and Register menus

const registerSwitch = () => {
    
    elements.loginBtn.removeEventListener("click", loginButtonClicked);
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.querySelector(".forget-link").style.display = "none";
    elements.formActionBtn.textContent = "Register";
    elements.formActionBtn.style.background = "#fdcb6e";
    elements.registerSwitchBtn.classList.add("active");
    elements.loginSwitchBtn.classList.remove("active");
    elements.formActionBtn.id = "register_button";
    document.getElementById("email").focus();
   
    document.querySelector("#register_button").addEventListener("click", registerButtonClicked);
    
};

const loginSwitch = () => {
    document
        .querySelector("#register_button")
        .removeEventListener("click", registerButtonClicked);
    elements.formActionBtn.textContent = "Login";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.querySelector(".forget-link").style.display = "inline-block";
    elements.formActionBtn.style.background = "#55efc4";
    elements.registerSwitchBtn.classList.remove("active");

    elements.loginSwitchBtn.classList.add("active");
    elements.formActionBtn.id = "login_button";
    document.getElementById("email").focus();
    document
        .querySelector("#login_button")
        .addEventListener("click", loginButtonClicked);
    console.log("loginSwitch");
};

const deleteTripEventListener = () => {
    //This will add the delete event listener for every trip

    document.querySelectorAll(".remove__trip__btn").forEach(el => {
        el.addEventListener("click", e => {
            displaySpinner();
            let id = e.srcElement.id;
            clearTrips();
            state.trips = removeTrip(id, state);

            renderTrips(state);
            renderTotalMiles(calcTotalMiles(state.trips));
            deleteTripEventListener();
            updateDatabase(
                userData.email,
                userData.password,
                state,
                displaySpinner,
                hideSpinner
            );
            hideSpinner();
        });
    });
};

//

/*
 *
 * EVENT LISTENERS
 *
 *
 */


window.onload = () => {

    elements.registerSwitchBtn.addEventListener("click", registerSwitch);
    elements.loginSwitchBtn.addEventListener("click", loginSwitch);
    
    document
        .querySelector("#login_button")
        .addEventListener("click", loginButtonClicked);
    //nav buttons
    document
        .getElementById("nav_register")
        .addEventListener("click",(e) =>  registerSwitch(e));
    
    document.getElementById("nav_login").addEventListener("click", loginSwitch);
    
    document.getElementById("password").addEventListener("keyup", e => {
        if (e.keyCode === 13) {
            elements.formActionBtn.innerText == "Login"
                ? loginButtonClicked()
                : registerButtonClicked();
        }
    });
    
    //forgot password click event
    
    //delete trip event listener
    
    
    

}
