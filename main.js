/* 1️⃣ Connexion à Cognito (toujours au début) */
AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
IdentityPoolId: 'us-east-1:cad8cabd-3198-47cd-a063-cf82a13a429b'
});

// On récupère les credentials avant d'exécuter le reste
AWS.config.credentials.get(function(err) {
if (err) {
console.error('Erreur lors de la récupération des credentials :', err);
return;
}
console.log('Credentials temporaires récupérés :', AWS.config.credentials);
alert('Connexion à Cognito réussie !');

// ===== Code AWS S3 ici =====
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

// Lister les objets du bucket (remplace par le nom de ton bucket)
const params = { Bucket: 'interactiveflagmapbucket' };
s3.listObjectsV2(params, function(err, data) {
    if (err) console.error('Erreur S3 :', err);
    else console.log('Contenu du bucket :', data.Contents);
});
// ===== Fin du code AWS =====

});




//Get needed elements from the DOM

const map = document.querySelector("svg");
const countries = document.querySelectorAll("path");
const sidePanel = document.querySelector(".side-panel");
const container = document.querySelector(".side-panel .container");
const closeBtn = document.querySelector(".close-btn");
const loading = document.querySelector(".loading");
const zoomInBtn = document.querySelector(".zoom-in");
const zoomOutBtn = document.querySelector(".zoom-out");
const zoomValueOutput = document.querySelector(".zoom-value");

//Data Outputs

const countryNameOutput = document.querySelector(".country-name");
const countryFlagOutput = document.querySelector(".country-flag");
const cityOutput = document.querySelector(".city");
const areaOutput = document.querySelector(".area");
const currencyOutput = document.querySelector(".currency");
const languagesOutput = document.querySelector(".languages");

//Loop through all countries

const panel = document.querySelector(".side-panel");

let isDragging = false;
let offsetX, offsetY;

panel.addEventListener("mousedown", (e) => {
  isDragging = true;
  panel.style.cursor = "grabbing";
  offsetX = e.clientX - panel.getBoundingClientRect().left;
  offsetY = e.clientY - panel.getBoundingClientRect().top;
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  panel.style.left = `${e.clientX - offsetX}px`;
  panel.style.top = `${e.clientY - offsetY}px`;
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  panel.style.cursor = "grab";
});

