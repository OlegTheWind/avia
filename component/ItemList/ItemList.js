import React, { useEffect, useState } from 'react'
import { Card, Button } from 'antd'
import { connect } from 'react-redux'

import { fetchTickets, fetchId } from '../Services/Services'
import './ItemList.css'
import '../FilterList/FilterList.css'

function ItemList({ filters }) {
    const urlImg = 'https://pics.avs.io/110/36/'
    const [tickets, setTickets] = useState([])
    const [visibleTicketsCount, setVisibleTicketsCount] = useState(5)
    const [error, setError] = useState(null)
    const [activeFilter, setActiveFilter] = useState('cheapest')
    const [isLoading, setIsLoading] = useState(false)
    const [allTickets, setAllTickets] = useState([])

    const loadMoreTickets = () => {
        setVisibleTicketsCount((prevCount) => prevCount + 5)
    }

    const sortTickets = (tickets, filter) => {
        if (filter === 'cheapest') {
            return [...tickets].sort((a, b) => a.price - b.price)
        } else if (filter === 'fastest') {
            return [...tickets].sort((a, b) => a.segments[0].duration - b.segments[0].duration)
        }
        return tickets
    }

    const onFilterChange = (filter) => {
        setActiveFilter(filter)
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const searchId = await fetchId()
                const fetchedTickets = await fetchTickets(searchId)
                setAllTickets(fetchedTickets)
            } catch (error) {
                console.error(error)
                setError('Ошибка при загрузке билетов')
            }
            setIsLoading(false)
        }

        fetchData()
    }, [])
    useEffect(() => {
        const filteredTickets = allTickets.filter((ticket) =>
            filters.includes(ticket.segments[0].stops.length.toString()),
        )
        const sortedTickets = sortTickets(filteredTickets, activeFilter)
        setTickets(sortedTickets)
    }, [filters, activeFilter, allTickets])

    function getStopsWord(stops) {
        const count = stops.length
        let word = ''

        if (count === 0) {
            word = 'Без пересадок'
        } else if (count === 1) {
            word = '1 пересадка'
        } else if (count > 1 && count < 5) {
            word = count + ' пересадки'
        } else {
            word = count + ' пересадок'
        }

        return word
    }

    function renderTickets(tickets, urlImg) {
        function calculateArrivalTime(departure, duration) {
            const departureDate = new Date(departure)
            const arrivalDate = new Date(departureDate.getTime() + duration * 60000)
            return arrivalDate
        }
        return tickets.map((ticket, index) => (
            <Card key={index} className="Card_position">
                <div className="Card_header">
                    <p className="Card_price">
                        {ticket.price.toLocaleString('ru-Ru', {
                            currency: 'RUB',
                        })}{' '}
                        Р
                    </p>
                    <img className="Card_carrier" src={`${urlImg}${ticket.carrier}.png`} alt="Лого Авиакомпании" />
                </div>
                {ticket.segments.map((segment, segmentIndex) => (
                    <div key={segmentIndex}>
                        <div className="Card_body">
                            <span className="body_flex">
                                <div className="Card_origin">
                                    {segment.origin} - {segment.destination}
                                    <p className="Card_date">
                                        {new Intl.DateTimeFormat('ru-RU', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        }).format(new Date(segment.date))}
                                        -
                                        {new Intl.DateTimeFormat('ru-RU', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        }).format(calculateArrivalTime(segment.date, segment.duration))}
                                    </p>
                                </div>
                            </span>
                            <span className="Card_duration">
                                Время в пути
                                <span className="Card_duration_black">
                                    {Math.floor(segment.duration / 60)} ч {segment.duration % 60} мин
                                </span>
                            </span>
                            <span className="Card_stops">
                                {getStopsWord(segment.stops)}
                                <span className="Card_stops_black">{segment.stops.join(', ')}</span>
                            </span>
                        </div>
                    </div>
                ))}
            </Card>
        ))
    }

    return (
        <>
            <div className="button_flex">
                <Button
                    type={activeFilter === 'cheapest' ? 'primary' : 'default'}
                    block
                    onClick={() => onFilterChange('cheapest')}
                >
                    САМЫЙ ДЕШЕВЫЙ
                </Button>
                <Button
                    type={activeFilter === 'fastest' ? 'primary' : 'default'}
                    block
                    onClick={() => onFilterChange('fastest')}
                >
                    САМЫЙ БЫСТРЫЙ
                </Button>
            </div>
            {error && <div>{error}</div>}
            {isLoading ? (
                <Card>Загрузка билетов...</Card>
            ) : error ? (
                <div>{error}</div>
            ) : (
                renderTickets(tickets.slice(0, visibleTicketsCount), urlImg)
            )}
            {tickets && tickets.length > visibleTicketsCount && (
                <Button className="button_bottom" onClick={loadMoreTickets} type="primary">
                    Загрузить еще
                </Button>
            )}
        </>
    )
}
const mapStateToProps = (state) => ({
    filters: state.filters,
})

export default connect(mapStateToProps)(ItemList)
