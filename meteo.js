
    const meteomaticsUsername = 'nocompany_ammar_mohamed';
    const meteomaticsPassword = '5S9lq2FvUP';
    const ninjaApiKey = 'ImN4HkeuMKaDzc3krjA+Qg==37InmOdMF0JqmMcJ';

    document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city').value || 'Beni Mellal';
    const dayNumbers = document.getElementById('dayNumbers').value || 7;
    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + dayNumbers * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    document.getElementById('loadingClass').style.display = 'flex';
    fetchCityCoordinates(city, startDate, endDate);
});

    document.addEventListener('DOMContentLoaded', () => {
    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    fetchCityCoordinates('Beni Mellal', startDate, endDate);
});

    async function fetchCityCoordinates(city, startDate, endDate) {
    const url = `https://api.api-ninjas.com/v1/geocoding?city=${city}`;
    try {
    const response = await fetch(url, {
    headers: {
    'X-Api-Key': ninjaApiKey
}
});

    if (!response.ok) {
    throw new Error('Réponse réseau non OK : ' + response.statusText);
}

    const data = await response.json();
    console.log(data)
    if (data.length === 0) {
    alert('Ville introuvable.');
    return;
}

    const { latitude, longitude } = data[0];
    fetchWeatherData(latitude, longitude, startDate, endDate, city);
} catch (error) {
    console.error('Il y a eu un problème n :', error);
} finally {
    document.getElementById('loadingClass').style.display = 'none';
}
}

    async function fetchWeatherData(lat, lon, startDate, endDate, city) {
    const currentTime = new Date().toISOString();
    const url = `https://api.meteomatics.com/${currentTime}--${endDate}T00:00:00Z:P1D/t_2m:C,relative_humidity_2m:p,wind_speed_10m:ms,weather_symbol_1h:idx/${lat},${lon}/json?model=mix`;
    try {
    const response = await fetch(url, {
    headers: {
    'Authorization': 'Basic ' + btoa(meteomaticsUsername + ':' + meteomaticsPassword)
}
});

    if (!response.ok) {
    throw new Error('probleme Réponse réseau n ok  : ' + response.statusText);
}

    const data = await response.json();
    console.log(data)
    console.log(data.data[0].coordinates[0].dates[1].value);
    updateWeatherUI(data, city, lat, lon);
} catch (error) {
    console.error('problème de récupération :', error);
} finally {
    document.getElementById('loadingClass').style.display = 'none';
}
}

    function updateWeatherUI(data, city, lat, lon) {
    const weatherForecast = document.getElementById('weather-forecast');
    weatherForecast.innerHTML = '';

    const todayData = data.data[0].coordinates[0].dates[0];
    const todayHumidity = data.data[1].coordinates[0].dates[0].value;
    const todayWindSpeed = data.data[2].coordinates[0].dates[0].value;
    const todayWeatherCode = data.data[3].coordinates[0].dates[0].value;
    const todayTemperature = todayData.value;
    const todayDateStr = new Date(todayData.date).toDateString();
    const weatherIcon = getMeteoIcon(todayWeatherCode);

    const bigCard = document.getElementById('cardpremiere');
    bigCard.innerHTML = `
            <h2>${city}</h2>
            <p>Coordonnées : ${lat.toFixed(2)}, ${lon.toFixed(2)}</p>
            <p>Date : ${todayDateStr}</p>
            <div class="icon">
                <img src="${weatherIcon}" alt="Icône Météo" style="width:300px;">
            </div>
            <p>Température : ${todayTemperature} °C</p>
            <p>Humidité : ${todayHumidity} %</p>
            <p>Vitesse du vent : ${todayWindSpeed} m/s</p>
        `;

    const dates = data.data[0].coordinates[0].dates;
    const humidityData = data.data[1].coordinates[0].dates;
    const windData = data.data[2].coordinates[0].dates;
    const weatherCodes = data.data[3].coordinates[0].dates;

    dates.forEach((date, index) => {
    if (index === 0) return;

    const temperature = date.value;
    const humidity = humidityData[index].value;
    const windSpeed = windData[index].value;
    const weatherCode = weatherCodes[index].value;
    const dateStr = new Date(date.date).toDateString();

    const weatherIcon = getMeteoIcon(weatherCode);

    const dayForecast = document.createElement('div');
    dayForecast.classList.add('col-md-4', 'text-center', 'my-2', 'meteoContent');
    dayForecast.innerHTML = `
                <div class="icon">
                    <img src="${weatherIcon}" alt="Icône Météo"  class="mainImage" style="width:200px">
                </div>
                <h4>${dateStr}</h4>
                <p>Température : ${temperature} °C</p>
                <p>Humidité : ${humidity} %</p>
                <p>Vitesse du vent : ${windSpeed} m/s</p>
            `;

    weatherForecast.appendChild(dayForecast);
});
}

    function getMeteoIcon(weatherCode) {
    switch (weatherCode) {
    case 101:
    case 1:
    return 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/day.svg'; // Ciel dégagé
    case 102:
    case 2:
    return 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/cloudy-day-1.svg'; // Nuages légers
    case 103:
    case 3:
    return 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/cloudy-day-2.svg'; // Partiellement nuageux
    case 104:
    case 4:
    return 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/cloudy-day-3.svg'; // Nuageux
    case 105:
    case 5:
    return 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/rainy-1.svg'; // Pluie
    case 106:
    case 6:
    return 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/rainy-2.svg'; // Pluie et neige / grésil
    case 107:
    case 7:
    return 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/snowy-1.svg'; // Neige
    case 108:
    case 8:
    return 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/rainy-3.svg'; // Averse de pluie
    case 109:
    case 9:
    return 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/snowy-2.svg'; // Averse de neige
    case 110:
    case 10:
    return 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/snowy-3.svg'; // Averse de grésil
    case 111:
    case 11:
    return 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/cloudy.svg'; // Brouillard léger
    case 112:
    case 12:
    return 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/cloudy-night-1.svg'; // Brouillard dense
    case 113:
    case 13:
    return 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/rainy-4.svg'; // Pluie verglaçante
    case 114:
    case 14:
    return 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/thunder.svg'; // Orages
    case 115:
    case 16:
    return 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/rainy-5.svg'; // Bruine
    case 116:
    return 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/sandstorm.svg'; // Tempête de sable
    default:
    return 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/cloudy.svg'; // Icône par défaut
}
}
