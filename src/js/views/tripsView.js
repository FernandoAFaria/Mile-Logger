import { elements } from "./domBase";

export const tripHtml = trip => {
    return `
        <tr id="${trip.id}">
            <td>${trip.vehicle}</td>
            <td>${trip.date}</td>
            <td id="delivery_type_td">${trip.type}</td>
            <td>${trip.start_miles}</td>
            <td>${trip.end_miles}</td>
            <td class='btn-remove'> <span id="total__miles">${
                trip.total_miles
            }</span>
            <button id="${
                trip.id
            }" class="btn btn-sm remove__trip__btn">remove</button>
            </td>
        </tr>
`;
};

export const renderTrips = state => {
    state.trips.forEach(trip => {
        elements.allTrips.insertAdjacentHTML("afterbegin", tripHtml(trip));
    });
};

export const clearTrips = () => {
    elements.allTrips.innerHTML = "";
};

export const renderTotalMiles = miles => {
    let totalMiles = document.querySelectorAll(".all_total_miles");
    totalMiles.forEach(el => (el.innerHTML = miles));
};

export const displaySpinner = () => {
    elements.mainMileLogger.style.opacity = ".4";
    elements.spinner.style.display = "block";
};

export const hideSpinner = () => {
    elements.mainMileLogger.style.opacity = "1";
    elements.spinner.style.display = "none";
    document.querySelector(".saved").style.opacity = "1";
    setTimeout(() => {
        document.querySelector(".saved").style.opacity = "0";
    }, 2500);
};
