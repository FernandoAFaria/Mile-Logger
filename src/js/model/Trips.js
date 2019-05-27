import Axios from "axios";

export class createTrip {
    constructor(id, vehicle, date, type, start_miles, end_miles) {
        this.id = id;
        this.vehicle = vehicle;
        this.date = date;
        this.type = type;
        this.start_miles = start_miles;
        this.end_miles = end_miles;
        this.total_miles = end_miles - start_miles;
    }
}

export const removeTrip = (id, state) => {
    let newState = state.trips;
    let filteredState = newState.filter(cur => cur.id != id);
    return filteredState;
};

export const calcTotalMiles = trips => {
    let total = trips.reduce((total = 0, current) => {
        return parseInt(total) + current.total_miles;
    }, 0);

    return total;
};

export const updateDatabase = (
    email,
    password,
    state,
    displaySpinner,
    hideSpinner
) => {
    let submitData = {
        email: email,
        password: password,
        data: state
    };
    displaySpinner();

    Axios({
        method: "post",
        url: "https://freemilelog.com/users/update",
        headers: { "Content-Type": "application/json" },
        data: submitData
    }).then(res => {
        console.log(res.status);
        hideSpinner();
    });
};

export const sortTripsByDate = state => {
    let trips = state.trips;
    let sortedTrips = trips.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });
    return sortedTrips;
};
