import { useState, useEffect } from 'react'
import axios from 'axios'

const Search = ({ value, handleChange }) => (
  <>
    find countries <input value={value} onChange={handleChange} />
  </>
)

const Weather = ({ country, weather }) => {
  if (weather.length === 0)
    return null

  return (
    <>
      <h3>Weather in {country.capital}</h3>
      <p>temperature {weather.hourly.temperature_2m[0]} {weather.hourly_units.temperature_2m}</p>
      <p>wind {weather.hourly.wind_speed_10m[0]} {weather.hourly_units.wind_speed_10m}</p>
    </>
  )
}

const Country = ({ country, weather }) => {
  console.log("displaying singular country", country)
  console.log("with weather", weather)
  return (
    <>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <h3>languages:</h3>
      <ul>
        {Object.keys(country.languages).map(k => country.languages[k]).map(l =>
          <li key={l}>
            {l}
          </li>
        )}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} />
      <Weather country={country} weather={weather} />
    </>
  )
}

const Countries = ({ applicable, search, showCountry, weather }) => {
  if (search.length === 0)
    return <p>Please specify a filter</p>

  if (applicable.length > 10)
    return <p>Too many matches, specify another filter</p>
  if (applicable.length === 0)
    return <p>No matches, specify another filter</p>
  
  if (applicable.length > 1)
    return (
      <ul>
        {applicable.map(c =>
          <li key={c.name.official}>
            {c.name.common}
            <button onClick={() => showCountry(c)}>show</button>
          </li>
        )}
      </ul>
    )
  
  return <Country country={applicable[0]} weather={weather} />
}

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [applicable, setApplicable] = useState([])
  const [weather, setWeather] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
        console.log("fetched country data from API")
      })
  }, [])

  useEffect(() => {
    if (applicable.length !== 1) {
      setWeather([])
      console.log("reset weather")
      return
    }
    
    const country = applicable[0]
    console.log("attempting to fetch weather for", country)
    const lat = country.capitalInfo.latlng[0]
    const lng = country.capitalInfo.latlng[1]
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,wind_speed_10m`
    axios
      .get(url)
      .then(response => {
        setWeather(response.data)
        console.log("fetched capital weather information from API")
      })
  }, [applicable])

  const handleSearchChange = (event) => {
    const newSearch = event.target.value
    setSearch(newSearch)
    setApplicable(countries.filter(c => c.name.common.toLowerCase().includes(newSearch)))
  }

  const showCountry = (c) => {
    console.log("switching to only", c.name.common)
    const newSearch = c.name.common.toLowerCase()
    setSearch(newSearch)
    setApplicable(countries.filter(c => c.name.common.toLowerCase().includes(newSearch)))
  }

  return (
    <div>
      <Search value={search} handleChange={handleSearchChange} />
      <Countries applicable={applicable} search={search} showCountry={showCountry} weather={weather} />
    </div>
  )
}

export default App
