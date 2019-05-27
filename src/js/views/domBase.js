export const elements = {
  //Query Selector Items here
  //Login Screen
  loginSwitchBtn: document.getElementById('login_form_switch'),
  registerSwitchBtn: document.getElementById('register_form_switch'),
  loginBtn: document.querySelector('#login_button'),
  
  formActionBtn: document.querySelector('.btn-login'),

  
  //INSERT FORM FIELDS 
  submitBtn: document.querySelector(".insert__trip"),
  printBtn: document.querySelector('.print__trips'),
  formVehicle: document.querySelector('#vehicle'),
  formTripType: document.querySelector('#tripType'),
  formDate: document.querySelector('#date'),
  formStartingMile: document.querySelector('#start'),
  formEndingMile: document.querySelector('#end'),
  formCurrentTripMiles: document.querySelector('.current_trip_miles'),

  //table fields
  totalMiles: document.querySelector('#total__miles'),
  //render trips here
  allTrips: document.querySelector("#root_data"),
  spinner: document.querySelector('.spinner'),
  mainMileLogger: document.getElementById('main_mile_logger'),
  errorField: document.getElementById('error')

  
}