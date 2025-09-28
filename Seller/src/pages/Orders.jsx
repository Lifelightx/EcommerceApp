import React, { useEffect } from 'react'
import axios from 'axios'
import { StoreContext } from '../ContextApi'
import { useContext } from 'react'

function Orders() {
    const { url, sellerToken } = useContext(StoreContext)
    const fetch = () => {
        axios.get(`${url}/api/orders/sellerOrders`, {
            headers: {
                Authorization: `Bearer ${sellerToken}`,
            }
        }).then(res => {
            console.log(res.data)
        })
    }
    useEffect(() => {
        if (sellerToken) {
            fetch();
        }
    }, [sellerToken, url]);
    return (
        <div>
            Hello World
        </div>
    )
}

export default Orders
