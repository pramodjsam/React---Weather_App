import React,{useState,useEffect} from 'react';
const api={
  key:'13e157a6bcc179236409cd5239abac8e',
  base:'https://api.openweathermap.org/data/2.5/'
}

function App() {
  const [query,setQuery]=useState("");
  const [weather,setWeather]=useState({});
  const [utc,setUtc]=useState(0);
  const [hour,setHour]=useState(null);
  const [minutes,setMinutes]=useState(null);

  const search=(evt)=>{
    if(evt.key==="Enter"){
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then((res)=>res.json())
        .then((data)=>{
          setWeather(data);
          setQuery("");
          let dt=data.dt;
          let timezone=data.timezone;
          let utc=dt+timezone;
          setUtc(utc)
        })
    }
  }

  useEffect(()=>{
    const fetchData=async ()=>{
      const response=await fetch(`https://showcase.api.linx.twenty57.net/UnixTime/fromunixtimestamp?unixtimestamp=${utc}`);
      const result=await response.json();
      setHour(new Date(result.Datetime).getHours());
      setMinutes(new Date(result.Datetime).getMinutes())
    }
    fetchData();
  },[utc])

  const dateBuilder=(d)=>{
    const months=['January','February','March','April','May','June','July','August','September',"October"
    ,"November",'December'];
    const days=['Monday','Tuesday','Wednesday','Thrusday','Friday','Saturday','Sunday'];
    let day=days[d.getDay()];
    let date=d.getDate();
    let month=months[d.getMonth()];
    let year=d.getFullYear();
    return `${day} ${date} ${month} ${year}`
  }

  return (
    <div className={(typeof weather.main!="undefined")?((weather.main.temp>16)?"app warm":"app"):"app"}>
      <main>
        <div className='search-box'>
          <input type="text" placeholder='Search...' className='search-bar' 
          onChange={(e)=>setQuery(e.target.value)}
          value={query}
          onKeyPress={search}
          />
        </div>
        {(typeof weather.main!='undefined')?(
          <div>
            <div className='location-box'>
              <div className='location'>{weather.name},{weather.sys.country}</div>
              <div className='date'>{dateBuilder(new Date())}</div>
              {(hour!=null&& minutes!=null)?(
                  <div className='local-time'>{`Time at ${weather.name}: ${hour<10?(`0${hour}`):hour}:${minutes<10?(minutes*10):minutes}`}</div>
                ):""}
              <div className='local-time'>{`Current Time: ${new Date().getHours()}:${(new Date().getMinutes()<10)?(`0${new Date().getMinutes()}`):(new Date().getMinutes())}`}</div>
            </div>

            <div className='weather-box'>
              <div className='temp'>{Math.round(weather.main.temp)}°C</div>
              <div className='weather'>{weather.weather[0].main}</div>
            </div>
          </div>
        ):""}
      </main>
    </div>
  );
}

export default App;
