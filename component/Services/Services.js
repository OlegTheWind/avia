function fetchId() {
    const urlSearch = 'https://aviasales-test-api.kata.academy/search'

    return fetch(urlSearch)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Ошибка получения id')
            }
            return response.json()
        })
        .then((data) => data.searchId)
        .catch((error) => console.error('Ошибка:', error))
}

function fetchTickets(searchId) {
    const urlTickets = `https://aviasales-test-api.kata.academy/tickets?searchId=${searchId}`
    let allTickets = []
    let page = 1
    let stop = false

    const fetchPage = async (page) => {
        try {
            const response = await fetch(`${urlTickets}&page=${page}`)
            if (!response.ok && response.status === 500) {
                return { tickets: [], stop: false }
            }
            const data = await response.json()
            return { tickets: data.tickets || [], stop: data.stop }
        } catch (error) {
            console.error('Ошибка:', error)
            return { tickets: [], stop: true }
        }
    }
    const loadTickets = async () => {
        if (!stop) {
            const { tickets, stop: fetchStop } = await fetchPage(page)
            allTickets = [...allTickets, ...tickets]
            page++
            stop = fetchStop
            if (!stop) {
                await loadTickets()
            }
        }
    }
    return new Promise((resolve) => {
        loadTickets().then(() => resolve(allTickets))
    })
}

export { fetchId, fetchTickets }
