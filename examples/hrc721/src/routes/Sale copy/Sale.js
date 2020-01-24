import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Chartist from 'chartist'
import { purchase } from './../../redux/crowdsale'
import Inventory from './../../components/Inventory/Inventory'

import { route, gradient, inventory, image, button, processingCover } from './Sale.module.scss'
import LoadingGIF from '../../img/loading.gif'

export default function Sale(props) {

    const {
        harmonyState: { processing },
        crowdsaleState: { items }
    } = props

    const dispatch = useDispatch()

    // useEffect(() => {

    //     const axisXMod = Math.floor(events.length / 5)
    //     const benes = addresses.map((a) => a.toLowerCase())

    //     new Chartist.Line('#chart-one', {
    //         labels: events.map((e, i) => (i+1)),
    //         series: [
    //             events.map((e) => parseFloat(e.one)),
    //         ]
    //     }, {
    //         fullWidth: true,
    //         height: 200,
    //         axisX: {
    //             labelInterpolationFnc: (value) => value % axisXMod === 0 ? value : null
    //         }
    //     });

    //     new Chartist.Line('#chart-hrc', {
    //         labels: events.map((e, i) => (i+1)),
    //         series: [
    //             events.map((e) => e.beneficiary.toLowerCase() === benes[0] ? parseFloat(e.hrc) : 0),
    //             events.map((e) => e.beneficiary.toLowerCase() === benes[1] ? parseFloat(e.hrc) : 0),
    //         ]
    //     }, {
    //         fullWidth: true,
    //         height: 200,
    //         axisX: {
    //             labelInterpolationFnc: (value) => value % axisXMod === 0 ? value : null
    //         }
    //     });

    // }, [events])

    return (
        <div className={route}>


            {processing &&
                <div className={processingCover}>
                    <img src={LoadingGIF} />
                </div>
            }

            <section className={gradient}>
                <h2>Items</h2>
                <Inventory {...props} />
            </section>
        </div>
    )
}