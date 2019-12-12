import React, { useEffect } from 'react'

export default function Home() {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div>
            <h1>Harmony HRC20 Dapp</h1>
        </div>
    )
}