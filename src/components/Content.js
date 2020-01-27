import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import 'moment/locale/fr';
import { ArrowForward } from "@material-ui/icons";

const Content = () => {
    const [value, setValue] = useState(0);
    const [convertedValue, setConvertedValue] = useState(0);
    const [currencyRate, setCurrencyRate] = useState();
    const [symbols, setSymbols] = useState();
    const [rates, setRates] = useState();
    const [date, setDate] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const key = "5e6353a9a8d226967b0876769f94f912";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ratesResponse = await axios.get(`http://data.fixer.io/api/latest?access_key=${key}`);
                const symbolsResponse = await axios.get(`http://data.fixer.io/api/symbols?access_key=${key}`);
                if (!ratesResponse.data.success && !symbolsResponse.data.success)
                    setError(true);
                else {
                    setSymbols(symbolsResponse.data.symbols);
                    setCurrencyRate(Object.keys(ratesResponse.data.rates)[0]);
                    setRates(ratesResponse.data.rates);
                    setDate(moment(ratesResponse.data.date).locale("fr").format("L"));
                }
            }
            catch (e) { setError(true) }
            setIsLoading(false);
        }
        fetchData();

    }, []);

    useEffect(() => {
        if (currencyRate && value) {
            const newVal = Math.round(
                (value * rates[currencyRate]) * 100
            ) / 100;
            setConvertedValue(newVal);
        }

    }, [currencyRate, value, rates]);

    useEffect(() => {
        if (!value) {
            setValue(0);
            setConvertedValue(0);
        }
    }, [value]);

    return <div className="container"><div className="wrapper">{error ? <span>Une erreur s'est produite. Veuillez réessayer plus tard.</span>
        :
        <>{isLoading ? <div className="loader"></div> : <div className="line"><div className="column"><span>Montant en euros (EUR)</span><input type="number" value={value} onChange={event => {
            setValue(event.target.value);
        }} /></div><ArrowForward style={{ fontSize: "60px", flex: 1 }} /><div className="info-right"><div className="column"><span style={{ color: "#FFD970" }}>Montant converti</span><input type="number" value={convertedValue} style={{ cursor: "not-allowed", backgroundColor: "#FFD970", color: "#303030" }} readOnly /></div><div className="column"><span>Choisissez une devise</span><select
            onChange={event => {
                setCurrencyRate(event.target.value);
            }}
        >
            {Object.keys(rates).map((rate) => {
                return (
                    <option key={rate} value={rate}>
                        {rate} ({symbols[rate]})
                    </option>
                );
            })}
            <option value={Object.keys(rates)[0]}>
                {Object.keys(rates)[0]}
            </option>
        </select></div></div></div>
        }
        </>
    }
    </div > <div className="footer">{!isLoading && !error && <div className="wrapper"><span>Taux de conversion au {date}</span></div>}</div></div>
}

export default Content