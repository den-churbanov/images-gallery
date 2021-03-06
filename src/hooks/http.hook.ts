import {useCallback, useState} from "react"

export const useHttp = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | undefined>(undefined)
    const [status, setStatus] = useState<number | undefined>(undefined)

    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true)
        try {
            if (body) {
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json'
            }
            const response = await fetch(url, {method, body, headers})
            setStatus(response.status)
            if (!response.ok) throw new Error('Произошла ошибка при загрузке данных')
            return response
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }, [error])

    const clearError = useCallback(() => setError(undefined), [setError])
    return {loading, status, request, error, clearError}
}