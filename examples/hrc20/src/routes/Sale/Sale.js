import React, {useEffect} from 'react'
import Chartist from 'chartist'

import { route, gradient, bubble, chart, marginTop, breakAll, processingCover } from './Sale.module.scss'
import LoadingGIF from '../../img/loading.gif'

export default function Sale(props) {

    const {
        harmonyState: { processing, addresses },
        crowdsaleState: { raised, minted, events }
    } = props


    useEffect(() => {

        const axisXMod = Math.floor(events.length / 5)
        const benes = addresses.map((a) => a.toLowerCase())

        new Chartist.Line('#chart-one', {
            labels: events.map((e, i) => (i+1)),
            series: [
                events.map((e) => parseFloat(e.one)),
            ]
        }, {
            fullWidth: true,
            height: 200,
            axisX: {
                labelInterpolationFnc: (value) => value % axisXMod === 0 ? value : null
            }
        });

        new Chartist.Line('#chart-hrc', {
            labels: events.map((e, i) => (i+1)),
            series: [
                events.map((e) => e.beneficiary.toLowerCase() === benes[0] ? parseFloat(e.hrc) : 0),
                events.map((e) => e.beneficiary.toLowerCase() === benes[1] ? parseFloat(e.hrc) : 0),
            ]
        }, {
            fullWidth: true,
            height: 200,
            axisX: {
                labelInterpolationFnc: (value) => value % axisXMod === 0 ? value : null
            }
        });
  
    }, [events])

    return (
        <div className={route}>

            {processing &&
                <div className={processingCover}>
                    <img src={LoadingGIF} />
                </div>
            }


            <section className={gradient}>

                <h2>ONE Raised</h2>
                {raised &&
                    <div className={bubble}>
                        {raised}
                    </div>
                }

                <div className={chart} id="chart-one"></div>

                <h2 className={marginTop}>HRC Minted</h2>
                {minted &&  
                    <div className={bubble}>
                        {minted}
                    </div>
                }

                <div className={chart} id="chart-hrc"></div>

                <h2 className={marginTop}>Sales</h2>
                {events && events.length > 0 && <div className={bubble}>
                    {events.map((e) =>
                        Object.keys(e).map((k, i) => <p key={i} className={breakAll}>{k} - {e[k]}</p>)
                    )} 
                </div>}

            </section>
        </div>
    )
}