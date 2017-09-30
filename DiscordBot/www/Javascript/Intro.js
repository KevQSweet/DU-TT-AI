setTimeout(function, 1000);

function changeDiv() {
    document.getElementById('body').hidden = "hidden"; // hide body div tag
    document.getElementById('body1').hidden = ""; // show body1 div tag
    document.getElementById('body1').innerHTML = "If you can see this, JavaScript function worked"; 
      // display text if JavaScript worked
};