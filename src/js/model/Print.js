export const printAllTrips = (state,totalMiles, tripHtml) => {
    let trips = state.trips;
    let printWindow = window.open('about:blank', "", "_blank, width=900");
    let printData = "";


    state.trips.forEach(trip => {
        let htmlData = tripHtml(trip);
        printData = printData + htmlData
    })

    let styling = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Mileage Logger</title>
    <style>*,
    *:before,
    *:after {
        margin: 0;
        border: 0;
        padding: 0;
        box-sizing: inherit;
    }
    
    html {
        box-sizing: border-box;
         font-family: 'Cantarell', sans-serif;
    } 
    
    body {
       
        min-width: 100vw;
        min-height: 100vh;
        overflow-x: hidden;}
    
    header {
        min-height: 30vh;
        background: linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35)), url('/img/bmw.jpg');
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
    }
    /*General styling */
    input {
        width: 10rem;
        height: 1.8rem;
        border: 1px solid lightgray;
        padding-left: 5px;
        color: grey;
    }
    select {
        background: white;
        border: 1px solid lightgray;
        padding: .35rem .3rem;
        color: grey;
    }
    table {
        width: 99.5%;
        border: 1px solid lightgray;
        overflow-x: hidden;
    }
    tr:nth-child(even){
        background: #eee;
    }
    table tr td span{
        margin-left: 15px;
    }
    table tr td {
        height: 35px;
        text-align: center;
        
    }
    
    .container {
        padding: 15px;
    }
    .flex-center {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .flex-row {
        flex-direction: row;
    }
    .flex-column {
        flex-direction: column;
    }
    
    .color-white {
        color: white;
    }
    .mt-1 {
        margin-top: 1rem;
    }
    .mt-2 {
        margin-top: 2rem;
    }
    .mx-1 {
        margin: 1rem;
    }
    .mx-2 {
        margin: 2rem;
    }
    .bx-1{
        border: 1px solid lightgray;
    }
    .btn {
        background: lightgray;
        padding: .4rem 1.8rem;
        cursor: pointer;
        transition: all .2s;
        color: black;
        font-weight: 800;
        cursor: pointer;
        margin: 0 5px;
        border-radius: 4px;
    }
    .btn-sm {
        padding: 5px 10px;
        font-size: 1rem;
        
        cursor: pointer;
       background: #9c88ff;
        transform: translateX(140px);
        transition: all .3s;
        color: white;
        font-weight: 900;
    }
    .btn-remove {
        position: relative;
        z-index: 1;
    }
    .btn-remove:hover .btn-sm{
        transform: translateX(20px);
    }
    
    .btn-primary {
        color: white;
        background: #00a8ff;
    }
    .btn-secondary {
        color: white;
        background: #4cd137;
    }
    .btn-warning {
        color: white;
        background: #fbc531;
    }
    .btn-danger {
        color: white;
        background: #e84118;
    }
    .btn-info {
        color: white;
        background: #9c88ff
    }
    .btn:hover {
        box-shadow: .2rem .1rem .2rem rgba(0,0,0,.2)
    }
    
    
    
    /*Specific Styling */
    
    .current_trip_miles {
       display: inline-block;
        width: 65px;
        height: 1.8rem;
        color: grey;
        font-weight: 600;
        padding-left: 5px;
    }
    .insert_mileage {
        background: #eee;
    }
    .total {
        float: right;
        font-size: 1.6rem;
        padding: 5px 20px;
        margin-top: 10px;
    }
    
    </style>
</head>
<body>
<div class="allTrips container">
<table>
    <thead>
        <th>Vehicle</th>
        <th>Date</th>
        <th>Type</th>
        <th>Starting Miles</th>
        <th>Ending Miles</th>
        <th>Total Miles</th>
    </thead>
    <tbody id="root_data">
          ${printData}
    </tbody>
</table>
<div class="total btn-danger">Total Miles Driven: ${totalMiles}</div>

<script type="text/javascript" src="bundle.js"></script></body>
</html>`;


    printWindow.document.write(styling)
    printWindow.print();
    
    
}