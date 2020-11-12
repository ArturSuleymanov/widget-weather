import { wire, track, LightningElement } from 'lwc';
import getCityWeatherSummary from '@salesforce/apex/WidgetWeatherController.getCityWeatherSummary';

export default class Custom extends LightningElement {
    @track city = '';
    feelslike = '';
    wind = '';
    pressure = '';
    humidity = '';
    iconURL = '';
    iconId = '';
    cityName = '';
    temp = '';
    localTime = '';

    handleKeyUp(evt) {
        const isEnterKey = evt.keyCode === 13;
        if (isEnterKey) {
            this.city = evt.target.value;
            evt.target.value = '';
        }
    }
/*
Example of JSON response

{"coord":{"lon":23.7,"lat":52.1},
"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02d"}],
"base":"stations",
"main":{"temp":9,"feels_like":5.91,"temp_min":9,"temp_max":9,"pressure":1025,"humidity":61},
"visibility":6000,
"wind":{"speed":2,"deg":260},
"clouds":{"all":20},
"dt":1603196115,
"sys":{"type":1,"id":8930,"country":"BY","sunrise":1603169946,"sunset":1603207227},
"timezone":10800,
"id":629634,
"name":"Brest",
"cod":200}
*/
    @wire(getCityWeatherSummary, {cityStr: '$city'})
    wiredInfo({error, data}) {
        if (data) {
            this.feelslike = Math.floor(data.main.feels_like);
            this.wind = data.wind.speed;
            this.pressure = data.main.pressure;
            this.humidity = data.main.humidity;
            this.cityName = data.name;
            this.temp = Math.floor(data.main.temp);
            this.iconURL = 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png';

            this.getLocalTime(data.timezone * 1000);
        } else if (error) {}
    }

    getLocalTime(timezone) {
        const options = {
            hour: '2-digit', minute: '2-digit', 
            timeZone: 'UTC', hour12: false
        }

        let dateString = new Intl.DateTimeFormat('en-US', options).format(new Date(Date.now() + timezone));
        console.log(dateString);
        this.localTime = dateString;
    }
}