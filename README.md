# Interactive Flag Map

## Overview

Interactive Flag Map is a web application that displays a fully interactive world map. Users can **hover over countries to highlight them**, **click to view detailed country information** (including flag, capital, area, currency, and languages), and **zoom in/out** on the map. The project also integrates **AWS Cognito** for authentication and **AWS S3** for hosting map assets.

## Features

* Interactive world map with hover and click effects
* Draggable side panel showing detailed country information
* Zoom in/out functionality
* Fetches real-time data from the [REST Countries API](https://restcountries.com)
* AWS integration:

  * **Cognito** for authentication
  * **S3** for hosting SVG map assets
* Loading states and error handling

## Technologies Used

* **Frontend:** HTML, CSS, JavaScript
* **APIs:** REST Countries API
* **Cloud:** AWS Cognito, AWS S3
* **Other:** SVG manipulation, dynamic DOM updates

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/interactive-flag-map.git
   ```
2. Open `index.html` in your browser.
3. Configure AWS Cognito Identity Pool and S3 bucket credentials if testing cloud integration.

## Usage

* Hover over a country to highlight it.
* Click a country to open the side panel with detailed information.
* Use zoom buttons to adjust the map size.
* Close the side panel with the close button.

## Future Improvements

* Add **search functionality** to jump directly to a country
* Implement **dark mode**
* Make the project **mobile responsive**
* Add **offline caching** for API data

## License

This project is licensed under the **MIT License**.

---