countries.forEach((country) => {
  // Add mouse enter event to each country (cursor enters a country)

  country.addEventListener("mouseenter", function () {
    //Get all classes of element the mouse enters
    const classList = [...this.classList];

    // Only proceed if there are classes
    if (classList.length > 0) {
      const classString = classList.join(".");
      //Create a selector for matching classes
      const selector = "." + classString;
      /*Select all matching elements/
      Select all pieces of land (svg paths)
      that belong to the same country*/
      const matchingElements = document.querySelectorAll(selector);
      //Add hover effect to matching elements
      matchingElements.forEach((el) => (el.style.fill = "#c99aff"));
    }
  });

  //Add a mouse out event (cursor leaves a country)
  country.addEventListener("mouseout", function () {
    /*Repeat the same steps from before to remove hovered styles from matching elements /
    remove hovered effect from all pieces of land
    (svg paths) that have the same class names (Belong to the same country)*/

    const classList = [...this.classList];

    // Only proceed if there are classes
    if (classList.length > 0) {
      const classString = classList.join(".");
      const selector = "." + classString;
      const matchingElements = document.querySelectorAll(selector);
      matchingElements.forEach((el) => (el.style.fill = "#443d4b"));
    }
  });

  //Add click event to each country
  country.addEventListener("click", function (e) {
    //Variable to hold the country name
    let clickedCountryName;

    //If the clicked svg path (country) has a name attribute
    if (e.target.hasAttribute("name")) {
      //Get the value of the name attribute (country name)
      clickedCountryName = e.target.getAttribute("name");
      //If it doesn't have a name attribute
    } else if (e.target.classList.length > 0) {
      //Get the class name (country name)
      clickedCountryName = e.target.classList[0];
    } else {
      // No name or class found, exit
      console.log("Country has no name or class attribute");
      return;
    }

    // Check if we have a valid country name
    if (!clickedCountryName || clickedCountryName.trim() === "") {
      console.log("Invalid country name");
      return;
    }

    //Set Loading text
    loading.innerText = "Loading...";
    //Hide country data container
    container.classList.add("hide");
    //Show Loading screen
    loading.classList.remove("hide");

    //Open the side panel
    sidePanel.classList.add("side-panel-open");
    //Use fetch to get data from the API (Add the extracted country name)
    fetch(
      `https://restcountries.com/v3.1/name/${clickedCountryName}?fullText=true`
    )
      .then((response) => {
        //Check if the response is Ok (status code 200)
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        //Parse the response as JSON
        return response.json();
      })
      .then((data) => {
        /*You can console log data and view it in the dev console*/
        console.log(data);
        //Delay the code inside for half a second
        setTimeout(() => {
          //Extract data and output to the side panel
          //Country Name
          countryNameOutput.innerText = data[0].name.common;
          //Flag image
          countryFlagOutput.src = data[0].flags.png;
          countryFlagOutput.alt = data[0].name.common + " flag";
          //Capital City
          cityOutput.innerText = data[0].capital ? data[0].capital[0] : "N/A";
          //Area
          //Change number format to include dots in big numbers
          const formattedNumber = data[0].area.toLocaleString("de-DE");
          areaOutput.innerHTML = formattedNumber + ` km<sup>2</sup>`;
          //Currency
          //Get the currencies object
          const currencies = data[0].currencies;
          /*Set currency output to empty string
            (Remove data from previous country)*/
          currencyOutput.innerHTML = "";
          //Loop through each object key
          if (currencies) {
            Object.keys(currencies).forEach((key) => {
              //Output the name of each currency of the selected country
              currencyOutput.innerHTML += `<li>${currencies[key].name}</li>`;
            });
          } else {
            currencyOutput.innerHTML = "<li>N/A</li>";
          }

          // Languages (Repeat the same steps as with the currency object)
          const languages = data[0].languages;
          languagesOutput.innerHTML = "";
          if (languages) {
            Object.keys(languages).forEach((key) => {
              languagesOutput.innerHTML += `<li>${languages[key]}</li>`;
            });
          } else {
            languagesOutput.innerHTML = "<li>N/A</li>";
          }

          //Wait for new flag image to Load
          countryFlagOutput.onload = () => {
            //Show the container with country info
            container.classList.remove("hide");
            //Hide loading screen
            loading.classList.add("hide");
          };
        }, 500);
      })

      //Handle errors
      .catch((error) => {
        //Output explanation for the user
        loading.innerText = "No data to show for selected country";
        //console log the error
        console.error("There was a problem with the fetch operation", error);
      });
  });
});

//Add click event to side panel close button
closeBtn.addEventListener("click", () => {
  //Close the side panel
  sidePanel.classList.remove("side-panel-open");
});

//Variable to contain the current zoom value
let zoomValue = 100;
//Disable zoom out button on load
zoomOutBtn.disabled = true;

//Add click event to zoom in button
zoomInBtn.addEventListener("click", () => {
  //Enable the zoom out button
  zoomOutBtn.disabled = false;
  //Increment zoom value by 100
  zoomValue += 100;
  /*If the zoom value is under 500
    (or Whatever you want the zoom in limit to be) */
  if (zoomValue < 500) {
    //Enable the zoom in button
    zoomInBtn.disabled = false;
    //And if it reaches the limit
  } else {
    //Disable the zoom in button
    zoomInBtn.disabled = true;
  }
  //set map width and height to zoomValue
  map.style.width = zoomValue + "vw";
  map.style.height = zoomValue + "vh";

  //Output zoom value percentage
  zoomValueOutput.innerText = zoomValue + "%";
});

/*Repeat the same process with the zoom out button, just decrement the zoom value by 100 and check if it is over 100*/

zoomOutBtn.addEventListener("click", () => {
  zoomInBtn.disabled = false;
  zoomValue -= 100;
  if (zoomValue > 100) {
    zoomOutBtn.disabled = false;
  } else {
    zoomOutBtn.disabled = true;
  }
  map.style.width = zoomValue + "vw";
  map.style.height = zoomValue + "vh";
  zoomValueOutput.innerText = zoomValue + "%";
});
